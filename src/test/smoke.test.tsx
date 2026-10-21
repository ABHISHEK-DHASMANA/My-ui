import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { SEED_COMPANIES } from "../data/seedCompanies";
import {
  normalizeCompanySummary,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
} from "../lib/companyData";
import { buildIntelligenceSections } from "../data/intelligenceData";

describe("Smoke Test Suite - JSS Placement Intelligence Hub", () => {
  it("validates seed data presence and integrity", () => {
    expect(SEED_COMPANIES).toHaveLength(1);
    const accenture = SEED_COMPANIES[0];
    expect(accenture.short_json.name).toBe("Accenture plc");
    expect(accenture.short_json.company_type).toBe("Dream");
    expect(accenture.skill_levels).toHaveLength(12);
  });

  it("normalizers produce valid structures with 0 CTC/stipend leaks", () => {
    const raw = SEED_COMPANIES[0];
    const summary = normalizeCompanySummary(raw.short_json, raw.company_id);
    const profile = normalizeCompanyProfile(raw.full_json, raw.short_json);
    const skills = normalizeDashboardSkills(raw.skill_levels);

    expect(summary.name).toBe("Accenture plc");
    expect(skills).toHaveLength(12);

    // Hard constraint verification: NO CTC or stipend fields
    expect(profile.ctc).toBeUndefined();
    expect(profile.stipend).toBeUndefined();
    expect(profile.selection_ratio).toBeUndefined();
  });

  it("generates exactly 22 intelligence sections", () => {
    const sections = buildIntelligenceSections(SEED_COMPANIES[0].full_json);
    expect(sections).toHaveLength(22);
    expect(sections[0].title).toBe("Company Identity");
    expect(sections[21].title).toBe("Contact Information");
  });

  it("renders main application without throwing", async () => {
    render(<App />);
    // Hero title check
    const heading = await screen.findByText(
      /JSS UNIVERSITY, Noida Companies Research & Placement Analytics Portal/i
    );
    expect(heading).toBeInTheDocument();
  });
});
