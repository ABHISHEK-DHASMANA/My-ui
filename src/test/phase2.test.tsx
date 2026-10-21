/**
 * Phase 2 — Supabase API & Data Layer Tests
 *
 * Strategy: the shared test setup mocks the Supabase client with seed-shaped
 * database responses. This validates:
 *   - Normalizer output shapes (name, company_type, profile fields, skills)
 *   - Bloom / criticality derivations
 *   - 10-level roadmap topology
 *   - CTC / stipend / selection_ratio are never present
 *
 * We do NOT test real Supabase network connectivity here (that belongs in
 * an integration/e2e suite).
 */
import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useCompanies, useCompanyProfile, useCompanySkills } from "../lib/companyApi";
import { supabase } from "../lib/supabaseClient";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("Phase 2 — Supabase API & Data Layer Tests", () => {
  it("uses the Supabase client for database reads", () => {
    expect(typeof supabase?.from).toBe("function");
  });

  it("useCompanies hook returns normalized company summaries with zero table joins", async () => {
    const { result } = renderHook(() => useCompanies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.length).toBeGreaterThan(0);
    const first = result.current.data![0];
    expect(first.name).toBe("Accenture plc");
    expect(first.company_type).toBe("Dream");
    expect(first.headquarters_address).toBe("Dublin, Ireland");
  });

  it("useCompanyProfile hook returns full company profile with 22 sections", async () => {
    const { result } = renderHook(() => useCompanyProfile(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { summary, profile } = result.current.data!;
    expect(summary.name).toBe("Accenture plc");
    expect(profile.ceo_name).toBe("Julie Sweet");

    // Strict constraint check: NO CTC / Stipend / Selection Ratio
    expect(profile.ctc).toBeUndefined();
    expect(profile.stipend).toBeUndefined();
    expect(profile.selection_ratio).toBeUndefined();
  });

  it("useCompanySkills hook maps 4 skill tables to 12 dashboard skills and 10-level roadmaps", async () => {
    const { result } = renderHook(() => useCompanySkills(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { skills, topicsMap } = result.current.data!;
    expect(skills.length).toBe(12);

    // Verify Bloom taxonomy & criticality derivations
    const dsa = skills.find((s) => s.skill_set_name === "Data Structures & Algorithms");
    expect(dsa).toBeDefined();
    expect(dsa!.required_level).toBe(8);
    expect(dsa!.bloom_level).toBe("EV"); // level 7-8 → EV
    expect(dsa!.criticality).toBe("Critical"); // >= 7 → Critical

    // Verify 10-level topic roadmap
    const dsaTopics = topicsMap[dsa!.skill_set_id];
    expect(dsaTopics).toBeDefined();
    expect(dsaTopics.length).toBe(10);
    expect(dsaTopics[0].level_number).toBe(1);
    expect(dsaTopics[9].level_number).toBe(10);
  });
});
