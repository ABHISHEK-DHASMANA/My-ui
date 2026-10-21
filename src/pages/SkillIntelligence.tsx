import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { useCompanySkills } from "@/lib/companyApi";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BLOOM_META,
  CRITICALITY_META,
} from "@/lib/companyData";
import { getSkillTopics } from "@/data/skillTopics";

export default function SkillIntelligence() {
  const navigate = useNavigate();
  const { selectedCompany, companyId } = useCompany();
  const [expandedSkills, setExpandedSkills] = useState<Record<number, boolean>>({});

  // Route Guard: if no company selected, navigate to "/"
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

  const effectiveId = companyId ?? selectedCompany?.companyId ?? 1;

  // React Query hook fetching from the 4 Supabase skill tables
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useCompanySkills(effectiveId);

  const skills = data?.skills || [];
  const topicsMap = data?.topicsMap || {};

  const companyName = selectedCompany?.companyName || "Target Company";
  const logoUrl = selectedCompany?.logoUrl;

  // Sort skills descending by required_level
  const sortedSkills = useMemo(() => {
    return [...skills].sort((a, b) => b.required_level - a.required_level);
  }, [skills]);

  const toggleExpand = (skillId: number) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillId]: !prev[skillId],
    }));
  };

  const toggleAll = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    sortedSkills.forEach(s => {
      next[s.skill_set_id] = expand;
    });
    setExpandedSkills(next);
  };

  return (
    <div className="space-y-8">
      {/* Page Header: company logo + "{Company} Skill Intelligence" */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CompanyLogo
            name={companyName}
            logoUrl={logoUrl}
            size="lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-slate-900">
                {companyName} Skill Intelligence
              </h1>
              <Badge variant="newGlow" className="text-xs">
                Active Benchmark
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Required cognitive proficiencies, Bloom Taxonomy mapping &amp; 10-level competency ladders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAll(true)}
            className="text-xs"
          >
            Expand All Ladders
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleAll(false)}
            className="text-xs text-slate-600"
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50/80 p-5 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold">Failed to load skill requirements</h3>
              <p className="text-xs text-red-700 mt-0.5">
                {error?.message || "Error querying skill tables in Supabase."}
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

      {/* Bloom 5-col Legend (CU/AP/AS/EV/CR tints) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-slate-800 flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Bloom's Revised Taxonomy Cognitive Framework</span>
          </h2>
          <span className="text-xs text-slate-400">Levels 1 to 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(["CU", "AP", "AS", "EV", "CR"] as const).map(code => {
            const meta = BLOOM_META[code];
            const range = {
              CU: "Level 1 – 2",
              AP: "Level 3 – 4",
              AS: "Level 5 – 6",
              EV: "Level 7 – 8",
              CR: "Level 9 – 10",
            }[code];

            return (
              <div
                key={code}
                className="flex flex-col justify-between rounded-lg border p-3 transition-colors"
                style={{
                  borderColor: `${meta.hex}40`,
                  backgroundColor: `${meta.hex}08`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-xs uppercase px-2 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: `${meta.hex}25`,
                      color: meta.hex,
                    }}
                  >
                    {meta.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {range}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900">
                    {meta.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {meta.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Criticality 3-Card Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(CRITICALITY_META).map(([key, meta]) => {
          const isCritical = key === "Critical";
          const isImportant = key === "Important";

          return (
            <div
              key={key}
              className={`rounded-xl border p-4 shadow-xs bg-white ${
                isCritical
                  ? "border-red-200"
                  : isImportant
                  ? "border-amber-200"
                  : "border-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${meta.badgeClass}`}>
                  {meta.label} Priority
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {meta.scoreRange}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                {isCritical
                  ? "Non-negotiable qualifying threshold for technical evaluation rounds and campus shortlisting."
                  : isImportant
                  ? "Significant differentiator during core project interviews and behavioral evaluations."
                  : "Foundation requirements expected from engineering and technical graduates."}
              </p>
            </div>
          );
        })}
      </div>

      {/* Skill Cards (Sorted Descending) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Assessed Skill Ladders ({sortedSkills.length} Core Dimensions)
          </h2>
          <span className="text-xs text-slate-500">
            Click any skill to inspect the 10-level syllabus roadmap
          </span>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSkills.map(skill => {
              const isExpanded = !!expandedSkills[skill.skill_set_id];
              // Retrieve topics from Supabase topicsMap with fallback to getSkillTopics
              const topics =
                topicsMap[skill.skill_set_id] ||
                getSkillTopics(skill.skill_set_id);
              const scorePercent = (skill.required_level / 10) * 100;
              const bloomMeta = BLOOM_META[skill.bloom_level];

              return (
                <div
                  key={skill.skill_set_id}
                  className="rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 shadow-xs overflow-hidden"
                >
                  {/* Main Card Header / Clickable area */}
                  <div
                    onClick={() => toggleExpand(skill.skill_set_id)}
                    className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Left: Skill title + Badges */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base font-bold text-slate-900">
                          {skill.skill_set_name}
                        </h3>

                        {/* Bloom Badge */}
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold"
                          style={{
                            backgroundColor: `${bloomMeta.hex}18`,
                            color: bloomMeta.hex,
                            border: `1px solid ${bloomMeta.hex}35`,
                          }}
                        >
                          <span>{bloomMeta.code}</span>
                          <span className="font-normal text-[11px]">· {bloomMeta.name}</span>
                        </span>

                        {/* Criticality Badge */}
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                            CRITICALITY_META[skill.criticality].badgeClass
                          }`}
                        >
                          {skill.criticality}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        Standard: <span className="font-semibold text-slate-700">{skill.required_proficiency}</span>
                        {" "}· Target Benchmark: <span className="font-bold text-slate-900">Level {skill.required_level}/10</span>
                      </p>
                    </div>

                    {/* Right: Progress bar & Expand CTA */}
                    <div className="flex items-center gap-5 shrink-0">
                      {/* Visual Progress Bar */}
                      <div className="w-36 sm:w-44 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Target</span>
                          <span style={{ color: bloomMeta.hex }}>
                            {skill.required_level} / 10
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${scorePercent}%`,
                              backgroundColor: bloomMeta.hex,
                            }}
                          />
                        </div>
                      </div>

                      {/* Expand icon */}
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        aria-label={isExpanded ? "Collapse roadmap" : "Expand roadmap"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable 10-Level Roadmap */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-1">
                        <span>10-Level Progressive Competency Curriculum</span>
                        <span className="italic">
                          Rows marked with lock are beyond campus assessment baseline
                        </span>
                      </div>

                      <div className="space-y-2">
                        {topics.map(topic => {
                          const isUnlocked = topic.level_number <= skill.required_level;
                          const isTargetLevel = topic.level_number === skill.required_level;

                          return (
                            <div
                              key={topic.level_number}
                              className={`flex items-start sm:items-center justify-between gap-3 rounded-lg border p-3 text-xs transition-colors ${
                                isTargetLevel
                                  ? "bg-white border-blue-400 shadow-xs ring-1 ring-blue-400/20"
                                  : isUnlocked
                                  ? "bg-white border-slate-200 text-slate-800"
                                  : "bg-slate-100/70 border-slate-200/60 text-slate-400"
                              }`}
                            >
                              <div className="flex items-start sm:items-center gap-3">
                                {/* Level badge */}
                                <span
                                  className={`inline-flex h-6 w-14 shrink-0 items-center justify-center rounded text-[11px] font-bold ${
                                    isTargetLevel
                                      ? "bg-blue-600 text-white"
                                      : isUnlocked
                                      ? "bg-slate-200 text-slate-800"
                                      : "bg-slate-200/50 text-slate-400"
                                  }`}
                                >
                                  Lvl {topic.level_number}
                                </span>

                                {/* Topic text */}
                                <span className={`font-medium ${isUnlocked ? "text-slate-800" : "text-slate-400 line-clamp-1 sm:line-clamp-none"}`}>
                                  {topic.topic}
                                </span>
                              </div>

                              {/* Status indicator */}
                              <div className="shrink-0 flex items-center gap-1.5 pl-2">
                                {isTargetLevel ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                                    <Sparkles className="h-3 w-3" />
                                    <span>Required Bar</span>
                                  </span>
                                ) : isUnlocked ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Included</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-[11px] bg-slate-200/60 px-2 py-0.5 rounded">
                                    <Lock className="h-3 w-3" />
                                    <span>Beyond scope</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
