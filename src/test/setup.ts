import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/lib/supabaseClient", async () => {
  const [{ SEED_COMPANIES }, { SKILL_TOPICS_MAP }] = await Promise.all([
    import("../data/seedCompanies"),
    import("../data/skillTopics"),
  ]);

  const company = SEED_COMPANIES[0];
  const skillLevels = company.skill_levels.map((skill, index) => ({
    company_id: company.company_id,
    skill_set_id: skill.skill_set_id,
    required_level: skill.required_level,
    required_proficiency_level_id: index + 1,
  }));
  const tableRows: Record<string, unknown[]> = {
    company_json: [
      {
        company_id: company.company_id,
        short_json: company.short_json,
        full_json: company.full_json,
      },
    ],
    company_skill_levels: skillLevels,
    skill_set_master: company.skill_levels.map(skill => ({
      skill_set_id: skill.skill_set_id,
      skill_set_name: skill.skill_set_name,
      short_name: skill.skill_set_name,
    })),
    proficiency_levels: company.skill_levels.map((skill, index) => ({
      proficiency_level_id: index + 1,
      proficiency_name: skill.required_proficiency,
      proficiency_code: String(index + 1),
    })),
    skill_set_topics: Object.entries(SKILL_TOPICS_MAP).flatMap(
      ([skillSetId, topics]) =>
        topics.map(topic => ({
          skill_set_id: Number(skillSetId),
          level_number: topic.level_number,
          topics: topic.topic,
        }))
    ),
  };

  return {
    supabase: {
      from(table: string) {
        let filters: Record<string, unknown> = {};
        const rows = () =>
          (tableRows[table] ?? []).filter(row =>
            Object.entries(filters).every(
              ([key, value]) =>
                (row as Record<string, unknown>)[key] === value
            )
          );
        const query = {
          select: () => query,
          eq: (column: string, value: unknown) => {
            filters = { ...filters, [column]: value };
            return query;
          },
          maybeSingle: async () => ({ data: rows()[0] ?? null, error: null }),
          then: (
            resolve: (result: { data: unknown[]; error: null }) => unknown,
            reject: (reason: unknown) => unknown
          ) => Promise.resolve({ data: rows(), error: null }).then(resolve, reject),
        };
        return query;
      },
    },
  };
});

// Mock window.matchMedia if needed in jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.scrollTo and Element.prototype.scrollIntoView
window.scrollTo = (() => {}) as any;
window.HTMLElement.prototype.scrollIntoView = (() => {}) as any;
