'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FertilizerCombinationType,
  SoilTestParameters,
} from '@/types/fertilizer';
import {
  calculateNutrientDemand,
  calculateFertilizerProducts,
  calculateApplicationSchedule,
  calculateOrganicAlternatives,
  hectaresToAcres,
  acresToHectares,
  roundTo,
} from '@/lib/calculations/fertilizer-engine';
import {
  getAllFertilizerRequirements,
  getFertilizerRequirementByCropId,
  getFertilizerProductById,
} from '@/data/fertilizer/fertilizer-database';

import { NutrientDemandCard } from './NutrientDemandCard';
import { FertilizerProductCard } from './FertilizerProductCard';
import { NutrientBalanceAlert } from './NutrientBalanceAlert';
import { ApplicationSchedule } from './ApplicationSchedule';
import { OrganicAlternatives } from './OrganicAlternatives';
import { FertilizerDisclaimer } from './FertilizerDisclaimer';

import {
  Sprout,
  Scale,
  Package,
  Calendar,
  Leaf,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export interface FertilizerPlannerProps {
  initialCropId?: string;
  initialAreaHectares?: number;
  farmName?: string;
  onCropChange?: (cropId: string) => void;
  availableCropIds?: string[];
  embedded?: boolean;
}

export const FertilizerPlanner: React.FC<FertilizerPlannerProps> = ({
  initialCropId = 'wheat',
  initialAreaHectares = 2.0,
  farmName,
  onCropChange,
  availableCropIds,
  embedded = false,
}) => {
  // All 16 crops from the agronomic database
  const allCropProfiles = useMemo(() => getAllFertilizerRequirements(), []);

  // Active state
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId);
  const [areaUnit, setAreaUnit] = useState<'ha' | 'acres'>('ha');
  const [areaValue, setAreaValue] = useState<number>(initialAreaHectares > 0 ? initialAreaHectares : 0);
  const [combinationType, setCombinationType] = useState<FertilizerCombinationType>('DAP_UREA_MOP');

  // Synchronize selected crop when initialCropId prop changes from parent
  useEffect(() => {
    if (initialCropId) {
      setSelectedCropId(initialCropId);
    }
  }, [initialCropId]);

  // Synchronize area value when initialAreaHectares prop changes from active farm
  useEffect(() => {
    if (typeof initialAreaHectares === 'number' && initialAreaHectares > 0) {
      setAreaValue(areaUnit === 'acres' ? roundTo(hectaresToAcres(initialAreaHectares), 1) : initialAreaHectares);
    }
  }, [initialAreaHectares, areaUnit]);

  // Soil-test lab data state
  const [showSoilTestPanel, setShowSoilTestPanel] = useState<boolean>(false);
  const [availN, setAvailN] = useState<string>('');
  const [availP, setAvailP] = useState<string>('');
  const [availK, setAvailK] = useState<string>('');
  const [applyMacroAdjustment, setApplyMacroAdjustment] = useState<boolean>(false);

  // Derive effective area in hectares for engine calculations
  const effectiveAreaHectares = useMemo(() => {
    if (!Number.isFinite(areaValue) || areaValue <= 0) return 0;
    return areaUnit === 'acres' ? acresToHectares(areaValue) : areaValue;
  }, [areaValue, areaUnit]);

  // Construct soil-test parameters object
  const soilTestParams: SoilTestParameters | undefined = useMemo(() => {
    const numN = parseFloat(availN);
    const numP = parseFloat(availP);
    const numK = parseFloat(availK);

    if (isNaN(numN) && isNaN(numP) && isNaN(numK)) {
      return undefined;
    }

    return {
      availableNitrogenKgHa: !isNaN(numN) && numN > 0 ? numN : undefined,
      availablePhosphorusKgHa: !isNaN(numP) && numP > 0 ? numP : undefined,
      availablePotassiumKgHa: !isNaN(numK) && numK > 0 ? numK : undefined,
      applyGeneralizedRatingAdjustment: applyMacroAdjustment,
    };
  }, [availN, availP, availK, applyMacroAdjustment]);

  // Execute pure calculation engine functions
  const nutrientDemand = useMemo(() => {
    return calculateNutrientDemand(selectedCropId, effectiveAreaHectares, soilTestParams);
  }, [selectedCropId, effectiveAreaHectares, soilTestParams]);

  const fertilizerPlan = useMemo(() => {
    return calculateFertilizerProducts(nutrientDemand, combinationType);
  }, [nutrientDemand, combinationType]);

  const applicationSchedule = useMemo(() => {
    return calculateApplicationSchedule(selectedCropId, fertilizerPlan);
  }, [selectedCropId, fertilizerPlan]);

  const organicAlternatives = useMemo(() => {
    return calculateOrganicAlternatives(selectedCropId, effectiveAreaHectares);
  }, [selectedCropId, effectiveAreaHectares]);

  // Crop metadata
  const currentCrop = useMemo(() => {
    return getFertilizerRequirementByCropId(selectedCropId);
  }, [selectedCropId]);

  // Filter available crops if subset provided
  const selectableCrops = useMemo(() => {
    if (availableCropIds && availableCropIds.length > 0) {
      return allCropProfiles.filter(c => availableCropIds.includes(c.cropId));
    }
    return allCropProfiles;
  }, [allCropProfiles, availableCropIds]);

  const handleCropSelect = (newCropId: string) => {
    setSelectedCropId(newCropId);
    if (onCropChange) {
      onCropChange(newCropId);
    }
  };

  const handleUnitToggle = (newUnit: 'ha' | 'acres') => {
    if (newUnit === areaUnit) return;
    if (newUnit === 'acres') {
      setAreaValue(roundTo(areaValue * 2.47105, 1));
    } else {
      setAreaValue(roundTo(areaValue * 0.404686, 1));
    }
    setAreaUnit(newUnit);
  };

  // Reusable soil test panel markup
  const renderSoilTestPanel = () => (
    <div className="mt-4 p-4 md:p-5 rounded-2xl bg-[#F9F8F5] border border-[#E0DCD3] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE6DF]">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-[#528C70]" />
          <h4 className="text-sm font-bold text-[#1E2420]">
            Laboratory Soil Health Card Measurements (Optional)
          </h4>
        </div>
        <span className="text-[11px] text-[#5C645E]">
          Analytical procedures: Alkaline KMnO₄ (N), Olsen (P₂O₅), NH₄OAc (K₂O)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="text-xs font-semibold text-[#1E2420] block mb-1">
            Available Nitrogen (kg N/ha)
          </label>
          <input
            type="number"
            placeholder="e.g. 210 (Low <280)"
            value={availN}
            onChange={e => setAvailN(e.target.value)}
            className="w-full bg-white border border-[#E0DCD3] rounded-xl px-3 py-2 text-sm text-[#1E2420] placeholder-[#8A928C] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1E2420] block mb-1">
            Available Phosphorus (kg P₂O₅/ha eq.)
          </label>
          <input
            type="number"
            placeholder="e.g. 18 (Low <23)"
            value={availP}
            onChange={e => setAvailP(e.target.value)}
            className="w-full bg-white border border-[#E0DCD3] rounded-xl px-3 py-2 text-sm text-[#1E2420] placeholder-[#8A928C] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1E2420] block mb-1">
            Available Potassium (kg K₂O/ha eq.)
          </label>
          <input
            type="number"
            placeholder="e.g. 115 (Low <130)"
            value={availK}
            onChange={e => setAvailK(e.target.value)}
            className="w-full bg-white border border-[#E0DCD3] rounded-xl px-3 py-2 text-sm text-[#1E2420] placeholder-[#8A928C] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
          />
        </div>
      </div>

      {/* Checkbox for generalized ±25% macro scaling */}
      <div className="p-3 rounded-xl bg-white border border-[#EAE6DF] flex items-start gap-3 text-xs">
        <input
          id="macro-scaling-toggle"
          type="checkbox"
          checked={applyMacroAdjustment}
          onChange={e => setApplyMacroAdjustment(e.target.checked)}
          className="mt-0.5 rounded border-[#E0DCD3] text-[#2E7D32] focus:ring-[#2E7D32]"
        />
        <label htmlFor="macro-scaling-toggle" className="cursor-pointer text-[#404642] leading-relaxed">
          <strong className="text-[#1E2420] font-semibold block">
            Enable generalized ±25% macro-scaling (Soil Health Card guideline)
          </strong>
          By default, ARACHNOVA evaluates fertility tiers but retains 100% baseline RDF because macro categories are not cultivar-calibrated STCR equations. Check this box only if your local agricultural extension officer recommends applying the standard ±25% adjustment.
        </label>
      </div>
    </div>
  );

  // Common inner sections (Demand, Products, Schedule, Organic, Disclaimer)
  const renderCalculationSections = () => (
    <>
      {/* Workflow Progression Stepper */}
      <div className="bg-white rounded-2xl border border-[#E0DCD3] p-3 md:p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2 text-[#2E7D32]">
            <span className="w-6 h-6 rounded-full bg-[#EAF3EE] flex items-center justify-center text-xs font-bold">1</span>
            <span>Crop Demand</span>
          </div>
          <span className="text-[#E0DCD3]">→</span>
          <div className="flex items-center gap-2 text-[#2E7D32]">
            <span className="w-6 h-6 rounded-full bg-[#EAF3EE] flex items-center justify-center text-xs font-bold">2</span>
            <span>Fertilizer Formulation</span>
          </div>
          <span className="text-[#E0DCD3]">→</span>
          <div className="flex items-center gap-2 text-[#2E7D32]">
            <span className="w-6 h-6 rounded-full bg-[#EAF3EE] flex items-center justify-center text-xs font-bold">3</span>
            <span>Split Schedule</span>
          </div>
          <span className="text-[#E0DCD3]">→</span>
          <div className="flex items-center gap-2 text-[#528C70]">
            <span className="w-6 h-6 rounded-full bg-[#EAF3EE] flex items-center justify-center text-xs font-bold">4</span>
            <span>Organic Alternatives</span>
          </div>
        </div>
      </div>

      {/* Missing registered area alert */}
      {effectiveAreaHectares <= 0 && (
        <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#D4973B]/40 flex items-start gap-3 text-xs text-[#854D0E]">
          <Info className="w-4 h-4 text-[#D4973B] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#1E2420] font-semibold mb-0.5">Please specify field area:</strong>
            Enter your field size in hectares or acres in the area box above to calculate exact commercial fertilizer quantities and packaging bag counts for {currentCrop?.cropName || 'this crop'}.
          </div>
        </div>
      )}

      {/* SECTION 1: CROP NUTRIENT DEMAND */}
      <section>
        <NutrientDemandCard
          nutrientDemand={nutrientDemand}
          areaUnit={areaUnit}
        />
      </section>

      {/* SECTION 2: FERTILIZER COMBINATION SELECTOR & FORMULATION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#1E2420]">
              Commercial Fertilizer Recommendation
            </h3>
            <p className="text-xs text-[#5C645E]">
              Select your preferred commercial fertilizer combination
            </p>
          </div>

          {/* Combination Toggle Buttons */}
          <div className="inline-flex rounded-xl p-1 bg-white border border-[#E0DCD3] shadow-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCombinationType('DAP_UREA_MOP')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                combinationType === 'DAP_UREA_MOP'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#5C645E] hover:text-[#1E2420]'
              }`}
            >
              DAP + Urea + MOP
            </button>
            <button
              type="button"
              onClick={() => setCombinationType('SSP_UREA_MOP')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                combinationType === 'SSP_UREA_MOP'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#5C645E] hover:text-[#1E2420]'
              }`}
            >
              SSP + Urea + MOP (Sulfur Rich)
            </button>
          </div>
        </div>

        {/* Combination Comparison Info Note */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DF] text-xs text-[#5C645E]">
          {combinationType === 'DAP_UREA_MOP' ? (
            <p>
              <strong className="text-[#1E2420] font-semibold">DAP Combination:</strong> Standard broadacre combination. DAP supplies 18% Ammoniacal Nitrogen alongside 46% P₂O₅. The nitrogen delivered by DAP is credited toward total crop demand, reducing Urea requirements accordingly.
            </p>
          ) : (
            <p>
              <strong className="text-[#1E2420] font-semibold">SSP Combination:</strong> Single Super Phosphate supplies 16% P₂O₅, plus 11% Sulfur (S) and 19% Calcium (Ca). Because SSP delivers 0% Nitrogen, Nitrogen and Phosphorus can be managed completely independently. Highly recommended for oilseeds (Groundnut, Soybean) and alliums (Onion).
            </p>
          )}
        </div>

        {/* CRITICAL: NUTRIENT BALANCE ALERTS (ALWAYS UNCOLLAPSED) */}
        <NutrientBalanceAlert plan={fertilizerPlan} />

        {/* FERTILIZER PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fertilizerPlan.products.map(prod => {
            const spec = getFertilizerProductById(prod.productId);
            return (
              <FertilizerProductCard
                key={prod.productId}
                product={prod}
                precautions={spec?.precautions}
                applicationTips={spec?.applicationTips}
              />
            );
          })}
        </div>
      </section>

      {/* SECTION 3: PHENOLOGICAL APPLICATION SCHEDULE */}
      <section>
        <ApplicationSchedule schedule={applicationSchedule} />
      </section>

      {/* SECTION 4: ORGANIC ALTERNATIVES & BIOFERTILIZERS */}
      <section>
        <OrganicAlternatives organicData={organicAlternatives} />
      </section>

      {/* SECTION 5: SCIENTIFIC TRANSPARENCY & DISCLAIMER */}
      <section>
        <FertilizerDisclaimer />
      </section>
    </>
  );

  // =========================================================================
  // EMBEDDED MODE (For inside CropCard / RotationAdvisorView)
  // =========================================================================
  if (embedded) {
    return (
      <div className="bg-[#FAF9F5] rounded-2xl border border-[#E0DCD3] p-4 md:p-6 text-[#1E2420] space-y-6">
        {/* Embedded Top Control Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EAE6DF]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#2E7D32] font-semibold uppercase tracking-wider mb-0.5">
              <FlaskConical className="w-4 h-4" />
              <span>Smart Fertilizer Planner</span>
              {farmName && <span className="text-[#5C645E]">· {farmName}</span>}
            </div>
            <h3 className="text-xl font-bold text-[#1E2420] flex items-center gap-2">
              <span>{currentCrop?.cropName || selectedCropId} Formulation</span>
              {currentCrop?.recommendationStatus === 'verified' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3EE] text-[#2E7D32] border border-[#C7E9D2]">
                  Verified ICAR / SAU
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFDF5] text-[#D4973B] border border-[#FDE68A]">
                  Provisional
                </span>
              )}
            </h3>
            <p className="text-xs text-[#5C645E] mt-0.5 italic">
              {currentCrop?.scientificName} &bull; {currentCrop?.botanicalFamily} &bull; {currentCrop?.cultivationCondition}
            </p>
          </div>

          {/* Area & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Crop Switcher inside planner */}
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-[#5C645E] uppercase tracking-wider mb-1">
                Crop
              </label>
              <div className="relative">
                <select
                  value={selectedCropId}
                  onChange={e => handleCropSelect(e.target.value)}
                  className="appearance-none bg-white border border-[#E0DCD3] text-[#1E2420] font-semibold text-xs rounded-xl pl-3 pr-8 py-2 hover:border-[#528C70] focus:outline-none cursor-pointer"
                >
                  {selectableCrops.map(crop => (
                    <option key={crop.cropId} value={crop.cropId}>
                      {crop.cropName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#5C645E] absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Field Area & Unit Switcher */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#5C645E] uppercase tracking-wider mb-1">
                <span>Field Area</span>
                <div className="inline-flex rounded-md p-0.5 bg-[#EAE6DF] text-[9px] ml-2">
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('ha')}
                    className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                      areaUnit === 'ha' ? 'bg-white text-[#1E2420] shadow-xs' : 'text-[#5C645E]'
                    }`}
                  >
                    ha
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('acres')}
                    className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                      areaUnit === 'acres' ? 'bg-white text-[#1E2420] shadow-xs' : 'text-[#5C645E]'
                    }`}
                  >
                    acres
                  </button>
                </div>
              </div>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={areaValue > 0 ? areaValue : ''}
                placeholder="Area"
                onChange={e => setAreaValue(parseFloat(e.target.value) || 0)}
                className="w-24 bg-white border border-[#E0DCD3] text-[#1E2420] font-bold text-xs rounded-xl px-3 py-2 hover:border-[#528C70] focus:outline-none"
              />
            </div>

            {/* Soil Test Toggle */}
            <div className="flex flex-col self-end">
              <button
                type="button"
                onClick={() => setShowSoilTestPanel(!showSoilTestPanel)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  showSoilTestPanel || soilTestParams
                    ? 'bg-[#EAF3EE] text-[#2E7D32] border-[#2E7D32]'
                    : 'bg-white text-[#1E2420] border-[#E0DCD3] hover:border-[#528C70]'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#528C70]" />
                <span>Soil Test</span>
                {showSoilTestPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Optional Soil Test Panel */}
        {showSoilTestPanel && renderSoilTestPanel()}

        {/* Calculation Sections */}
        {renderCalculationSections()}
      </div>
    );
  }

  // =========================================================================
  // STANDALONE FULL-PAGE MODE
  // =========================================================================
  return (
    <div className="bg-[#F9F8F5] min-h-screen text-[#1E2420] pb-16 space-y-8">
      {/* 1. TOP HEADER & CROP CONTEXT SELECTOR */}
      <div className="bg-white border-b border-[#E0DCD3] px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#528C70] font-semibold uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4" />
              <span>ARACHNOVA Agricultural Intelligence</span>
              {farmName && <span className="text-[#5C645E]">· {farmName}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E2420]">
              Smart Fertilizer &amp; Nutrient Planner
            </h1>
            <p className="text-sm text-[#5C645E] mt-1">
              Crop-specific scientific fertilizer dosage, commercial bag counts, and split schedules
            </p>
          </div>

          {/* Controls: Crop Selector & Area Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Crop Selector */}
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-[#5C645E] uppercase tracking-wider mb-1">
                Selected Crop
              </label>
              <div className="relative">
                <select
                  value={selectedCropId}
                  onChange={e => handleCropSelect(e.target.value)}
                  className="appearance-none bg-[#F9F8F5] border border-[#E0DCD3] text-[#1E2420] font-semibold text-sm rounded-xl pl-3.5 pr-9 py-2.5 hover:border-[#528C70] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 cursor-pointer"
                >
                  {selectableCrops.map(crop => (
                    <option key={crop.cropId} value={crop.cropId}>
                      {crop.cropName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#5C645E] absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Farm Area Input & Unit Toggle */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#5C645E] uppercase tracking-wider mb-1">
                <span>Field Area</span>
                <div className="inline-flex rounded-md p-0.5 bg-[#EAE6DF] text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('ha')}
                    className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                      areaUnit === 'ha' ? 'bg-white text-[#1E2420] shadow-xs' : 'text-[#5C645E]'
                    }`}
                  >
                    ha
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('acres')}
                    className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                      areaUnit === 'acres' ? 'bg-white text-[#1E2420] shadow-xs' : 'text-[#5C645E]'
                    }`}
                  >
                    acres
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={areaValue > 0 ? areaValue : ''}
                  placeholder="Area"
                  onChange={e => setAreaValue(parseFloat(e.target.value) || 0)}
                  className="w-28 bg-[#F9F8F5] border border-[#E0DCD3] text-[#1E2420] font-bold text-sm rounded-xl px-3.5 py-2.5 hover:border-[#528C70] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
                />
              </div>
            </div>

            {/* Soil Health Card Toggle Button */}
            <div className="flex flex-col self-end">
              <button
                type="button"
                onClick={() => setShowSoilTestPanel(!showSoilTestPanel)}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  showSoilTestPanel || soilTestParams
                    ? 'bg-[#EAF3EE] text-[#2E7D32] border-[#2E7D32]'
                    : 'bg-white text-[#1E2420] border-[#E0DCD3] hover:border-[#528C70]'
                }`}
              >
                <FlaskConical className="w-4 h-4 text-[#528C70]" />
                <span>Soil Test Data</span>
                {showSoilTestPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Selected Crop Meta Badges */}
        {currentCrop && (
          <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-[#EAE6DF] flex flex-wrap items-center gap-3 text-xs text-[#5C645E]">
            <span className="font-semibold text-[#1E2420]">
              Botanical: <span className="font-normal italic">{currentCrop.scientificName}</span>
            </span>
            <span>&bull;</span>
            <span>Family: {currentCrop.botanicalFamily}</span>
            <span>&bull;</span>
            <span>Condition: {currentCrop.cultivationCondition}</span>
            <span>&bull;</span>
            {currentCrop.recommendationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 text-[#2E7D32] font-medium bg-[#EAF3EE] px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Verified ICAR / SAU Standard
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#D4973B] font-medium bg-[#FFFDF5] px-2 py-0.5 rounded-full border border-[#D4973B]/30">
                <AlertCircle className="w-3 h-3" />
                Provisional Cover Crop
              </span>
            )}
          </div>
        )}

        {/* OPTIONAL SOIL HEALTH CARD LAB INPUT DRAWER */}
        {showSoilTestPanel && renderSoilTestPanel()}
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {renderCalculationSections()}
      </div>
    </div>
  );
};
