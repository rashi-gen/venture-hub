"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle, Loader2, AlertCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";

const stageMapping = {
  "Ideation": "IDEA",
  "MVP": "PRE_SEED",
  "Seed / Early": "SEED",
} as const;

const industryOptions = [
  { value: "climatetech", label: "Climatetech" },
  { value: "biotech", label: "Biotechnology" },
  { value: "agtech", label: "Agtech" },
  { value: "deeptech", label: "Deeptech" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Healthtech" },
  { value: "edtech", label: "Edtech" },
  { value: "cleantech", label: "Cleantech" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "ai-ml", label: "AI/ML" },
  { value: "robotics", label: "Robotics" },
];

const stages = ["Ideation", "MVP", "Seed / Early"] as const;

const steps = [
  { num: "01", title: "Founder Identity",  sub: "Personal Background",  icon: "👤" },
  { num: "02", title: "Core Concept",       sub: "Business & Industry",  icon: "💡" },
  { num: "03", title: "Impact Resonance",   sub: "Social & Ecology",     icon: "🌍" },
  { num: "04", title: "Capital Needs",      sub: "Terms & Deployment",   icon: "💰" },
  { num: "05", title: "The Collective",     sub: "Team & Outreach",      icon: "🤝" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-1.5 mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-[1px]" />
      <p className="text-red-500 text-xs leading-tight">{message}</p>
    </div>
  );
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep]   = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient]         = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [formData, setFormData] = useState({
    founderName: "", email: "", mobile: "",
    companyName: "", sector: "",
    stage: "Seed / Early" as typeof stages[number],
    country: "", websiteUrl: "",
    impactDescription: "", impactMetrics: "",
    capitalRequested: "", fundingPeriod: "", useOfFunds: "",
    pitchDeckUrl: "",
  });

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("venturehub-application-draft");
      if (saved) setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showMobileMenu]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
    setSubmitError(null);
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.founderName.trim()) errors.founderName = "Please enter your full name";
      if (!formData.email.trim())       errors.email = "Please enter your email address";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = "That doesn't look valid — try name@company.com";
    }
    if (step === 1) {
      if (!formData.companyName.trim()) errors.companyName = "Please enter your company or project name";
      if (!formData.sector)             errors.sector = "Please select the industry that best fits";
      if (formData.websiteUrl && !/^https?:\/\/.+\..+/.test(formData.websiteUrl))
        errors.websiteUrl = "URL must start with https:// or http://";
    }
    if (step === 4) {
      if (formData.pitchDeckUrl && !/^https?:\/\/.+\..+/.test(formData.pitchDeckUrl))
        errors.pitchDeckUrl = "Pitch deck URL must start with https:// or http://";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(p => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(p => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (i: number) => {
    if (i <= currentStep || validateStep(currentStep)) {
      setCurrentStep(i);
      setShowMobileMenu(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(4)) {
      setSubmitError("Some required fields are missing. Please review each step.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      localStorage.setItem("application-email", formData.email);
      const fullDescription = `Impact: ${formData.impactDescription || "—"}\nMetrics: ${formData.impactMetrics || "—"}\nUse of Funds: ${formData.useOfFunds || "—"}\nPeriod: ${formData.fundingPeriod || "—"}\nCapital: ${formData.capitalRequested || "—"}`;
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          founderName: formData.founderName, email: formData.email,
          mobile: formData.mobile || undefined,
          companyName: formData.companyName, sector: formData.sector,
          stage: stageMapping[formData.stage as keyof typeof stageMapping],
          country: formData.country || undefined,
          websiteUrl: formData.websiteUrl || undefined,
          description: fullDescription,
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
      localStorage.removeItem("venturehub-application-draft");
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProgress = () => {
    localStorage.setItem("venturehub-application-draft", JSON.stringify(formData));
    const toast = document.createElement("div");
    toast.className = "fixed bottom-20 left-1/2 -translate-x-1/2 bg-forest text-white px-5 py-3 rounded-full shadow-xl z-[200] text-sm font-medium pointer-events-none";
    toast.textContent = "Progress saved ✓";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const progressValue = Math.round(((currentStep + 1) / steps.length) * 100);

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
      {/* Plain Navigation — no progress prop, bottom tab bar shows normally */}
      <Navigation activeItem="startups" />

      {/*
        ── Sticky Progress Bar (mobile only) ──────────────────────────────────
        Sits directly below the nav (top-16 = 64px = nav height on mobile).
        Self-contained: owns its own sticky positioning, totally independent
        of Navigation. No prop drilling, no z-index fighting.
      */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-forest/10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Step dots */}
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

          {/* Step label */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/40 leading-none">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="text-sm font-serif text-forest leading-tight truncate">
              {steps[currentStep].title}
            </p>
          </div>

          {/* Steps drawer trigger */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-sm"
          >
            {steps[currentStep].icon}
          </button>
        </div>

        {/* Progress fill bar */}
        <div className="h-0.5 bg-forest/8">
          <div
            className="h-full bg-forest transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      {/*
        pt-16 sm:pt-20  →  clears the top navbar
        pb-20           →  clears the bottom tab bar
        The sticky progress bar is in document flow so it naturally
        pushes content down — no extra padding needed for it.
      */}
      <main className="flex-1 pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-6 lg:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-20">

            {/* ── Desktop Sidebar ── */}
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
                    className={`relative pl-8 flex items-center group cursor-pointer transition-all ${i === currentStep ? "scale-105" : ""}`}
                    onClick={() => handleStepClick(i)}
                  >
                    <div className={`absolute left-0 w-3.5 h-3.5 rounded-full transition-all ${
                      i === currentStep ? "bg-forest ring-4 ring-forest/20 scale-110"
                      : i < currentStep ? "bg-forest/60"
                      : "bg-forest/20 group-hover:bg-forest/40"
                    }`} />
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                        i === currentStep ? "text-forest"
                        : i < currentStep ? "text-forest/60"
                        : "text-forest/40 group-hover:text-forest/60"
                      }`}>{num}. {title}</p>
                      <p className={`text-[10px] uppercase tracking-wider ${
                        i === currentStep ? "text-forest/40"
                        : i < currentStep ? "text-forest/30"
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

            {/* ── Form Panel ── */}
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

                <form className="p-4 sm:p-8 lg:p-12 space-y-8 lg:space-y-12" onSubmit={e => e.preventDefault()}>

                  {/* Step 1 */}
                  {currentStep === 0 && (
                    <section className="space-y-5 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Founder Identity</h2>
                        <p className="text-sm text-forest/50 mt-1">The heartbeat of every great venture is its architect.</p>
                      </div>
                      <div>
                        <label className="label-style" htmlFor="founderName">Full Name <span className="text-red-400">*</span></label>
                        <input type="text" id="founderName"
                          className={`input-field ${validationErrors.founderName ? "border-red-300 bg-red-50/30" : ""}`}
                          placeholder="Elara Vance" value={formData.founderName} onChange={handleInputChange} />
                        <FieldError message={validationErrors.founderName} />
                      </div>
                      <div>
                        <label className="label-style" htmlFor="email">Professional Email <span className="text-red-400">*</span></label>
                        <input type="email" id="email"
                          className={`input-field ${validationErrors.email ? "border-red-300 bg-red-50/30" : ""}`}
                          placeholder="elara@aeris.bio" value={formData.email} onChange={handleInputChange} />
                        <FieldError message={validationErrors.email} />
                      </div>
                      <div>
                        <label className="label-style" htmlFor="mobile">Mobile <span className="text-forest/30 font-normal">(optional)</span></label>
                        <input type="tel" id="mobile" className="input-field"
                          placeholder="+1 (555) 123-4567" value={formData.mobile} onChange={handleInputChange} />
                      </div>
                    </section>
                  )}

                  {/* Step 2 */}
                  {currentStep === 1 && (
                    <section className="space-y-5 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Core Concept</h2>
                        <p className="text-sm text-forest/50 mt-1">Defining the solution and the ecosystem it inhabits.</p>
                      </div>
                      <div>
                        <label className="label-style" htmlFor="companyName">Company Name <span className="text-red-400">*</span></label>
                        <input type="text" id="companyName"
                          className={`input-field ${validationErrors.companyName ? "border-red-300 bg-red-50/30" : ""}`}
                          placeholder="Aeris Bio" value={formData.companyName} onChange={handleInputChange} />
                        <FieldError message={validationErrors.companyName} />
                      </div>
                      <div>
                        <label className="label-style" htmlFor="sector">Primary Industry <span className="text-red-400">*</span></label>
                        <select id="sector"
                          className={`input-field appearance-none cursor-pointer ${validationErrors.sector ? "border-red-300 bg-red-50/30" : ""}`}
                          value={formData.sector} onChange={handleInputChange}>
                          <option value="">Select Industry</option>
                          {industryOptions.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <FieldError message={validationErrors.sector} />
                      </div>
                      <div>
                        <label className="label-style">Current Stage</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {stages.map(stage => (
                            <label key={stage}
                              className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer transition-all ${
                                formData.stage === stage
                                  ? "bg-forest text-white border-forest shadow-sm"
                                  : "bg-beige/50 border-forest/10 hover:bg-beige"
                              }`}>
                              <input type="radio" name="stage" value={stage}
                                checked={formData.stage === stage}
                                onChange={() => setFormData(p => ({ ...p, stage }))}
                                className="sr-only" />
                              <span className={`text-xs font-bold uppercase tracking-widest ${formData.stage === stage ? "text-white" : "text-forest/70"}`}>
                                {stage}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label-style" htmlFor="country">Country <span className="text-forest/30 font-normal">(optional)</span></label>
                          <input type="text" id="country" className="input-field"
                            placeholder="United States" value={formData.country} onChange={handleInputChange} />
                        </div>
                        <div>
                          <label className="label-style" htmlFor="websiteUrl">Website <span className="text-forest/30 font-normal">(optional)</span></label>
                          <input type="url" id="websiteUrl"
                            className={`input-field ${validationErrors.websiteUrl ? "border-red-300 bg-red-50/30" : ""}`}
                            placeholder="https://aeris.bio" value={formData.websiteUrl} onChange={handleInputChange} />
                          <FieldError message={validationErrors.websiteUrl} />
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 3 */}
                  {currentStep === 2 && (
                    <section className="space-y-5 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Impact Resonance</h2>
                        <p className="text-sm text-forest/50 mt-1">How does your growth enrich the world?</p>
                      </div>
                      <div>
                        <label className="label-style" htmlFor="impactDescription">Environmental or Social Impact</label>
                        <textarea id="impactDescription" rows={4} className="input-field resize-none"
                          placeholder="Describe the intended positive ripple effects of your technology..."
                          value={formData.impactDescription} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label className="label-style" htmlFor="impactMetrics">Target Metrics <span className="text-forest/30 font-normal">(optional)</span></label>
                        <input type="text" id="impactMetrics" className="input-field"
                          placeholder="e.g. 50k tons of carbon sequestered annually by 2026"
                          value={formData.impactMetrics} onChange={handleInputChange} />
                      </div>
                    </section>
                  )}

                  {/* Step 4 */}
                  {currentStep === 3 && (
                    <section className="space-y-5 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">Capital Deployment</h2>
                        <p className="text-sm text-forest/50 mt-1">The tactical fuel for your strategic vision.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label-style" htmlFor="capitalRequested">Capital Requested (USD)</label>
                          <input type="text" id="capitalRequested" className="input-field"
                            placeholder="$500,000" value={formData.capitalRequested} onChange={handleInputChange} />
                        </div>
                        <div>
                          <label className="label-style" htmlFor="fundingPeriod">Planned Use Period</label>
                          <input type="text" id="fundingPeriod" className="input-field"
                            placeholder="18–24 Months" value={formData.fundingPeriod} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div>
                        <label className="label-style" htmlFor="useOfFunds">Use of Funds</label>
                        <textarea id="useOfFunds" rows={3} className="input-field resize-none"
                          placeholder="R&D, expansion into NA market, core hiring..."
                          value={formData.useOfFunds} onChange={handleInputChange} />
                      </div>
                    </section>
                  )}

                  {/* Step 5 */}
                  {currentStep === 4 && (
                    <section className="space-y-5 animate-fade-in">
                      <div>
                        <h2 className="font-serif text-2xl lg:text-3xl text-forest">The Collective</h2>
                        <p className="text-sm text-forest/50 mt-1">Team and outreach materials.</p>
                      </div>
                      <div>
                        <label className="label-style" htmlFor="pitchDeckUrl">Pitch Deck URL <span className="text-forest/30 font-normal">(optional)</span></label>
                        <input type="url" id="pitchDeckUrl"
                          className={`input-field ${validationErrors.pitchDeckUrl ? "border-red-300 bg-red-50/30" : ""}`}
                          placeholder="https://drive.google.com/your-pitch-deck"
                          value={formData.pitchDeckUrl} onChange={handleInputChange} />
                        <FieldError message={validationErrors.pitchDeckUrl} />
                        <p className="text-xs text-forest/40 mt-2">
                          Upload to Google Drive, Dropbox, or Notion and paste the shareable link here.
                        </p>
                      </div>
                    </section>
                  )}

                  {/* ── Navigation row ── */}
                  <div className="pt-6 border-t border-forest/10 flex items-center justify-between gap-3">
                    <button type="button" onClick={handleSaveProgress}
                      className="text-xs font-bold uppercase tracking-widest text-forest/40 hover:text-forest transition-colors flex items-center gap-1.5 py-2 flex-shrink-0">
                      <Save className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <div className="flex gap-2">
                      {currentStep > 0 && (
                        <button type="button" onClick={handlePrevious}
                          className="flex items-center gap-1.5 px-4 py-3 border border-forest/20 text-forest font-bold uppercase text-xs tracking-[0.15em] hover:bg-beige transition-colors rounded-lg">
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Back
                        </button>
                      )}
                      {currentStep < steps.length - 1 ? (
                        <button type="button" onClick={handleNext}
                          className="flex items-center gap-1.5 px-6 py-3 bg-forest text-white font-bold uppercase text-xs tracking-[0.15em] hover:bg-forest/90 transition-colors rounded-lg shadow-sm shadow-forest/10">
                          Continue
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                          className="flex items-center gap-2 px-6 py-3 bg-forest text-white font-bold uppercase text-xs tracking-[0.15em] hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-forest/10">
                          {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</> : "Submit Application"}
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

      {/* ── Mobile Steps Drawer ── */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-fade-in"
          onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-left"
            onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-forest/10 flex justify-between items-center">
              <h3 className="font-serif text-lg text-forest">All Steps</h3>
              <button onClick={() => setShowMobileMenu(false)}
                className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center">
                <X className="w-4 h-4 text-forest" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent   = index === currentStep;
                const isAvailable = index <= currentStep;
                return (
                  <button key={step.num} onClick={() => isAvailable && handleStepClick(index)}
                    disabled={!isAvailable}
                    className={`w-full text-left p-4 rounded-xl mb-1.5 transition-all flex items-center gap-3 ${
                      isCurrent   ? "bg-forest text-white"
                      : isCompleted ? "bg-forest/5 text-forest hover:bg-forest/10"
                      : "opacity-30 cursor-not-allowed text-forest"
                    }`}>
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

      {/* Footer — hidden on mobile, bottom tab bar takes its place */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* ── Success Overlay ── */}
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
        @keyframes fade-in   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slide-up  { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes scale-in  { from { opacity: 0; transform: scale(0.85) } to { opacity: 1; transform: scale(1) } }
        @keyframes slide-left { from { transform: translateX(100%) } to { transform: translateX(0) } }
        .animate-fade-in    { animation: fade-in 0.25s ease-out; }
        .animate-slide-up   { animation: slide-up 0.3s ease-out; }
        .animate-scale-in   { animation: scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .animate-slide-left { animation: slide-left 0.25s ease-out; }
        .animation-delay-150 { animation-delay: 150ms; animation-fill-mode: both; }
        @media (max-width: 1023px) { .input-field { font-size: 16px !important; } }
      `}</style>
    </div>
  );
}