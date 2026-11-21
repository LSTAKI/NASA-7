// ARACHNOVA Agronomic Fertilizer Knowledge Base
// Verified nutrient guidelines compiled from ICAR (Indian Council of Agricultural Research),
// State Agricultural Universities (PAU, TNAU, UAS), and FAO technical references.
// Values represent standard recommended packages of practices (RDF) for high-yielding crops under irrigated/specified conditions.

import {
  FertilizerNutrientRequirement,
  FertilizerProduct,
  AgronomicSource,
  FertilizerScheduleSplit,
  OrganicAlternative,
} from '../../types/fertilizer';

export * from '../../types/fertilizer';

// ============================================================================
// 1. COMMERCIAL & ORGANIC FERTILIZER PRODUCTS CATALOG
// ============================================================================

export const FERTILIZER_PRODUCTS: FertilizerProduct[] = [
  {
    id: 'neem_coated_urea',
    name: 'Neem-Coated Urea (NCU)',
    commonName: 'Urea',
    category: 'chemical',
    formulation: 'Prilled / Granular with neem oil coating',
    nutrientContent: {
      nitrogenPercent: 46.0,
      phosphorusPercent: 0.0,
      potassiumPercent: 0.0,
    },
    packaging: {
      standardBagWeightKg: 45, // Standardized 45 kg bag as per Govt of India Ministry of Chemicals and Fertilizers notification
      bagUnitLabel: '45 kg bag',
    },
    suitableCrops: ['rice', 'wheat', 'maize', 'pearl_millet', 'sorghum', 'cotton', 'tomato', 'potato', 'cabbage', 'onion', 'carrot'],
    applicationTips: [
      'Neem oil coating slows down nitrification, reducing nitrogen leaching and volatilization losses by 10-15% compared to plain urea.',
      'Split application across vegetative stages is mandatory; applying full dose at once causes massive leaching and foliage burning.',
      'Apply when topsoil is moist, then incorporate or irrigate lightly. Avoid application on standing stagnant water.',
    ],
    precautions: [
      'Do not apply on wet leaves during morning hours to prevent leaf scorch.',
      'Not recommended as main nitrogen source for nodulating legumes (soybean, chickpea) beyond small starter dose.',
    ],
  },
  {
    id: 'dap',
    name: 'Di-Ammonium Phosphate (DAP)',
    commonName: 'DAP (18-46-0)',
    category: 'chemical',
    formulation: 'Water-soluble granular',
    nutrientContent: {
      nitrogenPercent: 18.0,
      phosphorusPercent: 46.0,
      potassiumPercent: 0.0,
    },
    packaging: {
      standardBagWeightKg: 50,
      bagUnitLabel: '50 kg bag',
    },
    suitableCrops: ['all'],
    applicationTips: [
      'Primary basal phosphorus carrier for broadacre crops.',
      'Supplies 18% ammoniacal nitrogen along with 46% P2O5; the nitrogen delivered by DAP MUST be deducted from the total crop nitrogen requirement when calculating Urea.',
      'Best placement is 4-5 cm below and to the side of seeds during sowing to facilitate early root exploration.',
    ],
    precautions: [
      'Avoid placing directly in contact with seed in dry soils to avoid seedling ammonia toxicity.',
      'Inefficient if top-dressed on standing crops; phosphorus has very low mobility in soil and must be placed in the root zone.',
    ],
  },
  {
    id: 'mop',
    name: 'Muriate of Potash (MOP / Potassium Chloride)',
    commonName: 'MOP (0-0-60)',
    category: 'chemical',
    formulation: 'Pink / white crystalline granules (KCl)',
    nutrientContent: {
      nitrogenPercent: 0.0,
      phosphorusPercent: 0.0,
      potassiumPercent: 60.0,
    },
    packaging: {
      standardBagWeightKg: 50,
      bagUnitLabel: '50 kg bag',
    },
    suitableCrops: ['rice', 'wheat', 'maize', 'pearl_millet', 'sorghum', 'cotton', 'tomato', 'cabbage', 'onion', 'soybean', 'groundnut', 'green_peas'],
    applicationTips: [
      'Essential for enzyme activation, stomatal regulation, disease resistance, and carbohydrate translocation.',
      'In light sandy soils, split potassium between basal and top-dressing to prevent chloride leaching.',
    ],
    precautions: [
      'Contains chloride (approx 47%); for high-grade processing potatoes and chloride-sensitive crops, Potassium Sulfate (SOP) is preferred when available.',
    ],
  },
  {
    id: 'ssp',
    name: 'Single Super Phosphate (SSP)',
    commonName: 'SSP (0-16-0 + 11% S + 19% Ca)',
    category: 'chemical',
    formulation: 'Powder / Granular',
    nutrientContent: {
      nitrogenPercent: 0.0,
      phosphorusPercent: 16.0,
      potassiumPercent: 0.0,
      secondaryNutrients: {
        sulfurPercent: 11.0,
        calciumPercent: 19.0,
      },
    },
    packaging: {
      standardBagWeightKg: 50,
      bagUnitLabel: '50 kg bag',
    },
    suitableCrops: ['groundnut', 'soybean', 'chickpea', 'green_peas', 'onion', 'mustard'],
    applicationTips: [
      'Ideal phosphorus source for oilseeds, pulses, and alliums because it naturally delivers 11% Sulfur and 19% Calcium.',
      'Supplies zero nitrogen, allowing independent nitrogen management through legume nodulation.',
    ],
    precautions: [
      'Higher bulk volume required due to 16% P2O5 concentration compared to 46% in DAP.',
    ],
  },
  {
    id: 'gypsum',
    name: 'Agricultural Mineral Gypsum (CaSO4·2H2O)',
    commonName: 'Gypsum (22% Ca + 18% S)',
    category: 'amendment',
    formulation: 'Fine mineral powder',
    nutrientContent: {
      nitrogenPercent: 0.0,
      phosphorusPercent: 0.0,
      potassiumPercent: 0.0,
      secondaryNutrients: {
        sulfurPercent: 18.0,
        calciumPercent: 22.0,
      },
    },
    packaging: {
      standardBagWeightKg: 50,
      bagUnitLabel: '50 kg bag',
    },
    suitableCrops: ['groundnut', 'potato', 'onion'],
    applicationTips: [
      'Indispensable for groundnut pegging stage (40-45 DAS); calcium is absorbed directly by developing pods from the top 5 cm of soil to prevent "pops" (empty shells).',
      'Acts as a non-alkalizing calcium and sulfur source that improves soil aggregate stability.',
    ],
  },
  {
    id: 'fym',
    name: 'Well-Rotted Farmyard Manure (FYM)',
    commonName: 'Desi Gobar Khad / Cattle Dung Compost',
    category: 'organic',
    formulation: 'Bulky decomposed organic manure',
    nutrientContent: {
      nitrogenPercent: 0.5,
      phosphorusPercent: 0.2,
      potassiumPercent: 0.5,
    },
    packaging: {
      standardBagWeightKg: 1000,
      bagUnitLabel: 'Metric Tonne (t)',
    },
    suitableCrops: ['all'],
    applicationTips: [
      'Improves soil organic carbon, CEC, moisture retention capacity, and beneficial microbial population.',
      'Must be fully decomposed (dark brown/black, earthy smell); applying raw dung leads to nitrogen immobilization (tie-up) and termite proliferation.',
      'Incorporate 3-4 weeks before sowing during primary tillage.',
    ],
  },
  {
    id: 'vermicompost',
    name: 'Enriched Earthworm Vermicompost',
    commonName: 'Vermicompost (Kechua Khad)',
    category: 'organic',
    formulation: 'Fine granular organic humus',
    nutrientContent: {
      nitrogenPercent: 1.5,
      phosphorusPercent: 1.0,
      potassiumPercent: 1.5,
    },
    packaging: {
      standardBagWeightKg: 50,
      bagUnitLabel: '50 kg bag / Tonne',
    },
    suitableCrops: ['all'],
    applicationTips: [
      'Contains 3x the nutrient concentration of ordinary FYM, along with plant growth hormones (auxins, gibberellins) and rich actinomycetes.',
      'Excellent for furrow placement in high-value vegetable beds and tuber crops.',
    ],
  },
  {
    id: 'biofertilizer_rhizobium',
    name: 'Rhizobium Bacterial Seed Inoculant',
    commonName: 'Rhizobium Culture',
    category: 'biofertilizer',
    formulation: 'Carrier-based peat/lignite powder or liquid broth',
    nutrientContent: {
      nitrogenPercent: 0.0,
      phosphorusPercent: 0.0,
      potassiumPercent: 0.0,
    },
    packaging: {
      standardBagWeightKg: 0.2,
      bagUnitLabel: '200 g packet',
    },
    suitableCrops: ['chickpea', 'soybean', 'groundnut', 'green_peas'],
    applicationTips: [
      'Inoculate seeds with species-specific strain (e.g. Mesorhizobium ciceri for chickpea, Bradyrhizobium for soybean).',
      'Mix 200 g packet with 10 kg seed using 10% jaggery (gur) slurry as a sticker. Dry in shade for 30 minutes before sowing.',
      'Can biologically fix 30-100 kg atmospheric N/ha, saving synthetic nitrogen.',
    ],
    precautions: [
      'Keep away from direct sunlight and heat. Do not mix directly with chemical fungicides; if seed treated with fungicide, apply biofertilizer last.',
    ],
  },
  {
    id: 'biofertilizer_azotobacter',
    name: 'Azotobacter Free-Living Nitrogen Fixer',
    commonName: 'Azotobacter Culture',
    category: 'biofertilizer',
    formulation: 'Carrier-based powder or liquid broth',
    nutrientContent: {
      nitrogenPercent: 0.0,
      phosphorusPercent: 0.0,
      potassiumPercent: 0.0,
    },
    packaging: {
      standardBagWeightKg: 0.2,
      bagUnitLabel: '200 g packet / 500 ml bottle',
    },
    suitableCrops: ['wheat', 'maize', 'cotton', 'potato', 'carrot', 'cabbage', 'tomato', 'onion'],
    applicationTips: [
      'Fixes 15-25 kg N/ha in non-leguminous rhizosphere soils and synthesizes antifungal compounds and plant growth hormones.',
      'Apply as seed treatment (200 g/10 kg seed) or soil application mixed with 50 kg FYM/vermicompost per hectare.',
    ],
  },
  {
    id: 'biofertilizer_azospirillum',
    name: 'Azospirillum Associative Nitrogen Fixer',
    commonName: 'Azospirillum Culture',
    category: 'biofertilizer',
    formulation: 'Carrier-based powder or liquid broth',
    nutrientContent: {
      nitrogenPercent: 0.0,
      phosphorusPercent: 0.0,
      potassiumPercent: 0.0,
    },
    packaging: {
      standardBagWeightKg: 0.2,
      bagUnitLabel: '200 g packet / 500 ml bottle',
    },
    suitableCrops: ['rice', 'pearl_millet', 'sorghum', 'tomato', 'cabbage', 'onion'],
    applicationTips: [
      'Associative symbiont especially effective in wetland paddy, millets, and transplanted vegetables.',
      'Root dipping of seedlings for 30 minutes prior to transplanting: mix 1 kg Azospirillum in 40 liters of water for 1 hectare seedlings.',
    ],
  },
  {
    id: 'biofertilizer_psb',
    name: 'Phosphate Solubilizing Bacteria (PSB)',
    commonName: 'PSB Culture (Bacillus megaterium / Pseudomonas striata)',
    category: 'biofertilizer',
    formulation: 'Carrier-based powder or liquid broth',
    nutrientContent: {
      nitrogenPercent: 0.0,
      phosphorusPercent: 0.0,
      potassiumPercent: 0.0,
    },
    packaging: {
      standardBagWeightKg: 0.2,
      bagUnitLabel: '200 g packet / 1 kg pack',
    },
    suitableCrops: ['all'],
    applicationTips: [
      'Secretes organic acids (citric, gluconic, succinic) that solubilize insoluble tricalcium, iron, and aluminum phosphates in soil.',
      'Increases crop phosphorus uptake by 10-25 kg P2O5/ha equivalent from fixed native soil reserves.',
      'Apply 5 kg/ha mixed with 100 kg compost at sowing, or use as seed treatment.',
    ],
  },
];

// ============================================================================
// 2. SOIL HEALTH CARD INTERPRETATION & RATING STANDARDS (ICAR STANDARDS)
// ============================================================================

/**
 * Standard Soil Test Rating Tiers based on official ICAR / Ministry of Agriculture
 * and Farmers Welfare (Soil Health Card Scheme) testing protocols.
 *
 * NOTE ON ANALYTICAL DISTINCTION:
 * - SoilGrids 250m estimates "nitrogenGkg" (total elemental nitrogen in g/kg). Over 95% of
 *   total soil nitrogen is held in non-mineralized organic molecules unavailable to plants.
 * - Laboratory Soil Health Cards measure "Available Nitrogen" using Subbiah & Asija (1956)
 *   alkaline permanganate distillation (KMnO4-N), expressed in kg/ha.
 * - These two metrics CANNOT be substituted or converted directly without laboratory incubation data.
 */
export const SOIL_TEST_RATING_THRESHOLDS = {
  availableNitrogen: {
    method: 'Alkaline Permanganate (Subbiah & Asija 1956)',
    unit: 'kg N/ha',
    low: { max: 280, description: 'Deficient: Crop will respond strongly to nitrogen application (+20-25% RDF adjustment)' },
    medium: { min: 280, max: 560, description: 'Adequate: Follow standard Recommended Dose of Fertilizer (100% RDF)' },
    high: { min: 560, description: 'Surplus: Reduce synthetic nitrogen by 20-25% to avoid lodging, pest outbreaks, and leaching' },
  },
  availablePhosphorus: {
    method: 'Olsen method (0.5M NaHCO3 at pH 8.5) for neutral/alkaline soils, Bray P-1 for acidic soils',
    unit: 'kg P2O5/ha equivalent (Conversion: kg P/ha * 2.29 = kg P2O5/ha)',
    low: { max: 23.0, description: 'Deficient (<10 kg P/ha): Increase basal phosphorus dose by 25%' },
    medium: { min: 23.0, max: 56.0, description: 'Adequate (10-24.6 kg P/ha): Apply baseline crop RDF' },
    high: { min: 56.0, description: 'Surplus (>24.6 kg P/ha): Reduce basal phosphorus by 25-50% to prevent zinc/iron antagonism' },
  },
  availablePotassium: {
    method: 'Neutral 1N Ammonium Acetate extractable K (NH4OAc-K)',
    unit: 'kg K2O/ha equivalent (Conversion: kg K/ha * 1.20 = kg K2O/ha)',
    low: { max: 130.0, description: 'Deficient (<108 kg K/ha): Increase potassium application by 20-25%' },
    medium: { min: 130.0, max: 336.0, description: 'Adequate (108-280 kg K/ha): Apply baseline crop RDF' },
    high: { min: 336.0, description: 'Surplus (>280 kg K/ha): Omit or apply minimal starter potassium' },
  },
  soilOrganicCarbon: {
    method: 'Walkley and Black rapid titration method (%)',
    unit: '% Organic Carbon (w/w)',
    low: { max: 0.50, description: 'Low biological fertility: Prioritize bulky organic manure (10-15 t/ha) and green manuring' },
    medium: { min: 0.50, max: 0.75, description: 'Medium biological activity: Maintain with regular crop residue retention and compost' },
    high: { min: 0.75, description: 'High organic vitality: Excellent nutrient buffering and microbial activity' },
  },
  soilReactionPh: {
    method: '1:2.5 Soil-Water Suspension Potentiometric pH',
    stronglyAcidic: { max: 5.5, management: 'Liming recommended (Agricultural lime / Dolomite) to alleviate Al/Mn toxicity and fix P' },
    moderatelyAcidic: { min: 5.5, max: 6.5, management: 'Favorable for potatoes and tea; apply rock phosphate or SSP' },
    neutralOptimal: { min: 6.5, max: 7.5, management: 'Ideal agronomic range: Maximum availability of N, P, K, Ca, Mg' },
    moderatelyAlkaline: { min: 7.5, max: 8.5, management: 'Slight micronutrient fixation (Zn, Fe); use gypsum and acidic fertilizers like ammonium sulfate' },
    stronglyAlkalineSodic: { min: 8.5, management: 'Sodicity hazard: Chemical amendment with mineral gypsum based on gypsum requirement test' },
  },
};

// ============================================================================
// 3. COMPLETE AGRONOMIC FERTILIZER DATABASE FOR ALL 16 SUPPORTED CROPS
// ============================================================================

export const CROP_FERTILIZER_DATABASE: FertilizerNutrientRequirement[] = [
  // --------------------------------------------------------------------------
  // 1. RICE / PADDY
  // --------------------------------------------------------------------------
  {
    cropId: 'rice',
    cropName: 'Rice / Paddy (Lowland / Upland)',
    scientificName: 'Oryza sativa',
    botanicalFamily: 'Poaceae (Gramineae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 120,
      phosphorus: 50,
      potassium: 50,
      zinc: 25, // Zinc Sulfate 21% recommended for calcareous/waterlogged soils
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '5.0 - 6.5 tonnes paddy grain/ha (Semi-dwarf High-Yielding Varieties)',
    geographicalApplicability: 'Pan-India irrigated rice ecosystems (Punjab, Haryana, Andhra Pradesh, Tamil Nadu, West Bengal)',
    conditionsAndLimitations: [
      'Applies to transplanted medium-duration (120-135 days) semi-dwarf HYVs under assured irrigation.',
      'For short-duration varieties (100-115 days), reduce nitrogen to 100 kg/ha and apply in 3 splits at 0, 15, and 30 DAT.',
      'Under saline/alkaline soils, increase nitrogen dose by 20% to compensate for volatilization.',
      'Basal nitrogen must be incorporated during final puddling just before transplanting.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (During final puddling before transplanting)',
        timingDaysRange: { min: 0, max: 1 },
        nitrogenPercent: 25,
        phosphorusPercent: 100,
        potassiumPercent: 50,
        applicationMethod: 'Incorporate thoroughly into top 5-8 cm of puddled mud',
        criticalAdvisory: 'Drain excess standing water before application to prevent fertilizer runoff.',
      },
      {
        stage: 'tillering',
        stageDisplayName: 'Active Tillering Stage',
        timingDaysRange: { min: 20, max: 25 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Broadcast Neem-coated Urea evenly across moist field',
        criticalAdvisory: 'Maintain shallow water depth (2-3 cm); avoid deep flooding during top dressing.',
      },
      {
        stage: 'panicle_initiation',
        stageDisplayName: 'Panicle Initiation (PI) Stage',
        timingDaysRange: { min: 40, max: 45 },
        nitrogenPercent: 25,
        phosphorusPercent: 0,
        potassiumPercent: 50,
        applicationMethod: 'Broadcast remaining Urea and MOP',
        criticalAdvisory: 'Crucial for grain count per panicle and test weight; apply before flag leaf emergence.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'fym', 'vermicompost', 'biofertilizer_azospirillum', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Rotted Farmyard Manure (FYM)',
        category: 'bulky_organic',
        recommendedDosePerHectare: '12.5 Tonnes/ha',
        nutrientSupplyExplanation: 'Supplies baseline organic matter, enhances cation exchange capacity and mitigates puddle compaction.',
        timingAndMethod: 'Incorporate 15-20 days prior to nursery puddling.',
      },
      {
        productName: 'In-Situ Green Manuring (Dhaincha / Sesbania aculeata)',
        category: 'green_manure',
        recommendedDosePerHectare: '20 - 25 kg seed/ha',
        nutrientSupplyExplanation: 'Biologically fixes 60-80 kg N/ha and returns 15-20 t/ha green biomass when ploughed in at 45-50 days.',
        timingAndMethod: 'Sow with pre-monsoon showers and incorporate 1 week prior to rice transplanting.',
      },
      {
        productName: 'Azospirillum & PSB Seedling Root Dip',
        category: 'biofertilizer',
        recommendedDosePerHectare: '1 kg each in 40 L water per ha seedlings',
        nutrientSupplyExplanation: 'Associative nitrogen fixation and root exudation stimulation, saving 15-20 kg chemical N/ha.',
        timingAndMethod: 'Dip seedling root bundles for 30 minutes before transplanting.',
        biofertilizerStrain: 'Azospirillum brasilense / Bacillus megaterium',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Rice Research (ICAR-IIRR), Hyderabad',
        publicationTitle: 'Rice Knowledge Management Portal (RKMP) - Nutrient Management Guidelines',
        referenceUrl: 'https://www.icar-iirr.org',
        applicableRegion: 'All-India Irrigated Rice Basins',
        cultivationCondition: 'irrigated',
        yearOrEdition: 'ICAR-IIRR Technical Bulletin 2022',
      },
      {
        institution: 'Tamil Nadu Agricultural University (TNAU)',
        publicationTitle: 'Crop Production Guide - Agriculture: Lowland Irrigated Rice',
        referenceUrl: 'https://agritech.tnau.ac.in/agriculture/agri_crop_paddy_irrigation.html',
        applicableRegion: 'Peninsular India',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. WHEAT
  // --------------------------------------------------------------------------
  {
    cropId: 'wheat',
    cropName: 'Winter / Spring Wheat',
    scientificName: 'Triticum aestivum',
    botanicalFamily: 'Poaceae (Gramineae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 120,
      phosphorus: 60,
      potassium: 40,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '4.8 - 5.5 tonnes grain/ha (Timely sown irrigated varieties like HD 2967, HD 3086, PBW 550)',
    geographicalApplicability: 'Indo-Gangetic Plains (Punjab, Haryana, Western Uttar Pradesh, Rajasthan, Bihar)',
    conditionsAndLimitations: [
      'Applies to timely sown irrigated wheat (sown between November 1 and November 20).',
      'For late-sown wheat (December), reduce nitrogen to 90 kg/ha and P2O5 to 50 kg/ha.',
      'Under light-textured sandy soils, split nitrogen into 3 equal doses (sowing, 1st irrigation, 2nd irrigation).',
      'If following a summer green manure or well-fertilized potato crop, reduce basal nitrogen by 25 kg/ha.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (At sowing time)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 50,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Drill 4-5 cm below seed using seed-cum-fertilizer drill',
        criticalAdvisory: 'Placing DAP below seed promotes rapid crown root development without burning the embryo.',
      },
      {
        stage: 'tillering',
        stageDisplayName: 'Crown Root Initiation (CRI) / First Irrigation',
        timingDaysRange: { min: 21, max: 25 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Broadcast Neem-coated Urea immediately before or after 1st irrigation',
        criticalAdvisory: 'The CRI stage is the most critical moisture and nitrogen-sensitive growth stage in wheat.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'fym', 'biofertilizer_azotobacter', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Decomposed Farmyard Manure (FYM)',
        category: 'bulky_organic',
        recommendedDosePerHectare: '10 - 12 Tonnes/ha',
        nutrientSupplyExplanation: 'Enhances water holding capacity in sandy loam soils and provides sustained micronutrient release.',
        timingAndMethod: 'Apply and mix during pre-sowing tillage 3 weeks before sowing.',
      },
      {
        productName: 'Azotobacter & PSB Seed Treatment',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g each per 10 kg seed (approx 2 kg/ha)',
        nutrientSupplyExplanation: 'Non-symbiotic N-fixation adds 15-20 kg N/ha and solubilizes native soil phosphorus.',
        timingAndMethod: 'Coat seed with jaggery solution and inoculant, dry in shade before machine drilling.',
        biofertilizerStrain: 'Azotobacter chroococcum',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Wheat and Barley Research (ICAR-IIWBR), Karnal',
        publicationTitle: 'Wheat Crop Production Technology & Package of Practices',
        referenceUrl: 'https://iiwbr.icar.gov.in',
        applicableRegion: 'North-Western & North-Eastern Plains Zones of India',
        cultivationCondition: 'irrigated',
        yearOrEdition: 'IIWBR Extension Bulletin 2023',
      },
      {
        institution: 'Punjab Agricultural University (PAU), Ludhiana',
        publicationTitle: 'Package of Practices for Rabi Crops of Punjab: Wheat',
        referenceUrl: 'https://www.pau.edu',
        applicableRegion: 'Punjab & Indo-Gangetic Plains',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. MAIZE
  // --------------------------------------------------------------------------
  {
    cropId: 'maize',
    cropName: 'Maize / Corn',
    scientificName: 'Zea mays',
    botanicalFamily: 'Poaceae (Gramineae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 120,
      phosphorus: 60,
      potassium: 40,
      zinc: 25, // Zinc Sulfate 21%
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '6.0 - 7.5 tonnes grain/ha (Single Cross Hybrid Maize)',
    geographicalApplicability: 'Pan-India maize zones (Karanataka, Telangana, Bihar, Punjab, Madhya Pradesh)',
    conditionsAndLimitations: [
      'Applies to single-cross grain hybrids under assured irrigation. For rainfed composite varieties, reduce to 80:40:20 kg/ha.',
      'Maize is extremely sensitive to waterlogging at early stages; ensure ridge-and-furrow planting.',
      'High zinc responsiveness: apply Zinc Sulfate heptahydrate (25 kg/ha) basally if soil test shows Zn < 0.6 ppm.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (At planting)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 25,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Band placement 5-7 cm away and 5 cm below seed furrow',
        criticalAdvisory: 'Essential for early seedling root establishment and brace root anchoring.',
      },
      {
        stage: 'knee_high',
        stageDisplayName: 'Knee-High Stage (V6 to V8 stage)',
        timingDaysRange: { min: 25, max: 30 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Side-dress Urea 10-12 cm away from plants followed by earthing up',
        criticalAdvisory: 'Peak vegetative uptake period; earthing up covers the fertilizer and protects against lodging.',
      },
      {
        stage: 'flowering',
        stageDisplayName: 'Tasseling / Silking Stage',
        timingDaysRange: { min: 45, max: 50 },
        nitrogenPercent: 25,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Side-dress Urea before final pre-flowering irrigation',
        criticalAdvisory: 'Determines kernel set and cob length; do not delay past silking.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'fym', 'vermicompost', 'biofertilizer_azotobacter', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Enriched Farmyard Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '12.5 Tonnes/ha',
        nutrientSupplyExplanation: 'Provides long-term organic carbon and buffers fertilizer salts in root zone.',
        timingAndMethod: 'Broadcast and disk into topsoil 2-3 weeks before bed planting.',
      },
      {
        productName: 'Azotobacter / Azospirillum + PSB Inoculation',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g each per 10 kg hybrid seed',
        nutrientSupplyExplanation: 'Stimulates root elongation and enhances phosphorus bioavailability in neutral soils.',
        timingAndMethod: 'Seed coating with jaggery gum slurry.',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Maize Research (ICAR-IIMR), Ludhiana',
        publicationTitle: 'Maize Production Technologies in India',
        referenceUrl: 'https://iimr.icar.gov.in',
        applicableRegion: 'All Maize Production Zones of India',
        cultivationCondition: 'irrigated',
        yearOrEdition: 'ICAR-IIMR Technical Series 2022',
      },
      {
        institution: 'Tamil Nadu Agricultural University (TNAU)',
        publicationTitle: 'TNAU Agritech Portal: Millets - Hybrid Maize',
        referenceUrl: 'https://agritech.tnau.ac.in/agriculture/agri_crop_maize.html',
        applicableRegion: 'Peninsular India',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 4. PEARL MILLET (BAJRA)
  // --------------------------------------------------------------------------
  {
    cropId: 'pearl_millet',
    cropName: 'Pearl Millet (Bajra)',
    scientificName: 'Pennisetum glaucum',
    botanicalFamily: 'Poaceae (Gramineae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 80,
      phosphorus: 40,
      potassium: 40,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '3.0 - 4.0 tonnes grain/ha (Irrigated / High-Rainfall Hybrid Bajra)',
    geographicalApplicability: 'Semi-arid and arid zones (Rajasthan, Gujarat, Haryana, Maharashtra, Uttar Pradesh)',
    conditionsAndLimitations: [
      'Values apply to high-yielding hybrids under irrigated or assured rainfall conditions (>450 mm).',
      'For rainfed / arid conditions (<350 mm rainfall), reduce RDF to 40 kg N and 20 kg P2O5 per ha, with zero K unless soil is critically low.',
      'High salt tolerance; well-suited to light sandy and alluvial soils.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (At sowing)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 50,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Drill 3-5 cm below seed row',
        criticalAdvisory: 'In dry soils, ensure fertilizer does not contact seeds directly.',
      },
      {
        stage: 'tillering',
        stageDisplayName: 'Tillering Stage (After first weeding)',
        timingDaysRange: { min: 25, max: 30 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Top-dress Neem-coated Urea when soil has adequate moisture',
        criticalAdvisory: 'Crucial for productive tiller survival; do not apply if severe drought stress occurs.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'ssp', 'fym', 'biofertilizer_azospirillum', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Farmyard Manure (FYM)',
        category: 'bulky_organic',
        recommendedDosePerHectare: '5.0 - 7.5 Tonnes/ha',
        nutrientSupplyExplanation: 'Critical for sandy desert soils to increase water holding capacity and reduce rapid nutrient percolation.',
        timingAndMethod: 'Incorporate 2 weeks prior to sowing during summer tillage.',
      },
      {
        productName: 'Azospirillum Seed Inoculation',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g / 4 kg bajra seed',
        nutrientSupplyExplanation: 'Colonizes millet root cortex, synthesizing drought-mitigating osmoprotectants and fixing associative N.',
        timingAndMethod: 'Slurry seed dressing.',
        biofertilizerStrain: 'Azospirillum lipoferum',
      },
    ],
    sources: [
      {
        institution: 'ICAR - All India Coordinated Research Project on Pearl Millet (AICRPPM), Jodhpur',
        publicationTitle: 'Package of Practices for Increasing Pearl Millet Production in India',
        referenceUrl: 'https://aicrp.icar.gov.in/pearlmillet',
        applicableRegion: 'Arid & Semi-Arid Pearl Millet Belt',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. GRAIN SORGHUM (JOWAR)
  // --------------------------------------------------------------------------
  {
    cropId: 'sorghum',
    cropName: 'Grain Sorghum (Jowar)',
    scientificName: 'Sorghum bicolor',
    botanicalFamily: 'Poaceae (Gramineae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 80,
      phosphorus: 40,
      potassium: 40,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '3.5 - 4.5 tonnes grain/ha (Kharif / Rabi Hybrids under protective irrigation)',
    geographicalApplicability: 'Deccan Plateau Vertisol zones (Maharashtra, Karnataka, Andhra Pradesh, Madhya Pradesh)',
    conditionsAndLimitations: [
      'Applies to high-yielding hybrid sorghum under irrigated or assured moisture conditions.',
      'For dryland rainfed rabi sorghum on deep black soils, recommended dose is 50 kg N and 25 kg P2O5 per ha, applied 100% basal at sowing.',
      'Sorgoleone root exudates suppress weeds but require 2-3 weeks aeration rest before sensitive follow-up crops.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (At sowing)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 50,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Deep placement (5-7 cm below seed)',
        criticalAdvisory: 'Deep placement in heavy Vertisols prevents ammonium volatilization.',
      },
      {
        stage: 'early_vegetative',
        stageDisplayName: 'Knee-High Stage (30-35 DAS)',
        timingDaysRange: { min: 30, max: 35 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Side-dress Urea followed by hoeing/inter-cultivation',
        criticalAdvisory: 'Apply during inter-row cultivation to incorporate fertilizer and mulch soil cracks.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'ssp', 'fym', 'biofertilizer_azospirillum', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Rotted Cattle Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '8.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Improves soil porosity and moisture retention in swelling/shrinking black soils.',
        timingAndMethod: 'Mix during pre-monsoon preparatory cultivation.',
      },
      {
        productName: 'Azospirillum + PSB Seed Treatment',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g each per 8 kg seed',
        nutrientSupplyExplanation: 'Aids root branching and solubilization of fixed phosphorus in high-pH Vertisols.',
        timingAndMethod: 'Standard seed dressing.',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Millets Research (ICAR-IIMR), Hyderabad',
        publicationTitle: 'Millets Production Manual & Agronomic Guidelines',
        referenceUrl: 'https://millets.res.in',
        applicableRegion: 'Central & Southern Sorghum Zones',
        cultivationCondition: 'irrigated',
      },
      {
        institution: 'University of Agricultural Sciences (UAS), Dharwad',
        publicationTitle: 'Package of Practices for Agricultural Crops: Kharif & Rabi Sorghum',
        referenceUrl: 'https://uasd.edu',
        applicableRegion: 'Northern Karnataka & Deccan Vertisols',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. SOYBEAN
  // --------------------------------------------------------------------------
  {
    cropId: 'soybean',
    cropName: 'Soybean',
    scientificName: 'Glycine max',
    botanicalFamily: 'Fabaceae (Leguminosae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 25,     // Starter nitrogen only!
      phosphorus: 60,   // High phosphorus requirement for root nodule ATP energy
      potassium: 40,
      sulfur: 20,       // Essential for methionine and cysteine amino acid synthesis
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '2.5 - 3.2 tonnes seed/ha',
    geographicalApplicability: 'Central and Peninsular India (Madhya Pradesh, Maharashtra, Rajasthan, Karnataka)',
    conditionsAndLimitations: [
      'CRITICAL: Nitrogen dose (20-30 kg/ha) is strictly a STARTER DOSE to nourish seedlings before root nodules form.',
      'Applying excess nitrogen (>40 kg/ha) inhibits Rhizobium nodulation and shuts down biological nitrogen fixation.',
      'Single Super Phosphate (SSP) is preferred over DAP because it provides 11% Sulfur naturally.',
      'If using DAP, apply 20 kg elemental Sulfur or 100 kg Gypsum/ha separately.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: '100% Basal at Sowing',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 100,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Drill 5 cm below and to the side of seed furrow',
        criticalAdvisory: 'All nutrients must be applied basally; top-dressing nitrogen is strictly discouraged.',
      },
    ],
    suitableFertilizerProductIds: ['ssp', 'mop', 'dap', 'neem_coated_urea', 'gypsum', 'fym', 'biofertilizer_rhizobium', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Bradyrhizobium japonicum Seed Inoculant',
        category: 'biofertilizer',
        recommendedDosePerHectare: '400 g / 75 kg soybean seed (approx 2 packets)',
        nutrientSupplyExplanation: 'Forms pink active nodules that biologically fix 60-100 kg atmospheric N/ha.',
        timingAndMethod: 'Treat seeds with gum slurry; dry in shade 1 hour before sowing.',
        biofertilizerStrain: 'Bradyrhizobium japonicum (strain SB-16 or USDA-110)',
      },
      {
        productName: 'Well-Decomposed Compost / FYM',
        category: 'bulky_organic',
        recommendedDosePerHectare: '5.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Stimulates native rhizosphere soil bacteria and improves moisture conservation.',
        timingAndMethod: 'Incorporate during summer deep ploughing.',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Soybean Research (ICAR-IISR), Indore',
        publicationTitle: 'Package of Practices for Soybean Cultivation in Central India',
        referenceUrl: 'https://iisrindore.icar.gov.in',
        applicableRegion: 'Central India Soybean Belt',
        cultivationCondition: 'irrigated',
        yearOrEdition: 'ICAR-IISR Technical Bulletin No. 45',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 7. CHICKPEA (GRAM)
  // --------------------------------------------------------------------------
  {
    cropId: 'chickpea',
    cropName: 'Chickpea (Bengal Gram / Chana)',
    scientificName: 'Cicer arietinum',
    botanicalFamily: 'Fabaceae (Leguminosae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 20,     // Starter dose only
      phosphorus: 40,   // Crucial for nodule mass and deep root growth
      potassium: 20,
      sulfur: 20,       // Promotes protein synthesis
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '2.0 - 2.8 tonnes grain/ha (Desi & Kabuli varieties)',
    geographicalApplicability: 'Madhya Pradesh, Rajasthan, Maharashtra, Uttar Pradesh, Karnataka',
    conditionsAndLimitations: [
      'Nitrogen application is restricted to 20 kg/ha as starter dose; nodulating Mesorhizobium ciceri supplies 70-80% of crop requirement.',
      'Phosphorus is the primary limiting nutrient; band placement below seed is mandatory to prevent fixation.',
      'Avoid high nitrogen which stimulates excessive vegetative foliage and increases Ascochyta blight/Botrytis grey mould vulnerability.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: '100% Basal at Sowing',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 100,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Deep drill 7-10 cm below soil surface ahead of seed',
        criticalAdvisory: 'Deep placement ensures fertilizer is in the moist sub-surface soil horizon during dry winter.',
      },
    ],
    suitableFertilizerProductIds: ['ssp', 'dap', 'mop', 'neem_coated_urea', 'fym', 'biofertilizer_rhizobium', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Mesorhizobium ciceri Bacterial Culture',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g / 10 kg seed (approx 1.5 kg/ha seed requirement)',
        nutrientSupplyExplanation: 'Fixes 35-60 kg N/ha, leaving residual nitrogen for following summer or kharif crops.',
        timingAndMethod: 'Seed coating with 10% jaggery syrup.',
        biofertilizerStrain: 'Mesorhizobium ciceri',
      },
      {
        productName: 'Phosphate Solubilizing Bacteria (PSB)',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g / 10 kg seed',
        nutrientSupplyExplanation: 'Secretes organic acids that dissolve calcium-bound phosphorus in neutral to alkaline soils.',
        timingAndMethod: 'Apply simultaneously with Rhizobium as seed dressing.',
        biofertilizerStrain: 'Pseudomonas striata',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Pulses Research (ICAR-IIPR), Kanpur',
        publicationTitle: 'Pulse Production Technologies: Chickpea',
        referenceUrl: 'https://iipr.icar.gov.in',
        applicableRegion: 'North, Central & South Pulse Zones',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 8. GROUNDNUT (PEANUT)
  // --------------------------------------------------------------------------
  {
    cropId: 'groundnut',
    cropName: 'Groundnut (Peanut)',
    scientificName: 'Arachis hypogaea',
    botanicalFamily: 'Fabaceae (Leguminosae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 25,
      phosphorus: 50,
      potassium: 75,   // High potassium requirement for lipid synthesis and kernel filling
      sulfur: 25,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '2.8 - 3.5 tonnes pod/ha (Irrigated bunch / semi-spreading varieties)',
    geographicalApplicability: 'Gujarat (Saurashtra), Andhra Pradesh, Tamil Nadu, Karnataka, Rajasthan',
    conditionsAndLimitations: [
      'Applies to irrigated summer/kharif groundnut. Under strictly rainfed dryland, reduce to 15:30:45 kg/ha.',
      'SPECIAL REQUIREMENT: Gypsum (Calcium Sulfate) @ 400 kg/ha is MANDATORY at 40-45 DAS (pegging stage).',
      'Calcium is immobile in the plant and cannot move from roots to developing underground pods; pods directly absorb calcium from the surrounding top 5 cm of soil. Without calcium, pods remain empty ("pops").',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal Application at Sowing',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 100,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Broadcast and disk into topsoil before furrow opening',
        criticalAdvisory: 'SSP is strongly preferred as phosphorus source to satisfy early sulfur requirements.',
      },
      {
        stage: 'pegging',
        stageDisplayName: 'Pegging / Early Pod Initiation (Gypsum Application)',
        timingDaysRange: { min: 40, max: 45 },
        nitrogenPercent: 0,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Broadcast 400 kg Gypsum/ha close to base of plants and incorporate with hand weeding',
        criticalAdvisory: 'Mandatory calcium supply for shell hardening and oil percentage. Do not disturb soil after peg penetration.',
      },
    ],
    suitableFertilizerProductIds: ['ssp', 'mop', 'gypsum', 'dap', 'neem_coated_urea', 'fym', 'biofertilizer_rhizobium', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Decomposed Farmyard Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '10.0 - 12.5 Tonnes/ha',
        nutrientSupplyExplanation: 'Maintains soil friability in upper 10 cm, enabling easy peg penetration into the soil.',
        timingAndMethod: 'Incorporate during final land preparation.',
      },
      {
        productName: 'Rhizobium (Groundnut specific strain)',
        category: 'biofertilizer',
        recommendedDosePerHectare: '500 g / 100 kg kernels',
        nutrientSupplyExplanation: 'Effective nodulation fixes 40-70 kg N/ha.',
        timingAndMethod: 'Gentle seed treatment taking care not to detach kernel seed coats.',
        biofertilizerStrain: 'Rhizobium strain NC-92 / TAL-1000',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Directorate of Groundnut Research (ICAR-DGR), Junagadh',
        publicationTitle: 'Groundnut Cultivation Technology & Package of Practices',
        referenceUrl: 'https://dgr.icar.gov.in',
        applicableRegion: 'Western and Peninsular Groundnut Zones',
        cultivationCondition: 'irrigated',
      },
      {
        institution: 'Tamil Nadu Agricultural University (TNAU)',
        publicationTitle: 'TNAU Agritech Portal: Oilseeds - Groundnut',
        referenceUrl: 'https://agritech.tnau.ac.in/agriculture/agri_crop_oilseeds_groundnut.html',
        applicableRegion: 'Peninsular India',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 9. GREEN PEAS
  // --------------------------------------------------------------------------
  {
    cropId: 'green_peas',
    cropName: 'Green Peas / Garden Peas',
    scientificName: 'Pisum sativum',
    botanicalFamily: 'Fabaceae (Leguminosae)',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 30,     // Starter nitrogen
      phosphorus: 60,   // High phosphorus for flowering and pod set
      potassium: 40,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '8.0 - 10.0 tonnes green pods/ha (Early to main season varieties like Arkel, Azad P-1, GS-10)',
    geographicalApplicability: 'Cool-season irrigated vegetable zones (Punjab, Himachal Pradesh, Uttar Pradesh, Bihar)',
    conditionsAndLimitations: [
      'Vegetable peas require 30 kg N/ha as starter dose because the rapid 60-80 day cycle requires immediate nutrient availability before full nodule maturation.',
      'Phosphorus is placed in bands 5 cm below seed to accelerate root development in cool winter soils.',
      'Sensitive to soil salinity and waterlogging; prefers well-drained loamy soils.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: '100% Basal at Sowing',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 100,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Band placement 4-5 cm below seed furrow',
        criticalAdvisory: 'Band placement prevents phosphorus fixation in cool winter soils.',
      },
    ],
    suitableFertilizerProductIds: ['ssp', 'dap', 'mop', 'neem_coated_urea', 'fym', 'biofertilizer_rhizobium', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Rotted Farmyard Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '15.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Enhances seedling emergence and buffers against sudden winter temperature drops.',
        timingAndMethod: 'Incorporate 3 weeks before seedbed preparation.',
      },
      {
        productName: 'Rhizobium leguminosarum Seed Treatment',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g / 10 kg seed',
        nutrientSupplyExplanation: 'Rapid nodulation establishes active nitrogen fixation within 18 days of germination.',
        timingAndMethod: 'Seed coating with jaggery solution.',
        biofertilizerStrain: 'Rhizobium leguminosarum bv. viciae',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Vegetable Research (ICAR-IIVR), Varanasi',
        publicationTitle: 'Vegetable Production Technologies - Garden Pea',
        referenceUrl: 'https://iivr.icar.gov.in',
        applicableRegion: 'Sub-tropical & temperate vegetable zones',
        cultivationCondition: 'irrigated',
      },
      {
        institution: 'Punjab Agricultural University (PAU), Ludhiana',
        publicationTitle: 'Package of Practices for Vegetable Crops: Garden Peas',
        referenceUrl: 'https://www.pau.edu',
        applicableRegion: 'North-Western India',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 10. COTTON
  // --------------------------------------------------------------------------
  {
    cropId: 'cotton',
    cropName: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    botanicalFamily: 'Malvaceae',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 120,
      phosphorus: 60,
      potassium: 60,
      sulfur: 20,
      zinc: 25,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '2.5 - 3.5 tonnes seed cotton (kapas)/ha (Bt / Hybrid Cotton)',
    geographicalApplicability: 'Gujarat, Maharashtra, Telangana, Punjab, Haryana, Rajasthan',
    conditionsAndLimitations: [
      'Applies to Bt / Hybrid cotton grown under assured irrigation or high-rainfall Vertisols.',
      'Under rainfed central zone conditions, nitrogen is reduced to 80-90 kg/ha in 2 splits.',
      'Potassium is critical during boll development to prevent "red leaf disease" and premature senescence.',
      'Avoid late nitrogen application after 90 days to prevent excessive vegetative rank growth and pest flare-ups.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (At sowing or thinning)',
        timingDaysRange: { min: 0, max: 15 },
        nitrogenPercent: 25,
        phosphorusPercent: 100,
        potassiumPercent: 50,
        applicationMethod: 'Deep spot placement 7-10 cm away from plant row',
        criticalAdvisory: 'Full phosphorus applied basally to promote deep taproot elongation.',
      },
      {
        stage: 'square_formation',
        stageDisplayName: 'Square Formation Stage (Peak vegetative development)',
        timingDaysRange: { min: 40, max: 45 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Ring placement around plants followed by earthing up and irrigation',
        criticalAdvisory: 'Peak nitrogen requirement phase; earthing up covers fertilizer and supports heavy branching.',
      },
      {
        stage: 'flowering',
        stageDisplayName: 'Flowering & Early Boll Development Stage',
        timingDaysRange: { min: 70, max: 75 },
        nitrogenPercent: 25,
        phosphorusPercent: 0,
        potassiumPercent: 50,
        applicationMethod: 'Side-dress remaining Urea and MOP into moist soil',
        criticalAdvisory: 'Potassium supports boll filling and fiber strength. Do not apply nitrogen past 90 DAS.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'ssp', 'fym', 'vermicompost', 'biofertilizer_azotobacter', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Rotted Farmyard Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '10.0 - 12.5 Tonnes/ha',
        nutrientSupplyExplanation: 'Enhances water retention in deep black Vertisols and minimizes soil cracking.',
        timingAndMethod: 'Broadcast and disk into soil 1 month prior to bed preparation.',
      },
      {
        productName: 'Azotobacter Seed & Soil Inoculation',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g / 10 kg seed + 2.5 kg/ha in compost',
        nutrientSupplyExplanation: 'Supplies biological nitrogen and promotes indole acetic acid (IAA) root stimulation.',
        timingAndMethod: 'Seed dressing followed by soil broadcast mixed with compost.',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Central Institute for Cotton Research (ICAR-CICR), Nagpur',
        publicationTitle: 'Package of Practices for Cotton Cultivation in India',
        referenceUrl: 'https://cicr.icar.gov.in',
        applicableRegion: 'Central & Southern Cotton Belts',
        cultivationCondition: 'irrigated',
      },
      {
        institution: 'Punjab Agricultural University (PAU), Ludhiana',
        publicationTitle: 'PAU Package of Practices for Kharif Crops: Cotton',
        referenceUrl: 'https://www.pau.edu',
        applicableRegion: 'North-Western Cotton Zone',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 11. TOMATO
  // --------------------------------------------------------------------------
  {
    cropId: 'tomato',
    cropName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    botanicalFamily: 'Solanaceae',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 150,
      phosphorus: 100,
      potassium: 100,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '60 - 80 tonnes fresh fruit/ha (Determinate & Indeterminate Hybrids)',
    geographicalApplicability: 'Pan-India vegetable clusters (Karnataka, Andhra Pradesh, Maharashtra, Madhya Pradesh, Punjab)',
    conditionsAndLimitations: [
      'Applies to commercial hybrid tomato under furrow/drip irrigation with staking.',
      'Potassium is essential for fruit firmness, lycopene pigmentation, and reduction of cracking.',
      'Calcium deficiency in low-pH soils causes Blossom End Rot (BER); foliar calcium chloride (0.5%) or gypsum application is recommended where calcium is deficient.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (During final bed preparation / transplanting)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 33,
        phosphorusPercent: 100,
        potassiumPercent: 50,
        applicationMethod: 'Incorporate into raised planting beds 10 cm deep',
        criticalAdvisory: 'Ensures immediate phosphorus access for developing root system.',
      },
      {
        stage: 'early_vegetative',
        stageDisplayName: 'Active Vegetative & Early Flower Cluster Stage',
        timingDaysRange: { min: 30, max: 35 },
        nitrogenPercent: 33,
        phosphorusPercent: 0,
        potassiumPercent: 25,
        applicationMethod: 'Side-dress in furrow 15 cm from stem followed by earthing up',
        criticalAdvisory: 'Supports heavy lateral branching and strong floral trusses.',
      },
      {
        stage: 'flowering',
        stageDisplayName: 'Peak Fruit Setting & Development Stage',
        timingDaysRange: { min: 50, max: 60 },
        nitrogenPercent: 34,
        phosphorusPercent: 0,
        potassiumPercent: 25,
        applicationMethod: 'Side-dress into moist soil between irrigations',
        criticalAdvisory: 'Potassium drives fruit sizing and brix (sugar) accumulation.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'fym', 'vermicompost', 'biofertilizer_azospirillum', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Decomposed Farmyard Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '25.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Essential for maintaining soil moisture buffer and microbial population in high-input vegetable beds.',
        timingAndMethod: 'Broadcast and rotavator-mixed 1 month prior to transplanting.',
      },
      {
        productName: 'Enriched Vermicompost',
        category: 'concentrated_organic',
        recommendedDosePerHectare: '5.0 Tonnes/ha',
        nutrientSupplyExplanation: 'High humic acid content enhances micronutrient absorption and root vigor.',
        timingAndMethod: 'Apply in planting furrows along with basal fertilizers.',
      },
      {
        productName: 'Azospirillum & PSB Seedling Dip',
        category: 'biofertilizer',
        recommendedDosePerHectare: '1 kg each per ha seedlings in 40 L water',
        nutrientSupplyExplanation: 'Stimulates root proliferation and reduces transplanting shock.',
        timingAndMethod: 'Dip roots for 30 minutes prior to planting.',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Horticultural Research (ICAR-IIHR), Bengaluru',
        publicationTitle: 'Package of Practices for Commercial Horticultural Crops: Tomato',
        referenceUrl: 'https://iihr.res.in',
        applicableRegion: 'Peninsular & Central Horticultural Belts',
        cultivationCondition: 'irrigated',
      },
      {
        institution: 'Tamil Nadu Agricultural University (TNAU)',
        publicationTitle: 'TNAU Agritech Portal: Horticulture - Hybrid Tomato',
        referenceUrl: 'https://agritech.tnau.ac.in/horticulture/horti_vegetables_tomato.html',
        applicableRegion: 'Peninsular India',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 12. POTATO
  // --------------------------------------------------------------------------
  {
    cropId: 'potato',
    cropName: 'Potato',
    scientificName: 'Solanum tuberosum',
    botanicalFamily: 'Solanaceae',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 180,
      phosphorus: 100,
      potassium: 120,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '30 - 40 tonnes tubers/ha (Table varieties like Kufri Pukhraj, Kufri Jyoti, Kufri Chipsona)',
    geographicalApplicability: 'Indo-Gangetic Plains (Uttar Pradesh, West Bengal, Punjab, Bihar) & Plateau zones',
    conditionsAndLimitations: [
      'Applies to autumn/winter main crop potato in northern and eastern plains.',
      'For processing varieties (e.g. Chipsona), Potassium Sulfate (SOP) is preferred over MOP to ensure high specific gravity and low reducing sugars.',
      'Potato is a heavy feeder with shallow, inefficient root systems (0-40 cm), demanding high nutrient concentrations in the ridge zone.',
      'All nitrogen must be supplied by earthing-up (30-35 DAS); late nitrogen application delays tuber maturity and increases foliage blight.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (Furrow placement at planting)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 50,
        phosphorusPercent: 100,
        potassiumPercent: 50,
        applicationMethod: 'Furrow band placement 5 cm below seed tubers',
        criticalAdvisory: 'Avoid direct contact with cut seed pieces to prevent bacterial rot.',
      },
      {
        stage: 'tuber_initiation_earthing_up',
        stageDisplayName: 'Earthing-Up / Tuber Initiation (30-35 DAS)',
        timingDaysRange: { min: 30, max: 35 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 50,
        applicationMethod: 'Side-dress along sides of ridges immediately followed by earthing up and irrigation',
        criticalAdvisory: 'Final fertilizer application; covers stolons and prevents greening of swelling tubers.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'fym', 'vermicompost', 'biofertilizer_azotobacter', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Rotted Farmyard Manure (FYM)',
        category: 'bulky_organic',
        recommendedDosePerHectare: '25.0 - 30.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Critical for loosening soil aggregate structure, allowing smooth, uninhibited tuber expansion.',
        timingAndMethod: 'Incorporate 1 month before ridge making.',
      },
      {
        productName: 'Azotobacter & PSB Tuber Dip / Treatment',
        category: 'biofertilizer',
        recommendedDosePerHectare: '1 kg each in 100 L water for 2.5 t seed tubers',
        nutrientSupplyExplanation: 'Colonizes stolons and aids phosphorus solubilization in the compact potato ridge.',
        timingAndMethod: 'Dip sprouted seed tubers for 15 minutes and dry in shade before planting.',
        biofertilizerStrain: 'Azotobacter chroococcum',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Central Potato Research Institute (ICAR-CPRI), Shimla',
        publicationTitle: 'Package of Practices for Potato Cultivation in Indo-Gangetic Plains',
        referenceUrl: 'https://cpri.icar.gov.in',
        applicableRegion: 'Indo-Gangetic Plains & Plateau Zones',
        cultivationCondition: 'irrigated',
        yearOrEdition: 'ICAR-CPRI Technical Manual 2022',
      },
      {
        institution: 'Punjab Agricultural University (PAU), Ludhiana',
        publicationTitle: 'PAU Package of Practices for Vegetable Crops: Potato',
        referenceUrl: 'https://www.pau.edu',
        applicableRegion: 'North-Western Plains',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 13. CARROT
  // --------------------------------------------------------------------------
  {
    cropId: 'carrot',
    cropName: 'Carrot & Root Crops',
    scientificName: 'Daucus carota',
    botanicalFamily: 'Apiaceae',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 60,     // Moderate nitrogen to prevent root splitting/forking
      phosphorus: 50,
      potassium: 80,    // High potassium for root length, carotene content, and crispness
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '25 - 35 tonnes roots/ha (Asian & European varieties)',
    geographicalApplicability: 'Cool-season vegetable zones (Punjab, Haryana, Uttar Pradesh, Tamil Nadu - Nilgiris)',
    conditionsAndLimitations: [
      'CRITICAL QUALITY LIMITATION: Excessive nitrogen (>80 kg/ha) or un-decomposed fresh dung causes severe root forking, hairiness, splitting, and reduced core sugar.',
      'High potassium is necessary to ensure deep vertical elongation, smooth skin, and high carotene synthesis.',
      'Requires deep, friable, stone-free sandy loam soil worked down to 30 cm depth.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (During final bed preparation)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 50,
        phosphorusPercent: 100,
        potassiumPercent: 50,
        applicationMethod: 'Broadcast and thoroughly disk into raised beds',
        criticalAdvisory: 'Ensure even distribution; fertilizer hot-spots cause crooked roots.',
      },
      {
        stage: 'early_vegetative',
        stageDisplayName: 'Active Root Elongation Stage (30-35 DAS)',
        timingDaysRange: { min: 30, max: 35 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 50,
        applicationMethod: 'Side-dress along bed edges followed by light hoeing and irrigation',
        criticalAdvisory: 'Apply after thinning plants to 6-8 cm spacing.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'ssp', 'mop', 'dap', 'fym', 'biofertilizer_azotobacter', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Fully-Decomposed Well-Rotted FYM / Compost',
        category: 'bulky_organic',
        recommendedDosePerHectare: '20.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Must be completely decomposed and passed through a screen to eliminate woody chunks that fork taproots.',
        timingAndMethod: 'Apply 1-2 months before bed raising during summer tillage.',
      },
      {
        productName: 'Azotobacter Seed Treatment',
        category: 'biofertilizer',
        recommendedDosePerHectare: '200 g / 5 kg carrot seed',
        nutrientSupplyExplanation: 'Improves early radicle emergence and reduces synthetic nitrogen demand.',
        timingAndMethod: 'Seed coating with jaggery gum slurry.',
      },
    ],
    sources: [
      {
        institution: 'Tamil Nadu Agricultural University (TNAU)',
        publicationTitle: 'TNAU Agritech Portal: Horticulture - Carrot',
        referenceUrl: 'https://agritech.tnau.ac.in/horticulture/horti_vegetables_carrot.html',
        applicableRegion: 'Plains & Hilly Vegetable Tracts',
        cultivationCondition: 'irrigated',
      },
      {
        institution: 'Punjab Agricultural University (PAU), Ludhiana',
        publicationTitle: 'Package of Practices for Vegetable Crops: Carrot',
        referenceUrl: 'https://www.pau.edu',
        applicableRegion: 'North-Western India',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 14. CABBAGE
  // --------------------------------------------------------------------------
  {
    cropId: 'cabbage',
    cropName: 'Cabbage & Brassica Greens',
    scientificName: 'Brassica oleracea var. capitata',
    botanicalFamily: 'Brassicaceae',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 150,
      phosphorus: 80,
      potassium: 80,
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '40 - 55 tonnes heads/ha (Commercial F1 Hybrids)',
    geographicalApplicability: 'Pan-India cool-season vegetable tracts (West Bengal, Bihar, Karnataka, Odisha, Punjab)',
    conditionsAndLimitations: [
      'Applies to transplanted hybrid cabbage under assured irrigation.',
      'Cabbage is a heavy nitrogen and potassium feeder; nitrogen drives broad vegetative wrapper leaves while potassium ensures dense head compacting.',
      'Clubroot disease (Plasmodiophora brassicae) proliferates in acidic soils; maintain soil pH > 6.5 through liming if soil is acidic.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (During final bed preparation / transplanting)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 50,
        phosphorusPercent: 100,
        potassiumPercent: 50,
        applicationMethod: 'Band placement in ridges or furrows before planting',
        criticalAdvisory: 'Incorporation prevents ammonia volatilization.',
      },
      {
        stage: 'early_vegetative',
        stageDisplayName: 'Head Formation / Cupping Stage (30-45 DAT)',
        timingDaysRange: { min: 30, max: 45 },
        nitrogenPercent: 50,
        phosphorusPercent: 0,
        potassiumPercent: 50,
        applicationMethod: 'Side-dress along plant rows followed by earthing up and irrigation',
        criticalAdvisory: 'Essential for solid head compactness; avoid broadcasting directly into developing head centers.',
      },
    ],
    suitableFertilizerProductIds: ['neem_coated_urea', 'dap', 'mop', 'fym', 'vermicompost', 'biofertilizer_azospirillum', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Rotted Farmyard Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '25.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Enhances water holding capacity and supplies micronutrients (boron, molybdenum) essential to Brassicas.',
        timingAndMethod: 'Mix into soil 3 weeks before transplanting.',
      },
      {
        productName: 'Azospirillum & PSB Seedling Root Dip',
        category: 'biofertilizer',
        recommendedDosePerHectare: '1 kg each per ha seedlings in 40 L water',
        nutrientSupplyExplanation: 'Promotes rapid root anchoring and reduces transplanting shock.',
        timingAndMethod: 'Dip seedling roots for 30 minutes before transplanting.',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Indian Institute of Vegetable Research (ICAR-IIVR), Varanasi',
        publicationTitle: 'Package of Practices for Cole Crops: Cabbage',
        referenceUrl: 'https://iivr.icar.gov.in',
        applicableRegion: 'Sub-tropical Vegetable Zones',
        cultivationCondition: 'irrigated',
      },
      {
        institution: 'Tamil Nadu Agricultural University (TNAU)',
        publicationTitle: 'TNAU Agritech Portal: Vegetables - Cabbage',
        referenceUrl: 'https://agritech.tnau.ac.in/horticulture/horti_vegetables_cabbage.html',
        applicableRegion: 'Peninsular India',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 15. ONION
  // --------------------------------------------------------------------------
  {
    cropId: 'onion',
    cropName: 'Onion & Alliums',
    scientificName: 'Allium cepa',
    botanicalFamily: 'Alliaceae',
    recommendationStatus: 'verified',
    baselineRdfKgHa: {
      nitrogen: 100,
      phosphorus: 50,
      potassium: 60,
      sulfur: 30, // Sulfur is essential for pyruvic acid and pungent allicin oil synthesis
    },
    cultivationCondition: 'irrigated',
    targetYieldBenchmark: '25 - 35 tonnes bulbs/ha (Rabi & Kharif varieties like Bhima Super, N-53, Agrifound Dark Red)',
    geographicalApplicability: 'Maharashtra (Nashik belt), Madhya Pradesh, Karnataka, Gujarat, Rajasthan, Bihar',
    conditionsAndLimitations: [
      'CRITICAL TIMING RULE: All nitrogen must be completed by 45-60 DAT (before bulb enlargement begins).',
      'Late application of nitrogen induces "thick neck" (bull necks), splitting, and severe bulb rotting during storage.',
      'Sulfur application (30-40 kg S/ha via SSP or elemental sulfur) is essential for bulb pungency, storage longevity, and resistance to purple blotch.',
      'Shallow adventitious root system (15-25 cm) requires nutrients in the uppermost soil layer.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (During final bed preparation / transplanting)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 50,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Incorporate into raised planting beds before seedling transplanting',
        criticalAdvisory: 'SSP is strongly preferred to meet the 30 kg Sulfur requirement.',
      },
      {
        stage: 'early_vegetative',
        stageDisplayName: 'Active Foliage Growth Stage (30 DAT)',
        timingDaysRange: { min: 30, max: 30 },
        nitrogenPercent: 25,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Broadcast Neem-coated Urea followed by light hoeing and irrigation',
        criticalAdvisory: 'Drives leaf count; every healthy leaf translates to one bulb scale ring.',
      },
      {
        stage: 'bulb_development',
        stageDisplayName: 'Bulb Initiation Stage (45 DAT)',
        timingDaysRange: { min: 45, max: 45 },
        nitrogenPercent: 25,
        phosphorusPercent: 0,
        potassiumPercent: 0,
        applicationMethod: 'Final broadcast of Urea before bulb enlargement',
        criticalAdvisory: 'ABSOLUTE CUTOFF: Do not apply any nitrogen after 60 DAT to prevent thick necks and storage rot.',
      },
    ],
    suitableFertilizerProductIds: ['ssp', 'mop', 'neem_coated_urea', 'dap', 'fym', 'vermicompost', 'biofertilizer_azospirillum', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Well-Decomposed Farmyard Manure',
        category: 'bulky_organic',
        recommendedDosePerHectare: '20.0 Tonnes/ha',
        nutrientSupplyExplanation: 'Buffers soil moisture in the shallow 20 cm root zone and prevents soil surface crusting.',
        timingAndMethod: 'Mix into soil during final ploughing 1 month before transplanting.',
      },
      {
        productName: 'Vermicompost + PSB Application',
        category: 'concentrated_organic',
        recommendedDosePerHectare: '5.0 Tonnes/ha vermicompost + 5 kg PSB',
        nutrientSupplyExplanation: 'Stimulates root surface area and enhances phosphorus absorption without chemical salt stress.',
        timingAndMethod: 'Apply in beds at transplanting.',
      },
    ],
    sources: [
      {
        institution: 'ICAR - Directorate of Onion and Garlic Research (ICAR-DOGR), Rajgurunagar, Pune',
        publicationTitle: 'Package of Practices for Onion Cultivation in India',
        referenceUrl: 'https://dogr.icar.gov.in',
        applicableRegion: 'Central & Western Onion Belts',
        cultivationCondition: 'irrigated',
        yearOrEdition: 'ICAR-DOGR Technical Bulletin No. 22',
      },
      {
        institution: 'Punjab Agricultural University (PAU), Ludhiana',
        publicationTitle: 'Package of Practices for Vegetable Crops: Onion',
        referenceUrl: 'https://www.pau.edu',
        applicableRegion: 'North-Western Plains',
        cultivationCondition: 'irrigated',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 16. COVER CROP MIX (MULTI-SPECIES)
  // --------------------------------------------------------------------------
  {
    cropId: 'cover_crop_mix',
    cropName: 'Multi-Species Cover Crop (Vetch + Rye + Radish)',
    scientificName: 'Vicia villosa + Secale cereale + Raphanus sativus',
    botanicalFamily: 'Fabaceae (Leguminosae)',
    recommendationStatus: 'provisional',
    baselineRdfKgHa: {
      nitrogen: 0,     // Synthetic N is contraindicated: Vetch fixes N, Rye scavenges residual N
      phosphorus: 20,  // Provisional starter P only on severely exhausted soils
      potassium: 20,   // Provisional starter K
    },
    cultivationCondition: 'conserved_moisture',
    targetYieldBenchmark: '4.0 - 6.0 tonnes dry organic biomass/ha (Not harvested for grain; terminated for soil health)',
    geographicalApplicability: 'Global conservation agriculture systems & transitional agro-ecological fallows',
    conditionsAndLimitations: [
      'PROVISIONAL / ECOLOGICAL CLASSIFICATION: Multi-species cover crops are planted specifically for soil biological regeneration, erosion control, and bio-drilling.',
      'Synthetic nitrogen application is strongly DISCOURAGED: adding synthetic N causes grasses (cereal rye) to outcompete legumes (hairy vetch) and stops biological N2 fixation.',
      'Starter P2O5 and K2O (20 kg/ha) are provisional and recommended only if laboratory soil tests indicate severe nutrient depletion.',
      'Terminate cover crop (mow or roller-crimp) at 10-20% vetch flowering before viable seeds form.',
    ],
    applicationSchedule: [
      {
        stage: 'basal',
        stageDisplayName: 'Basal (At seeding - Optional starter on depleted soils)',
        timingDaysRange: { min: 0, max: 0 },
        nitrogenPercent: 0,
        phosphorusPercent: 100,
        potassiumPercent: 100,
        applicationMethod: 'Surface broadcast and harrowed before drilling seed',
        criticalAdvisory: 'Omit entirely if succeeding fertile commercial crops or if soil test shows medium to high P/K.',
      },
    ],
    suitableFertilizerProductIds: ['ssp', 'mop', 'fym', 'vermicompost', 'biofertilizer_rhizobium', 'biofertilizer_psb'],
    organicAlternatives: [
      {
        productName: 'Rhizobium leguminosarum bv. viciae Inoculant',
        category: 'biofertilizer',
        recommendedDosePerHectare: '400 g / ha seed mix',
        nutrientSupplyExplanation: 'Ensures immediate nodulation of hairy vetch, fixing 60-120 kg biological N/ha for subsequent cash crops.',
        timingAndMethod: 'Seed slurry coating immediately before broadcasting or drilling.',
      },
      {
        productName: 'Arbuscular Mycorrhizal Fungi (AMF) Soil Inoculant',
        category: 'biofertilizer',
        recommendedDosePerHectare: '10 kg/ha granular root-zone inoculum',
        nutrientSupplyExplanation: 'Extends fungal hyphal networks to mobilize insoluble phosphorus and micronutrients across species.',
        timingAndMethod: 'Mix with seed in drill box.',
      },
    ],
    sources: [
      {
        institution: 'Food and Agriculture Organization of the United Nations (FAO)',
        publicationTitle: 'Conservation Agriculture: Principles and Ecological Nutrient Recycling',
        referenceUrl: 'https://www.fao.org/conservation-agriculture',
        applicableRegion: 'Global Temperate & Subtropical Agro-ecosystems',
        cultivationCondition: 'conserved_moisture',
      },
      {
        institution: 'USDA - Natural Resources Conservation Service (USDA-NRCS)',
        publicationTitle: 'Cover Crop Management in Conservation Tillage Systems (Technical Note No. 16)',
        referenceUrl: 'https://www.nrcs.usda.gov',
        applicableRegion: 'Conservation Agriculture Tracts',
        cultivationCondition: 'conserved_moisture',
      },
    ],
  },
];

// ============================================================================
// 4. LOOKUP & QUERY UTILITIES
// ============================================================================

/**
 * Retrieve the verified fertilizer requirement profile by matching crop ID
 */
export function getFertilizerRequirementByCropId(cropId: string): FertilizerNutrientRequirement | undefined {
  return CROP_FERTILIZER_DATABASE.find(item => item.cropId === cropId);
}

/**
 * Retrieve a commercial or organic fertilizer product by ID
 */
export function getFertilizerProductById(productId: string): FertilizerProduct | undefined {
  return FERTILIZER_PRODUCTS.find(prod => prod.id === productId);
}

/**
 * Get all available crop fertilizer requirements
 */
export function getAllFertilizerRequirements(): FertilizerNutrientRequirement[] {
  return CROP_FERTILIZER_DATABASE;
}

/**
 * Get all fertilizer products
 */
export function getAllFertilizerProducts(): FertilizerProduct[] {
  return FERTILIZER_PRODUCTS;
}
