import React, { createContext, useContext, useState, useEffect } from "react";

export interface SelectedCompanyInfo {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

export interface CompanyContextType {
  selectedCompany: SelectedCompanyInfo | null;
  companyId: number | null;
  setSelectedCompany: (company: SelectedCompanyInfo) => void;
  clearSelectedCompany: () => void;
}

const LOCAL_STORAGE_KEY = "selected-company";

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompanyState] = useState<SelectedCompanyInfo | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.companyId === "number") {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read selected-company from localStorage", e);
    }
    return null;
  });

  const setSelectedCompany = (company: SelectedCompanyInfo) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(company));
    } catch (e) {
      console.warn("Failed to save selected-company to localStorage", e);
    }
    setSelectedCompanyState(company);
  };

  const clearSelectedCompany = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear selected-company", e);
    }
    setSelectedCompanyState(null);
  };

  return (
    <CompanyContext.Provider
      value={{
        selectedCompany,
        companyId: selectedCompany?.companyId ?? null,
        setSelectedCompany,
        clearSelectedCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
