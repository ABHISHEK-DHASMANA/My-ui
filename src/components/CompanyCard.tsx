import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { CompanySummary, CATEGORY_COLORS, isNullish } from "@/lib/companyData";
import { useCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  company: CompanySummary;
}

export const CompanyCard = memo(function CompanyCard({ company }: CompanyCardProps) {
  const navigate = useNavigate();
  const { setSelectedCompany } = useCompany();

  const handleClick = () => {
    // 1. Save selected-company to localStorage
    const selectedPayload = {
      companyId: company.id,
      companyName: company.short_name || company.name,
      logoUrl: company.logo_url,
    };

    try {
      localStorage.setItem("selected-company", JSON.stringify(selectedPayload));
    } catch (e) {
      console.warn("Error setting localStorage:", e);
    }

    // 2. Update CompanyContext
    setSelectedCompany(selectedPayload);

    // 3. Navigate directly to /company/intelligence
    navigate("/company/intelligence");
  };

  const isGrowthNegative = company.yoy_growth_rate.trim().startsWith("-");
  const catColor = CATEGORY_COLORS[company.company_type] || CATEGORY_COLORS["Dream"];

  const renderFieldValue = (val: string) => {
    if (isNullish(val)) {
      return <span className="italic text-slate-400">not publicly available</span>;
    }
    return <span>{val}</span>;
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div>
        {/* Top Header: Logo + Badge */}
        <div className="flex items-start justify-between gap-3">
          <CompanyLogo
            name={company.name}
            logoUrl={company.logo_url}
            websiteUrl={company.website_url}
            size="md"
          />

          <Badge
            variant={
              company.company_type === "Super Dream"
                ? "superDream"
                : company.company_type === "Standard"
                ? "standard"
                : company.company_type === "Regular"
                ? "regular"
                : "dream"
            }
            className="text-[11px] font-semibold tracking-wide shrink-0"
          >
            {company.company_type}
          </Badge>
        </div>

        {/* Company Title */}
        <div className="mt-3.5">
          <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {company.name}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {company.short_name} · {company.category}
          </p>
        </div>

        {/* Key Attributes */}
        <div className="mt-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="truncate">{renderFieldValue(company.headquarters_address)}</div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="truncate">{renderFieldValue(company.employee_size)}</div>
          </div>

          <div className="flex items-center gap-2">
            {isGrowthNegative ? (
              <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
            <span
              className={`font-medium ${
                isGrowthNegative ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {isNullish(company.yoy_growth_rate) ? (
                renderFieldValue(company.yoy_growth_rate)
              ) : (
                `${company.yoy_growth_rate} YoY Growth`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="text-[11px] font-medium text-slate-400">
          Founded {company.incorporation_year || "—"}
        </span>
        <div className="flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
});
