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
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { SKILL_TOPICS_MAP, SkillTopic } from "@/data/skillTopics";

/**
 * Hook to retrieve all company cards / summaries.
 * Query: SELECT company_id, short_json FROM company_json
 * Falls back to seed on ANY Supabase error (RLS, network, missing table, 0 rows).
 */
export function useCompanies() {
  return useQuery<CompanySummary[], Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const seedFallback = () =>
        SEED_COMPANIES.map((company) =>
          normalizeCompanySummary(company.short_json, company.company_id)
        );

      // If Supabase is not initialized, fall back to seed data
      if (!supabase) {
        console.warn(
          "[companyApi] Supabase not initialized; falling back to local seedCompanies."
        );
        return seedFallback();
      }

      try {
        // Query ONLY public.company_json
        const { data, error } = await supabase
          .from("company_json")
          .select("company_id, short_json");

        if (error) {
          console.warn(
            "[companyApi] Supabase error fetching company_json; falling back to seed:",
            error.message
          );
          return seedFallback();
        }

        // If remote table has rows, map them
        if (data && data.length > 0) {
          return data.map((row) =>
            normalizeCompanySummary(row.short_json, row.company_id)
          );
        }

        // If remote table currently has 0 rows (or RLS restriction), gracefully display reference seed data
        console.info(
          "[companyApi] Remote company_json is currently empty (0 rows); displaying reference dataset."
        );
        return seedFallback();
      } catch (err) {
        console.warn(
          "[companyApi] Unexpected error querying Supabase; falling back to seed:",
          err
        );
        return seedFallback();
      }
    },
  });
}

export interface CompanyDetailData {
  summary: CompanySummary;
  profile: CompanyProfile;
}

/**
 * Hook to retrieve full company detail (22 intelligence sections).
 * Query: SELECT company_id, short_json, full_json FROM company_json WHERE company_id = :id
 * Falls back to seed on ANY Supabase error.
 */
export function useCompanyProfile(companyId: number | null | undefined) {
  return useQuery<CompanyDetailData, Error>({
    queryKey: ["company-profile", companyId],
    enabled: typeof companyId === "number" && !isNaN(companyId),
    queryFn: async () => {
      if (!companyId) {
        throw new Error("Invalid or missing company ID");
      }

      const getFallback = () => {
        const seed =
          SEED_COMPANIES.find((c) => c.company_id === companyId) ||
          SEED_COMPANIES[0];
        return {
          summary: normalizeCompanySummary(seed.short_json, seed.company_id),
          profile: normalizeCompanyProfile(seed.full_json, seed.short_json),
        };
      };

      // If Supabase not initialized, fall back to seed
      if (!supabase) {
        console.warn(
          "[companyApi] Supabase not initialized; falling back to seed for company:",
          companyId
        );
        return getFallback();
      }

      try {
        // Query ONLY public.company_json
        const { data, error } = await supabase
          .from("company_json")
          .select("company_id, short_json, full_json")
          .eq("company_id", companyId)
          .maybeSingle();

        if (error) {
          console.warn(
            "[companyApi] Supabase error fetching company profile; falling back to seed:",
            error.message
          );
          return getFallback();
        }

        if (!data) {
          // Fall back to seed reference data if company_id row not yet seeded in remote DB
          console.info(
            `[companyApi] company_id=${companyId} not found in remote DB; using seed dataset.`
          );
          return getFallback();
        }

        const summary = normalizeCompanySummary(data.short_json, data.company_id);
        const profile = normalizeCompanyProfile(data.full_json, data.short_json);

        return { summary, profile };
      } catch (err) {
        console.warn(
          "[companyApi] Unexpected error querying Supabase company profile; falling back to seed:",
          err
        );
        return getFallback();
      }
    },
  });
}

export interface CompanySkillsData {
  skills: DashboardSkill[];
  topicsMap: Record<number, SkillTopic[]>;
}

/**
 * Hook to retrieve skills and 10-level roadmaps for a company.
 * Queries the 4 allowed skill tables:
 * - public.company_skill_levels
 * - public.skill_set_master
 * - public.proficiency_levels
 * - public.skill_set_topics
 * Falls back to seed on ANY Supabase error.
 */
export function useCompanySkills(companyId: number | null | undefined) {
  return useQuery<CompanySkillsData, Error>({
    queryKey: ["company-skills", companyId],
    enabled: typeof companyId === "number" && !isNaN(companyId),
    queryFn: async () => {
      if (!companyId) {
        throw new Error("Invalid or missing company ID");
      }

      const getSeedSkillsFallback = () => {
        const seed =
          SEED_COMPANIES.find((c) => c.company_id === companyId) ||
          SEED_COMPANIES[0];
        return {
          skills: normalizeDashboardSkills(seed.skill_levels),
          topicsMap: SKILL_TOPICS_MAP,
        };
      };

      // If Supabase not initialized, fall back to seed skill_levels and skillTopics
      if (!supabase) {
        return getSeedSkillsFallback();
      }

      try {
        // Query the 4 allowed skill tables in parallel
        const [levelsRes, setsRes, profsRes, topicsRes] = await Promise.all([
          supabase
            .from("company_skill_levels")
            .select(
              "company_id, skill_set_id, required_level, required_proficiency_level_id"
            )
            .eq("company_id", companyId),
          supabase
            .from("skill_set_master")
            .select("skill_set_id, skill_set_name, short_name"),
          supabase
            .from("proficiency_levels")
            .select("proficiency_level_id, proficiency_name, proficiency_code"),
          supabase
            .from("skill_set_topics")
            .select("skill_set_id, level_number, topics"),
        ]);

        if (levelsRes.error) {
          console.warn(
            "[companyApi] Supabase error fetching company_skill_levels; falling back to seed:",
            levelsRes.error.message
          );
          return getSeedSkillsFallback();
        }

        // If remote table has no skill records for this company, fall back gracefully
        if (!levelsRes.data || levelsRes.data.length === 0) {
          console.info(
            `[companyApi] No skill levels found in remote DB for company_id=${companyId}; using reference skills.`
          );
          return getSeedSkillsFallback();
        }

        // Lookup maps for joins
        const skillNameMap = new Map<number, string>();
        if (setsRes.data) {
          setsRes.data.forEach((item) => {
            skillNameMap.set(item.skill_set_id, item.skill_set_name);
          });
        }

        const profNameMap = new Map<number, string>();
        if (profsRes.data) {
          profsRes.data.forEach((item) => {
            profNameMap.set(item.proficiency_level_id, item.proficiency_name);
          });
        }

        // Assemble skill rows
        const rawSkillLevels = (levelsRes.data || []).map((row) => ({
          skill_set_id: row.skill_set_id,
          skill_set_name:
            skillNameMap.get(row.skill_set_id) || `Skill #${row.skill_set_id}`,
          required_level: row.required_level,
          required_proficiency:
            profNameMap.get(row.required_proficiency_level_id) || "Intermediate",
        }));

        const normalizedSkills = normalizeDashboardSkills(rawSkillLevels);

        // Assemble 10-level roadmap topics
        const topicsMap: Record<number, SkillTopic[]> = {};
        if (topicsRes.data && topicsRes.data.length > 0) {
          topicsRes.data.forEach((item) => {
            const sId = item.skill_set_id;
            if (!topicsMap[sId]) {
              topicsMap[sId] = [];
            }
            topicsMap[sId].push({
              level_number: item.level_number,
              topic: String(item.topics || "").trim(),
            });
          });

          // Ensure each skill's topics are sorted by level_number
          Object.keys(topicsMap).forEach((key) => {
            const numKey = Number(key);
            topicsMap[numKey].sort((a, b) => a.level_number - b.level_number);
          });
        }

        return {
          skills: normalizedSkills,
          topicsMap: Object.keys(topicsMap).length > 0 ? topicsMap : SKILL_TOPICS_MAP,
        };
      } catch (err) {
        console.warn(
          "[companyApi] Unexpected error querying Supabase skills; falling back to seed:",
          err
        );
        return getSeedSkillsFallback();
      }
    },
  });
}
