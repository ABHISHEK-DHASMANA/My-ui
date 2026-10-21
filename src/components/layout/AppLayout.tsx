import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, ChevronRight, Building2, Home } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { AppSidebar } from "@/components/layout/AppSidebar";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCompany } = useCompany();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Route Guard:
  // If selected-company is missing from state & localStorage, redirect to "/"
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

  const companyName = selectedCompany?.companyName || "Company";
  const isSkillsPage = location.pathname.includes("/skills");
  const currentPageTitle = isSkillsPage ? "Skill Intelligence" : "Company Intelligence";

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(prev => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs showing company name */}
            <nav className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-500 overflow-hidden">
              <Link
                to="/"
                className="flex items-center gap-1 font-medium hover:text-blue-600 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Companies</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[240px]">
                {companyName}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-blue-600 font-medium whitespace-nowrap">
                {currentPageTitle}
              </span>
            </nav>
          </div>

          {/* Right Header: Short tag pill */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
              JSS · INTELLIGENCE PLATFORM
            </span>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
