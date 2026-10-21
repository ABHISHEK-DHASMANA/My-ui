import React, { useEffect, useState } from "react";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const COMPANY_LOGO_DOMAINS: Record<string, string> = {
  oraclefinancialservicessoftwarelimited: "oracle.com",
  simplilearn: "simplilearn.com",
  wellsfargocompany: "wellsfargo.com",
  atlassiancorporation: "atlassian.com",
  deepmind: "deepmind.google",
  akamaitechnologiesindiapvtltd: "akamai.com",
  adobeinc: "adobe.com",
  genpactltd: "genpact.com",
  ubertechnologiesinc: "uber.com",
  zeptotechnologiesprivatelimited: "zeptonow.com",
  consiliollc: "consilio.com",
  btgroupplc: "bt.com",
  delltechnologiesinc: "dell.com",
  fidelityinvestments: "fidelity.com",
  jpmorganchaseco: "jpmorganchase.com",
  airbusse: "airbus.com",
};

const COMPANY_LOGO_OVERRIDES: Record<string, string> = {
  mitsubishiufjfinancialgroupinc:
    "https://www.mufg.jp/dam/cmn/cmn_logo_mufg_001.png",
  tataconsultancyserviceslimited:
    "https://upload.wikimedia.org/wikipedia/commons/9/9b/TATA_Consultancy_Services_Logo.svg",
};

const COMPANY_FAVICON_URLS: Record<string, string> = {
  thebankofnewyorkmelloncorporation: "https://www.bny.com/favicon.ico",
  nutanixinc: "https://www.nutanix.com/favicon.ico",
  hexagoncapabilitycenterindia: "https://hexagon.com/favicon.ico",
  delltechnologiesinc: "https://www.dell.com/favicon.ico",
  schneiderelectric: "https://www.se.com/favicon.ico",
};

export function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  className = "",
  size = "md",
}: CompanyLogoProps) {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const logoCandidates = [
    COMPANY_LOGO_OVERRIDES[normalizedName],
    ...(logoUrl || "").split(";"),
  ]
    .filter((url): url is string => Boolean(url))
    .map(url => url.trim())
    .flatMap(url => {
      try {
        const parsed = new URL(url);
        if (parsed.hostname === "images.search.yahoo.com") {
          const imageUrl = parsed.searchParams.get("imgurl");
          return imageUrl ? [imageUrl] : [];
        }
      } catch {
        return [];
      }
      return [url];
    })
    .filter(url => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    });
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [directFaviconError, setDirectFaviconError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setDirectFaviconError(false);
    setFaviconError(false);
  }, [logoUrl, name, websiteUrl]);

  const knownDomain = COMPANY_LOGO_DOMAINS[normalizedName];
  const knownFaviconUrl = COMPANY_FAVICON_URLS[normalizedName];

  // Extract a company domain from the website or a first-party logo URL.
  let domain = "";
  const domainSources = [websiteUrl, ...logoCandidates].filter(
    (source): source is string => Boolean(source)
  );
  const domainSource = knownDomain || domainSources.find(source => {
    try {
      const hostname = new URL(
        source.startsWith("http") ? source : `https://${source}`
      ).hostname.toLowerCase();
      const isThirdPartyLogoHost = [
        "upload.wikimedia.org",
        "commons.wikimedia.org",
        "1000logos.net",
        "pbs.twimg.com",
        "play-lh.googleusercontent.com",
        "in.images.search.yahoo.com",
        "imgproxy.divecdn.com",
        "pngkey.com",
        "logo.wine",
      ].some(host => hostname === host || hostname.endsWith(`.${host}`));
      return !isThirdPartyLogoHost;
    } catch {
      return false;
    }
  });

  if (domainSource) {
    try {
      domain = knownDomain || new URL(
        domainSource.startsWith("http") ? domainSource : `https://${domainSource}`
      ).hostname.replace(/^www\./, "");
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

  if (
    candidateIndex >= logoCandidates.length &&
    knownFaviconUrl &&
    !directFaviconError
  ) {
    return (
      <div
        className={`relative flex items-center justify-center bg-white border border-slate-200 overflow-hidden shadow-xs shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={knownFaviconUrl}
          alt={`${name} icon`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setDirectFaviconError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Try each semicolon-separated logo URL before falling back to a favicon.
  if (candidateIndex < logoCandidates.length) {
    return (
      <div
        className={`relative flex items-center justify-center bg-white border border-slate-200 overflow-hidden shadow-xs shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={logoCandidates[candidateIndex]}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setCandidateIndex(index => index + 1)}
          loading="lazy"
        />
      </div>
    );
  }

  // Google favicon fallback requires no API key.
  if (domain && !faviconError) {
    const cdnUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div
        className={`relative flex items-center justify-center bg-white border border-slate-200 overflow-hidden shadow-xs shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={cdnUrl}
          alt={`${name} icon`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setFaviconError(true)}
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
