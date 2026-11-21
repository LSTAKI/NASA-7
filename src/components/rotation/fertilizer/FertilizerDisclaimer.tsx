'use client';

import React from 'react';
import { ShieldCheck, Info, FlaskConical, Scale, BookOpen, AlertCircle } from 'lucide-react';

export const FertilizerDisclaimer: React.FC = () => {
  return (
    <div className="bg-[#F9F8F5] rounded-2xl border border-[#E0DCD3] p-5 md:p-6 text-xs text-[#5C645E] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#EAE6DF]">
        <ShieldCheck className="w-5 h-5 text-[#528C70]" />
        <div>
          <h4 className="text-sm font-bold text-[#1E2420]">
            Scientific Transparency & Agronomic Advisory Principles
          </h4>
          <p className="text-[11px] text-[#5C645E]">
            Guidelines on baseline recommendations, soil-test calibrations, and local agricultural verification
          </p>
        </div>
      </div>

      {/* Grid of 4 Key Disclaimers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Point 1: Baseline RDF & Regional Variance */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DF] space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#1E2420]">
            <BookOpen className="w-4 h-4 text-[#528C70]" />
            <span>Regional Baseline RDF Packages</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Baseline nutrient dosages in ARACHNOVA are drawn from official packages of practices published by the Indian Council of Agricultural Research (ICAR) and State Agricultural Universities (PAU, TNAU, UAS). They assume high-yielding varieties under assured irrigation and good agricultural management.
          </p>
        </div>

        {/* Point 2: SoilGrids vs Lab Tests */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DF] space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#1E2420]">
            <FlaskConical className="w-4 h-4 text-[#528C70]" />
            <span>SoilGrids Total N is Not Available N</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Satellite and digital soil maps like ISRIC SoilGrids 250m predict total elemental nitrogen (g/kg). Over 95% of total soil nitrogen is bound in organic matter and unavailable to crops in a single growing season. Only certified wet-chemistry laboratory tests (such as Alkaline KMnO₄ distillation) measure plant-available nitrogen.
          </p>
        </div>

        {/* Point 3: Generalized Adjustments Disabled */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DF] space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#1E2420]">
            <Scale className="w-4 h-4 text-[#528C70]" />
            <span>Default Retention of Baseline Rates</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Generic ±25% soil rating adjustments are administrative macro-guidelines, not cultivar-specific Soil Test Crop Response (STCR) quadratic equations. By default, ARACHNOVA retains 100% baseline RDF to prevent arbitrary over- or under-fertilization unless explicitly authorized.
          </p>
        </div>

        {/* Point 4: Advisory Nature & KVK Consultation */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DF] space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#1E2420]">
            <Info className="w-4 h-4 text-[#528C70]" />
            <span>Local Extension Verification</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            These calculations serve as decision-support models and planning estimates. They do not guarantee specific crop yields or profit margins. Always cross-reference planned fertilizer schedules with your local Krishi Vigyan Kendra (KVK) or district agricultural officer before commercial purchase.
          </p>
        </div>
      </div>
    </div>
  );
};
