// ARACHNOVA - Smart Fertilizer Planner Calculation Engine Test Suite
// Verifies nutrient demand, DAP offsets, SSP formulations, bag calculations,
// split application allocations, soil-test adjustments, and error boundary handling.

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
console.log('ARACHNOVA FERTILIZER ENGINE COMPREHENSIVE VERIFICATION SUITE');
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
assert(!riceDapPlan.nutrientBalance.isNutrientImbalanced, 'Rice DAP plan is balanced');

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
// Synthetic test: Crop demand with 10 kg N and 60 kg P2O5
// DAP required for 60 kg P2O5 = 60 / 0.46 = 130.43 kg DAP
// N supplied by this DAP = 130.43 * 0.18 = 23.48 kg N > 10 kg target N!
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
// TEST GROUP 7: APPLICATION SCHEDULE & SPLIT PERCENTAGES
// ----------------------------------------------------------------------------
console.log('\n7. Testing Application Schedule & Split Allocations');
for (const crop of allCrops) {
  const demand = calculateNutrientDemand(crop.cropId, 1.0);
  const plan = calculateFertilizerProducts(demand, 'DAP_UREA_MOP');
  const schedule = calculateApplicationSchedule(crop.cropId, plan);

  assert(schedule.isValid, `Schedule valid for ${crop.cropId}`);
  assert(schedule.isAllocationValid, `Split percentages total 100% for ${crop.cropId}`);
  assert(schedule.stages.length > 0, `At least 1 stage created for ${crop.cropId} (found: ${schedule.stages.length})`);

  // Verify basal stage has products
  const basalStage = schedule.stages[0];
  assert(basalStage.stageProducts.length > 0, `Basal stage has allocated products for ${crop.cropId}`);
}

// ----------------------------------------------------------------------------
// TEST GROUP 8: ORGANIC ALTERNATIVES SCALING
// ----------------------------------------------------------------------------
console.log('\n8. Testing Organic Alternatives Scaling');
const organicRice = calculateOrganicAlternatives('rice', 2.0);
assert(organicRice.isValid, 'Organic alternatives valid for Rice on 2 ha');
assert(organicRice.alternatives.length > 0, `Rice has ${organicRice.alternatives.length} organic alternatives`);
const fymRice = organicRice.alternatives.find(a => a.productName.includes('Farmyard Manure'));
assert(Boolean(fymRice?.totalFarmDoseEstimated.includes('25 Tonnes')), `FYM scaled correctly for 2 ha (12.5 * 2 = 25 Tonnes, got: ${fymRice?.totalFarmDoseEstimated})`);

// ----------------------------------------------------------------------------
// TEST GROUP 9: SOIL-TEST ADJUSTMENTS & SCIENTIFIC GUARDRAILS
// ----------------------------------------------------------------------------
console.log('\n9. Testing Soil-Test Adjustments & Scientific Guardrails');
// Case A: Low Available N (< 280 kg/ha) -> +25% adjustment
const lowNDemand = calculateNutrientDemand('wheat', 1.0, { availableNitrogenKgHa: 210 });
assert(lowNDemand.soilTestAdjustmentApplied, 'Adjustment applied for Low Available N');
assert(lowNDemand.totalDemandKg.nitrogen === 150, `Low N (+25%) scales 120 -> 150 kg (got ${lowNDemand.totalDemandKg.nitrogen})`);

// Case B: High Available N (> 560 kg/ha) -> -25% adjustment
const highNDemand = calculateNutrientDemand('wheat', 1.0, { availableNitrogenKgHa: 620 });
assert(highNDemand.totalDemandKg.nitrogen === 90, `High N (-25%) scales 120 -> 90 kg (got ${highNDemand.totalDemandKg.nitrogen})`);

// Case C: Medium Available N (280 - 560 kg/ha) -> 100% baseline RDF
const medNDemand = calculateNutrientDemand('wheat', 1.0, { availableNitrogenKgHa: 350 });
assert(medNDemand.totalDemandKg.nitrogen === 120, `Medium N retains 100% baseline 120 kg (got ${medNDemand.totalDemandKg.nitrogen})`);

// Case D: SoilGrids Total Nitrogen Guardrail (Must NOT adjust available N)
const soilGridsGuardrailDemand = calculateNutrientDemand('wheat', 1.0, { soilGridsTotalNitrogenGKg: 1.4 });
assert(!soilGridsGuardrailDemand.soilTestAdjustmentApplied, 'SoilGrids Total Nitrogen alone does NOT trigger available N adjustment');
assert(soilGridsGuardrailDemand.totalDemandKg.nitrogen === 120, 'Baseline 120 kg N retained when only SoilGrids total N is provided');
assert(soilGridsGuardrailDemand.warnings.some(w => w.includes('SoilGrids estimated Total Nitrogen')), 'SoilGrids non-available nitrogen warning emitted');

// ----------------------------------------------------------------------------
// TEST GROUP 10: EDGE CASES & ERROR BOUNDARIES
// ----------------------------------------------------------------------------
console.log('\n10. Testing Edge Cases & Error Boundaries');
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
