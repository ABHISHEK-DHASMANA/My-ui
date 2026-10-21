export interface CompanySummary {
  id: number;
  name: string;
  short_name: string;
  logo_url: string;
  category: string;
  company_type: string; // "Super Dream" | "Dream" | "Standard" | "Regular"
  incorporation_year: number | string;
  employee_size: string;
  headquarters_address: string;
  operating_countries: string;
  office_locations: string;
  yoy_growth_rate: string;
  website_url: string;
}

export type CompanyProfile = Record<string, any>;

export interface DashboardSkill {
  skill_set_id: number;
  skill_set_name: string;
  required_level: number;
  required_proficiency: string;
  bloom_level: "CU" | "AP" | "AS" | "EV" | "CR";
  bloom_name: string;
  bloom_color: string;
  criticality: "Critical" | "Important" | "Baseline";
  difficulty: "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";
}

// Category Color Constants (exact hex as mandated)
export const CATEGORY_COLORS: Record<string, { hex: string; bg: string; text: string; border: string }> = {
  "Super Dream": {
    hex: "#7c3aed",
    bg: "bg-[#7c3aed]/10",
    text: "text-[#7c3aed]",
    border: "border-[#7c3aed]/30",
  },
  "Dream": {
    hex: "#2563eb",
    bg: "bg-[#2563eb]/10",
    text: "text-[#2563eb]",
    border: "border-[#2563eb]/30",
  },
  "Standard": {
    hex: "#16a34a",
    bg: "bg-[#16a34a]/10",
    text: "text-[#16a34a]",
    border: "border-[#16a34a]/30",
  },
  "Regular": {
    hex: "#d97706",
    bg: "bg-[#d97706]/10",
    text: "text-[#d97706]",
    border: "border-[#d97706]/30",
  },
};

// Bloom Level Meta
export const BLOOM_META: Record<
  "CU" | "AP" | "AS" | "EV" | "CR",
  { code: "CU" | "AP" | "AS" | "EV" | "CR"; name: string; hex: string; description: string }
> = {
  CU: { code: "CU", name: "Conceptual Understanding", hex: "#3b82f6", description: "Recall and fundamental knowledge" },
  AP: { code: "AP", name: "Application", hex: "#22c55e", description: "Implementation and practical usage" },
  AS: { code: "AS", name: "Analysis & Synthesis", hex: "#eab308", description: "Deconstruction and solution synthesis" },
  EV: { code: "EV", name: "Evaluation", hex: "#ef4444", description: "Critical appraisal and edge-case assessment" },
  CR: { code: "CR", name: "Creation & Architecture", hex: "#a855f7", description: "Design, innovation and system creation" },
};

// Criticality Meta
export const CRITICALITY_META = {
  Critical: { label: "Critical", scoreRange: "Score 7-10", badgeClass: "bg-red-50 text-red-700 border-red-200" },
  Important: { label: "Important", scoreRange: "Score 5-6", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  Baseline: { label: "Baseline", scoreRange: "Score 1-4", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

// Helpers
export function asString(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val).trim();
}

export function asRecord(val: any): Record<string, any> {
  if (typeof val === "object" && val !== null) return val;
  return {};
}

export function isNullish(val: any): boolean {
  if (val === null || val === undefined) return true;
  const s = String(val).trim().toLowerCase();
  return (
    s === "" ||
    s === "na" ||
    s === "n/a" ||
    s === "none" ||
    s === "-" ||
    s === "--" ||
    s === "null" ||
    s === "undefined" ||
    s === "not available" ||
    s === "not applicable"
  );
}

export function splitItems(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
  const str = String(val);
  // Split on newlines, semicolons, bullets (•), or commas if structured
  return str
    .split(/[\n;•]+/)
    .map(s => s.trim())
    .filter(s => Boolean(s) && !isNullish(s));
}

export function titleCaseFromCode(code: string): string {
  if (!code) return "";
  return code
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function scoreToDifficulty(score: number): "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER" {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

export function proficiencyToBloom(level: number): {
  code: "CU" | "AP" | "AS" | "EV" | "CR";
  name: string;
  hex: string;
} {
  if (level >= 9) return BLOOM_META.CR;
  if (level >= 7) return BLOOM_META.EV;
  if (level >= 5) return BLOOM_META.AS;
  if (level >= 3) return BLOOM_META.AP;
  return BLOOM_META.CU;
}

export function scoreToCriticality(score: number): "Critical" | "Important" | "Baseline" {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}

// Normalizers
export function normalizeCompanySummary(shortJson: Record<string, any>, companyId = 1): CompanySummary {
  const short = asRecord(shortJson);
  return {
    id: companyId,
    name: asString(short.name, "Company Name"),
    short_name: asString(short.short_name, short.name || "Company"),
    logo_url: asString(short.logo_url),
    category: asString(short.category, "Technology"),
    company_type: asString(short.company_type, "Dream"),
    incorporation_year: short.incorporation_year ?? "NA",
    employee_size: asString(short.employee_size, "NA"),
    headquarters_address: asString(short.headquarters_address, "NA"),
    operating_countries: asString(short.operating_countries, "NA"),
    office_locations: asString(short.office_locations, "NA"),
    yoy_growth_rate: asString(short.yoy_growth_rate, "NA"),
    website_url: asString(short.website_url, "#"),
  };
}

export function normalizeCompanyProfile(
  fullJson: Record<string, any>,
  shortJson: Record<string, any> = {}
): CompanyProfile {
  const full = asRecord(fullJson);
  const short = asRecord(shortJson);

  // Merge full and short while explicitly ensuring CTC, stipend, selection ratio are NEVER present
  const merged: Record<string, any> = { ...short, ...full };

  // Sanitize any forbidden keys just in case
  delete merged.ctc;
  delete merged.salary;
  delete merged.stipend;
  delete merged.selection_ratio;
  delete merged.ctc_range;
  delete merged.package;

  return merged;
}

export function normalizeDashboardSkills(skillLevels: any[]): DashboardSkill[] {
  if (!Array.isArray(skillLevels)) return [];

  return skillLevels.map(skill => {
    const level = Number(skill.required_level) || 1;
    const bloom = proficiencyToBloom(level);
    const criticality = scoreToCriticality(level);
    const difficulty = scoreToDifficulty(level);

    return {
      skill_set_id: Number(skill.skill_set_id),
      skill_set_name: asString(skill.skill_set_name),
      required_level: level,
      required_proficiency: asString(skill.required_proficiency),
      bloom_level: bloom.code,
      bloom_name: bloom.name,
      bloom_color: bloom.hex,
      criticality,
      difficulty,
    };
  });
}
