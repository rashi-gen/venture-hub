"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Save, CheckCircle, Loader2, AlertCircle,
  ChevronLeft, ChevronRight, X, Globe,
} from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import Select from "react-select";
import countryData from "country-telephone-data";

// ─────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────

const stageMapping = {
  "Ideation": "IDEA",
  "MVP": "PRE_SEED",
  "Seed / Early": "SEED",
} as const;

type StageKey = keyof typeof stageMapping;
const stages = Object.keys(stageMapping) as StageKey[];

const industryOptions = [
  { value: "climatetech", label: "Climatetech" },
  { value: "biotech",     label: "Biotechnology" },
  { value: "agtech",      label: "Agtech" },
  { value: "deeptech",    label: "Deeptech" },
  { value: "fintech",     label: "Fintech" },
  { value: "healthtech",  label: "Healthtech" },
  { value: "edtech",      label: "Edtech" },
  { value: "cleantech",   label: "Cleantech" },
  { value: "saas",        label: "SaaS" },
  { value: "ecommerce",   label: "E-commerce" },
  { value: "ai-ml",       label: "AI/ML" },
  { value: "robotics",    label: "Robotics" },
];

const steps = [
  { num: "01", title: "Founder Identity",  sub: "Personal Background", icon: "👤" },
  { num: "02", title: "Core Concept",      sub: "Business & Industry",  icon: "💡" },
  { num: "03", title: "Impact Resonance",  sub: "Social & Ecology",     icon: "🌍" },
  { num: "04", title: "Capital Needs",     sub: "Terms & Deployment",   icon: "💰" },
  { num: "05", title: "The Collective",    sub: "Team & Outreach",      icon: "🤝" },
];

// ── Country / phone data built from country-telephone-data ──────────────────

interface CountryOption {
  value: string;       // ISO2 code e.g. "IN"
  label: string;       // "India (+91)"
  dialCode: string;    // "91"
  name: string;        // "India"
  flag: string;        // emoji flag
}

interface CountryNameOption {
  value: string;       // ISO2
  label: string;       // country name
  dialCode: string;
}

type CountryDataItem = {
  name: string;
  iso2: string;
  dialCode: string;
  priority?: number;
  areaCodes?: string[];
};

function isoToFlag(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (c) =>
      String.fromCodePoint(127397 + c.charCodeAt(0))
    );
}

// Build sorted option lists once
const raw = countryData as any;

const countries: CountryDataItem[] = Array.isArray(raw)
  ? raw
  : raw?.default ?? raw?.allCountries ?? [];

const allCountryOptions: CountryOption[] = countries
  .filter((c) => c.iso2 && c.dialCode && c.name)
  .map((c) => ({
    value: c.iso2.toUpperCase(),
    label: `${isoToFlag(c.iso2)} ${c.name} (+${c.dialCode})`,
    dialCode: c.dialCode,
    name: c.name,
    flag: isoToFlag(c.iso2),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const allCountryNameOptions: CountryNameOption[] = allCountryOptions.map((c) => ({
  value:    c.value,
  label:    `${c.flag} ${c.name}`,
  dialCode: c.dialCode,
}));

// ── Currency map: ISO2 → { code, symbol } ──────────────────────────────────

const currencyMap: Record<string, { code: string; symbol: string }> = {
  IN: { code: "INR", symbol: "₹" },  US: { code: "USD", symbol: "$" },
  GB: { code: "GBP", symbol: "£" },  EU: { code: "EUR", symbol: "€" },
  DE: { code: "EUR", symbol: "€" },  FR: { code: "EUR", symbol: "€" },
  IT: { code: "EUR", symbol: "€" },  ES: { code: "EUR", symbol: "€" },
  NL: { code: "EUR", symbol: "€" },  PT: { code: "EUR", symbol: "€" },
  BE: { code: "EUR", symbol: "€" },  AT: { code: "EUR", symbol: "€" },
  CH: { code: "CHF", symbol: "Fr" }, SE: { code: "SEK", symbol: "kr" },
  NO: { code: "NOK", symbol: "kr" }, DK: { code: "DKK", symbol: "kr" },
  AU: { code: "AUD", symbol: "A$" }, CA: { code: "CAD", symbol: "C$" },
  NZ: { code: "NZD", symbol: "NZ$"},SG: { code: "SGD", symbol: "S$" },
  HK: { code: "HKD", symbol: "HK$"},JP: { code: "JPY", symbol: "¥" },
  CN: { code: "CNY", symbol: "¥" },  KR: { code: "KRW", symbol: "₩" },
  BR: { code: "BRL", symbol: "R$" }, MX: { code: "MXN", symbol: "MX$"},
  AR: { code: "ARS", symbol: "$" },  ZA: { code: "ZAR", symbol: "R" },
  NG: { code: "NGN", symbol: "₦" },  KE: { code: "KES", symbol: "KSh"},
  AE: { code: "AED", symbol: "د.إ" },SA: { code: "SAR", symbol: "﷼" },
  ID: { code: "IDR", symbol: "Rp" }, MY: { code: "MYR", symbol: "RM" },
  TH: { code: "THB", symbol: "฿" },  PH: { code: "PHP", symbol: "₱" },
  PK: { code: "PKR", symbol: "₨" },  BD: { code: "BDT", symbol: "৳" },
  EG: { code: "EGP", symbol: "£" },  IL: { code: "ILS", symbol: "₪" },
  TR: { code: "TRY", symbol: "₺" },  RU: { code: "RUB", symbol: "₽" },
  PL: { code: "PLN", symbol: "zł" }, CZ: { code: "CZK", symbol: "Kč" },
  HU: { code: "HUF", symbol: "Ft" }, RO: { code: "RON", symbol: "lei"},
  UA: { code: "UAH", symbol: "₴" },  VN: { code: "VND", symbol: "₫" },
};

const currencyOptions = Array.from(
  new Map(Object.values(currencyMap).map((c) => [c.code, c])).values()
)
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((c) => ({ value: c.code, label: `${c.symbol} ${c.code}` }));

function getCurrency(iso2: string) {
  return currencyMap[iso2] ?? { code: "USD", symbol: "$" };
}

// ── URL validation ──────────────────────────────────────────────────────────

const URL_RE = /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/;

function validateUrl(url: string): string | undefined {
  if (!url) return undefined;
  if (!URL_RE.test(url.trim())) return "Must be a valid URL starting with https:// or http://";
  return undefined;
}

// ── react-select shared styles (matches input-field: bottom-border only) ───

function buildSelectStyles(hasError = false) {
  return {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "transparent",
      border: "none",
      borderBottom: hasError
        ? "1px solid #ef4444"
        : state.isFocused
          ? "1px solid #1A362B"
          : "1px solid rgba(26,54,43,0.2)",
      borderRadius: 0,
      boxShadow: "none",
      padding: "0.25rem 0",
      cursor: "pointer",
      "&:hover": {
        borderBottom: "1px solid rgba(26,54,43,0.5)",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 8,
      boxShadow: "0 8px 30px rgba(26,54,43,0.12)",
      border: "1px solid rgba(26,54,43,0.08)",
      zIndex: 100,
    }),
    menuList: (base: any) => ({ ...base, padding: "4px" }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#1A362B"
        : state.isFocused
          ? "rgba(26,54,43,0.06)"
          : "transparent",
      color: state.isSelected ? "#F9F7F2" : "#1A362B",
      borderRadius: 4,
      fontSize: "0.875rem",
      padding: "8px 12px",
      cursor: "pointer",
    }),
    singleValue: (base: any) => ({ ...base, color: "#1A362B", fontSize: "0.875rem" }),
    placeholder: (base: any) => ({ ...base, color: "rgba(26,54,43,0.35)", fontSize: "0.875rem" }),
    input: (base: any) => ({ ...base, color: "#1A362B", fontSize: "0.875rem" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base: any) => ({ ...base, color: "rgba(26,54,43,0.4)", padding: "0 4px" }),
    clearIndicator: (base: any) => ({ ...base, color: "rgba(26,54,43,0.4)", padding: "0 4px" }),
    valueContainer: (base: any) => ({ ...base, padding: "0" }),
  };
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-1.5 mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-[1px]" />
      <p className="text-red-500 text-xs leading-tight">{message}</p>
    </div>
  );
}

function FieldHint({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-amber-600 text-xs mt-1.5 leading-tight">{message}</p>;
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

interface FormData {
  founderName:         string;
  email:               string;
  countryCode:         CountryOption | null;
  mobile:              string;
  companyName:         string;
  sector:              string;
  stage:               StageKey;
  countryIso:          string;       // ISO2, drives currency + country name
  countryName:         string;       // display string sent to API
  websiteUrl:          string;
  impactDescription:   string;
  impactMetrics:       string;
  capitalAmount:       string;
  currencyCode:        string;
  currencySymbol:      string;
  fundingPeriod:       string;
  useOfFunds:          string;
  pitchDeckUrl:        string;
}

const DRAFT_KEY = "venturehub-application-draft";

const defaultForm: FormData = {
  founderName:       "",
  email:             "",
  countryCode:       null,
  mobile:            "",
  companyName:       "",
  sector:            "",
  stage:             "Seed / Early",
  countryIso:        "",
  countryName:       "",
  websiteUrl:        "",
  impactDescription: "",
  impactMetrics:     "",
  capitalAmount:     "",
  currencyCode:      "USD",
  currencySymbol:    "$",
  fundingPeriod:     "",
  useOfFunds:        "",
  pitchDeckUrl:      "",
};

export default function ApplyPage() {
  const [currentStep, setCurrentStep]   = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [touched, setTouched]           = useState<Record<string, boolean>>({});
  const [isClient, setIsClient]         = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [shakeNext, setShakeNext]       = useState(false);
  const [formData, setFormData]         = useState<FormData>(defaultForm);

  // URL debounce refs
  const websiteTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pitchTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  // Restore draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showMobileMenu]);

  // ── Persist helpers ──────────────────────────────────────────────────────

  const saveDraft = useCallback((data: FormData) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {}
  }, []);

  // ── Field setters ────────────────────────────────────────────────────────

  const setField = (key: keyof FormData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
    // Clear error on change
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
    setSubmitError(null);
  };

  const markTouched = (key: string) => {
    setTouched((t) => ({ ...t, [key]: true }));
  };

  // ── Input handlers ───────────────────────────────────────────────────────

  // Name: allow only letters and spaces
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw   = e.target.value;
    const clean = raw.replace(/[^a-zA-Z\s]/g, "");
    setField("founderName", clean);
    if (touched.founderName) validateField("founderName", clean);
  };

  // Mobile: digits only
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setField("mobile", digits);
    if (touched.mobile) validateField("mobile", digits);
  };

  // Generic text / textarea / select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setField(id as keyof FormData, value);
    if (touched[id]) validateField(id, value);
  };

  // Country code select
  const handleCountryCodeChange = (opt: CountryOption | null) => {
    setField("countryCode", opt);
    markTouched("countryCode");
    if (opt) {
      // Auto-fill country
      setField("countryIso",  opt.value);
      setField("countryName", opt.name);
      // Auto-set currency
      const cur = getCurrency(opt.value);
      setField("currencyCode",   cur.code);
      setField("currencySymbol", cur.symbol);
    }
  };

  // Country name select (Step 2, when no code chosen)
  const handleCountryNameChange = (opt: CountryNameOption | null) => {
    if (!opt) {
      setField("countryIso",  "");
      setField("countryName", "");
      return;
    }
    setField("countryIso",  opt.value);
    setField("countryName", opt.label.replace(/^\S+\s/, "")); // strip flag emoji
    const cur = getCurrency(opt.value);
    setField("currencyCode",   cur.code);
    setField("currencySymbol", cur.symbol);
  };

  // Website URL — debounced validation
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setField("websiteUrl", value);
    if (websiteTimer.current) clearTimeout(websiteTimer.current);
    websiteTimer.current = setTimeout(() => {
      const err = validateUrl(value);
      setErrors((prev) => {
        if (err) return { ...prev, websiteUrl: err };
        const n = { ...prev }; delete n.websiteUrl; return n;
      });
    }, 400);
  };

  // Pitch deck URL — debounced
  const handlePitchUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setField("pitchDeckUrl", value);
    if (pitchTimer.current) clearTimeout(pitchTimer.current);
    pitchTimer.current = setTimeout(() => {
      const err = validateUrl(value);
      setErrors((prev) => {
        if (err) return { ...prev, pitchDeckUrl: err };
        const n = { ...prev }; delete n.pitchDeckUrl; return n;
      });
    }, 400);
  };

  // ── Per-field validation ─────────────────────────────────────────────────

  const validateField = (id: string, value: any): string | undefined => {
    let err: string | undefined;
    switch (id) {
      case "founderName":
        if (!String(value).trim()) err = "Full name is required";
        else if (!/^[a-zA-Z\s]+$/.test(String(value).trim())) err = "Name may only contain letters and spaces";
        break;
      case "email":
        if (!String(value).trim()) err = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) err = "Enter a valid email like name@company.com";
        break;
      case "mobile":
        if (value && String(value).length < 7)  err = "Phone number is too short (min 7 digits)";
        if (value && String(value).length > 15)  err = "Phone number is too long (max 15 digits)";
        break;
      case "companyName":
        if (!String(value).trim()) err = "Company name is required";
        break;
      case "sector":
        if (!value) err = "Please select an industry";
        break;
      case "websiteUrl":
        err = validateUrl(String(value));
        break;
      case "pitchDeckUrl":
        err = validateUrl(String(value));
        break;
    }
    if (err) {
      setErrors((prev) => ({ ...prev, [id]: err! }));
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
    return err;
  };

  // ── Step-level validation ────────────────────────────────────────────────

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    if (step === 0) {
      const fields = ["founderName", "email"] as const;
      for (const f of fields) {
        newTouched[f] = true;
        const err = validateField(f, formData[f]);
        if (err) newErrors[f] = err;
      }
      // Mobile optional but if filled must be valid
      if (formData.mobile) {
        const err = validateField("mobile", formData.mobile);
        if (err) newErrors.mobile = err;
      }
    }

    if (step === 1) {
      const fields = ["companyName", "sector"] as const;
      for (const f of fields) {
        newTouched[f] = true;
        const err = validateField(f, formData[f]);
        if (err) newErrors[f] = err;
      }
      if (formData.websiteUrl) {
        const err = validateUrl(formData.websiteUrl);
        if (err) newErrors.websiteUrl = err;
      }
    }

    if (step === 4) {
      if (formData.pitchDeckUrl) {
        const err = validateUrl(formData.pitchDeckUrl);
        if (err) newErrors.pitchDeckUrl = err;
      }
    }

    setTouched((t) => ({ ...t, ...newTouched }));
    setErrors((e) => ({ ...e, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // ── Navigation ───────────────────────────────────────────────────────────

  const triggerShake = () => {
    setShakeNext(true);
    setTimeout(() => setShakeNext(false), 600);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      saveDraft(formData);           // ← auto-save on Next
      setCurrentStep((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      triggerShake();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      saveDraft(formData);
      setCurrentStep((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (i: number) => {
    if (i <= currentStep) {
      saveDraft(formData);
      setCurrentStep(i);
      setShowMobileMenu(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (validateStep(currentStep)) {
      saveDraft(formData);
      setCurrentStep(i);
      setShowMobileMenu(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      triggerShake();
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const s0 = validateStep(0);
    const s1 = validateStep(1);
    const s4 = validateStep(4);
    if (!s0 || !s1 || !s4) {
      setSubmitError("Some required fields are missing. Please review each step.");
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      localStorage.setItem("application-email", formData.email);

      const capitalStr = formData.capitalAmount
        ? `${formData.currencySymbol}${formData.capitalAmount} ${formData.currencyCode}`
        : "—";

      const fullDescription = [
        `Impact: ${formData.impactDescription || "—"}`,
        `Metrics: ${formData.impactMetrics || "—"}`,
        `Use of Funds: ${formData.useOfFunds || "—"}`,
        `Period: ${formData.fundingPeriod || "—"}`,
        `Capital: ${capitalStr}`,
      ].join("\n");

      const mobileStr = formData.countryCode && formData.mobile
        ? `+${formData.countryCode.dialCode}${formData.mobile}`
        : formData.mobile || undefined;

      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          founderName:  formData.founderName,
          email:        formData.email,
          mobile:       mobileStr,
          companyName:  formData.companyName,
          sector:       formData.sector,
          stage:        stageMapping[formData.stage],
          country:      formData.countryName || undefined,
          websiteUrl:   formData.websiteUrl || undefined,
          description:  fullDescription,
          pitchDeckUrl: formData.pitchDeckUrl || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409)
          throw new Error("An application with this email already exists. Check your inbox.");
        if (response.status === 400 && data.details)
          throw new Error(data.details.map((d: any) => d.message).join(". "));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      localStorage.removeItem(DRAFT_KEY);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProgress = () => {
    saveDraft(formData);
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-20 left-1/2 -translate-x-1/2 bg-forest text-white px-5 py-3 rounded-full shadow-xl z-[200] text-sm font-medium pointer-events-none";
    toast.textContent = "Progress saved ✓";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const progressValue = Math.round(((currentStep + 1) / steps.length) * 100);

  // ── Derived values ───────────────────────────────────────────────────────

  const countryCodeValue = formData.countryCode ?? null;

  const countryNameValue = formData.countryIso
    ? allCountryNameOptions.find((o) => o.value === formData.countryIso) ?? null
    : null;

  const impactLength   = formData.impactDescription.length;
  const IMPACT_MIN     = 50;
  const IMPACT_MAX     = 1000;
  const impactTooShort = impactLength > 0 && impactLength < IMPACT_MIN;
  const impactNearMax  = impactLength > IMPACT_MAX * 0.85;

  const selectedCurrency = currencyOptions.find((o) => o.value === formData.currencyCode)
    ?? { value: "USD", label: "$ USD" };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation activeItem="startups" />
        <main className="flex-1 pt-16 sm:pt-20 flex items-center justify-center">
          <div className="animate-pulse text-forest/40 text-sm">Loading…</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-beige/30">
      <Navigation activeItem="startups" />

      {/* ── Sticky mobile progress bar ── */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-forest/10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex gap-1.5 flex-shrink-0">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-5 bg-forest"
                  : i < currentStep  ? "w-1.5 bg-forest/50"
                  : "w-1.5 bg-forest/15"
                }`}
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/40 leading-none">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="text-sm font-serif text-forest leading-tight truncate">
              {steps[currentStep].title}
            </p>
          </div>
          <button
            onClick={() => setShowMobileMenu(true)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-sm"
          >
            {steps[currentStep].icon}
          </button>
        </div>
        <div className="h-0.5 bg-forest/8">
          <div className="h-full bg-forest transition-all duration-500 ease-out" style={{ width: `${progressValue}%` }} />
        </div>
      </div>

      <main className="flex-1 pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-6 lg:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-20">

            {/* ── Desktop sidebar ── */}
            <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <span className="text-forest/40 font-bold uppercase tracking-[0.4em] text-[10px] block mb-4">
                Apply for Capital
              </span>
              <h1 className="font-serif text-5xl lg:text-6xl text-forest mb-8 leading-tight">
                Plant your <span className="italic">vision.</span>
              </h1>
              <p className="text-forest/70 text-lg leading-relaxed mb-12 max-w-sm">
                We partner with founders who see beyond the horizon. Tell us about the legacy you intend to build.
              </p>
              <nav className="space-y-7 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-forest/10" />
                {steps.map(({ num, title, sub }, i) => (
                  <div
                    key={num}
                    onClick={() => handleStepClick(i)}
                    className={`relative pl-8 flex items-center group cursor-pointer transition-all ${i === currentStep ? "scale-105" : ""}`}
                  >
                    <div className={`absolute left-0 w-3.5 h-3.5 rounded-full transition-all ${
                      i === currentStep ? "bg-forest ring-4 ring-forest/20 scale-110"
                      : i < currentStep  ? "bg-forest/60"
                      : "bg-forest/20 group-hover:bg-forest/40"
                    }`} />
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                        i === currentStep ? "text-forest"
                        : i < currentStep  ? "text-forest/60"
                        : "text-forest/40 group-hover:text-forest/60"
                      }`}>{num}. {title}</p>
                      <p className={`text-[10px] uppercase tracking-wider ${
                        i === currentStep ? "text-forest/40"
                        : i < currentStep  ? "text-forest/30"
                        : "text-forest/20"
                      }`}>{sub}</p>
                    </div>
                  </div>
                ))}
              </nav>
            </aside>

            {/* ── Mobile title ── */}
            <div className="lg:hidden col-span-1 mb-5 px-1">
              <h1 className="font-serif text-3xl text-forest leading-tight">
                Plant your <span className="italic">vision.</span>
              </h1>
              <p className="text-forest/60 text-sm mt-1.5 leading-relaxed">
                We partner with founders who see beyond the horizon.
              </p>
            </div>

            {/* ── Form panel ── */}
            <div className="lg:col-span-8">
              <div className="bg-white/60 backdrop-blur-sm border border-forest/5 shadow-lg rounded-2xl lg:rounded-none overflow-hidden">

                {submitError && (
                  <div className="mx-4 sm:mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 text-sm font-medium">Submission failed</p>
                      <p className="text-red-600 text-xs mt-0.5">{submitError}</p>
                    </div>
                  </div>
                )}

                <form className="p-4 sm:p-8 lg:p-12 space-y-8 lg:space-y-12" onSubmit={(e) => e.preventDefault()}>

                  {/* ── Step 1: Founder Identity ── */}
                  {currentStep === 0 && (
                    <section className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Founder Identity</h2>
                        <p className="text-sm text-forest/50 mt-1">The heartbeat of every great venture is its architect.</p>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="label-style" htmlFor="founderName">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="founderName"
                          autoComplete="name"
                          className={`input-field ${errors.founderName ? "border-b-red-300" : ""}`}
                          placeholder="Elara Vance"
                          value={formData.founderName}
                          onChange={handleNameChange}
                          onBlur={() => { markTouched("founderName"); validateField("founderName", formData.founderName); }}
                        />
                        <FieldError message={errors.founderName} />
                        {!errors.founderName && touched.founderName && formData.founderName && (
                          <p className="text-[11px] text-forest/30 mt-1">Only letters and spaces allowed</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="label-style" htmlFor="email">
                          Professional Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          autoComplete="email"
                          className={`input-field ${errors.email ? "border-b-red-300" : ""}`}
                          placeholder="elara@aeris.bio"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => { markTouched("email"); validateField("email", formData.email); }}
                        />
                        <FieldError message={errors.email} />
                      </div>

                      {/* Mobile: country code + number */}
                      <div>
                        <label className="label-style">
                          Mobile <span className="text-forest/30 font-normal">(optional)</span>
                        </label>
                        <div className="flex gap-3 items-end">
                          {/* Country code picker */}
                          <div className="w-52 flex-shrink-0">
                            <Select<CountryOption>
                              instanceId="country-code"
                              options={allCountryOptions}
                              value={countryCodeValue}
                              onChange={handleCountryCodeChange}
                              placeholder="Code"
                              isClearable
                              isSearchable
                              styles={buildSelectStyles()}
                              formatOptionLabel={(opt) => (
                                <span className="flex items-center gap-2 text-sm">
                                  <span>{opt.flag}</span>
                                  <span className="truncate">{opt.name}</span>
                                  <span className="text-forest/40 flex-shrink-0">+{opt.dialCode}</span>
                                </span>
                              )}
                            />
                          </div>
                          {/* Number input */}
                          <div className="flex-1">
                            <input
                              type="tel"
                              id="mobile"
                              inputMode="numeric"
                              className={`input-field ${errors.mobile ? "border-b-red-300" : ""}`}
                              placeholder={formData.countryCode ? "Phone number" : "Select country code first"}
                              value={formData.mobile}
                              onChange={handleMobileChange}
                              onBlur={() => { markTouched("mobile"); validateField("mobile", formData.mobile); }}
                            />
                          </div>
                        </div>
                        <FieldError message={errors.mobile} />
                        {formData.countryCode && formData.mobile && !errors.mobile && (
                          <p className="text-[11px] text-forest/40 mt-1">
                            Full number: +{formData.countryCode.dialCode}{formData.mobile}
                          </p>
                        )}
                      </div>
                    </section>
                  )}

                  {/* ── Step 2: Core Concept ── */}
                  {currentStep === 1 && (
                    <section className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Core Concept</h2>
                        <p className="text-sm text-forest/50 mt-1">Defining the solution and the ecosystem it inhabits.</p>
                      </div>

                      {/* Company name */}
                      <div>
                        <label className="label-style" htmlFor="companyName">
                          Company Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          className={`input-field ${errors.companyName ? "border-b-red-300" : ""}`}
                          placeholder="Aeris Bio"
                          value={formData.companyName}
                          onChange={handleChange}
                          onBlur={() => { markTouched("companyName"); validateField("companyName", formData.companyName); }}
                        />
                        <FieldError message={errors.companyName} />
                      </div>

                      {/* Industry */}
                      <div>
                        <label className="label-style" htmlFor="sector">
                          Primary Industry <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="sector"
                          className={`input-field appearance-none cursor-pointer ${errors.sector ? "border-b-red-300" : ""}`}
                          value={formData.sector}
                          onChange={handleChange}
                          onBlur={() => { markTouched("sector"); validateField("sector", formData.sector); }}
                        >
                          <option value="">Select Industry</option>
                          {industryOptions.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <FieldError message={errors.sector} />
                      </div>

                      {/* Stage */}
                      <div>
                        <label className="label-style">Current Stage</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {stages.map((stage) => (
                            <label
                              key={stage}
                              className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer transition-all ${
                                formData.stage === stage
                                  ? "bg-forest text-white border-forest shadow-sm"
                                  : "bg-beige/50 border-forest/10 hover:bg-beige"
                              }`}
                            >
                              <input
                                type="radio"
                                name="stage"
                                value={stage}
                                checked={formData.stage === stage}
                                onChange={() => setField("stage", stage)}
                                className="sr-only"
                              />
                              <span className={`text-xs font-bold uppercase tracking-widest ${
                                formData.stage === stage ? "text-white" : "text-forest/70"
                              }`}>
                                {stage}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Country + Website */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Country */}
                        <div>
                          <label className="label-style">
                            Country <span className="text-forest/30 font-normal">(optional)</span>
                          </label>
                          {formData.countryCode ? (
                            /* Auto-filled from phone country code */
                            <div className="flex items-center justify-between py-3 border-b border-forest/20">
                              <span className="text-sm text-forest flex items-center gap-2">
                                <span>{formData.countryCode.flag}</span>
                                <span>{formData.countryName}</span>
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-forest/30">
                                Auto-filled
                              </span>
                            </div>
                          ) : (
                            /* Searchable dropdown when no code chosen */
                            <Select<CountryNameOption>
                              instanceId="country-name"
                              options={allCountryNameOptions}
                              value={countryNameValue}
                              onChange={handleCountryNameChange}
                              placeholder="Search country…"
                              isClearable
                              isSearchable
                              styles={buildSelectStyles()}
                            />
                          )}
                        </div>

                        {/* Website */}
                        <div>
                          <label className="label-style" htmlFor="websiteUrl">
                            Website <span className="text-forest/30 font-normal">(optional)</span>
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-forest/30 pointer-events-none" />
                            <input
                              type="url"
                              id="websiteUrl"
                              className={`input-field pl-5 ${errors.websiteUrl ? "border-b-red-300" : ""}`}
                              placeholder="https://aeris.bio"
                              value={formData.websiteUrl}
                              onChange={handleWebsiteChange}
                              onBlur={() => {
                                markTouched("websiteUrl");
                                const err = validateUrl(formData.websiteUrl);
                                if (err) setErrors((e) => ({ ...e, websiteUrl: err }));
                              }}
                            />
                          </div>
                          <FieldError message={errors.websiteUrl} />
                          {!errors.websiteUrl && formData.websiteUrl && (
                            <p className="text-[11px] text-forest/30 mt-1">Must start with https://</p>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* ── Step 3: Impact Resonance ── */}
                  {currentStep === 2 && (
                    <section className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Impact Resonance</h2>
                        <p className="text-sm text-forest/50 mt-1">How does your growth enrich the world?</p>
                      </div>

                      {/* Impact description — improved UI */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="label-style mb-0" htmlFor="impactDescription">
                            Environmental or Social Impact
                          </label>
                          <span className={`text-[11px] font-medium tabular-nums ${
                            impactNearMax ? "text-red-500"
                            : impactTooShort ? "text-amber-600"
                            : impactLength > 0 ? "text-forest/40"
                            : "text-forest/20"
                          }`}>
                            {impactLength} / {IMPACT_MAX}
                          </span>
                        </div>

                        {/* Box-styled textarea */}
                        <div className={`relative rounded-lg border transition-all duration-200 ${
                          impactNearMax
                            ? "border-red-300 bg-red-50/20"
                            : impactTooShort
                              ? "border-amber-300 bg-amber-50/20"
                              : "border-forest/15 bg-white/40 focus-within:border-forest/40 focus-within:bg-white/60"
                        }`}>
                          <textarea
                            id="impactDescription"
                            rows={5}
                            maxLength={IMPACT_MAX}
                            className="w-full bg-transparent px-4 py-3 text-sm text-forest placeholder:text-forest/30 resize-none focus:outline-none leading-relaxed"
                            placeholder="Describe the intended positive ripple effects of your technology — environmental, social, or economic impact you're creating…"
                            value={formData.impactDescription}
                            onChange={(e) => {
                              setField("impactDescription", e.target.value);
                            }}
                          />
                          {/* Bottom progress bar inside box */}
                          <div className="h-0.5 mx-4 mb-3 bg-forest/8 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                impactNearMax ? "bg-red-400"
                                : impactTooShort && impactLength > 0 ? "bg-amber-400"
                                : "bg-forest/40"
                              }`}
                              style={{ width: `${Math.min((impactLength / IMPACT_MAX) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        <FieldHint message={impactTooShort ? `Please write at least ${IMPACT_MIN} characters to describe your impact (${IMPACT_MIN - impactLength} more needed)` : undefined} />
                        {impactNearMax && (
                          <p className="text-red-500 text-xs mt-1.5">Approaching the {IMPACT_MAX} character limit</p>
                        )}
                      </div>

                      {/* Impact metrics */}
                      <div>
                        <label className="label-style" htmlFor="impactMetrics">
                          Target Metrics <span className="text-forest/30 font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          id="impactMetrics"
                          className="input-field"
                          placeholder="e.g. 50k tons of carbon sequestered annually by 2026"
                          value={formData.impactMetrics}
                          onChange={handleChange}
                        />
                      </div>
                    </section>
                  )}

                  {/* ── Step 4: Capital Needs ── */}
                  {currentStep === 3 && (
                    <section className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Capital Deployment</h2>
                        <p className="text-sm text-forest/50 mt-1">The tactical fuel for your strategic vision.</p>
                      </div>

                      {/* Capital amount + currency */}
                      <div>
                        <label className="label-style">
                          Capital Requested{" "}
                          <span className="text-forest/30 font-normal">(optional)</span>
                        </label>
                        <div className="flex gap-3 items-end">
                          {/* Currency selector */}
                          <div className="w-36 flex-shrink-0">
                            <Select
                              instanceId="currency"
                              options={currencyOptions}
                              value={selectedCurrency}
                              onChange={(opt) => {
                                if (!opt) return;
                                setField("currencyCode",   opt.value);
                                setField("currencySymbol", opt.label.split(" ")[0]);
                              }}
                              isSearchable
                              styles={buildSelectStyles()}
                            />
                          </div>
                          {/* Amount input */}
                          <div className="flex-1 relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-forest/40 text-sm pointer-events-none select-none">
                              {formData.currencySymbol}
                            </span>
                            <input
                              type="text"
                              id="capitalAmount"
                              inputMode="numeric"
                              className="input-field pl-5"
                              placeholder="500,000"
                              value={formData.capitalAmount}
                              onChange={(e) => {
                                // Allow digits, commas, dots
                                const val = e.target.value.replace(/[^0-9.,]/g, "");
                                setField("capitalAmount", val);
                              }}
                            />
                          </div>
                        </div>
                        {formData.countryIso && (
                          <p className="text-[11px] text-forest/30 mt-1.5">
                            Currency auto-set from your country — you can change it above
                          </p>
                        )}
                      </div>

                      {/* Funding period */}
                      <div>
                        <label className="label-style" htmlFor="fundingPeriod">Planned Use Period</label>
                        <input
                          type="text"
                          id="fundingPeriod"
                          className="input-field"
                          placeholder="18–24 Months"
                          value={formData.fundingPeriod}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Use of funds */}
                      <div>
                        <label className="label-style" htmlFor="useOfFunds">Use of Funds</label>
                        <textarea
                          id="useOfFunds"
                          rows={3}
                          className="input-field resize-none"
                          placeholder="R&D, expansion into NA market, core hiring…"
                          value={formData.useOfFunds}
                          onChange={handleChange}
                        />
                      </div>
                    </section>
                  )}

                  {/* ── Step 5: The Collective ── */}
                  {currentStep === 4 && (
                    <section className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">The Collective</h2>
                        <p className="text-sm text-forest/50 mt-1">Team and outreach materials.</p>
                      </div>

                      <div>
                        <label className="label-style" htmlFor="pitchDeckUrl">
                          Pitch Deck URL <span className="text-forest/30 font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-forest/30 pointer-events-none" />
                          <input
                            type="url"
                            id="pitchDeckUrl"
                            className={`input-field pl-5 ${errors.pitchDeckUrl ? "border-b-red-300" : ""}`}
                            placeholder="https://drive.google.com/your-pitch-deck"
                            value={formData.pitchDeckUrl}
                            onChange={handlePitchUrlChange}
                            onBlur={() => {
                              markTouched("pitchDeckUrl");
                              const err = validateUrl(formData.pitchDeckUrl);
                              if (err) setErrors((e) => ({ ...e, pitchDeckUrl: err }));
                            }}
                          />
                        </div>
                        <FieldError message={errors.pitchDeckUrl} />
                        <p className="text-xs text-forest/40 mt-2">
                          Upload to Google Drive, Dropbox, or Notion and paste the shareable link here. Must be a valid https:// URL.
                        </p>
                      </div>
                    </section>
                  )}

                  {/* ── Nav row ── */}
                  <div className="pt-6 border-t border-forest/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleSaveProgress}
                      className="text-xs font-bold uppercase tracking-widest text-forest/40 hover:text-forest transition-colors flex items-center gap-1.5 py-2 flex-shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Save</span>
                    </button>

                    <div className="flex gap-2">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="flex items-center gap-1.5 px-4 py-3 border border-forest/20 text-forest font-bold uppercase text-xs tracking-[0.15em] hover:bg-beige transition-colors rounded-lg"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Back
                        </button>
                      )}

                      {currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className={`flex items-center gap-1.5 px-6 py-3 bg-forest text-white font-bold uppercase text-xs tracking-[0.15em] hover:bg-forest/90 transition-colors rounded-lg shadow-sm shadow-forest/10 ${shakeNext ? "animate-shake" : ""}`}
                        >
                          Continue
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className={`flex items-center gap-2 px-6 py-3 bg-forest text-white font-bold uppercase text-xs tracking-[0.15em] hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-forest/10 ${shakeNext ? "animate-shake" : ""}`}
                        >
                          {isSubmitting
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
                            : "Submit Application"
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Mobile steps drawer ── */}
      {showMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-fade-in"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-forest/10 flex justify-between items-center">
              <h3 className="font-serif text-lg text-forest">All Steps</h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-forest" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent   = index === currentStep;
                const isAvailable = index <= currentStep;
                return (
                  <button
                    key={step.num}
                    onClick={() => isAvailable && handleStepClick(index)}
                    disabled={!isAvailable}
                    className={`w-full text-left p-4 rounded-xl mb-1.5 transition-all flex items-center gap-3 ${
                      isCurrent   ? "bg-forest text-white"
                      : isCompleted ? "bg-forest/5 text-forest hover:bg-forest/10"
                      : "opacity-30 cursor-not-allowed text-forest"
                    }`}
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{step.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? "text-white/60" : "text-forest/40"}`}>
                        {step.num} {isCompleted ? "✓" : ""}
                      </p>
                      <p className="font-bold text-sm leading-tight">{step.title}</p>
                      <p className={`text-xs mt-0.5 ${isCurrent ? "text-white/50" : "text-forest/40"}`}>{step.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* ── Success overlay ── */}
      {showSuccess && (
        <div className="fixed inset-0 bg-forest/95 z-[100] flex items-center justify-center text-center px-6 animate-fade-in">
          <div className="max-w-md">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white mb-6 mx-auto animate-scale-in">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4 animate-slide-up">Application Planted.</h2>
            <p className="text-white/60 text-base leading-relaxed animate-slide-up animation-delay-150">
              Your vision is now in our ecosystem. Check your email for confirmation and next steps.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slide-up   { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes scale-in   { from { opacity: 0; transform: scale(0.85) } to { opacity: 1; transform: scale(1) } }
        @keyframes slide-left { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%  { transform: translateX(-5px); }
          30%  { transform: translateX(5px); }
          45%  { transform: translateX(-4px); }
          60%  { transform: translateX(4px); }
          75%  { transform: translateX(-2px); }
          90%  { transform: translateX(2px); }
        }
        .animate-fade-in     { animation: fade-in 0.25s ease-out; }
        .animate-slide-up    { animation: slide-up 0.3s ease-out; }
        .animate-scale-in    { animation: scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .animate-slide-left  { animation: slide-left 0.25s ease-out; }
        .animate-shake       { animation: shake 0.55s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .animation-delay-150 { animation-delay: 150ms; animation-fill-mode: both; }
        @media (max-width: 1023px) { .input-field { font-size: 16px !important; } }
        .border-b-red-300 { border-bottom-color: #fca5a5 !important; }
      `}</style>
    </div>
  );
}