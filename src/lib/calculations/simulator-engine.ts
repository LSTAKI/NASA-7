// ARACHNOVA Rotation Strategy Simulator Engine
// Scientifically compares 4 multi-season cropping strategies for the active farm

import { Farm, RotationStrategy, FarmerPriorities } from '@/types';

export function generateStrategiesForFarm(farm: Farm, priorities: FarmerPriorities): RotationStrategy[] {
  const currentCropsList = farm.currentCrops.length > 0 ? farm.currentCrops : ['maize'];
  const primaryCrop = currentCropsList[0];

  // 1. Existing Farming Practice (Baseline)
  const baselineSequence = [primaryCrop, primaryCrop, primaryCrop === 'maize' ? 'soybean' : primaryCrop];
  const strategy1: RotationStrategy = {
    id: 'strat-baseline',
    title: 'Conventional Baseline Practice',
    subtitle: 'High frequency single-crop or simple 2-year rotation with standard inputs',
    cropSequence: baselineSequence.map(formatCropTitle),
    soilConsiderations: 'Continuous or near-continuous cereal/cash crop patterns gradually deplete active soil organic matter and mineralized subsoil nitrogen, increasing synthetic fertilizer reliance.',
    waterRequirements: farm.irrigationType === 'rainfed'
      ? 'Entirely vulnerable to in-season rainfall deficits during critical flowering and grain fill stages.'
      : 'High irrigation demand with risk of lowering local water tables under intensive extraction cycles.',
    climateCompatibility: 'Moderate vulnerability to prolonged heatwaves and summer dry spells due to low biological buffering.',
    potentialAdvantages: [
      'Familiar operational workflow with established local machinery and market outlets',
      'Predictable short-term cash flow under favorable weather conditions'
    ],
    potentialRisks: [
      'Accumulation of specialized soil-borne pests (e.g., corn rootworm, nematodes)',
      'Subsoil plow pan compaction from repeated passes during similar seasonal windows',
      'Increased fertilizer runoff and tile drainage nitrate losses'
    ],
    dataConfidence: 'High',
    metrics: {
      organicMatterImpact: 'Slight Depletion',
      waterUsageIndex: 'High (Demanding)',
      nitrogenBalance: 'Deficit (-N)',
      soilCoverDuration: '5 - 6 months / year'
    }
  };

  // 2. Nutrient-Cycling Strategy
  const nutrientSequence = [primaryCrop, 'soybean', 'wheat', 'chickpea'];
  const strategy2: RotationStrategy = {
    id: 'strat-nutrient',
    title: 'Nutrient-Cycling & Biological N2 Fixation',
    subtitle: 'Alternates nitrogen-demanding cereals with nodulated legumes and catch crops',
    cropSequence: nutrientSequence.map(formatCropTitle),
    soilConsiderations: 'Biological nodulation via symbiotic rhizobia adds labile nitrogen to the top 0-30cm horizon. Root exudates from pulses mobilize previously fixed soil phosphorus.',
    waterRequirements: 'Balanced water consumption. Pulse crops utilize residual post-monsoon soil moisture, reducing the aggregate seasonal irrigation footprint.',
    climateCompatibility: 'Robust thermal resilience. Staggered sowing windows hedge against mid-summer heat stress spikes.',
    potentialAdvantages: [
      'Substantially lowers synthetic nitrogen fertilizer expenditures (estimated 40-70 kg N/ha biological input)',
      'Breaks cereal take-all and fungal root rot cycles',
      'Maintains favorable soil carbon-to-nitrogen (C:N) ratio for microbial soil respiration'
    ],
    potentialRisks: [
      'Legumes require meticulous weed control in early stages before canopy closure',
      'Susceptibility to fungal root rots if fields experience extended waterlogging'
    ],
    dataConfidence: 'High',
    metrics: {
      organicMatterImpact: 'Positive',
      waterUsageIndex: 'Moderate',
      nitrogenBalance: 'Surplus (+N)',
      soilCoverDuration: '8 - 9 months / year'
    }
  };

  // 3. Water-Conscious Strategy
  const waterSequence = ['pearl_millet', 'chickpea', 'sorghum', 'groundnut'];
  const strategy3: RotationStrategy = {
    id: 'strat-water',
    title: 'Water-Conscious & Drought-Resilient System',
    subtitle: 'Prioritizes C4 cereals, deep taproots, and low-transpiration dryland pulses',
    cropSequence: waterSequence.map(formatCropTitle),
    soilConsiderations: 'Deep penetrating root architectures (up to 1.8m in pearl millet and chickpea) exploit subsoil moisture bands and break dense compacted soil layers naturally.',
    waterRequirements: 'Lowest seasonal water consumption. Requires 40-55% less water volume than continuous rice or maize monocultures.',
    climateCompatibility: 'Exceptional tolerance to high temperature extremes (>35°C) and irregular rainfall patterns typical of semi-arid regions.',
    potentialAdvantages: [
      'Ensures harvestable grain and forage even during severe drought years',
      'Significantly lowers energy and pumping costs for irrigated farms',
      'Sorgoleone root exudates provide natural weed suppression in subsequent plantings'
    ],
    potentialRisks: [
      'Local market grain pricing for coarse cereals may fluctuate compared to staple white maize or wheat',
      'Requires seed drill calibration for differing grain sizes'
    ],
    dataConfidence: 'Moderate',
    metrics: {
      organicMatterImpact: 'Neutral',
      waterUsageIndex: 'Low (Conserving)',
      nitrogenBalance: 'Balanced',
      soilCoverDuration: '7 - 8 months / year'
    }
  };

  // 4. Soil-Protection & Carbon Regeneration Strategy
  const soilProtectionSequence = [primaryCrop, 'cover_crop_mix', 'soybean', 'wheat', 'cover_crop_mix'];
  const strategy4: RotationStrategy = {
    id: 'strat-soil-protect',
    title: 'Soil-Protection & Carbon Regeneration',
    subtitle: 'Year-round living roots with multi-species cover crops and bio-drilling species',
    cropSequence: soilProtectionSequence.map(formatCropTitle),
    soilConsiderations: 'Living roots present year-round stimulate mycorrhizal fungi and increase water infiltration rates. Tillage radish taproots physically shatter compaction zones.',
    waterRequirements: 'Moderate. Cover crop biomass reduces surface evaporation and keeps soil temperatures cooler during dry hot periods, though spring termination timing is essential.',
    climateCompatibility: 'High climate adaptation. Continuous canopy cover buffers soil surface from extreme temperature swings and high-intensity rainfall erosive forces.',
    potentialAdvantages: [
      'Protects topsoil from severe wind and water erosion during fallow periods',
      'Suppresses up to 80% of annual weed emergence via heavy organic surface residue mulch',
      'Substantially improves long-term soil aggregate stability and cation exchange capacity (CEC)'
    ],
    potentialRisks: [
      'Requires timely cover crop termination (roller-crimper or mowing) to prevent moisture drawdown in dry springs',
      'Additional seed expenditure for multi-species cover crop seed blends'
    ],
    dataConfidence: 'High',
    metrics: {
      organicMatterImpact: 'Positive',
      waterUsageIndex: 'Moderate',
      nitrogenBalance: 'Surplus (+N)',
      soilCoverDuration: '11 - 12 months / year'
    }
  };

  return [strategy1, strategy2, strategy3, strategy4];
}

function formatCropTitle(id: string): string {
  const map: Record<string, string> = {
    maize: 'Maize (Corn)',
    soybean: 'Soybean',
    wheat: 'Winter Wheat',
    chickpea: 'Chickpea',
    pearl_millet: 'Pearl Millet',
    sorghum: 'Sorghum',
    rice: 'Rice',
    groundnut: 'Groundnut',
    cotton: 'Cotton',
    cover_crop_mix: 'Multi-Species Cover Crop'
  };
  return map[id] || id;
}
