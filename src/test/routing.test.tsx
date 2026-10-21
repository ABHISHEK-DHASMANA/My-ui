import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { SEED_COMPANIES } from "../data/seedCompanies";

describe("Routing & Functional Validation Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "Home", "/");
  });

  it("1. Visiting '/' shows company cards with Accenture", async () => {
    render(<App />);

    expect(
      await screen.findByText(
        "JSS UNIVERSITY, Noida Companies Research & Placement Analytics Portal"
      )
    ).toBeInTheDocument();

    expect(await screen.findByText("Accenture plc")).toBeInTheDocument();
    expect(screen.getAllByText("Dream").length).toBeGreaterThan(0);
    expect(screen.getByText(/3% YoY Growth/i)).toBeInTheDocument();
  });

  it("2. Clicking company card navigates to /company/intelligence and saves to localStorage", async () => {
    render(<App />);

    const card = await screen.findByText("Accenture plc");
    fireEvent.click(card);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/company/intelligence");
    });

    const stored = JSON.parse(localStorage.getItem("selected-company") || "{}");
    expect(stored.companyId).toBe(1);
    expect(stored.companyName).toBe("Accenture");
  });

  it("3. Browser refresh simulation on /company/intelligence retains company data", async () => {
    localStorage.setItem(
      "selected-company",
      JSON.stringify({
        companyId: 1,
        companyName: "Accenture",
        logoUrl: SEED_COMPANIES[0].short_json.logo_url,
      })
    );
    window.history.pushState({}, "Intelligence", "/company/intelligence");

    render(<App />);

    const titles = await screen.findAllByText("Accenture plc", {}, { timeout: 3000 });
    expect(titles.length).toBeGreaterThanOrEqual(1);
    const contactTabs = await screen.findAllByText("Contact Information");
    expect(contactTabs.length).toBeGreaterThan(0);
    expect(screen.getAllByText("Company Identity").length).toBeGreaterThan(0);
    expect(screen.getByText("Section 1 of 22")).toBeInTheDocument();
  });

  it("4. Browser refresh simulation on /company/skills loads 12 skills & topic roadmaps", async () => {
    localStorage.setItem(
      "selected-company",
      JSON.stringify({
        companyId: 1,
        companyName: "Accenture",
        logoUrl: SEED_COMPANIES[0].short_json.logo_url,
      })
    );
    window.history.pushState({}, "Skills", "/company/skills");

    render(<App />);

    expect(
      await screen.findByText("Accenture Skill Intelligence", {}, { timeout: 3000 })
    ).toBeInTheDocument();

    // Check skills (await async query resolution)
    expect(
      await screen.findByText("Data Structures & Algorithms", {}, { timeout: 3000 })
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Object-Oriented Programming", {}, { timeout: 3000 })
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Generative AI Basics", {}, { timeout: 3000 })
    ).toBeInTheDocument();

    // Check expand roadmap
    const expandButtons = screen.getAllByRole("button", {
      name: /expand roadmap/i,
    });
    expect(expandButtons.length).toBeGreaterThan(0);
    fireEvent.click(expandButtons[0]);

    // Check unlocked vs locked text
    expect(screen.getByText(/Required Bar/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Beyond scope/i).length).toBeGreaterThan(0);
  });

  it("5. Visiting /company redirects to /company/intelligence", async () => {
    localStorage.setItem(
      "selected-company",
      JSON.stringify({
        companyId: 1,
        companyName: "Accenture",
        logoUrl: SEED_COMPANIES[0].short_json.logo_url,
      })
    );
    window.history.pushState({}, "Company", "/company");

    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/company/intelligence");
    });
  });

  it("6. Visiting genuinely invalid URL produces 404 NotFound", async () => {
    window.history.pushState({}, "Invalid", "/some-random-broken-path");

    render(<App />);

    expect(await screen.findByText("404 - Page Not Found", {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it("7. /dashboard route does NOT exist (renders 404)", async () => {
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    expect(await screen.findByText("404 - Page Not Found", {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it("8. /login route does NOT exist (renders 404)", async () => {
    window.history.pushState({}, "Login", "/login");

    render(<App />);

    expect(await screen.findByText("404 - Page Not Found", {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it("9. Visiting /company/intelligence without selected-company redirects to /", async () => {
    localStorage.clear();
    window.history.pushState({}, "DirectIntelligence", "/company/intelligence");

    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  it("10. Ensures zero CTC, Stipend, or Selection Ratio are displayed anywhere", async () => {
    localStorage.setItem(
      "selected-company",
      JSON.stringify({
        companyId: 1,
        companyName: "Accenture",
        logoUrl: SEED_COMPANIES[0].short_json.logo_url,
      })
    );
    window.history.pushState({}, "Intelligence", "/company/intelligence");

    render(<App />);

    const titles = await screen.findAllByText("Accenture plc", {}, { timeout: 3000 });
    expect(titles.length).toBeGreaterThanOrEqual(1);

    // Query entire body text to ensure forbidden terms are never exposed
    const bodyText = document.body.textContent || "";
    expect(bodyText).not.toMatch(/\bCTC\b/);
    expect(bodyText).not.toMatch(/\bStipend\b/i);
    expect(bodyText).not.toMatch(/\bSelection Ratio\b/i);
  });
});
