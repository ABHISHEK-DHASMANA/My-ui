# JSS UNIVERSITY, Noida Companies Research & Placement Analytics Portal

> Also known as **JSS UNIVERSITY, Noida Placement Intelligence Hub** (`JSS · INTELLIGENCE PLATFORM`).

A high-performance, mobile-first React + Vite + TypeScript + Tailwind v3 + shadcn/ui Single Page Application built to empower students and campus recruiters with comprehensive due diligence, 22-point institutional intelligence, and 10-level Bloom taxonomy skill roadmaps.

---

## Phase 2 — Supabase (Read-Only, JSON-Driven)

The portal is wired to Supabase using pure JSON-driven queries with zero database joins on the 90+ enterprise tables.

### Quick Setup:
1. Open `.env` in the root of the project.
2. Paste your project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run the development server:
   ```bash
   npm install && npm run dev
   ```

### Database Architecture in Phase 2:
- **Company Cards / Directory**: `SELECT company_id, short_json FROM company_json`
- **Single Company Intelligence**: `SELECT company_id, short_json, full_json FROM company_json WHERE company_id = :id` (powers all 22 institutional sections)
- **Skills & Topic Roadmaps**: Queried from the 4 designated tables (`company_skill_levels`, `skill_set_master`, `proficiency_levels`, `skill_set_topics`) and mapped into 10-level Bloom competency ladders.
- **Graceful Fallback**: If `.env` is empty or during offline testing, the portal gracefully falls back to the local Accenture seed dataset without throwing unhandled exceptions.

---

## Architectural Principles & Scope

### 1. Phase 1: UI-Only with Hardcoded Seed Data
- **No Database / Cloud Backend:** Phase 1 operates strictly on local TypeScript seed data (`src/data/seedCompanies.ts`). No Supabase tables, migrations, RLS policies, edge functions, or database clients are enabled.
- **Reference Dataset:** Pre-populated with verified enterprise-grade intelligence for Accenture plc (`full_json` with 163 attributes and 12 core skill dimensions).
- **Preparation Ladders:** Includes full 10-level progressive competency roadmaps (`src/data/skillTopics.ts`) mapped against Bloom's Revised Taxonomy (CU, AP, AS, EV, CR).

### 2. Fully Public Access (Zero Auth Overhead)
- **No Login / Authentication:** The portal has **no** `/login` route, no `AuthContext`, no `ProtectedRoute`, and no authentication gates.
- Every route and analysis section is publicly reachable directly by students, faculty, and recruiters.

### 3. Configured Institution Details
- **College Full Name:** `JSS UNIVERSITY, Noida`
- **Short Tag:** `JSS`
- **Branding Standard:** Strictly follows the enterprise text-only wordmark and header pill (`JSS · INTELLIGENCE PLATFORM`). No college logo image files are bundled or loaded.

### 4. Seamless Phase 2 Supabase Readiness
- The data normalization layer in `src/lib/companyData.ts` (`normalizeCompanySummary`, `normalizeCompanyProfile`, `normalizeDashboardSkills`) directly ingests raw JSONB objects (`short_json` and `full_json`).
- When Phase 2 connects to Supabase, swapping from local seed data to Supabase queries will be a seamless one-file modification in the query hooks without altering UI components.

### 5. Strict Data Privacy & Placement Compliance
- **Zero Financial Disclosures:** As mandated, **CTC, Stipend, and Selection Ratio** are completely omitted across all summaries, intelligence sections, and profiles.

---

## 22 Institutional Intelligence Sections
The portal analyzes target employers across 22 structured dimensions:
1. **Company Identity**
2. **Overview & Vision**
3. **Leadership**
4. **Funding & Financials**
5. **Global Presence**
6. **Products & Services**
7. **Technology Stack**
8. **Partnerships & Ecosystem**
9. **Competitive Landscape**
10. **Market Opportunity**
11. **Core Value Proposition & ESG**
12. **Culture & Work Life**
13. **Recent News & Milestones**
14. **Sales & Customer Metrics**
15. **Risk & Compliance**
16. **Work Location & Commute**
17. **Safety & Wellbeing**
18. **Career Growth & Learning**
19. **Brand & Reputation**
20. **Compensation & Benefits** *(Zero CTC / Stipend figures)*
21. **Digital Presence & Ratings**
22. **Contact Information**

---

## Routing & Navigation Architecture
- `/` — Company directory with real-time 200ms debounced search and category filter pills (`All`, `Super Dream`, `Dream`, `Standard`, `Regular`).
- `/company` — Automatically redirects to `/company/intelligence`.
- `/company/intelligence` — Sticky header, scroll-spy navigation, and 22-section deep dive for the active company.
- `/company/skills` — Bloom taxonomy breakdown, criticality badges, and 10-level preparation ladders.
- `*` — 404 Catch-all for non-existent URLs only.

---

## Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` (Tested on `v24`)
- npm `v9+`

### Installation & Run
```bash
# Navigate to the project directory
cd jss-placement-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Run Vitest test suite
npm run test

# Production build
npm run build
```

### Environment Variables (Optional)
Create a `.env` file in the project root if you have a Logo.dev API token:
```env
VITE_LOGO_DEV_PUBLISHABLE_KEY=your_publishable_key
```
*(If omitted, the portal automatically falls back to company seed URLs and styled typography badges).*
