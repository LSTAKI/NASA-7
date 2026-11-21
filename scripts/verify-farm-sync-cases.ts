// Test script for verifying the exact 5 cases for Farm Identity and Area Synchronization
import {
  calculateNutrientDemand,
  calculateFertilizerProducts,
  hectaresToAcres,
  acresToHectares,
  roundTo,
} from '../src/lib/calculations/fertilizer-engine';

// Mocking the state transition logic from FertilizerPlanner.tsx:
interface PlannerState {
  farmId?: string;
  farmName?: string;
  initialCropId: string;
  initialAreaHectares: number;
  // internal states
  prevFarmKey?: string;
  prevInitialCropId: string;
  prevInitialAreaHectares: number;
  selectedCropId: string;
  areaUnit: 'ha' | 'acres';
  areaValue: number;
}

function createPlanner(props: {
  farmId?: string;
  farmName?: string;
  initialCropId?: string;
  initialAreaHectares?: number;
}): PlannerState {
  const farmIdentityKey = props.farmId !== undefined ? props.farmId : props.farmName;
  const initialCrop = props.initialCropId || 'wheat';
  const initialArea = props.initialAreaHectares || 0;
  return {
    farmId: props.farmId,
    farmName: props.farmName,
    initialCropId: initialCrop,
    initialAreaHectares: initialArea,
    prevFarmKey: farmIdentityKey,
    prevInitialCropId: initialCrop,
    prevInitialAreaHectares: initialArea,
    selectedCropId: initialCrop,
    areaUnit: 'ha',
    areaValue: (typeof initialArea === 'number' && Number.isFinite(initialArea) && initialArea > 0) ? initialArea : 0,
  };
}

function receiveNewProps(
  state: PlannerState,
  newProps: {
    farmId?: string;
    farmName?: string;
    initialCropId?: string;
    initialAreaHectares?: number;
  }
): PlannerState {
  const next = { ...state, ...newProps };
  const farmIdentityKey = next.farmId !== undefined ? next.farmId : next.farmName;

  // 1. Synchronize crop
  if (next.initialCropId !== next.prevInitialCropId) {
    next.prevInitialCropId = next.initialCropId;
    next.selectedCropId = next.initialCropId;
  }

  // 2. Detect farm identity change OR area change
  const isFarmChanged = farmIdentityKey !== next.prevFarmKey ||
                        next.initialAreaHectares !== next.prevInitialAreaHectares;

  if (isFarmChanged) {
    next.prevFarmKey = farmIdentityKey;
    next.prevInitialAreaHectares = next.initialAreaHectares;
    if (typeof next.initialAreaHectares === 'number' && Number.isFinite(next.initialAreaHectares) && next.initialAreaHectares > 0) {
      next.areaValue = next.areaUnit === 'acres' ? roundTo(hectaresToAcres(next.initialAreaHectares), 1) : next.initialAreaHectares;
    } else {
      next.areaValue = 0;
    }
  }

  return next;
}

function userManualEditArea(state: PlannerState, newArea: number): PlannerState {
  return { ...state, areaValue: newArea };
}

function userToggleUnit(state: PlannerState, newUnit: 'ha' | 'acres'): PlannerState {
  if (newUnit === state.areaUnit) return state;
  const newAreaValue = newUnit === 'acres'
    ? roundTo(state.areaValue * 2.47105, 1)
    : roundTo(state.areaValue * 0.404686, 1);
  return { ...state, areaUnit: newUnit, areaValue: newAreaValue };
}

function getEffectiveHectares(state: PlannerState): number {
  if (!Number.isFinite(state.areaValue) || state.areaValue <= 0) return 0;
  return state.areaUnit === 'acres' ? acresToHectares(state.areaValue) : state.areaValue;
}

console.log('===============================================================');
console.log('VERIFYING 5 EXACT CASES OF FARM IDENTITY & AREA SYNCHRONIZATION');
console.log('===============================================================');

let passed = 0;
let total = 0;

function check(cond: boolean, name: string, detail?: string) {
  total++;
  if (cond) {
    passed++;
    console.log(`[PASS] ${name}`);
  } else {
    console.error(`[FAIL] ${name} ${detail ? `- ${detail}` : ''}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// CASE 1: Farm A (12.5 ha) -> manually enter 10.0 ha
// -------------------------------------------------------------
console.log('\n--- CASE 1: Farm A (12.5 ha) -> manual override to 10.0 ha ---');
let planner = createPlanner({
  farmId: 'farm-a',
  farmName: 'Farm Alpha',
  initialCropId: 'wheat',
  initialAreaHectares: 12.5,
});

check(planner.areaValue === 12.5, 'Initial area is 12.5 ha');
check(planner.areaUnit === 'ha', 'Initial unit is ha');

// Farmer manually edits area to 10.0 ha
planner = userManualEditArea(planner, 10.0);
check(planner.areaValue === 10.0, 'Manually entered area is 10.0 ha');

let effHa = getEffectiveHectares(planner);
check(effHa === 10.0, 'Effective area is 10.0 ha');
let wheat10Demand = calculateNutrientDemand('wheat', effHa);
check(wheat10Demand.totalDemandKg.nitrogen === 1200, `Wheat on 10 ha requires 1200 kg N (120*10), got: ${wheat10Demand.totalDemandKg.nitrogen}`);

// -------------------------------------------------------------
// CASE 2: Switch to Farm B (12.5 ha) -> planner must reset to 12.5 ha
// -------------------------------------------------------------
console.log('\n--- CASE 2: Switch to Farm B (12.5 ha) -> must reset to 12.5 ha ---');
planner = receiveNewProps(planner, {
  farmId: 'farm-b',
  farmName: 'Farm Beta',
  initialAreaHectares: 12.5,
});

check(planner.farmId === 'farm-b', 'Active farm ID is farm-b');
check(planner.areaValue === 12.5, 'Planner area reset from 10.0 ha back to 12.5 ha (manual override cleared)');
effHa = getEffectiveHectares(planner);
check(effHa === 12.5, 'Effective area is 12.5 ha');
let wheat12Demand = calculateNutrientDemand('wheat', effHa);
check(wheat12Demand.totalDemandKg.nitrogen === 1500, `Wheat on 12.5 ha requires 1500 kg N (120*12.5), got: ${wheat12Demand.totalDemandKg.nitrogen}`);
let wheat12Plan = calculateFertilizerProducts(wheat12Demand, 'DAP_UREA_MOP');
const urea12 = wheat12Plan.products.find(p => p.productId.includes('urea'));
check(urea12?.exactQuantityKg === 2622.9, `Urea exact quantity is 2622.9 kg (got: ${urea12?.exactQuantityKg})`);
check(urea12?.bagsToPurchase === 59, `Urea bags to purchase is 59 bags (got: ${urea12?.bagsToPurchase})`);

// -------------------------------------------------------------
// CASE 3: Switch to Farm C (0 ha) -> planner must reset to 0
// -------------------------------------------------------------
console.log('\n--- CASE 3: Switch to Farm C (0 ha) -> must reset to 0 ---');
planner = receiveNewProps(planner, {
  farmId: 'farm-c',
  farmName: 'Farm Gamma',
  initialAreaHectares: 0,
});

check(planner.farmId === 'farm-c', 'Active farm ID is farm-c');
check(planner.areaValue === 0, 'Planner area reset to 0');
effHa = getEffectiveHectares(planner);
check(effHa === 0, 'Effective area is 0 ha');
let demand0 = calculateNutrientDemand('wheat', effHa);
check(!demand0.isValid, 'Nutrient demand calculation is marked invalid for 0 ha');
check(demand0.totalDemandKg.nitrogen === 0, 'Required nitrogen is 0 kg');
let plan0 = calculateFertilizerProducts(demand0, 'DAP_UREA_MOP');
check(!plan0.isValid, 'Fertilizer product plan is marked invalid for 0 ha');
check(plan0.products.length === 0, 'No products returned for 0 ha');

// -------------------------------------------------------------
// CASE 4: Change crop on Farm B -> manually entered area must remain unchanged
// -------------------------------------------------------------
console.log('\n--- CASE 4: Change crop on Farm B -> manual area preserved ---');
// Switch back to Farm B and enter manual area 10.0 ha
planner = receiveNewProps(planner, {
  farmId: 'farm-b',
  farmName: 'Farm Beta',
  initialAreaHectares: 12.5,
});
check(planner.areaValue === 12.5, 'Farm B initial area is 12.5 ha');
planner = userManualEditArea(planner, 10.0);
check(planner.areaValue === 10.0, 'Farm B manual area is 10.0 ha');

// Change crop from wheat to chickpea WITHOUT changing farm
planner = receiveNewProps(planner, {
  initialCropId: 'chickpea',
  farmId: 'farm-b',
  initialAreaHectares: 12.5,
});

check(planner.selectedCropId === 'chickpea', 'Selected crop updated to chickpea');
check(planner.areaValue === 10.0, 'Manually entered area 10.0 ha is preserved when crop changes');
check(planner.areaUnit === 'ha', 'Unit remains ha');
effHa = getEffectiveHectares(planner);
check(effHa === 10.0, 'Effective area remains 10.0 ha');

// Verify chickpea calculation on 10 ha (RDF: 20-40-20)
let chickpeaDemand = calculateNutrientDemand('chickpea', effHa);
check(chickpeaDemand.totalDemandKg.nitrogen === 200, `Chickpea on 10 ha requires 200 kg N (20*10), got: ${chickpeaDemand.totalDemandKg.nitrogen}`);
check(chickpeaDemand.totalDemandKg.phosphorus === 400, `Chickpea on 10 ha requires 400 kg P2O5 (40*10), got: ${chickpeaDemand.totalDemandKg.phosphorus}`);
check(chickpeaDemand.totalDemandKg.potassium === 200, `Chickpea on 10 ha requires 200 kg K2O (20*10), got: ${chickpeaDemand.totalDemandKg.potassium}`);

// -------------------------------------------------------------
// CASE 5: Repeat farm-switch tests with 'acres' selected
// -------------------------------------------------------------
console.log('\n--- CASE 5: Farm switch with acres selected ---');
// Start with Farm A (12.5 ha) and switch to acres
planner = createPlanner({
  farmId: 'farm-a',
  farmName: 'Farm Alpha',
  initialCropId: 'wheat',
  initialAreaHectares: 12.5,
});
planner = userToggleUnit(planner, 'acres');
check(planner.areaUnit === 'acres', 'Unit toggled to acres');
check(planner.areaValue === 30.9, `Farm A area in acres is 30.9 (got: ${planner.areaValue})`);

// Farmer manually changes area to 25.0 acres
planner = userManualEditArea(planner, 25.0);
check(planner.areaValue === 25.0, 'Manually edited area is 25.0 acres');

// Farmer switches to Farm B (12.5 ha)
planner = receiveNewProps(planner, {
  farmId: 'farm-b',
  farmName: 'Farm Beta',
  initialAreaHectares: 12.5,
});

check(planner.farmId === 'farm-b', 'Active farm ID is farm-b');
check(planner.areaUnit === 'acres', 'Area unit "acres" is preserved on farm switch');
check(planner.areaValue === 30.9, `Planner reset from 25.0 acres back to 30.9 acres (got: ${planner.areaValue})`);
effHa = getEffectiveHectares(planner);
check(roundTo(effHa, 2) === 12.5, `Effective area converted back to hectares is 12.5 ha (got: ${effHa})`);

// Farmer switches to Farm C (0 ha) while in acres mode
planner = receiveNewProps(planner, {
  farmId: 'farm-c',
  farmName: 'Farm Gamma',
  initialAreaHectares: 0,
});

check(planner.farmId === 'farm-c', 'Active farm ID is farm-c');
check(planner.areaUnit === 'acres', 'Area unit "acres" is preserved when switching to Farm C');
check(planner.areaValue === 0, 'Planner area reset to 0 in acres mode');
effHa = getEffectiveHectares(planner);
check(effHa === 0, 'Effective area is 0 ha');
let cDemandAcres = calculateNutrientDemand('wheat', effHa);
check(!cDemandAcres.isValid, 'Nutrient demand invalid for 0 ha in acres mode');
let cPlanAcres = calculateFertilizerProducts(cDemandAcres, 'DAP_UREA_MOP');
check(!cPlanAcres.isValid, 'Fertilizer plan invalid for 0 ha in acres mode');
check(cPlanAcres.products.length === 0, 'No products returned for 0 ha in acres mode');

console.log('\n===============================================================');
console.log(`TOTAL RESULT: ${passed} / ${total} TESTS PASSED`);
console.log('===============================================================');
