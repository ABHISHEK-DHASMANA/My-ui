import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Sparkles, RotateCcw, AlertTriangle, RefreshCw } from "lucide-react";
import { CompanySummary, CATEGORY_COLORS } from "@/lib/companyData";
import { useCompanies } from "@/lib/companyApi";
import { CompanyCard } from "@/components/CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const COLLEGE_NAME = "JSS UNIVERSITY, Noida";
const COLLEGE_SHORT = "JSS";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // React Query hook fetching from Supabase company_json
  const { data: companies = [], isLoading, isError, error, refetch } = useCompanies();

  // 200ms debounce for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Category counts computed from query data
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: companies.length,
      "Super Dream": 0,
      Dream: 0,
      Standard: 0,
      Regular: 0,
    };
    companies.forEach(c => {
      if (counts[c.company_type] !== undefined) {
        counts[c.company_type]++;
      }
    });
    return counts;
  }, [companies]);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      // Category filter
      if (selectedCategory !== "All" && c.company_type !== selectedCategory) {
        return false;
      }
      // Search filter (name, short_name, category, HQ, operating countries)
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesShort = c.short_name.toLowerCase().includes(query);
        const matchesCategory = c.category.toLowerCase().includes(query);
        const matchesHQ = c.headquarters_address.toLowerCase().includes(query);
        return matchesName || matchesShort || matchesCategory || matchesHQ;
      }
      return true;
    });
  }, [companies, selectedCategory, debouncedSearch]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const filterOptions = [
    { label: "All", count: categoryCounts["All"], colorClass: "text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200" },
    { label: "Super Dream", count: categoryCounts["Super Dream"], hex: CATEGORY_COLORS["Super Dream"].hex },
    { label: "Dream", count: categoryCounts["Dream"], hex: CATEGORY_COLORS["Dream"].hex },
    { label: "Standard", count: categoryCounts["Standard"], hex: CATEGORY_COLORS["Standard"].hex },
    { label: "Regular", count: categoryCounts["Regular"], hex: CATEGORY_COLORS["Regular"].hex },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section: Enterprise SaaS layout (NO hero gradients, White bg, Bottom border) */}
      <section className="border-b border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{COLLEGE_SHORT} · INTELLIGENCE PLATFORM</span>
          </div>

          {/* Heading (Outfit font, font-heading) */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {COLLEGE_NAME} Companies Research &amp; Placement Analytics Portal
          </h1>

          {/* Descriptive Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Your strategic edge for campus placements
          </p>

          {/* Search bar directly below hero */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by company name, sector, tech domain, or location..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-10 text-sm shadow-xs placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error State */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-5 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <h3 className="font-heading text-sm font-bold">Failed to load company records</h3>
                <p className="text-xs text-red-700 mt-0.5">
                  {error?.message || "There was a problem querying the database. Please verify your Supabase connection."}
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

        {/* 5 Filter Pills with Live Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map(option => {
              const isActive = selectedCategory === option.label;
              const isAll = option.label === "All";

              return (
                <button
                  key={option.label}
                  onClick={() => setSelectedCategory(option.label)}
                  style={{
                    backgroundColor: isActive
                      ? isAll
                        ? "#1e293b"
                        : option.hex
                      : undefined,
                    color: isActive ? "#ffffff" : undefined,
                    borderColor: isActive
                      ? isAll
                        ? "#1e293b"
                        : option.hex
                      : undefined,
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-200/80 text-slate-700"
                    }`}
                  >
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredCompanies.length}</span>{" "}
            {filteredCompanies.length === 1 ? "organization" : "organizations"}
          </div>
        </div>

        {/* Loading Skeleton: 8-card skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-11 w-11 rounded-lg" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-5/6 rounded-md" />
                  <Skeleton className="h-3.5 w-2/3 rounded-md" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCompanies.length > 0 ? (
          /* Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          /* Empty State with Reset CTA */
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-16 px-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-semibold text-slate-900">
                No matching companies found
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                No results matched "{searchTerm || selectedCategory}". Try adjusting your search query or reset the filters.
              </p>
            </div>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Filters</span>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
