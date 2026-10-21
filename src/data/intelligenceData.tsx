import {
  Building2,
  Eye,
  Users2,
  DollarSign,
  Globe2,
  PackageCheck,
  Cpu,
  Handshake,
  Swords,
  TrendingUp,
  HeartHandshake,
  Smile,
  Newspaper,
  BarChart3,
  ShieldAlert,
  MapPin,
  HeartPulse,
  GraduationCap,
  Award,
  Gift,
  Share2,
  Mail,
  LucideIcon,
} from "lucide-react";

export interface IntelligenceField {
  key: string;
  label: string;
  value?: any;
  type?: "text" | "url" | "video" | "rating" | "list" | "badge";
}

export interface IntelligenceSection {
  id: string;
  number: number;
  title: string;
  icon: LucideIcon;
  fields: IntelligenceField[];
}

interface RawSectionDefinition {
  id: string;
  number: number;
  title: string;
  icon: LucideIcon;
  fields: Array<{
    key: string;
    label: string;
    type?: IntelligenceField["type"];
  }>;
}

export function buildIntelligenceSections(profile?: Record<string, any>): IntelligenceSection[] {
  const p = profile || {};

  const rawSections: RawSectionDefinition[] = [
    {
      id: "company-identity",
      number: 1,
      title: "Company Identity",
      icon: Building2,
      fields: [
        { key: "name", label: "Legal Entity Name" },
        { key: "short_name", label: "Display / Short Name" },
        { key: "category", label: "Industry Category" },
        { key: "company_type", label: "Campus Tier Category" },
        { key: "incorporation_year", label: "Incorporation Year" },
        { key: "nature_of_company", label: "Nature of Company (Public / Private)" },
        { key: "headquarters_address", label: "Global Headquarters" },
      ],
    },
    {
      id: "overview-vision",
      number: 2,
      title: "Overview & Vision",
      icon: Eye,
      fields: [
        { key: "overview_text", label: "Executive Overview" },
        { key: "vision_statement", label: "Vision Statement" },
        { key: "mission_statement", label: "Mission Statement" },
        { key: "core_values", label: "Core Values", type: "list" },
        { key: "history_timeline", label: "Milestones & History", type: "list" },
      ],
    },
    {
      id: "leadership",
      number: 3,
      title: "Leadership",
      icon: Users2,
      fields: [
        { key: "ceo_name", label: "Chief Executive Officer (CEO)" },
        { key: "ceo_linkedin_url", label: "CEO LinkedIn Profile", type: "url" },
        { key: "key_leaders", label: "Key Executive Leaders", type: "list" },
        { key: "board_members", label: "Board of Directors", type: "list" },
        { key: "warm_intro_pathways", label: "Warm Intro & Network Pathways", type: "list" },
        { key: "decision_maker_access", label: "Decision Maker Access Level" },
      ],
    },
    {
      id: "funding-financials",
      number: 4,
      title: "Funding & Financials",
      icon: DollarSign,
      fields: [
        { key: "valuation", label: "Valuation / Market Capitalization" },
        { key: "annual_revenue", label: "Annual Revenue" },
        { key: "annual_profit", label: "Annual Net Profit / Income" },
        { key: "profitability_status", label: "Profitability Status" },
        { key: "yoy_growth_rate", label: "Year-over-Year Growth Rate" },
        { key: "revenue_mix", label: "Revenue Stream Mix", type: "list" },
        { key: "key_investors", label: "Key Institutional Investors", type: "list" },
        { key: "total_capital_raised", label: "Total Capital Raised" },
        { key: "recent_funding_rounds", label: "Recent Funding / Market Status" },
        { key: "burn_rate", label: "Cash Burn Rate" },
        { key: "runway_months", label: "Runway (Months)" },
      ],
    },
    {
      id: "global-presence",
      number: 5,
      title: "Global Presence",
      icon: Globe2,
      fields: [
        { key: "operating_countries", label: "Operating Countries", type: "list" },
        { key: "office_count", label: "Total Office Facilities" },
        { key: "office_locations", label: "Major Office Delivery Centers", type: "list" },
        { key: "employee_size", label: "Global Employee Headcount" },
      ],
    },
    {
      id: "products-services",
      number: 6,
      title: "Products & Services",
      icon: PackageCheck,
      fields: [
        { key: "offerings_description", label: "Core Business Offerings", type: "list" },
        { key: "focus_sectors", label: "Primary Focus Verticals & Sectors", type: "list" },
        { key: "pain_points_addressed", label: "Industry Pain Points Solved", type: "list" },
        { key: "top_customers", label: "Key Enterprise Clients", type: "list" },
        { key: "product_pipeline", label: "Active Product / Innovation Pipeline", type: "list" },
        { key: "case_studies", label: "Signature Case Studies & Deployments", type: "list" },
      ],
    },
    {
      id: "technology-stack",
      number: 7,
      title: "Technology Stack",
      icon: Cpu,
      fields: [
        { key: "tech_stack", label: "Core Enterprise & Engineering Tech Stack", type: "list" },
        { key: "ai_ml_adoption_level", label: "AI / ML & GenAI Adoption Posture" },
        { key: "tech_adoption_rating", label: "Technology Modernization Tier" },
        { key: "intellectual_property", label: "Patents, Labs & Proprietary IP", type: "list" },
        { key: "r_and_d_investment", label: "Annual R&D Investment" },
        { key: "cybersecurity_posture", label: "Cybersecurity & Infosec Standards", type: "list" },
      ],
    },
    {
      id: "partnerships-ecosystem",
      number: 8,
      title: "Partnerships & Ecosystem",
      icon: Handshake,
      fields: [
        { key: "technology_partners", label: "Strategic Technology Alliances", type: "list" },
        { key: "partnership_ecosystem", label: "Cloud & Platform Ecosystem", type: "list" },
        { key: "industry_associations", label: "Industry Memberships & Global Forums", type: "list" },
      ],
    },
    {
      id: "competitive-landscape",
      number: 9,
      title: "Competitive Landscape",
      icon: Swords,
      fields: [
        { key: "key_competitors", label: "Primary Direct Competitors", type: "list" },
        { key: "competitive_advantages", label: "Key Competitive Moats", type: "list" },
        { key: "weaknesses_gaps", label: "Organizational / Operational Gaps", type: "list" },
        { key: "benchmark_vs_peers", label: "Peer Group Benchmarking Analysis" },
      ],
    },
    {
      id: "market-opportunity",
      number: 10,
      title: "Market Opportunity",
      icon: TrendingUp,
      fields: [
        { key: "tam", label: "Total Addressable Market (TAM)" },
        { key: "sam", label: "Serviceable Addressable Market (SAM)" },
        { key: "som", label: "Serviceable Obtainable Market (SOM)" },
        { key: "market_share_percentage", label: "Estimated Global Market Share" },
        { key: "future_projections", label: "Projected Growth & Revenue Targets" },
        { key: "strategic_priorities", label: "Strategic Priorities & Future Bets", type: "list" },
      ],
    },
    {
      id: "core-value-proposition-esg",
      number: 11,
      title: "Core Value Proposition & ESG",
      icon: HeartHandshake,
      fields: [
        { key: "core_value_proposition", label: "Core Enterprise Value Proposition" },
        { key: "unique_differentiators", label: "Unique Value Differentiators", type: "list" },
        { key: "esg_ratings", label: "ESG Commitments & Governance", type: "list" },
        { key: "carbon_footprint", label: "Carbon Reduction & Net-Zero Strategy" },
        { key: "ethical_sourcing", label: "Ethical Procurement & Supplier Code", type: "list" },
        { key: "sustainability_csr", label: "Sustainability & CSR Initiatives", type: "list" },
      ],
    },
    {
      id: "culture-work-life",
      number: 12,
      title: "Culture & Work Life",
      icon: Smile,
      fields: [
        { key: "work_culture_summary", label: "Workplace Culture Summary" },
        { key: "manager_quality", label: "Engineering & People Management Quality" },
        { key: "psychological_safety", label: "Team Psychological Safety" },
        { key: "feedback_culture", label: "Feedback & Performance Review Culture" },
        { key: "diversity_metrics", label: "Workforce Diversity & Inclusion Metrics", type: "list" },
        { key: "ethical_standards", label: "Corporate Ethics & Integrity Guardrails" },
        { key: "burnout_risk", label: "Workload & Burnout Risk Rating" },
        { key: "layoff_history", label: "Restructuring & Layoff History" },
        { key: "crisis_behavior", label: "Leadership Crisis Response Culture" },
      ],
    },
    {
      id: "recent-news-milestones",
      number: 13,
      title: "Recent News & Milestones",
      icon: Newspaper,
      fields: [
        { key: "recent_news", label: "Major Recent News & Deals", type: "list" },
        { key: "event_participation", label: "Global Keynotes & Conferences", type: "list" },
        { key: "innovation_roadmap", label: "Active Innovation Roadmaps", type: "list" },
      ],
    },
    {
      id: "sales-customer-metrics",
      number: 14,
      title: "Sales & Customer Metrics",
      icon: BarChart3,
      fields: [
        { key: "sales_motion", label: "Sales & Distribution Motion" },
        { key: "go_to_market_strategy", label: "Go-to-Market Strategy", type: "list" },
        { key: "net_promoter_score", label: "Net Promoter Score (NPS)" },
        { key: "churn_rate", label: "Annual Client Churn Rate" },
        { key: "customer_concentration_risk", label: "Client Revenue Concentration Risk" },
        { key: "customer_acquisition_cost", label: "Enterprise Customer Acquisition Cost" },
        { key: "customer_lifetime_value", label: "Enterprise Customer Lifetime Value" },
      ],
    },
    {
      id: "risk-compliance",
      number: 15,
      title: "Risk & Compliance",
      icon: ShieldAlert,
      fields: [
        { key: "regulatory_status", label: "Regulatory Certifications & Compliance", type: "list" },
        { key: "legal_issues", label: "Material Legal & Litigation History" },
        { key: "geopolitical_risks", label: "Geopolitical & Sovereign Exposure", type: "list" },
        { key: "macro_risks", label: "Macroeconomic & Industry Headwinds", type: "list" },
        { key: "supply_chain_dependencies", label: "Supply Chain & Vendor Dependencies", type: "list" },
      ],
    },
    {
      id: "work-location-commute",
      number: 16,
      title: "Work Location & Commute",
      icon: MapPin,
      fields: [
        { key: "remote_policy_details", label: "Remote & Hybrid Work Policy" },
        { key: "typical_hours", label: "Core Working Hours Flexibility" },
        { key: "overtime_expectations", label: "Overtime & Peak Load Expectations" },
        { key: "weekend_work", label: "Weekend Work Frequency" },
        { key: "location_centrality", label: "Office Location Centrality" },
        { key: "public_transport_access", label: "Transit & Metro Connectivity", type: "list" },
        { key: "cab_policy", label: "Company Transportation & Cab Policy" },
        { key: "airport_commute_time", label: "Airport Commute Duration" },
        { key: "office_zone_type", label: "Office Zone Classification" },
      ],
    },
    {
      id: "safety-wellbeing",
      number: 17,
      title: "Safety & Wellbeing",
      icon: HeartPulse,
      fields: [
        { key: "area_safety", label: "Campus & Neighborhood Safety Rating" },
        { key: "safety_policies", label: "Late-Night & Commute Safety Policies", type: "list" },
        { key: "infrastructure_safety", label: "Facility Infrastructure & Fire Safety" },
        { key: "emergency_preparedness", label: "Medical Support & Emergency Preparedness" },
      ],
    },
    {
      id: "career-growth-learning",
      number: 18,
      title: "Career Growth & Learning",
      icon: GraduationCap,
      fields: [
        { key: "learning_culture", label: "Learning Platforms & Certifications", type: "list" },
        { key: "training_spend", label: "Annual Training Budget per Employee" },
        { key: "onboarding_quality", label: "Campus Onboarding & Bootcamps" },
        { key: "mentorship_availability", label: "Peer & Leadership Mentorship" },
        { key: "internal_mobility", label: "Internal Project & Role Mobility" },
        { key: "promotion_clarity", label: "Promotion Criteria & Evaluation Cycle" },
        { key: "tools_access", label: "Modern Software & Cloud Tools Access" },
        { key: "role_clarity", label: "Role Scope & Expected Ownership" },
        { key: "work_impact", label: "Early-Career Client & Revenue Impact" },
        { key: "cross_functional_exposure", label: "Cross-Functional Domain Exposure", type: "list" },
        { key: "exit_opportunities", label: "Alumni Exit Trajectories", type: "list" },
      ],
    },
    {
      id: "brand-reputation",
      number: 19,
      title: "Brand & Reputation",
      icon: Award,
      fields: [
        { key: "brand_value", label: "Global Brand Value & Market Stature" },
        { key: "awards_recognitions", label: "Major Industry Awards & Accreditations", type: "list" },
        { key: "brand_sentiment_score", label: "Public Brand Sentiment" },
        { key: "glassdoor_rating", label: "Glassdoor Overall Rating", type: "rating" },
        { key: "indeed_rating", label: "Indeed Overall Rating", type: "rating" },
        { key: "google_rating", label: "Google Business Rating", type: "rating" },
        { key: "social_media_followers", label: "Global Social Media Audience" },
        { key: "marketing_video_url", label: "Corporate Video Showcase", type: "video" },
      ],
    },
    {
      id: "compensation-benefits",
      number: 20,
      title: "Compensation & Benefits",
      icon: Gift,
      fields: [
        // CRITICAL: NEVER include CTC, stipend, or selection ratio
        { key: "fixed_vs_variable_pay", label: "Compensation Structure (Fixed vs Variable)" },
        { key: "bonus_predictability", label: "Annual Performance Bonus Predictability" },
        { key: "esops_incentives", label: "Equity Incentives & Stock Grants (ESOP/RSU)", type: "list" },
        { key: "leave_policy", label: "Paid Leave & Time-Off Policy", type: "list" },
        { key: "health_support", label: "Health & Mental Wellness Coverage", type: "list" },
        { key: "family_health_insurance", label: "Family & Dependent Medical Insurance" },
        { key: "relocation_support", label: "Relocation Assistance & Housing Allowance", type: "list" },
        { key: "lifestyle_benefits", label: "Lifestyle, Meal & Fitness Allowances", type: "list" },
      ],
    },
    {
      id: "digital-presence-ratings",
      number: 21,
      title: "Digital Presence & Ratings",
      icon: Share2,
      fields: [
        { key: "website_url", label: "Official Web Portal", type: "url" },
        { key: "linkedin_url", label: "LinkedIn Enterprise Page", type: "url" },
        { key: "twitter_handle", label: "Official Twitter / X Handle" },
        { key: "facebook_url", label: "Facebook Page", type: "url" },
        { key: "instagram_url", label: "Instagram Handle", type: "url" },
        { key: "website_traffic_rank", label: "Global Web Traffic Ranking" },
        { key: "website_quality", label: "Web Clarity & Architecture" },
      ],
    },
    {
      id: "contact-information",
      number: 22,
      title: "Contact Information",
      icon: Mail,
      fields: [
        { key: "contact_person_name", label: "University Relations / Executive Contact" },
        { key: "contact_person_title", label: "Contact Designation" },
        { key: "contact_person_email", label: "Contact Email Address" },
        { key: "contact_person_phone", label: "Contact Phone / Desk" },
        { key: "primary_contact_email", label: "Corporate Headquarters Email" },
      ],
    },
  ];

  return rawSections.map(s => ({
    id: s.id,
    number: s.number,
    title: s.title,
    icon: s.icon,
    fields: s.fields.map(f => ({
      key: f.key,
      label: f.label,
      type: f.type,
      value: p[f.key] !== undefined ? p[f.key] : undefined,
    })),
  }));
}
