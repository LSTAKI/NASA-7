// ARACHNOVA - Smart Fertilizer Planner Data Models & Schema Definitions
// Agronomic schemas aligned with ICAR, State Agricultural Universities (PAU, TNAU), and FAO standards.

export type FertilizerCategory = 'chemical' | 'organic' | 'biofertilizer' | 'amendment';

export type RecommendationStatus = 'verified' | 'provisional' | 'unavailable';

export type CultivationCondition = 'irrigated' | 'rainfed' | 'conserved_moisture' | 'dryland';

export type GrowthStageName =
  | 'basal'
  | 'early_vegetative'
  | 'tillering'
  | 'branching'
  | 'knee_high'
  | 'square_formation'
  | 'flowering'
  | 'tuber_initiation_earthing_up'
  | 'pegging'
  | 'bulb_development'
  | 'panicle_initiation'
  | 'grain_filling';

/**
 * Verified agronomic research publication or extension guide
 */
export interface AgronomicSource {
  institution: string;          // e.g. "ICAR - Indian Institute of Rice Research (ICAR-IIRR)"
  publicationTitle: string;     // e.g. "Rice Production Technology Compendium"
  referenceUrl: string;        // Official institutional URL or portal link
  applicableRegion: string;     // e.g. "Indo-Gangetic Plains & Southern Irrigated Basins"
  cultivationCondition: CultivationCondition;
  yearOrEdition?: string;
  notes?: string;
}

/**
 * Phenology-based fertilizer split application timing
 */
export interface FertilizerScheduleSplit {
  stage: GrowthStageName;
  stageDisplayName: string;     // e.g. "Basal Application (At Sowing / Puddling)"
  timingDaysRange?: { min: number; max: number }; // Days after sowing (DAS) or transplanting (DAT)
  nitrogenPercent: number;      // % of total N requirement (0-100)
  phosphorusPercent: number;    // % of total P2O5 requirement (0-100)
  potassiumPercent: number;     // % of total K2O requirement (0-100)
  applicationMethod: string;    // e.g. "Drilled 4-5 cm below seed" | "Broadcast and hoed into topsoil"
  criticalAdvisory?: string;    // e.g. "Do not apply on wet leaves to avoid scorch"
}

/**
 * Organic fertilizer and biofertilizer application alternative
 */
export interface OrganicAlternative {
  productName: string;
  category: 'bulky_organic' | 'concentrated_organic' | 'biofertilizer' | 'green_manure';
  recommendedDosePerHectare: string; // e.g. "10 - 12.5 Tonnes/ha" or "200 g / 10 kg seed"
  nutrientSupplyExplanation: string; // e.g. "Supplies slow-release organic N, P, K; boosts biological activity"
  timingAndMethod: string;           // e.g. "Incorporate into topsoil 3-4 weeks prior to sowing"
  biofertilizerStrain?: string;      // e.g. "Rhizobium leguminosarum / Bacillus megaterium"
}

/**
 * Commercial or farm-level fertilizer product definition
 */
export interface FertilizerProduct {
  id: string;
  name: string;
  commonName: string;
  category: FertilizerCategory;
  formulation: string;           // e.g. "Granular", "Crystalline", "Powder", "Liquid"
  nutrientContent: {
    nitrogenPercent: number;     // N% (e.g. 46 for Urea, 18 for DAP)
    phosphorusPercent: number;   // P2O5% (e.g. 46 for DAP, 16 for SSP)
    potassiumPercent: number;    // K2O% (e.g. 60 for MOP)
    secondaryNutrients?: {
      sulfurPercent?: number;    // e.g. 11% for SSP
      calciumPercent?: number;   // e.g. 19% for SSP
      zincPercent?: number;
    };
  };
  packaging: {
    standardBagWeightKg: number; // e.g. 45 for Neem-coated Urea, 50 for DAP/MOP
    bagUnitLabel: string;        // "45 kg bag" | "50 kg bag"
  };
  suitableCrops: string[];       // Crop IDs or ['all']
  applicationTips: string[];
  precautions?: string[];
}

/**
 * Soil fertility rating tier
 */
export type FertilityTier = 'low' | 'medium' | 'high';

/**
 * Scientific soil test parameter specifications
 * Differentiates laboratory analytical methods from macro satellite/covariate estimates.
 */
export interface SoilTestParameters {
  // Nitrogen
  availableNitrogenKgHa?: number;     // Measured via Alkaline KMnO4 method (Standard Indian Soil Health Card)
  soilGridsTotalNitrogenGKg?: number; // Estimated Total N from SoilGrids 250m (Organic + Bound, NOT plant-available)

  // Phosphorus
  availablePhosphorusKgHa?: number;   // Measured via Olsen method (neutral/alkaline) or Bray-1 (acidic) in kg P/ha or kg P2O5/ha
  phosphorusExtractionMethod?: 'olsen' | 'bray_1';

  // Potassium
  availablePotassiumKgHa?: number;    // Measured via neutral 1N Ammonium Acetate (NH4OAc-K) in kg K/ha or kg K2O/ha

  // Soil Chemical Properties
  soilPh?: number;                    // 1:2.5 or 1:2 soil:water suspension pH
  soilOrganicCarbonPercent?: number;  // Measured via Walkley-Black wet oxidation method (%)
  electricalConductivityDsM?: number; // Salinity indicator (dS/m)

  // Meta
  testDate?: string;
  laboratoryName?: string;
  isSoilHealthCardData?: boolean;
  /**
   * If true, applies the macro-level ±25% adjustment from the Indian Soil Health Card
   * general guidelines (Muhr et al. 1965 / DAC&FW 2015).
   * Disabled by default because generalized rating adjustments are not crop-calibrated STCR equations.
   */
  applyGeneralizedRatingAdjustment?: boolean;
}

/**
 * Individual soil parameter rating evaluation
 */
export interface SoilTestEvaluationItem {
  parameterName: string;
  testedValue: number;
  unit: string;
  extractionMethod: string;
  ratingTier: FertilityTier;
  referenceStandard: string;
  isVerifiedReference: boolean;
  adjustmentMultiplierApplied: number;
  advisory: string;
}

/**
 * Baseline crop nutrient requirement and management record
 */
export interface FertilizerNutrientRequirement {
  cropId: string;                     // Matches crop ID in crop-database.ts
  cropName: string;
  scientificName: string;
  botanicalFamily: string;
  recommendationStatus: RecommendationStatus;

  // Baseline Recommended Dose of Fertilizer (RDF) in kg/ha
  baselineRdfKgHa: {
    nitrogen: number;                 // N kg/ha
    phosphorus: number;               // P2O5 kg/ha
    potassium: number;                // K2O kg/ha
    sulfur?: number;                  // S kg/ha (crucial for oilseeds/pulses/alliums)
    zinc?: number;                    // Zn kg/ha
  };

  // Conditions of applicability
  cultivationCondition: CultivationCondition;
  targetYieldBenchmark?: string;      // e.g. "4.5 - 5.5 tonnes grain/ha"
  geographicalApplicability: string;  // e.g. "Pan-India irrigated zones / Indo-Gangetic Plains"
  conditionsAndLimitations: string[]; // Important caveats and micro-climate dependencies

  // Application timing splits
  applicationSchedule: FertilizerScheduleSplit[];
  applicationScheduleStatus?: RecommendationStatus;

  // Compatible commercial fertilizers
  suitableFertilizerProductIds: string[];

  // Organic and biofertilizer options
  organicAlternatives: OrganicAlternative[];

  // Verified agronomic citations
  sources: AgronomicSource[];
}

// ============================================================================
// CALCULATION ENGINE RESULT INTERFACES (PHASE 2)
// ============================================================================

export type FertilizerCombinationType = 'DAP_UREA_MOP' | 'SSP_UREA_MOP';

export interface NutrientDemandResult {
  cropId: string;
  cropName: string;
  scientificName: string;
  areaHectares: number;
  areaAcres: number;
  recommendationStatus: RecommendationStatus;
  cultivationCondition: CultivationCondition;
  baselineRdfKgHa: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    sulfur?: number;
    zinc?: number;
  };
  totalDemandKg: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    sulfur?: number;
    zinc?: number;
  };
  soilTestAdjustmentApplied: boolean;
  soilTestAdjustmentDetails?: string;
  soilEvaluations?: SoilTestEvaluationItem[];
  warnings: string[];
  isValid: boolean;
  errorMessage?: string;
}

export interface CalculatedFertilizerProductItem {
  productId: string;
  productName: string;
  commonName: string;
  category: FertilizerCategory;
  exactQuantityKg: number;
  bagsToPurchase: number;
  bagWeightKg: number;
  bagUnitLabel: string;
  nutrientsSuppliedKg: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    sulfur?: number;
    calcium?: number;
    zinc?: number;
  };
  applicationRole: string;
}

/**
 * Secondary and Micronutrient Accounting Models
 */
export interface NutrientSupplyDemandItem {
  nutrientName: string;
  chemicalSymbol: string;
  demandedKg: number;
  suppliedKg: number;
  balanceKg: number;               // supplied - demanded (negative = deficit, positive = surplus)
  status: 'satisfied' | 'deficit' | 'surplus' | 'not_applicable';
  isSatisfied: boolean;
  advisory?: string;
}

export interface SecondaryNutrientAccounting {
  sulfur?: NutrientSupplyDemandItem;
  zinc?: NutrientSupplyDemandItem;
  calcium?: NutrientSupplyDemandItem;
  hasUnmetRequirements: boolean;
  unmetNutrients: string[];
}

export interface FertilizerPlanResult {
  cropId: string;
  cropName: string;
  areaHectares: number;
  areaAcres: number;
  combinationType: FertilizerCombinationType;
  recommendationStatus: RecommendationStatus;
  products: CalculatedFertilizerProductItem[];
  nutrientBalance: {
    demandedKg: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
      sulfur?: number;
      zinc?: number;
    };
    suppliedKg: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
      sulfur?: number;
      calcium?: number;
      zinc?: number;
    };
    balanceKg: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
    isNutrientImbalanced: boolean;
    imbalanceWarnings: string[];
  };
  secondaryNutrientAccounting: SecondaryNutrientAccounting;
  isRecommendationComplete: boolean; // false if any required secondary/micronutrient has an unfulfilled deficit
  suitabilityForCrop: {
    isSuitable: boolean;
    suitabilityNotes: string[];
  };
  notes: string[];
  warnings: string[];
  isValid: boolean;
  errorMessage?: string;
}

export interface ScheduledStageProductSplit {
  productId: string;
  productName: string;
  quantityKg: number;
  bagWeightKg: number;
  stageBagsApprox: number;
}

export interface ScheduledStagePlan {
  stage: GrowthStageName;
  stageDisplayName: string;
  timingDaysRange?: { min: number; max: number };
  applicationMethod: string;
  criticalAdvisory?: string;
  percentages: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  stageNutrientsKg: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  stageProducts: ScheduledStageProductSplit[];
}

export interface ApplicationScheduleResult {
  cropId: string;
  cropName: string;
  stages: ScheduledStagePlan[];
  totalPercentages: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  scheduleStatus: RecommendationStatus;
  isAllocationValid: boolean;
  allocationWarnings: string[];
  isValid: boolean;
  errorMessage?: string;
}

export interface CalculatedOrganicAlternativeItem {
  productName: string;
  category: 'bulky_organic' | 'concentrated_organic' | 'biofertilizer' | 'green_manure';
  recommendedDosePerHectare: string;
  totalFarmDoseEstimated: string;
  nutrientSupplyExplanation: string;
  timingAndMethod: string;
  biofertilizerStrain?: string;
  releaseAssumptions: string;
  scientificReference?: string;
  isProvisional?: boolean;
}

export interface OrganicAlternativesResult {
  cropId?: string;
  cropName?: string;
  areaHectares: number;
  areaAcres: number;
  alternatives: CalculatedOrganicAlternativeItem[];
  generalOrganicAdvisory: string[];
  isValid: boolean;
  errorMessage?: string;
}

