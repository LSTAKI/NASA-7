// ARACHNOVA - Smart Fertilizer Planner Calculation Engine Test Suite
// Scientifically verifies nutrient demand, DAP offsets, SSP formulations, bag calculations,
// secondary nutrient accounting, split schedules, soil-test safeguards, and error boundaries.

import {
  calculateNutrientDemand,
  calculateFertilizerProducts,
  calculateApplicationSchedule,
  calculateOrganicAlternatives,
  hectaresToAcres,
  acresToHectares,
  roundTo,
} from '../src/lib/calculations/fertilizer-engine';
import {
  CROP_FERTILIZER_DATABASE,
  getAllFertilizerRequirements,
  getFertilizerRequirementByCropId,
} from '../src/data/fertilizer/fertilizer-database';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    process.exitCode = 1;
  }
}

console.log('===============================================================');
console.log('ARACHNOVA FERTILIZER ENGINE SCIENTIFIC VALIDATION SUITE');
console.log('===============================================================\n');

// ----------------------------------------------------------------------------
// TEST GROUP 1: UNIT CONVERSIONS
// ----------------------------------------------------------------------------
console.log('1. Testing Unit Conversions (Hectares <-> Acres)');
assert(hectaresToAcres(1) === 2.47, '1 hectare equals 2.47 acres');
assert(hectaresToAcres(10) === 24.71, '10 hectares equals 24.71 acres');
assert(roundTo(acresToHectares(2.47105), 1) === 1.0, '2.47105 acres converts back to 1.0 hectare');
assert(hectaresToAcres(0) === 0, '0 hectares returns 0 acres');
assert(hectaresToAcres(-5) === 0, 'Negative hectares returns 0 acres');

// ----------------------------------------------------------------------------
// TEST GROUP 2: COVERAGE OF ALL 16 CROPS
// ----------------------------------------------------------------------------
console.log('\n2. Testing Database Coverage & Baseline Nutrient Demands for All 16 Crops');
const allCrops = getAllFertilizerRequirements();
assert(allCrops.length === 16, `Database contains exactly 16 crops (found: ${allCrops.length})`);

for (const crop of allCrops) {
  const demand = calculateNutrientDemand(crop.cropId, 1.0);
  assert(demand.isValid, `Nutrient demand valid for crop: ${crop.cropId} (${crop.cropName})`);
  assert(
    demand.totalDemandKg.nitrogen === crop.baselineRdfKgHa.nitrogen &&
    demand.totalDemandKg.phosphorus === crop.baselineRdfKgHa.phosphorus &&
    demand.totalDemandKg.potassium === crop.baselineRdfKgHa.potassium,
    `Baseline demand matches RDF exactly for 1 ha: ${crop.cropId}`
  );
  assert(!Number.isNaN(demand.totalDemandKg.nitrogen), `No NaN in nitrogen demand for ${crop.cropId}`);
}

// ----------------------------------------------------------------------------
// TEST GROUP 3: FARM SIZE SCALING
// ----------------------------------------------------------------------------
console.log('\n3. Testing Farm Size Scaling (Wheat on 0.5 ha, 5.0 ha, 24.0 ha)');
const wheatSmall = calculateNutrientDemand('wheat', 0.5);
assert(wheatSmall.totalDemandKg.nitrogen === 60, 'Wheat on 0.5 ha requires 60 kg N (120 * 0.5)');
assert(wheatSmall.totalDemandKg.phosphorus === 30, 'Wheat on 0.5 ha requires 30 kg P2O5 (60 * 0.5)');
assert(wheatSmall.totalDemandKg.potassium === 20, 'Wheat on 0.5 ha requires 20 kg K2O (40 * 0.5)');

const wheatLarge = calculateNutrientDemand('wheat', 24.0); // Satluj Green Basin farm size
assert(wheatLarge.totalDemandKg.nitrogen === 2880, 'Wheat on 24 ha requires 2880 kg N (120 * 24)');
assert(wheatLarge.totalDemandKg.phosphorus === 1440, 'Wheat on 24 ha requires 1440 kg P2O5 (60 * 24)');
assert(wheatLarge.totalDemandKg.potassium === 960, 'Wheat on 24 ha requires 960 kg K2O (40 * 24)');

// ----------------------------------------------------------------------------
// TEST GROUP 4: DAP OFFSET ALGORITHM & PRODUCT CALCULATIONS
// ----------------------------------------------------------------------------
console.log('\n4. Testing DAP Offset Algorithm (Rice: 120-50-50 on 1.0 ha)');
const riceDemand = calculateNutrientDemand('rice', 1.0);
const riceDapPlan = calculateFertilizerProducts(riceDemand, 'DAP_UREA_MOP');
assert(riceDapPlan.isValid, 'Rice DAP plan is valid');

// Verification of manual math:
// DAP Qty = 50 / 0.46 = 108.7 kg -> 3 bags (Ceil(108.7 / 50))
// N from DAP = 108.7 * 0.18 = 19.565 kg N
// Remaining N = 120 - 19.565 = 100.435 kg N
// Urea Qty = 100.435 / 0.46 = 218.3 kg -> 5 bags (Ceil(218.3 / 45))
// MOP Qty = 50 / 0.60 = 83.3 kg -> 2 bags (Ceil(83.3 / 50))
const dapItem = riceDapPlan.products.find(p => p.productId === 'dap');
const ureaItem = riceDapPlan.products.find(p => p.productId === 'neem_coated_urea');
const mopItem = riceDapPlan.products.find(p => p.productId === 'mop');

assert(dapItem !== undefined && dapItem.exactQuantityKg === 108.7, `DAP exact qty matches formula (108.7 kg, got ${dapItem?.exactQuantityKg})`);
assert(dapItem?.bagsToPurchase === 3, `DAP bags to purchase is 3 (got ${dapItem?.bagsToPurchase})`);
assert(ureaItem !== undefined && ureaItem.exactQuantityKg === 218.3, `Urea exact qty matches DAP offset formula (218.3 kg, got ${ureaItem?.exactQuantityKg})`);
assert(ureaItem?.bagsToPurchase === 5, `Urea bags to purchase is 5 (got ${ureaItem?.bagsToPurchase})`);
assert(mopItem !== undefined && mopItem.exactQuantityKg === 83.3, `MOP exact qty matches formula (83.3 kg, got ${mopItem?.exactQuantityKg})`);
assert(mopItem?.bagsToPurchase === 2, `MOP bags to purchase is 2 (got ${mopItem?.bagsToPurchase})`);
assert(!riceDapPlan.nutrientBalance.isNutrientImbalanced, 'Rice DAP plan is balanced for Nitrogen');

// ----------------------------------------------------------------------------
// TEST GROUP 5: SSP CALCULATIONS & SECONDARY NUTRIENTS
// ----------------------------------------------------------------------------
console.log('\n5. Testing SSP Formulations & Secondary Nutrients (Rice: 120-50-50 on 1.0 ha)');
const riceSspPlan = calculateFertilizerProducts(riceDemand, 'SSP_UREA_MOP');
assert(riceSspPlan.isValid, 'Rice SSP plan is valid');

// Manual math:
// SSP Qty = 50 / 0.16 = 312.5 kg -> 7 bags (Ceil(312.5 / 50))
// Sulfur from SSP = 312.5 * 0.11 = 34.4 kg S
// Calcium from SSP = 312.5 * 0.19 = 59.4 kg Ca
// Urea Qty = 120 / 0.46 = 260.9 kg -> 6 bags (Ceil(260.9 / 45))
// MOP Qty = 50 / 0.60 = 83.3 kg -> 2 bags
const sspItem = riceSspPlan.products.find(p => p.productId === 'ssp');
const sspUreaItem = riceSspPlan.products.find(p => p.productId === 'neem_coated_urea');

assert(sspItem !== undefined && sspItem.exactQuantityKg === 312.5, `SSP exact qty is 312.5 kg (got ${sspItem?.exactQuantityKg})`);
assert(sspItem?.bagsToPurchase === 7, `SSP bags is 7 (got ${sspItem?.bagsToPurchase})`);
assert(sspItem?.nutrientsSuppliedKg.sulfur === 34.4, `SSP sulfur supplied is 34.4 kg (got ${sspItem?.nutrientsSuppliedKg.sulfur})`);
assert(sspItem?.nutrientsSuppliedKg.calcium === 59.4, `SSP calcium supplied is 59.4 kg (got ${sspItem?.nutrientsSuppliedKg.calcium})`);
assert(sspUreaItem !== undefined && sspUreaItem.exactQuantityKg === 260.9, `Urea with SSP is 260.9 kg (got ${sspUreaItem?.exactQuantityKg})`);
assert(sspUreaItem?.bagsToPurchase === 6, `Urea bags with SSP is 6 (got ${sspUreaItem?.bagsToPurchase})`);

// ----------------------------------------------------------------------------
// TEST GROUP 6: NUTRIENT IMBALANCE DETECTION
// ----------------------------------------------------------------------------
console.log('\n6. Testing Nutrient Imbalance Warning (Simulated low N / high P scenario)');
const imbalancedDemand = {
  cropId: 'custom_pulse',
  cropName: 'Custom Legume',
  scientificName: '',
  areaHectares: 1.0,
  areaAcres: 2.47,
  recommendationStatus: 'verified' as const,
  cultivationCondition: 'irrigated' as const,
  baselineRdfKgHa: { nitrogen: 10, phosphorus: 60, potassium: 20 },
  totalDemandKg: { nitrogen: 10, phosphorus: 60, potassium: 20 },
  soilTestAdjustmentApplied: false,
  warnings: [],
  isValid: true,
};
const imbalancedPlan = calculateFertilizerProducts(imbalancedDemand, 'DAP_UREA_MOP');
assert(imbalancedPlan.nutrientBalance.isNutrientImbalanced === true, 'Imbalance flag is TRUE when DAP oversupplies N');
assert(imbalancedPlan.nutrientBalance.imbalanceWarnings.length > 0, 'Imbalance warning message is generated');
assert(imbalancedPlan.products.find(p => p.productId === 'neem_coated_urea')?.exactQuantityKg === 0, 'Urea quantity is 0 when N is exceeded');

// ----------------------------------------------------------------------------
// TEST GROUP 7: SECONDARY NUTRIENT ACCOUNTING (SULPHUR, ZINC, CALCIUM)
// ----------------------------------------------------------------------------
console.log('\n7. Testing Secondary Nutrient Accounting & Incomplete Formulation Warnings');
// Case A: Groundnut with DAP (Demands 25 kg S, DAP provides 0 kg S -> Deficit & Incomplete)
const groundnutDemand = calculateNutrientDemand('groundnut', 1.0);
const groundnutDapPlan = calculateFertilizerProducts(groundnutDemand, 'DAP_UREA_MOP');
assert(!groundnutDapPlan.isRecommendationComplete, 'Groundnut with DAP is marked INCOMPLETE due to unmet Sulphur');
assert(groundnutDapPlan.secondaryNutrientAccounting.sulfur?.status === 'deficit', 'Groundnut Sulphur status is DEFICIT in DAP combination');
assert(groundnutDapPlan.secondaryNutrientAccounting.sulfur?.balanceKg === -25, 'Groundnut Sulphur deficit is -25 kg');
assert(groundnutDapPlan.warnings.some(w => w.includes('Incomplete Recommendation')), 'Incomplete recommendation warning generated for Groundnut DAP');

// Case B: Groundnut with SSP (SSP satisfies Sulphur with a surplus)
const groundnutSspPlan = calculateFertilizerProducts(groundnutDemand, 'SSP_UREA_MOP');
assert(groundnutSspPlan.isRecommendationComplete, 'Groundnut with SSP is COMPLETE (Sulphur satisfied)');
assert(groundnutSspPlan.secondaryNutrientAccounting.sulfur?.isSatisfied === true, 'Groundnut Sulphur is satisfied by SSP');
assert(groundnutSspPlan.secondaryNutrientAccounting.sulfur?.status === 'satisfied' || groundnutSspPlan.secondaryNutrientAccounting.sulfur?.status === 'surplus', 'Groundnut Sulphur has satisfied/surplus status');
assert(groundnutSspPlan.secondaryNutrientAccounting.calcium?.suppliedKg === 59.4, 'Calcium from SSP recorded (59.4 kg)');

// Case C: Rice with Zinc requirement (Rice demands 25 kg ZnSO4 eq. -> neither DAP nor SSP provides Zn)
assert(!riceDapPlan.isRecommendationComplete, 'Rice plan marked INCOMPLETE due to unmet Zinc');
assert(riceDapPlan.secondaryNutrientAccounting.zinc?.status === 'deficit', 'Rice Zinc status is DEFICIT');
assert(riceDapPlan.secondaryNutrientAccounting.zinc?.advisory?.includes('Zinc Sulfate') === true, 'Advisory explains Zinc must be applied separately');

// ----------------------------------------------------------------------------
// TEST GROUP 8: SOIL-TEST ADJUSTMENT SAFEGUARDS
// ----------------------------------------------------------------------------
console.log('\n8. Testing Soil-Test Adjustment Safeguards & Default Baseline Retention');

// Case A: Default behavior without explicit opt-in -> Retains 100% baseline RDF
const lowNDefaultDemand = calculateNutrientDemand('wheat', 1.0, { availableNitrogenKgHa: 210 });
assert(!lowNDefaultDemand.soilTestAdjustmentApplied, 'Automatic adjustment DISABLED by default for Low N');
assert(lowNDefaultDemand.totalDemandKg.nitrogen === 120, 'Baseline 120 kg N strictly retained by default');
assert(lowNDefaultDemand.soilEvaluations?.[0].ratingTier === 'low', 'Evaluation records tier as LOW');
assert(Boolean(lowNDefaultDemand.soilEvaluations?.[0]?.extractionMethod.includes('Alkaline Permanganate')), 'Method cited as Alkaline Permanganate');

// Case B: Explicit opt-in (applyGeneralizedRatingAdjustment: true) -> Applies macro ±25% scaling
const lowNOptInDemand = calculateNutrientDemand('wheat', 1.0, {
  availableNitrogenKgHa: 210,
  applyGeneralizedRatingAdjustment: true,
});
assert(lowNOptInDemand.soilTestAdjustmentApplied, 'Adjustment applied when explicitly opted-in');
assert(lowNOptInDemand.totalDemandKg.nitrogen === 150, `Low N scales +25% (120 -> 150 kg, got ${lowNOptInDemand.totalDemandKg.nitrogen})`);

const highNOptInDemand = calculateNutrientDemand('wheat', 1.0, {
  availableNitrogenKgHa: 620,
  applyGeneralizedRatingAdjustment: true,
});
assert(highNOptInDemand.totalDemandKg.nitrogen === 90, `High N scales -25% (120 -> 90 kg, got ${highNOptInDemand.totalDemandKg.nitrogen})`);

// Case C: SoilGrids Total Nitrogen Guardrail (Must NEVER adjust available N)
const soilGridsGuardrailDemand = calculateNutrientDemand('wheat', 1.0, { soilGridsTotalNitrogenGKg: 1.4 });
assert(!soilGridsGuardrailDemand.soilTestAdjustmentApplied, 'SoilGrids Total Nitrogen alone does NOT trigger available N adjustment');
assert(soilGridsGuardrailDemand.totalDemandKg.nitrogen === 120, 'Baseline 120 kg N retained when only SoilGrids total N is provided');
assert(soilGridsGuardrailDemand.warnings.some(w => w.includes('SoilGrids estimated Total Nitrogen')), 'SoilGrids non-available nitrogen warning emitted');

// ----------------------------------------------------------------------------
// TEST GROUP 9: APPLICATION SCHEDULE VALIDITY & SPLIT ALLOCATIONS
// ----------------------------------------------------------------------------
console.log('\n9. Testing Application Schedule & Split Allocations');
for (const crop of allCrops) {
  const demand = calculateNutrientDemand(crop.cropId, 1.0);
  const plan = calculateFertilizerProducts(demand, 'DAP_UREA_MOP');
  const schedule = calculateApplicationSchedule(crop.cropId, plan);

  assert(schedule.isValid, `Schedule valid for ${crop.cropId}`);
  assert(schedule.isAllocationValid, `Split percentages total 100% for ${crop.cropId}`);
  assert(schedule.stages.length > 0, `At least 1 stage created for ${crop.cropId} (found: ${schedule.stages.length})`);
  assert(
    crop.cropId === 'cover_crop_mix' ? schedule.scheduleStatus === 'provisional' : schedule.scheduleStatus === 'verified',
    `Schedule status verified for commercial crops, provisional for cover crop (${crop.cropId}: ${schedule.scheduleStatus})`
  );
}

// ----------------------------------------------------------------------------
// TEST GROUP 10: ORGANIC ALTERNATIVES & SCIENTIFIC REFERENCES
// ----------------------------------------------------------------------------
console.log('\n10. Testing Organic Alternatives Scaling & References');
const organicRice = calculateOrganicAlternatives('rice', 2.0);
assert(organicRice.isValid, 'Organic alternatives valid for Rice on 2 ha');
assert(organicRice.alternatives.length > 0, `Rice has ${organicRice.alternatives.length} organic alternatives`);
const fymRice = organicRice.alternatives.find(a => a.productName.includes('Farmyard Manure'));
assert(Boolean(fymRice?.totalFarmDoseEstimated.includes('25 Tonnes')), `FYM scaled correctly for 2 ha (12.5 * 2 = 25 Tonnes, got: ${fymRice?.totalFarmDoseEstimated})`);
assert(Boolean(fymRice?.scientificReference?.includes('ICAR-IISS')), 'FYM references ICAR-IISS LTFE research');
assert(Boolean(fymRice?.releaseAssumptions?.includes('25-30% N')), 'FYM states empirical 25-30% first-year N release');

// ----------------------------------------------------------------------------
// TEST GROUP 11: EDGE CASES & ERROR BOUNDARIES
// ----------------------------------------------------------------------------
console.log('\n11. Testing Edge Cases & Error Boundaries');
// Zero farm area
const zeroAreaDemand = calculateNutrientDemand('wheat', 0);
assert(!zeroAreaDemand.isValid, 'Zero farm area marked invalid');
assert(zeroAreaDemand.errorMessage !== undefined, 'Zero farm area provides error message');

// Negative farm area
const negAreaDemand = calculateNutrientDemand('wheat', -3.5);
assert(!negAreaDemand.isValid, 'Negative farm area marked invalid');

// Unrecognized crop ID
const unknownCropDemand = calculateNutrientDemand('non_existent_crop_xyz', 1.0);
assert(!unknownCropDemand.isValid, 'Unknown crop ID marked invalid');

// Provisional crop status preservation (Cover Crop Mix)
const coverCropDemand = calculateNutrientDemand('cover_crop_mix', 1.0);
assert(coverCropDemand.recommendationStatus === 'provisional', 'Cover crop status is provisional');
assert(coverCropDemand.totalDemandKg.nitrogen === 0, 'Cover crop synthetic nitrogen is 0 kg/ha');

console.log('\n===============================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
console.log('===============================================================');

if (passedTests === totalTests) {
  console.log('\nALL TESTS PASSED WITH ZERO FAILURES!\n');
} else {
  console.error('\nSOME TESTS FAILED. CHECK LOGS ABOVE.\n');
  process.exit(1);
}
