import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Linkedin,
  ExternalLink,
  Play,
  Star,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { useCompanyProfile } from "@/lib/companyApi";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  buildIntelligenceSections,
  IntelligenceSection,
  IntelligenceField,
} from "@/data/intelligenceData";
import { isNullish, splitItems } from "@/lib/companyData";

// Memoized FieldRow component
const FieldRow = memo(function FieldRow({ field }: { field: IntelligenceField }) {
  const { label, value, type } = field;

  const renderValue = () => {
    if (isNullish(value)) {
      return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">
          Not Available
        </span>
      );
    }

    const strVal = String(value).trim();

    // Explicit or auto-detected URL
    if (type === "url" || (strVal.startsWith("http://") || strVal.startsWith("https://"))) {
      return (
        <a
          href={strVal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline break-all"
        >
          <span>{strVal}</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      );
    }

    // Video URL
    if (type === "video") {
      return (
        <a
          href={strVal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
        >
          <Play className="h-3.5 w-3.5 fill-red-600 text-red-600" />
          <span>Watch Corporate Media ({strVal})</span>
        </a>
      );
    }

    // Star / Glassdoor / Indeed rating
    if (type === "rating") {
      return (
        <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>{strVal}</span>
        </div>
      );
    }

    // List or semicolon-separated items
    if (type === "list" || strVal.includes(";")) {
      const items = splitItems(strVal);
      if (items.length > 1) {
        return (
          <div className="flex flex-wrap gap-1.5">
            {items.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        );
      }
    }

    // Multi-line paragraph or standard text
    if (strVal.length > 150) {
      return <p className="text-sm leading-relaxed text-slate-700">{strVal}</p>;
    }

    return <span className="text-sm font-medium text-slate-800">{strVal}</span>;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start border-b border-slate-100 py-3 last:border-b-0 gap-1.5 sm:gap-4">
      <div className="sm:w-1/3 text-xs font-semibold text-slate-500 uppercase tracking-wide pt-0.5">
        {label}
      </div>
      <div className="sm:w-2/3 min-w-0">{renderValue()}</div>
    </div>
  );
});

// Memoized SectionCard component
const SectionCard = memo(function SectionCard({
  section,
}: {
  section: IntelligenceSection;
}) {
  const Icon = section.icon;

  // Active fields count
  const filledCount = section.fields.filter(f => !isNullish(f.value)).length;

  return (
    <section
      id={section.id}
      className="scroll-mt-36 rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-shadow hover:shadow-sm"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              {section.title}
            </h2>
            <p className="text-xs text-slate-400">
              Section {section.number} of 22
            </p>
          </div>
        </div>

        {/* Count Badge */}
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {filledCount} / {section.fields.length} points
        </span>
      </div>

      {/* Field Rows */}
      <div className="divide-y divide-slate-100/60">
        {section.fields.map(field => (
          <FieldRow key={field.key} field={field} />
        ))}
      </div>
    </section>
  );
});

export default function CompanyIntelligence() {
  const navigate = useNavigate();
  const { selectedCompany, companyId } = useCompany();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const isScrollingRef = useRef(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Guard: if no company is selected, redirect to "/"
  useEffect(() => {
    try {
      const stored = localStorage.getItem("selected-company");
      if (!stored && !selectedCompany) {
        navigate("/", { replace: true });
      }
    } catch {
      if (!selectedCompany) {
        navigate("/", { replace: true });
      }
    }
  }, [selectedCompany, navigate]);

  // Hook fetching company profile from Supabase company_json
  const effectiveId = companyId ?? selectedCompany?.companyId ?? 1;
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useCompanyProfile(effectiveId);

  const profile = data?.profile;
  const summary = data?.summary;

  const sections = useMemo(() => {
    return buildIntelligenceSections(profile || {});
  }, [profile]);

  // Scroll spy implementation
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const headerOffset = 180;
      const scrollPos = window.scrollY + headerOffset;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTabIdx(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Auto-center active tab button in horizontally scrollable tab bar
  useEffect(() => {
    const activeTab = tabRefs.current[activeTabIdx];
    if (activeTab && tabsContainerRef.current && typeof activeTab.scrollIntoView === "function") {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTabIdx]);

  const scrollToSection = (idx: number) => {
    setActiveTabIdx(idx);
    isScrollingRef.current = true;
    const targetSection = sections[idx];
    const el = document.getElementById(targetSection.id);

    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 600);
  };

  const companyName = summary?.name || selectedCompany?.companyName || "Target Company";
  const logoUrl = summary?.logo_url || selectedCompany?.logoUrl;
  const category = summary?.category || "Enterprise";
  const websiteUrl = summary?.website_url || (profile?.website_url as string) || "";
  const linkedinUrl = (profile?.linkedin_url as string) || "";

  return (
    <div className="space-y-6">
      {/* Sticky Top Information Bar */}
      <div className="sticky top-16 z-20 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 border-b border-slate-200 bg-white/95 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-xs shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <CompanyLogo
              name={companyName}
              logoUrl={logoUrl}
              websiteUrl={websiteUrl}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {companyName}
                </h1>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {category}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive 22-Point Institutional Due-Diligence
              </p>
            </div>
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-2">
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>Website</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-100 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                <span>LinkedIn</span>
                <ExternalLink className="h-3 w-3 text-blue-400" />
              </a>
            )}
          </div>
        </div>

        {/* Sticky Tab Bar (22 tabs) */}
        <div className="max-w-7xl mx-auto mt-3 border-t border-slate-100 pt-2">
          <div
            ref={tabsContainerRef}
            className="flex items-center space-x-1 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {sections.map((section, idx) => {
              const isActive = activeTabIdx === idx;
              return (
                <button
                  key={section.id}
                  ref={el => (tabRefs.current[idx] = el)}
                  onClick={() => scrollToSection(idx)}
                  className={`inline-flex items-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="opacity-70 mr-1.5 font-normal">{idx + 1}.</span>
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50/80 p-5 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold">Failed to load company intelligence</h3>
              <p className="text-xs text-red-700 mt-0.5">
                {error?.message || "Error querying company_json in Supabase."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-red-300 bg-white hover:bg-red-50 text-red-700 shrink-0 gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Query</span>
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-6 pt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 22 Intelligence Sections Container */
        <div className="space-y-6 pt-2">
          {sections.map(section => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
