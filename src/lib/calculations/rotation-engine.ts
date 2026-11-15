// ARACHNOVA Explainable Crop Rotation Scoring Engine
// Evaluates agronomic compatibility, nutrient dynamics, water footprints, and farmer preferences

import { Crop, CropRotationScore, Farm, FarmerPriorities } from '@/types';
import { CROP_DATABASE } from '@/data/crops/crop-database';

export function evaluateCropRotation(
  candidateCrop: Crop,
  farm: Farm,
  previousCrops: string[],
  priorities: FarmerPriorities,
  avgAnnualRainfall = 600,
  avgTemp = 22
): CropRotationScore {
  const previousCropIds = previousCrops.map(c => c.toLowerCase());
  const immediatePreviousId = previousCropIds[previousCropIds.length - 1] || '';
  const immediatePreviousCrop = CROP_DATABASE.find(c => c.id === immediatePreviousId);

  // 1. Soil Compatibility
  let soilScore = 75;
  let soilRationale = 'Moderate soil suitability based on general regional soil profiles.';

  if (farm.soil?.phH2O) {
    const ph = farm.soil.phH2O;
    if (ph >= candidateCrop.soilPhPreference.min && ph <= candidateCrop.soilPhPreference.max) {
      soilScore = 95;
      soilRationale = `Optimal soil pH match (${ph.toFixed(1)} is within preferred range ${candidateCrop.soilPhPreference.min}-${candidateCrop.soilPhPreference.max}).`;
    } else {
      const diff = Math.min(
        Math.abs(ph - candidateCrop.soilPhPreference.min),
        Math.abs(ph - candidateCrop.soilPhPreference.max)
      );
      if (diff > 1.2) {
        soilScore = 40;
        soilRationale = `Sub-optimal soil pH (${ph.toFixed(1)} vs preferred ${candidateCrop.soilPhPreference.min}-${candidateCrop.soilPhPreference.max}); may require liming or amendment.`;
      } else {
        soilScore = 65;
        soilRationale = `Marginal soil pH tolerance (${ph.toFixed(1)}); acceptable with standard management.`;
      }
    }
  }

  // 2. Climate & Season Compatibility
  let climateScore = 80;
  let climateRationale = `Temperature of ~${avgTemp.toFixed(1)}°C fits ${candidateCrop.name} growth envelope (${candidateCrop.optimalTemperatureC.min}-${candidateCrop.optimalTemperatureC.max}°C).`;

  if (avgTemp < candidateCrop.optimalTemperatureC.min || avgTemp > candidateCrop.optimalTemperatureC.max) {
    climateScore = 50;
    climateRationale = `Local temperature (~${avgTemp.toFixed(1)}°C) falls outside peak thermal range (${candidateCrop.optimalTemperatureC.min}-${candidateCrop.optimalTemperatureC.max}°C).`;
  }

  // 3. Water Balance Suitability
  let waterScore = 75;
  let waterRationale = '';
  const isIrrigated = farm.irrigationType !== 'rainfed';

  if (candidateCrop.waterRequirement === 'low') {
    waterScore = 90;
    waterRationale = 'Low water footprint reduces drought vulnerability and safeguards subsoil moisture.';
  } else if (candidateCrop.waterRequirement === 'moderate') {
    waterScore = isIrrigated ? 85 : (avgAnnualRainfall >= 450 ? 80 : 60);
    waterRationale = isIrrigated
      ? 'Moderate water need supported by active farm irrigation infrastructure.'
      : 'Moderate water need matches local seasonal precipitation trends.';
  } else {
    // High or Very High
    waterScore = isIrrigated ? 75 : (avgAnnualRainfall >= 750 ? 70 : 45);
    waterRationale = isIrrigated
      ? 'High water requirements require scheduled irrigation monitoring to prevent yield penalties.'
      : 'High water requirements pose moisture stress risk under purely rainfed dry spells.';
  }

  // 4. Nutrient Cycling Benefit
  let nutrientScore = 70;
  let nutrientRationale = 'Maintains balanced soil nutrient turnover.';

  if (candidateCrop.nitrogenImpact === 'fixer') {
    if (immediatePreviousCrop?.nitrogenImpact === 'heavy_feeder') {
      nutrientScore = 98;
      nutrientRationale = `Outstanding biological N2 fixation directly following heavy feeder (${immediatePreviousCrop.name}), restoring nitrogen reserves.`;
    } else {
      nutrientScore = 90;
      nutrientRationale = 'Active legume nodulation adds biological nitrogen to the soil bank, reducing synthetic fertilizer needs.';
    }
  } else if (candidateCrop.nitrogenImpact === 'heavy_feeder') {
    if (immediatePreviousCrop?.nitrogenImpact === 'fixer') {
      nutrientScore = 85;
      nutrientRationale = `Cereal heavy feeder effectively utilizes residual nitrogen left by preceding ${immediatePreviousCrop.name}.`;
    } else if (immediatePreviousCrop?.nitrogenImpact === 'heavy_feeder') {
      nutrientScore = 35;
      nutrientRationale = `Successive heavy feeders deplete identical soil nitrogen and nutrient horizons.`;
    } else {
      nutrientScore = 60;
      nutrientRationale = 'Standard nutrient uptake; recommend targeted basal organic application.';
    }
  }

  // 5. Crop Family Diversity & Pest Breaks
  let diversityScore = 85;
  let diversityRationale = 'Introduces diverse botanical family, interrupting pest and pathogen cycles.';

  if (immediatePreviousCrop) {
    if (immediatePreviousCrop.family === candidateCrop.family) {
      diversityScore = 30;
      diversityRationale = `Monoculture / repeat family alert: both crops belong to ${candidateCrop.family}. Elevated root rot, nematode, and insect pressure risk.`;
    } else {
      diversityScore = 95;
      diversityRationale = `Rotational family shift from ${immediatePreviousCrop.family} to ${candidateCrop.family} effectively breaks host pest lifecycles.`;
    }
  }

  // 6. Farmer Priorities Weighting
  const totalWeight = priorities.soilHealth + priorities.waterConservation + priorities.economicYield + priorities.pestDiseaseBreak;
  const wSoil = priorities.soilHealth / totalWeight;
  const wWater = priorities.waterConservation / totalWeight;
  const wYield = priorities.economicYield / totalWeight;
  const wPest = priorities.pestDiseaseBreak / totalWeight;

  // Approximate economic yield score based on crop cash value & yield stability
  const economicIndex = candidateCrop.nitrogenImpact === 'heavy_feeder' || candidateCrop.id === 'cotton' || candidateCrop.id === 'soybean' ? 88 : 74;

  const priorityScore = Math.round(
    soilScore * wSoil * 0.3 +
    waterScore * wWater * 0.3 +
    economicIndex * wYield * 0.2 +
    diversityScore * wPest * 0.2
  );

  const farmerRationale = `Aligned with high priority on ${
    priorities.soilHealth >= 4 ? 'Soil Health' : (priorities.waterConservation >= 4 ? 'Water Conservation' : 'Yield & Pest Resistance')
  }.`;

  // Compute Overall Weighted Score (0 - 100)
  const overallScore = Math.round(
    soilScore * 0.20 +
    climateScore * 0.15 +
    waterScore * 0.20 +
    nutrientScore * 0.20 +
    diversityScore * 0.15 +
    priorityScore * 0.10
  );

  // Key Advantages
  const keyAdvantages: string[] = [];
  if (candidateCrop.nitrogenImpact === 'fixer') keyAdvantages.push('Biological atmospheric nitrogen fixation (reduces synthetic urea dependency).');
  if (candidateCrop.waterRequirement === 'low') keyAdvantages.push('Exceptional drought resilience and low evaporative water consumption.');
  if (candidateCrop.rootDepth === 'deep') keyAdvantages.push('Deep root architecture penetrates subsoil hardpan and mines deep moisture.');
  if (candidateCrop.coverCropCapable) keyAdvantages.push('High biomass ground canopy reduces rainfall erosion and suppresses weeds.');
  if (diversityScore > 80) keyAdvantages.push('Breaks persistent host-specific root fungal pathogens.');

  // Management Tips
  const managementTips: string[] = [
    `Ensure seed inoculation with appropriate Rhizobium strain if planting legumes on uncultivated ground.`,
    `Monitor soil moisture at seeding; optimal depth corresponds to ${candidateCrop.rootDepth} rooting dynamics.`
  ];

  return {
    crop: candidateCrop,
    overallScore: Math.min(100, Math.max(10, overallScore)),
    breakdown: {
      soilCompatibility: { score: soilScore, rationale: soilRationale },
      climateCompatibility: { score: climateScore, rationale: climateRationale },
      waterBalanceSuitability: { score: waterScore, rationale: waterRationale },
      nutrientCyclingBenefit: { score: nutrientScore, rationale: nutrientRationale },
      familyDiversityScore: { score: diversityScore, rationale: diversityRationale },
      farmerPriorityFit: { score: priorityScore, rationale: farmerRationale }
    },
    keyAdvantages: keyAdvantages.length ? keyAdvantages : candidateCrop.rotationBenefits.slice(0, 2),
    managementTips,
    confidence: farm.soil?.source === 'soilgrids' || farm.soil?.source === 'manual_test' ? 'high' : 'moderate'
  };
}

export function rankAllCropsForFarm(
  farm: Farm,
  previousCrops: string[],
  priorities: FarmerPriorities
): CropRotationScore[] {
  return CROP_DATABASE.map(crop => evaluateCropRotation(crop, farm, previousCrops, priorities))
    .sort((a, b) => b.overallScore - a.overallScore);
}
