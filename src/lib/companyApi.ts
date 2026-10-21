import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  normalizeCompanySummary,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  CompanySummary,
  CompanyProfile,
  DashboardSkill,
} from "@/lib/companyData";

interface SkillTopic {
  level_number: number;
  topic: string;
}

function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env."
    );
  }
  return supabase;
}

export function useCompanies() {
  return useQuery<CompanySummary[], Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from("company_json")
        .select("company_id, short_json");

      if (error) throw error;
      return (data ?? []).map(row =>
        normalizeCompanySummary(row.short_json, row.company_id)
      );
    },
  });
}

export interface CompanyDetailData {
  summary: CompanySummary;
  profile: CompanyProfile;
}

export function useCompanyProfile(companyId: number | null | undefined) {
  return useQuery<CompanyDetailData, Error>({
    queryKey: ["company-profile", companyId],
    enabled: typeof companyId === "number" && Number.isFinite(companyId),
    queryFn: async () => {
      if (typeof companyId !== "number" || !Number.isFinite(companyId)) {
        throw new Error("A valid company ID is required to load company intelligence.");
      }

      const { data, error } = await getSupabaseClient()
        .from("company_json")
        .select("company_id, short_json, full_json")
        .eq("company_id", companyId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error(`No company_json record found for company_id=${companyId}.`);
      }

      return {
        summary: normalizeCompanySummary(data.short_json, data.company_id),
        profile: normalizeCompanyProfile(data.full_json, data.short_json),
      };
    },
  });
}

export interface CompanySkillsData {
  skills: DashboardSkill[];
  topicsMap: Record<number, SkillTopic[]>;
}

export function useCompanySkills(companyId: number | null | undefined) {
  return useQuery<CompanySkillsData, Error>({
    queryKey: ["company-skills", companyId],
    enabled: typeof companyId === "number" && Number.isFinite(companyId),
    queryFn: async () => {
      if (typeof companyId !== "number" || !Number.isFinite(companyId)) {
        throw new Error("A valid company ID is required to load skill requirements.");
      }

      const client = getSupabaseClient();
      const [levelsResult, skillSetsResult, proficienciesResult, topicsResult] =
        await Promise.all([
          client
            .from("company_skill_levels")
            .select(
              "company_id, skill_set_id, required_level, required_proficiency_level_id"
            )
            .eq("company_id", companyId),
          client
            .from("skill_set_master")
            .select("skill_set_id, skill_set_name, short_name"),
          client
            .from("proficiency_levels")
            .select("proficiency_level_id, proficiency_name, proficiency_code"),
          client
            .from("skill_set_topics")
            .select("skill_set_id, level_number, topics"),
        ]);

      if (levelsResult.error) throw levelsResult.error;
      if (skillSetsResult.error) throw skillSetsResult.error;
      if (proficienciesResult.error) throw proficienciesResult.error;
      if (topicsResult.error) throw topicsResult.error;

      const skillSetNames = new Map(
        (skillSetsResult.data ?? []).map(row => [
          row.skill_set_id,
          row.skill_set_name,
        ])
      );
      const proficiencyNames = new Map(
        (proficienciesResult.data ?? []).map(row => [
          row.proficiency_level_id,
          row.proficiency_name,
        ])
      );

      const skills = normalizeDashboardSkills(
        (levelsResult.data ?? []).map(row => ({
          skill_set_id: row.skill_set_id,
          skill_set_name: skillSetNames.get(row.skill_set_id) ?? "",
          required_level: row.required_level,
          required_proficiency:
            proficiencyNames.get(row.required_proficiency_level_id) ?? "",
        }))
      );

      const topicsMap: Record<number, SkillTopic[]> = {};
      for (const row of topicsResult.data ?? []) {
        if (!topicsMap[row.skill_set_id]) topicsMap[row.skill_set_id] = [];
        topicsMap[row.skill_set_id].push({
          level_number: row.level_number,
          topic: String(row.topics ?? "").trim(),
        });
      }

      for (const topics of Object.values(topicsMap)) {
        topics.sort((a, b) => a.level_number - b.level_number);
      }

      return { skills, topicsMap };
    },
  });
}
