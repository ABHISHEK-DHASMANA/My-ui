import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { CompanyProvider } from "@/context/CompanyContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
const Index = lazy(() => import("@/pages/Index"));
const CompanyIntelligence = lazy(() => import("@/pages/CompanyIntelligence"));
const SkillIntelligence = lazy(() => import("@/pages/SkillIntelligence"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Query Client setup with required options:
// staleTime: 5min (300000ms), gcTime: 10min (600000ms), retry: 1, refetchOnWindowFocus: false
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-500">Loading Intelligence Portal...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
        <CompanyProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Home route */}
                <Route path="/" element={<Index />} />

                {/* Nested Company routes (MANDATORY EXACT IMPLEMENTATION) */}
                <Route path="/company" element={<AppLayout />}>
                  <Route index element={<Navigate to="intelligence" replace />} />
                  <Route path="intelligence" element={<CompanyIntelligence />} />
                  <Route path="skills" element={<SkillIntelligence />} />
                </Route>

                {/* Catch-all 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CompanyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
