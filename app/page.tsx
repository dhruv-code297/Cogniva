import React from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { AgentShowcaseSection } from "@/components/landing/AgentShowcaseSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { ControlSection } from "@/components/landing/ControlSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="min-h-screen cogniva-grid-bg text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 flex flex-col antialiased">
      {/* Navigation Header with Open dashboard pill button (no sign in button) */}
      <LandingNav />

      {/* Main Hero Section matching user reference screenshot with live agent command widget */}
      <HeroSection />

      {/* Feature Cards Trio matching user reference screenshot */}
      <FeatureCards />

      {/* Real Pre-Built Agent Templates Showcase */}
      <AgentShowcaseSection />

      {/* Native Integrations Ecosystem */}
      <IntegrationsSection />

      {/* Operational Safety, Guardrails & Human-in-the-Loop */}
      <ControlSection />

      {/* Transparent Predictable Pricing */}
      <PricingSection />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Bottom CTA Banner matching user reference screenshot */}
      <CtaBanner />

      {/* Landing Footer */}
      <LandingFooter />
    </main>
  );
}
