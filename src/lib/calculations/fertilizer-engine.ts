// ARACHNOVA - Scientific Fertilizer Calculation Engine
// Translates verified agronomic crop nutrient requirements into real-world commercial fertilizer quantities,
// packaging bag counts, phenological application schedules, and organic alternatives.
// Adheres strictly to ICAR, State Agricultural University (PAU, TNAU), and FAO agronomic guidelines.

import {
  FertilizerNutrientRequirement,
  FertilizerProduct,
  FertilizerCombinationType,
  NutrientDemandResult,
  CalculatedFertilizerProductItem,
  FertilizerPlanResult,
  ScheduledStagePlan,
  ScheduledStageProductSplit,
  ApplicationScheduleResult,
  CalculatedOrganicAlternativeItem,
  OrganicAlternativesResult,
  SoilTestParameters,
} from '../../types/fertilizer';
import {
  getFertilizerRequirementByCropId,
  getFertilizerProductById,
  SOIL_TEST_RATING_THRESHOLDS,
} from '../../data/fertilizer/fertilizer-database';

// ============================================================================
// CONSTANTS & CONVERSION FACTORS
// ============================================================================

/** 1 hectare = 2.47105 acres */
export const HECTARES_TO_ACRES = 2.47105;

/** 1 acre = 0.404686 hectares */
export const ACRES_TO_HECTARES = 0.404686;

/**
 * Clean floating point rounding to specified decimal places
 */
export function roundTo(val: number, decimals: number = 2): number {
  if (!Number.isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Convert area in hectares to acres
 */
export function hectaresToAcres(hectares: number): number {
  if (!Number.isFinite(hectares) || hectares <= 0) return 0;
  return roundTo(hectares * HECTARES_TO_ACRES, 2);
}

/**
 * Convert area in acres to hectares
 */
export function acresToHectares(acres: number): number {
  if (!Number.isFinite(acres) || acres <= 0) return 0;
  return roundTo(acres * ACRES_TO_HECTARES, 4);
}

// ============================================================================
// 1. NUTRIENT REQUIREMENT CALCULATION
// ============================================================================

/**
 * Calculates total nutrient demand for a given crop and farm area,
 * accounting for baseline RDF and verified soil-test adjustments where available.
 *
 * Total nutrient requirement (kg) = Baseline RDF (kg/ha) * Farm area (ha) * SoilTestFactor
 */
export function calculateNutrientDemand(
  cropId: string,
  areaHectares: number,
  soilTestAdjustment?: SoilTestParameters
): NutrientDemandResult {
  const warnings: string[] = [];

  // Validation 1: Farm area
  if (!Number.isFinite(areaHectares) || areaHectares <= 0) {
    return {
      cropId,
      cropName: 'Unknown',
      scientificName: '',
      areaHectares: 0,
      areaAcres: 0,
      recommendationStatus: 'unavailable',
      cultivationCondition: 'irrigated',
      baselineRdfKgHa: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      totalDemandKg: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      soilTestAdjustmentApplied: false,
      warnings: ['Farm area must be a positive number greater than 0.'],
      isValid: false,
      errorMessage: 'Invalid farm area specified. Area must be greater than zero hectares.',
    };
  }

  // Validation 2: Crop existence in agronomic database
  const cropReq = getFertilizerRequirementByCropId(cropId);
  if (!cropReq) {
    return {
      cropId,
      cropName: cropId,
      scientificName: '',
      areaHectares: roundTo(areaHectares, 2),
      areaAcres: hectaresToAcres(areaHectares),
      recommendationStatus: 'unavailable',
      cultivationCondition: 'irrigated',
      baselineRdfKgHa: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      totalDemandKg: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      soilTestAdjustmentApplied: false,
      warnings: [`Crop '${cropId}' is not found in the ARACHNOVA fertilizer database.`],
      isValid: false,
      errorMessage: `Unrecognized crop ID: '${cropId}'. Nutrient requirements cannot be determined.`,
    };
  }

  // Handle recommendation status
  if (cropReq.recommendationStatus === 'unavailable') {
    return {
      cropId,
      cropName: cropReq.cropName,
      scientificName: cropReq.scientificName,
      areaHectares: roundTo(areaHectares, 2),
      areaAcres: hectaresToAcres(areaHectares),
      recommendationStatus: 'unavailable',
      cultivationCondition: cropReq.cultivationCondition,
      baselineRdfKgHa: cropReq.baselineRdfKgHa,
      totalDemandKg: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      soilTestAdjustmentApplied: false,
      warnings: ['Nutrient recommendations are currently marked as unavailable for this crop in production.'],
      isValid: false,
      errorMessage: `Nutrient recommendations for ${cropReq.cropName} are unavailable.`,
    };
  }

  if (cropReq.recommendationStatus === 'provisional') {
    warnings.push(
      `Recommendation for ${cropReq.cropName} is provisional. Synthetic fertilization is generally discouraged for green manure/cover crops to protect biological N2 fixation.`
    );
  }

  // Soil Test Adjustment Logic
  let nMultiplier = 1.0;
  let pMultiplier = 1.0;
  let kMultiplier = 1.0;
  let soilTestAdjustmentApplied = false;
  const adjustmentDetails: string[] = [];

  if (soilTestAdjustment) {
    // Scientific Guardrail: Reject SoilGrids total nitrogen as a proxy for available nitrogen
    if (
      soilTestAdjustment.soilGridsTotalNitrogenGKg !== undefined &&
      soilTestAdjustment.availableNitrogenKgHa === undefined
    ) {
      warnings.push(
        'SoilGrids estimated Total Nitrogen (g/kg) represents total non-mineralized organic nitrogen and cannot be used as plant-available nitrogen. Standard baseline RDF is retained for Nitrogen.'
      );
    }

    // Available Nitrogen (Alkaline KMnO4 test)
    if (
      soilTestAdjustment.availableNitrogenKgHa !== undefined &&
      Number.isFinite(soilTestAdjustment.availableNitrogenKgHa) &&
      soilTestAdjustment.availableNitrogenKgHa > 0
    ) {
      const availN = soilTestAdjustment.availableNitrogenKgHa;
      if (availN < SOIL_TEST_RATING_THRESHOLDS.availableNitrogen.low.max) {
        nMultiplier = 1.25; // +25% ICAR standard adjustment for low fertility
        adjustmentDetails.push(`Available N is Low (${availN} kg/ha): +25% Nitrogen applied to baseline RDF.`);
        soilTestAdjustmentApplied = true;
      } else if (availN > SOIL_TEST_RATING_THRESHOLDS.availableNitrogen.high.min) {
        nMultiplier = 0.75; // -25% ICAR adjustment for high fertility
        adjustmentDetails.push(`Available N is High (${availN} kg/ha): -25% Nitrogen reduced from baseline RDF.`);
        soilTestAdjustmentApplied = true;
      } else {
        adjustmentDetails.push(`Available N is Medium (${availN} kg/ha): Standard 100% baseline RDF retained.`);
      }
    }

    // Available Phosphorus (Olsen P test)
    if (
      soilTestAdjustment.availablePhosphorusKgHa !== undefined &&
      Number.isFinite(soilTestAdjustment.availablePhosphorusKgHa) &&
      soilTestAdjustment.availablePhosphorusKgHa > 0
    ) {
      const availP = soilTestAdjustment.availablePhosphorusKgHa;
      if (availP < SOIL_TEST_RATING_THRESHOLDS.availablePhosphorus.low.max) {
        pMultiplier = 1.25; // +25% adjustment
        adjustmentDetails.push(`Available P2O5 is Low (${availP} kg/ha): +25% Phosphorus applied to baseline RDF.`);
        soilTestAdjustmentApplied = true;
      } else if (availP > SOIL_TEST_RATING_THRESHOLDS.availablePhosphorus.high.min) {
        pMultiplier = 0.75; // -25% adjustment
        adjustmentDetails.push(`Available P2O5 is High (${availP} kg/ha): -25% Phosphorus reduced from baseline RDF.`);
        soilTestAdjustmentApplied = true;
      } else {
        adjustmentDetails.push(`Available P2O5 is Medium (${availP} kg/ha): Standard 100% baseline RDF retained.`);
      }
    }

    // Available Potassium (Neutral 1N NH4OAc-K test)
    if (
      soilTestAdjustment.availablePotassiumKgHa !== undefined &&
      Number.isFinite(soilTestAdjustment.availablePotassiumKgHa) &&
      soilTestAdjustment.availablePotassiumKgHa > 0
    ) {
      const availK = soilTestAdjustment.availablePotassiumKgHa;
      if (availK < SOIL_TEST_RATING_THRESHOLDS.availablePotassium.low.max) {
        kMultiplier = 1.25; // +25% adjustment
        adjustmentDetails.push(`Available K2O is Low (${availK} kg/ha): +25% Potassium applied to baseline RDF.`);
        soilTestAdjustmentApplied = true;
      } else if (availK > SOIL_TEST_RATING_THRESHOLDS.availablePotassium.high.min) {
        kMultiplier = 0.75; // -25% adjustment
        adjustmentDetails.push(`Available K2O is High (${availK} kg/ha): -25% Potassium reduced from baseline RDF.`);
        soilTestAdjustmentApplied = true;
      } else {
        adjustmentDetails.push(`Available K2O is Medium (${availK} kg/ha): Standard 100% baseline RDF retained.`);
      }
    }
  }

  // Calculate scaled total nutrient demand
  const totalN = roundTo(cropReq.baselineRdfKgHa.nitrogen * areaHectares * nMultiplier, 2);
  const totalP = roundTo(cropReq.baselineRdfKgHa.phosphorus * areaHectares * pMultiplier, 2);
  const totalK = roundTo(cropReq.baselineRdfKgHa.potassium * areaHectares * kMultiplier, 2);

  const totalDemandKg: NutrientDemandResult['totalDemandKg'] = {
    nitrogen: totalN,
    phosphorus: totalP,
    potassium: totalK,
  };

  if (cropReq.baselineRdfKgHa.sulfur !== undefined) {
    totalDemandKg.sulfur = roundTo(cropReq.baselineRdfKgHa.sulfur * areaHectares, 2);
  }

  if (cropReq.baselineRdfKgHa.zinc !== undefined) {
    totalDemandKg.zinc = roundTo(cropReq.baselineRdfKgHa.zinc * areaHectares, 2);
  }

  return {
    cropId,
    cropName: cropReq.cropName,
    scientificName: cropReq.scientificName,
    areaHectares: roundTo(areaHectares, 2),
    areaAcres: hectaresToAcres(areaHectares),
    recommendationStatus: cropReq.recommendationStatus,
    cultivationCondition: cropReq.cultivationCondition,
    baselineRdfKgHa: cropReq.baselineRdfKgHa,
    totalDemandKg,
    soilTestAdjustmentApplied,
    soilTestAdjustmentDetails: adjustmentDetails.length > 0 ? adjustmentDetails.join(' | ') : undefined,
    warnings,
    isValid: true,
  };
}

// ============================================================================
// 2. FERTILIZER PRODUCT & BAG COUNT CALCULATION
// ============================================================================

/**
 * Calculates exact commercial fertilizer quantities and packaging bag counts
 * for the selected fertilizer combination type (DAP vs SSP).
 *
 * Implements the rigorous multi-nutrient DAP offset algorithm and avoids
 * silently masking nutrient imbalances.
 */
export function calculateFertilizerProducts(
  nutrientDemand: NutrientDemandResult,
  combinationType: FertilizerCombinationType = 'DAP_UREA_MOP'
): FertilizerPlanResult {
  // If nutrient demand is invalid, propagate structured error
  if (!nutrientDemand.isValid) {
    return {
      cropId: nutrientDemand.cropId,
      cropName: nutrientDemand.cropName,
      areaHectares: nutrientDemand.areaHectares,
      areaAcres: nutrientDemand.areaAcres,
      combinationType,
      recommendationStatus: nutrientDemand.recommendationStatus,
      products: [],
      nutrientBalance: {
        demandedKg: { nitrogen: 0, phosphorus: 0, potassium: 0 },
        suppliedKg: { nitrogen: 0, phosphorus: 0, potassium: 0 },
        balanceKg: { nitrogen: 0, phosphorus: 0, potassium: 0 },
        isNutrientImbalanced: false,
        imbalanceWarnings: [],
      },
      suitabilityForCrop: { isSuitable: false, suitabilityNotes: ['Invalid nutrient demand.'] },
      notes: [],
      warnings: nutrientDemand.warnings,
      isValid: false,
      errorMessage: nutrientDemand.errorMessage || 'Cannot calculate fertilizer products from invalid nutrient demand.',
    };
  }

  const cropReq = getFertilizerRequirementByCropId(nutrientDemand.cropId);
  const products: CalculatedFertilizerProductItem[] = [];
  const notes: string[] = [];
  const warnings: string[] = [...nutrientDemand.warnings];
  const imbalanceWarnings: string[] = [];
  const suitabilityNotes: string[] = [];

  const demandedN = nutrientDemand.totalDemandKg.nitrogen;
  const demandedP = nutrientDemand.totalDemandKg.phosphorus;
  const demandedK = nutrientDemand.totalDemandKg.potassium;
  const demandedS = nutrientDemand.totalDemandKg.sulfur;

  // Retrieve products from database
  const ureaSpec = getFertilizerProductById('neem_coated_urea');
  const dapSpec = getFertilizerProductById('dap');
  const mopSpec = getFertilizerProductById('mop');
  const sspSpec = getFertilizerProductById('ssp');

  const ureaNFrac = (ureaSpec?.nutrientContent.nitrogenPercent || 46) / 100; // 0.46
  const dapNFrac = (dapSpec?.nutrientContent.nitrogenPercent || 18) / 100;   // 0.18
  const dapPFrac = (dapSpec?.nutrientContent.phosphorusPercent || 46) / 100; // 0.46
  const mopKFrac = (mopSpec?.nutrientContent.potassiumPercent || 60) / 100;  // 0.60
  const sspPFrac = (sspSpec?.nutrientContent.phosphorusPercent || 16) / 100; // 0.16
  const sspSFrac = (sspSpec?.nutrientContent.secondaryNutrients?.sulfurPercent || 11) / 100; // 0.11
  const sspCaFrac = (sspSpec?.nutrientContent.secondaryNutrients?.calciumPercent || 19) / 100; // 0.19

  const ureaBagWeight = ureaSpec?.packaging.standardBagWeightKg || 45;
  const dapBagWeight = dapSpec?.packaging.standardBagWeightKg || 50;
  const mopBagWeight = mopSpec?.packaging.standardBagWeightKg || 50;
  const sspBagWeight = sspSpec?.packaging.standardBagWeightKg || 50;

  let suppliedN = 0;
  let suppliedP = 0;
  let suppliedK = 0;
  let suppliedS = 0;
  let suppliedCa = 0;
  let isNutrientImbalanced = false;

  // --------------------------------------------------------------------------
  // COMBINATION A: DAP + UREA + MOP
  // --------------------------------------------------------------------------
  if (combinationType === 'DAP_UREA_MOP') {
    // Step 1: Calculate DAP required to satisfy 100% of P2O5 demand
    const dapQtyKg = demandedP > 0 ? demandedP / dapPFrac : 0;
    const dapBags = Math.ceil(dapQtyKg / dapBagWeight);

    // Step 2: Calculate Nitrogen supplied by DAP
    const nFromDap = dapQtyKg * dapNFrac;
    suppliedP += dapQtyKg * dapPFrac;
    suppliedN += nFromDap;

    // Step 3: Calculate remaining Nitrogen requirement
    const remainingN = demandedN - nFromDap;

    let ureaQtyKg = 0;
    let ureaBags = 0;

    // Step 4: Handle Urea calculation and imbalance detection
    if (remainingN > 0.001) {
      ureaQtyKg = remainingN / ureaNFrac;
      ureaBags = Math.ceil(ureaQtyKg / ureaBagWeight);
      suppliedN += ureaQtyKg * ureaNFrac;
    } else if (remainingN < -0.001) {
      // DAP supplies MORE nitrogen than target!
      // CRITICAL: Do NOT silently clamp to 0 and report fully balanced.
      ureaQtyKg = 0;
      ureaBags = 0;
      isNutrientImbalanced = true;
      const excessN = Math.abs(remainingN);
      imbalanceWarnings.push(
        `Nutrient Imbalance: DAP required to meet the Phosphorus target (${roundTo(demandedP, 1)} kg P2O5) automatically supplies ${roundTo(nFromDap, 1)} kg Nitrogen, which exceeds the crop target requirement (${roundTo(demandedN, 1)} kg N) by ${roundTo(excessN, 1)} kg N. Zero Urea is required, but an unavoidable excess of Nitrogen will be applied. Consider using SSP + Urea + MOP to control Nitrogen independently.`
      );
    } else {
      // Exactly 0 remaining
      ureaQtyKg = 0;
      ureaBags = 0;
    }

    // Step 5: MOP calculation
    const mopQtyKg = demandedK > 0 ? demandedK / mopKFrac : 0;
    const mopBags = Math.ceil(mopQtyKg / mopBagWeight);
    suppliedK += mopQtyKg * mopKFrac;

    // Construct Product Items
    if (dapQtyKg > 0) {
      products.push({
        productId: 'dap',
        productName: dapSpec?.name || 'Di-Ammonium Phosphate (DAP)',
        commonName: dapSpec?.commonName || 'DAP (18-46-0)',
        category: 'chemical',
        exactQuantityKg: roundTo(dapQtyKg, 1),
        bagsToPurchase: dapBags,
        bagWeightKg: dapBagWeight,
        bagUnitLabel: dapSpec?.packaging.bagUnitLabel || '50 kg bag',
        nutrientsSuppliedKg: {
          nitrogen: roundTo(nFromDap, 1),
          phosphorus: roundTo(dapQtyKg * dapPFrac, 1),
          potassium: 0,
        },
        applicationRole: 'Primary Phosphorus Carrier & Basal Nitrogen Credit',
      });
    }

    if (ureaQtyKg > 0 || demandedN > 0) {
      products.push({
        productId: 'neem_coated_urea',
        productName: ureaSpec?.name || 'Neem-Coated Urea',
        commonName: ureaSpec?.commonName || 'Urea (46% N)',
        category: 'chemical',
        exactQuantityKg: roundTo(ureaQtyKg, 1),
        bagsToPurchase: ureaBags,
        bagWeightKg: ureaBagWeight,
        bagUnitLabel: ureaSpec?.packaging.bagUnitLabel || '45 kg bag',
        nutrientsSuppliedKg: {
          nitrogen: roundTo(ureaQtyKg * ureaNFrac, 1),
          phosphorus: 0,
          potassium: 0,
        },
        applicationRole: ureaQtyKg > 0 ? 'Top-Dressing & Vegetative Nitrogen Carrier' : 'Not required (N satisfied by DAP)',
      });
    }

    if (mopQtyKg > 0 || demandedK > 0) {
      products.push({
        productId: 'mop',
        productName: mopSpec?.name || 'Muriate of Potash',
        commonName: mopSpec?.commonName || 'MOP (60% K2O)',
        category: 'chemical',
        exactQuantityKg: roundTo(mopQtyKg, 1),
        bagsToPurchase: mopBags,
        bagWeightKg: mopBagWeight,
        bagUnitLabel: mopSpec?.packaging.bagUnitLabel || '50 kg bag',
        nutrientsSuppliedKg: {
          nitrogen: 0,
          phosphorus: 0,
          potassium: roundTo(mopQtyKg * mopKFrac, 1),
        },
        applicationRole: 'Potassium Carrier for Osmotic Regulation & Grain/Fruit Quality',
      });
    }

    notes.push('DAP supplies 18% Ammoniacal Nitrogen which has been credited towards total crop Nitrogen requirement.');
    if (demandedS && demandedS > 0) {
      notes.push(`Crop has a verified Sulfur demand of ${roundTo(demandedS, 1)} kg S. DAP does not contain sulfur; consider supplemental Gypsum or switching to SSP.`);
    }
  }

  // --------------------------------------------------------------------------
  // COMBINATION B: SSP + UREA + MOP
  // --------------------------------------------------------------------------
  else if (combinationType === 'SSP_UREA_MOP') {
    // Step 1: Calculate SSP required to satisfy 100% of P2O5 demand
    const sspQtyKg = demandedP > 0 ? demandedP / sspPFrac : 0;
    const sspBags = Math.ceil(sspQtyKg / sspBagWeight);

    suppliedP += sspQtyKg * sspPFrac;
    const sFromSsp = sspQtyKg * sspSFrac;
    const caFromSsp = sspQtyKg * sspCaFrac;
    suppliedS += sFromSsp;
    suppliedCa += caFromSsp;

    // Step 2: Urea calculation (SSP supplies 0% N, so Urea supplies 100% of N demand)
    const ureaQtyKg = demandedN > 0 ? demandedN / ureaNFrac : 0;
    const ureaBags = Math.ceil(ureaQtyKg / ureaBagWeight);
    suppliedN += ureaQtyKg * ureaNFrac;

    // Step 3: MOP calculation
    const mopQtyKg = demandedK > 0 ? demandedK / mopKFrac : 0;
    const mopBags = Math.ceil(mopQtyKg / mopBagWeight);
    suppliedK += mopQtyKg * mopKFrac;

    // Construct Product Items
    if (sspQtyKg > 0) {
      products.push({
        productId: 'ssp',
        productName: sspSpec?.name || 'Single Super Phosphate (SSP)',
        commonName: sspSpec?.commonName || 'SSP (16% P2O5 + 11% S + 19% Ca)',
        category: 'chemical',
        exactQuantityKg: roundTo(sspQtyKg, 1),
        bagsToPurchase: sspBags,
        bagWeightKg: sspBagWeight,
        bagUnitLabel: sspSpec?.packaging.bagUnitLabel || '50 kg bag',
        nutrientsSuppliedKg: {
          nitrogen: 0,
          phosphorus: roundTo(sspQtyKg * sspPFrac, 1),
          potassium: 0,
          sulfur: roundTo(sFromSsp, 1),
          calcium: roundTo(caFromSsp, 1),
        },
        applicationRole: 'Phosphorus, Sulfur & Calcium Carrier',
      });
    }

    if (ureaQtyKg > 0 || demandedN > 0) {
      products.push({
        productId: 'neem_coated_urea',
        productName: ureaSpec?.name || 'Neem-Coated Urea',
        commonName: ureaSpec?.commonName || 'Urea (46% N)',
        category: 'chemical',
        exactQuantityKg: roundTo(ureaQtyKg, 1),
        bagsToPurchase: ureaBags,
        bagWeightKg: ureaBagWeight,
        bagUnitLabel: ureaSpec?.packaging.bagUnitLabel || '45 kg bag',
        nutrientsSuppliedKg: {
          nitrogen: roundTo(ureaQtyKg * ureaNFrac, 1),
          phosphorus: 0,
          potassium: 0,
        },
        applicationRole: 'Nitrogen Carrier (Basal and Split Top-Dressing)',
      });
    }

    if (mopQtyKg > 0 || demandedK > 0) {
      products.push({
        productId: 'mop',
        productName: mopSpec?.name || 'Muriate of Potash',
        commonName: mopSpec?.commonName || 'MOP (60% K2O)',
        category: 'chemical',
        exactQuantityKg: roundTo(mopQtyKg, 1),
        bagsToPurchase: mopBags,
        bagWeightKg: mopBagWeight,
        bagUnitLabel: mopSpec?.packaging.bagUnitLabel || '50 kg bag',
        nutrientsSuppliedKg: {
          nitrogen: 0,
          phosphorus: 0,
          potassium: roundTo(mopQtyKg * mopKFrac, 1),
        },
        applicationRole: 'Potassium Carrier for Osmotic Regulation & Yield',
      });
    }

    notes.push(
      `SSP naturally supplies ${roundTo(sFromSsp, 1)} kg Sulfur (11%) and ${roundTo(caFromSsp, 1)} kg Calcium (19%), highly beneficial for oilseeds, pulses, and alliums.`
    );
  }

  // Crop Suitability Assessment
  let isSuitable = true;
  if (cropReq) {
    if (combinationType === 'DAP_UREA_MOP') {
      if (cropReq.botanicalFamily.includes('Fabaceae') && isNutrientImbalanced) {
        suitabilityNotes.push(
          'For nodulating legumes, high DAP doses supply excess starter nitrogen that suppresses biological nodule development. SSP + Urea + MOP is preferred.'
        );
      }
    } else if (combinationType === 'SSP_UREA_MOP') {
      if (['groundnut', 'soybean', 'onion', 'chickpea'].includes(cropReq.cropId)) {
        suitabilityNotes.push('Excellent match: SSP directly satisfies crop sulfur and calcium requirements.');
      }
    }
  }

  const balanceN = roundTo(suppliedN - demandedN, 1);
  const balanceP = roundTo(suppliedP - demandedP, 1);
  const balanceK = roundTo(suppliedK - demandedK, 1);

  return {
    cropId: nutrientDemand.cropId,
    cropName: nutrientDemand.cropName,
    areaHectares: nutrientDemand.areaHectares,
    areaAcres: nutrientDemand.areaAcres,
    combinationType,
    recommendationStatus: nutrientDemand.recommendationStatus,
    products,
    nutrientBalance: {
      demandedKg: {
        nitrogen: roundTo(demandedN, 1),
        phosphorus: roundTo(demandedP, 1),
        potassium: roundTo(demandedK, 1),
        sulfur: demandedS !== undefined ? roundTo(demandedS, 1) : undefined,
      },
      suppliedKg: {
        nitrogen: roundTo(suppliedN, 1),
        phosphorus: roundTo(suppliedP, 1),
        potassium: roundTo(suppliedK, 1),
        sulfur: suppliedS > 0 ? roundTo(suppliedS, 1) : undefined,
        calcium: suppliedCa > 0 ? roundTo(suppliedCa, 1) : undefined,
      },
      balanceKg: {
        nitrogen: balanceN,
        phosphorus: balanceP,
        potassium: balanceK,
      },
      isNutrientImbalanced,
      imbalanceWarnings,
    },
    suitabilityForCrop: {
      isSuitable,
      suitabilityNotes,
    },
    notes,
    warnings,
    isValid: true,
  };
}

// ============================================================================
// 3. FERTILIZER APPLICATION SCHEDULE
// ============================================================================

/**
 * Calculates crop-specific split application schedules by distributing
 * calculated fertilizer products across verified phenological growth stages.
 */
export function calculateApplicationSchedule(
  cropId: string,
  fertilizerPlan: FertilizerPlanResult
): ApplicationScheduleResult {
  const cropReq = getFertilizerRequirementByCropId(cropId);
  if (!cropReq || !fertilizerPlan.isValid) {
    return {
      cropId,
      cropName: cropReq?.cropName || cropId,
      stages: [],
      totalPercentages: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      isAllocationValid: false,
      allocationWarnings: ['Cannot calculate application schedule without a valid crop requirement and fertilizer plan.'],
      isValid: false,
      errorMessage: 'Invalid crop or fertilizer plan provided for application scheduling.',
    };
  }

  const allocationWarnings: string[] = [];
  const scheduleSplits = cropReq.applicationSchedule;

  // Validate split percentages sum to 100%
  let sumN = 0;
  let sumP = 0;
  let sumK = 0;
  for (const s of scheduleSplits) {
    sumN += s.nitrogenPercent;
    sumP += s.phosphorusPercent;
    sumK += s.potassiumPercent;
  }

  // Tolerance check (0.5% tolerance for rounding)
  let isAllocationValid = true;
  if (cropReq.baselineRdfKgHa.nitrogen > 0 && Math.abs(sumN - 100) > 0.5) {
    allocationWarnings.push(`Nitrogen application splits total ${sumN}% instead of 100%.`);
    isAllocationValid = false;
  }
  if (cropReq.baselineRdfKgHa.phosphorus > 0 && Math.abs(sumP - 100) > 0.5) {
    allocationWarnings.push(`Phosphorus application splits total ${sumP}% instead of 100%.`);
    isAllocationValid = false;
  }
  if (cropReq.baselineRdfKgHa.potassium > 0 && Math.abs(sumK - 100) > 0.5) {
    allocationWarnings.push(`Potassium application splits total ${sumK}% instead of 100%.`);
    isAllocationValid = false;
  }

  // Extract total product quantities from plan
  const dapItem = fertilizerPlan.products.find(p => p.productId === 'dap');
  const sspItem = fertilizerPlan.products.find(p => p.productId === 'ssp');
  const ureaItem = fertilizerPlan.products.find(p => p.productId === 'neem_coated_urea');
  const mopItem = fertilizerPlan.products.find(p => p.productId === 'mop');

  const totalDapKg = dapItem ? dapItem.exactQuantityKg : 0;
  const totalSspKg = sspItem ? sspItem.exactQuantityKg : 0;
  const totalUreaKg = ureaItem ? ureaItem.exactQuantityKg : 0;
  const totalMopKg = mopItem ? mopItem.exactQuantityKg : 0;

  const totalDemandedN = fertilizerPlan.nutrientBalance.demandedKg.nitrogen;
  const totalDemandedP = fertilizerPlan.nutrientBalance.demandedKg.phosphorus;
  const totalDemandedK = fertilizerPlan.nutrientBalance.demandedKg.potassium;

  // For DAP combinations, DAP delivers nitrogen in the basal stage:
  const nDeliveredByDap = totalDapKg * 0.18;

  const scheduledStages: ScheduledStagePlan[] = [];

  for (let i = 0; i < scheduleSplits.length; i++) {
    const split = scheduleSplits[i];
    const isBasal = split.stage === 'basal' || i === 0;

    const stageN = roundTo(totalDemandedN * (split.nitrogenPercent / 100), 1);
    const stageP = roundTo(totalDemandedP * (split.phosphorusPercent / 100), 1);
    const stageK = roundTo(totalDemandedK * (split.potassiumPercent / 100), 1);

    const stageProducts: ScheduledStageProductSplit[] = [];

    // Phosphorus Carrier Allocation (DAP or SSP)
    if (totalDapKg > 0 && split.phosphorusPercent > 0) {
      const stageDapKg = roundTo(totalDapKg * (split.phosphorusPercent / 100), 1);
      stageProducts.push({
        productId: 'dap',
        productName: dapItem?.productName || 'DAP',
        quantityKg: stageDapKg,
        bagWeightKg: 50,
        stageBagsApprox: roundTo(stageDapKg / 50, 1),
      });
    } else if (totalSspKg > 0 && split.phosphorusPercent > 0) {
      const stageSspKg = roundTo(totalSspKg * (split.phosphorusPercent / 100), 1);
      stageProducts.push({
        productId: 'ssp',
        productName: sspItem?.productName || 'SSP',
        quantityKg: stageSspKg,
        bagWeightKg: 50,
        stageBagsApprox: roundTo(stageSspKg / 50, 1),
      });
    }

    // Potassium Carrier Allocation (MOP)
    if (totalMopKg > 0 && split.potassiumPercent > 0) {
      const stageMopKg = roundTo(totalMopKg * (split.potassiumPercent / 100), 1);
      stageProducts.push({
        productId: 'mop',
        productName: mopItem?.productName || 'MOP',
        quantityKg: stageMopKg,
        bagWeightKg: 50,
        stageBagsApprox: roundTo(stageMopKg / 50, 1),
      });
    }

    // Nitrogen Carrier Allocation (Neem-Coated Urea)
    if (totalUreaKg > 0) {
      let stageUreaKg = 0;

      if (fertilizerPlan.combinationType === 'DAP_UREA_MOP') {
        if (isBasal) {
          // In Basal stage, DAP provides ammoniacal N.
          // Remaining basal N is provided by Urea:
          const basalRemainingN = Math.max(0, stageN - nDeliveredByDap);
          stageUreaKg = roundTo(basalRemainingN / 0.46, 1);
        } else {
          // In top-dressing / subsequent stages, N is supplied by Urea
          stageUreaKg = roundTo(stageN / 0.46, 1);
        }
      } else {
        // In SSP combination, Urea is allocated directly by stage's nitrogen percent
        stageUreaKg = roundTo(totalUreaKg * (split.nitrogenPercent / 100), 1);
      }

      if (stageUreaKg > 0) {
        stageProducts.push({
          productId: 'neem_coated_urea',
          productName: ureaItem?.productName || 'Neem-Coated Urea',
          quantityKg: stageUreaKg,
          bagWeightKg: 45,
          stageBagsApprox: roundTo(stageUreaKg / 45, 1),
        });
      }
    }

    scheduledStages.push({
      stage: split.stage,
      stageDisplayName: split.stageDisplayName,
      timingDaysRange: split.timingDaysRange,
      applicationMethod: split.applicationMethod,
      criticalAdvisory: split.criticalAdvisory,
      percentages: {
        nitrogen: split.nitrogenPercent,
        phosphorus: split.phosphorusPercent,
        potassium: split.potassiumPercent,
      },
      stageNutrientsKg: {
        nitrogen: stageN,
        phosphorus: stageP,
        potassium: stageK,
      },
      stageProducts,
    });
  }

  return {
    cropId,
    cropName: cropReq.cropName,
    stages: scheduledStages,
    totalPercentages: {
      nitrogen: sumN,
      phosphorus: sumP,
      potassium: sumK,
    },
    isAllocationValid,
    allocationWarnings,
    isValid: true,
  };
}

// ============================================================================
// 4. ORGANIC ALTERNATIVES & BIOFERTILIZERS
// ============================================================================

/**
 * Calculates farm-scaled organic manure and biofertilizer recommendations
 * from verified database entries, displaying clear release assumptions.
 */
export function calculateOrganicAlternatives(
  cropId: string,
  areaHectares: number
): OrganicAlternativesResult {
  if (!Number.isFinite(areaHectares) || areaHectares <= 0) {
    return {
      cropId,
      cropName: '',
      areaHectares: 0,
      areaAcres: 0,
      alternatives: [],
      generalOrganicAdvisory: [],
      isValid: false,
      errorMessage: 'Invalid farm area specified. Area must be greater than zero hectares.',
    };
  }

  const cropReq = getFertilizerRequirementByCropId(cropId);
  const rawAlternatives = cropReq?.organicAlternatives || [];

  const alternatives: CalculatedOrganicAlternativeItem[] = rawAlternatives.map(alt => {
    // Attempt to extract numeric tonnes/ha rate for scaling
    let totalFarmDoseEstimated = alt.recommendedDosePerHectare;
    const match = alt.recommendedDosePerHectare.match(/([\d.]+)\s*(?:-\s*([\d.]+))?\s*Tonnes\/ha/i);

    if (match) {
      const minVal = parseFloat(match[1]);
      const maxVal = match[2] ? parseFloat(match[2]) : null;

      if (maxVal) {
        const scaledMin = roundTo(minVal * areaHectares, 1);
        const scaledMax = roundTo(maxVal * areaHectares, 1);
        totalFarmDoseEstimated = `${scaledMin} - ${scaledMax} Tonnes (for ${roundTo(areaHectares, 1)} ha)`;
      } else {
        const scaledVal = roundTo(minVal * areaHectares, 1);
        totalFarmDoseEstimated = `${scaledVal} Tonnes (for ${roundTo(areaHectares, 1)} ha)`;
      }
    } else {
      totalFarmDoseEstimated = `${alt.recommendedDosePerHectare} (Scale based on planting density / seed quantity for ${roundTo(areaHectares, 1)} ha)`;
    }

    const releaseAssumptions =
      alt.category === 'bulky_organic'
        ? 'Slow mineralization: Approx. 25-30% N, 60-70% P, and 70-80% K released in the first season; builds lasting soil organic carbon.'
        : alt.category === 'concentrated_organic'
        ? 'Medium release: High humic acids, enzyme activity, and microbial proliferation within 30-45 days.'
        : alt.category === 'biofertilizer'
        ? 'Living microbial cultures that colonize rhizosphere roots, fix atmospheric N, or solubilize native bound phosphorus.'
        : 'Biological green manure: Rapid mineralization when incorporated at succulent pre-flowering stage.';

    return {
      productName: alt.productName,
      category: alt.category,
      recommendedDosePerHectare: alt.recommendedDosePerHectare,
      totalFarmDoseEstimated,
      nutrientSupplyExplanation: alt.nutrientSupplyExplanation,
      timingAndMethod: alt.timingAndMethod,
      biofertilizerStrain: alt.biofertilizerStrain,
      releaseAssumptions,
    };
  });

  const generalOrganicAdvisory: string[] = [
    'Bulky organic manures (FYM, compost) cannot directly replace chemical fertilizers on a 1:1 kilogram basis in intensive high-yielding cropping.',
    'Combined Integrated Nutrient Management (INM) - pairing organic manures with split chemical fertilizers - delivers the highest nutrient use efficiency and long-term soil health.',
    'Biofertilizers (Rhizobium, Azotobacter, PSB) are living bacterial cultures and must be stored in cool shade away from chemical pesticides.',
  ];

  return {
    cropId,
    cropName: cropReq?.cropName || cropId,
    areaHectares: roundTo(areaHectares, 2),
    areaAcres: hectaresToAcres(areaHectares),
    alternatives,
    generalOrganicAdvisory,
    isValid: true,
  };
}
