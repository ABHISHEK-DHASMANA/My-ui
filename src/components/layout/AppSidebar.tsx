import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  BrainCircuit,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "@/components/CompanyLogo";

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();

  const companyName = selectedCompany?.companyName || "Company";
  const logoUrl = selectedCompany?.logoUrl;

  const navItems = [
    {
      name: "Company Intelligence",
      to: "/company/intelligence",
      icon: Building2,
    },
    {
      name: "Skill Intelligence",
      to: "/company/skills",
      icon: BrainCircuit,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out lg:static ${
          // Enterprise styles from prompt:
          // Sidebar background: #F8FAFC, Sidebar border: #E5E7EB, Sidebar text: #334155
          "bg-[#F8FAFC] border-[#E5E7EB] text-[#334155]"
        } ${collapsed ? "w-20" : "w-64"} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-4">
          {!collapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <CompanyLogo
                name={companyName}
                logoUrl={logoUrl}
                size="sm"
                className="shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Target Company
                </p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {companyName}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <CompanyLogo
                name={companyName}
                logoUrl={logoUrl}
                size="sm"
              />
            </div>
          )}

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                      : "text-[#334155] hover:bg-slate-100/80 hover:text-slate-900"
                  } ${collapsed ? "justify-center" : ""}`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: All Companies link (NO logout, NO user profile) */}
        <div className="border-t border-[#E5E7EB] p-3">
          <button
            onClick={() => {
              onCloseMobile();
              navigate("/");
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title="All Companies"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-slate-500" />
            {!collapsed && <span>All Companies</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
