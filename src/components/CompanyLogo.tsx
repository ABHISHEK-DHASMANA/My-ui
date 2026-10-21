import React, { useState } from "react";
import { Building2 } from "lucide-react";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  className = "",
  size = "md",
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const [cdnError, setCdnError] = useState(false);

  // Extract domain from website or name
  let domain = "";
  if (websiteUrl) {
    try {
      const url = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`);
      domain = url.hostname.replace(/^www\./, "");
    } catch {
      // ignore
    }
  }

  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8 text-xs rounded-md",
    md: "w-11 h-11 text-sm rounded-lg",
    lg: "w-14 h-14 text-base rounded-xl",
    xl: "w-16 h-16 text-lg rounded-xl",
  }[size];

  const initial = (name || "C").trim().charAt(0).toUpperCase();

  // 1. Direct logo_url from seed / database
  if (logoUrl && !imgError) {
    return (
      <div
        className={`relative flex items-center justify-center bg-white border border-slate-200 overflow-hidden shadow-xs shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 2. High-resolution Google favicon CDN (requires no API key, works globally)
  if (domain && !cdnError) {
    const cdnUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div
        className={`relative flex items-center justify-center bg-white border border-slate-200 overflow-hidden shadow-xs shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={cdnUrl}
          alt={`${name} icon`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setCdnError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 3. Fallback: stylized initial badge
  return (
    <div
      className={`relative flex items-center justify-center bg-blue-50 text-blue-700 font-bold border border-blue-200 shrink-0 select-none ${sizeClasses} ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
}
