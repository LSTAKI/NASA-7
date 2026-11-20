// ARACHNOVA Agronomic Knowledge Base
// Indicative values based on FAO EcoCrop and USDA Agronomy Handbooks
// All values represent regional agricultural ranges, not rigid universal constraints.

import { Crop } from '@/types';

export const CROP_DATABASE: Crop[] = [
  {
    id: 'maize',
    name: 'Maize (Corn)',
    scientificName: 'Zea mays',
    family: 'Poaceae (Gramineae)',
    category: 'cereal',
    durationDays: { min: 90, max: 140 },
    waterRequirement: 'high',
    optimalRainfallMm: { min: 500, max: 800 },
    optimalTemperatureC: { min: 18, max: 32 },
    soilPhPreference: { min: 5.8, max: 7.0 },
    soilTexturePreferences: ['Loam', 'Silt Loam', 'Clay Loam'],
    nitrogenImpact: 'heavy_feeder',
    rootDepth: 'deep',
    rootDescription: 'Extensive fibrous root system down to 1.5m; breaks lower compaction but heavily depletes soil nitrogen and moisture.',
    rotationBenefits: [
      'High biomass residue returns carbon to the soil',
      'Breaks broadleaf weed and disease cycles',
      'Excellent companion to preceding legume green manures'
    ],
    risksAndPestVulnerabilities: [
      'Vulnerable to continuous cropping rootworm (Diabrotica) and fungal stalk rots',
      'Leaves soil exposed early in growth cycle (erosion risk)'
    ],
    seasonsSuitable: ['kharif', 'summer', 'spring'],
    coverCropCapable: false,
  },
  {
    id: 'soybean',
    name: 'Soybean',
    scientificName: 'Glycine max',
    family: 'Fabaceae (Leguminosae)',
    category: 'legume',
    durationDays: { min: 85, max: 125 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 450, max: 700 },
    optimalTemperatureC: { min: 20, max: 30 },
    soilPhPreference: { min: 6.0, max: 7.2 },
    soilTexturePreferences: ['Loam', 'Sandy Clay Loam', 'Silt Loam'],
    nitrogenImpact: 'fixer',
    rootDepth: 'medium',
    rootDescription: 'Well-developed taproot (0.9-1.2m) with Bradyrhizobium japonicum nodulation for biological nitrogen fixation.',
    rotationBenefits: [
      'Fixes 40-100 kg N/ha via symbiotic nodulation, reducing synthetic N requirements for following cereal',
      'Breaks cereal root rots and nematode cycles',
      'Leaves friable soil structure favoring minimal tillage'
    ],
    risksAndPestVulnerabilities: [
      'Low residue leaves soil vulnerable to post-harvest erosion',
      'Susceptible to Sudden Death Syndrome (SDS) and soybean cyst nematode under tight rotations'
    ],
    seasonsSuitable: ['kharif', 'summer'],
    coverCropCapable: false,
  },
  {
    id: 'wheat',
    name: 'Winter / Spring Wheat',
    scientificName: 'Triticum aestivum',
    family: 'Poaceae (Gramineae)',
    category: 'cereal',
    durationDays: { min: 110, max: 160 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 350, max: 650 },
    optimalTemperatureC: { min: 12, max: 24 },
    soilPhPreference: { min: 6.0, max: 7.5 },
    soilTexturePreferences: ['Clay Loam', 'Loam', 'Silt Loam'],
    nitrogenImpact: 'moderate_feeder',
    rootDepth: 'medium',
    rootDescription: 'Fibrous root network (0.8-1.2m) that scavenges leftover residual nitrogen from previous summer crops.',
    rotationBenefits: [
      'Provides dense ground cover during winter/early spring, mitigating wind and water erosion',
      'High straw-to-grain ratio provides persistent soil mulch',
      'Suppresses summer annual weeds'
    ],
    risksAndPestVulnerabilities: [
      'Fusarium head blight risk when directly following maize without residue management',
      'Take-all fungus under continuous cereal monoculture'
    ],
    seasonsSuitable: ['rabi', 'winter', 'spring'],
    coverCropCapable: false,
  },
  {
    id: 'chickpea',
    name: 'Chickpea (Gram)',
    scientificName: 'Cicer arietinum',
    family: 'Fabaceae (Leguminosae)',
    category: 'legume',
    durationDays: { min: 90, max: 130 },
    waterRequirement: 'low',
    optimalRainfallMm: { min: 250, max: 450 },
    optimalTemperatureC: { min: 14, max: 26 },
    soilPhPreference: { min: 6.2, max: 8.2 },
    soilTexturePreferences: ['Sandy Loam', 'Loam', 'Clay'],
    nitrogenImpact: 'fixer',
    rootDepth: 'deep',
    rootDescription: 'Deep taproot reaching up to 1.8m, exceptionally capable of extracting subsoil moisture in dry climates.',
    rotationBenefits: [
      'Symbiotic N2 fixation (30-60 kg N/ha) suited for semi-arid dryland rotations',
      'Exudes organic acids (malic/citric) from roots, mobilizing bound soil phosphorus for following crops',
      'Low water footprint makes it ideal post-monsoon or dry-season crop'
    ],
    risksAndPestVulnerabilities: [
      'Highly sensitive to waterlogging and soil salinity',
      'Susceptible to Ascochyta blight under humid wet spells'
    ],
    seasonsSuitable: ['rabi', 'winter', 'autumn'],
    coverCropCapable: false,
  },
  {
    id: 'pearl_millet',
    name: 'Pearl Millet (Bajra)',
    scientificName: 'Pennisetum glaucum',
    family: 'Poaceae (Gramineae)',
    category: 'cereal',
    durationDays: { min: 70, max: 95 },
    waterRequirement: 'low',
    optimalRainfallMm: { min: 200, max: 450 },
    optimalTemperatureC: { min: 25, max: 38 },
    soilPhPreference: { min: 5.5, max: 7.8 },
    soilTexturePreferences: ['Sandy Loam', 'Sand', 'Light Loam'],
    nitrogenImpact: 'light_feeder',
    rootDepth: 'deep',
    rootDescription: 'Extremely efficient deep-penetrating root system (up to 2m) with rapid downward elongation to escape surface drought.',
    rotationBenefits: [
      'Superb drought tolerance; thrives on marginal, sandy, nutrient-deficient soils',
      'Effective catch crop after early summer crop failures',
      'Allelochemicals in roots suppress parasitic weeds like Striga'
    ],
    risksAndPestVulnerabilities: [
      'Downy mildew and ergot vulnerability during late rainfall events at flowering',
      'Grain shattering if harvest is delayed'
    ],
    seasonsSuitable: ['kharif', 'zaid', 'summer'],
    coverCropCapable: false,
  },
  {
    id: 'sorghum',
    name: 'Grain Sorghum (Jowar)',
    scientificName: 'Sorghum bicolor',
    family: 'Poaceae (Gramineae)',
    category: 'cereal',
    durationDays: { min: 95, max: 130 },
    waterRequirement: 'low',
    optimalRainfallMm: { min: 350, max: 600 },
    optimalTemperatureC: { min: 22, max: 35 },
    soilPhPreference: { min: 5.5, max: 8.0 },
    soilTexturePreferences: ['Clay', 'Clay Loam', 'Loam', 'Sandy Loam'],
    nitrogenImpact: 'moderate_feeder',
    rootDepth: 'deep',
    rootDescription: 'Massive root volume with high osmotic adjustment capacity, shutting stomata during severe heat without wilting.',
    rotationBenefits: [
      'High root biomass creates biopores and stabilizes soil aggregates',
      'Tolerates temporary waterlogging and moderate salinity better than maize',
      'Exudes sorgoleone, a potent natural bio-herbicide that inhibits weed seed germination'
    ],
    risksAndPestVulnerabilities: [
      'Shoot fly and stem borer susceptibility during early vegetative stages',
      'Sorgoleone residue can temporarily stunt following sensitive crops (allow 2-3 weeks rest or tillage)'
    ],
    seasonsSuitable: ['kharif', 'rabi', 'summer'],
    coverCropCapable: false,
  },
  {
    id: 'rice',
    name: 'Rice (Lowland / Upland)',
    scientificName: 'Oryza sativa',
    family: 'Poaceae (Gramineae)',
    category: 'cereal',
    durationDays: { min: 105, max: 155 },
    waterRequirement: 'very_high',
    optimalRainfallMm: { min: 1000, max: 1800 },
    optimalTemperatureC: { min: 22, max: 34 },
    soilPhPreference: { min: 5.0, max: 6.8 },
    soilTexturePreferences: ['Clay', 'Clay Loam', 'Silty Clay'],
    nitrogenImpact: 'heavy_feeder',
    rootDepth: 'shallow',
    rootDescription: 'Shallow adventitious root system (0.2-0.4m) with specialized aerenchyma tissues facilitating oxygen transport in submerged soils.',
    rotationBenefits: [
      'Puddling and flood cycles eliminate terrestrial weed seed banks',
      'Enhances anaerobic phosphorus availability in acidic soils',
      'High caloric yield per hectare in high-rainfall/irrigated ecosystems'
    ],
    risksAndPestVulnerabilities: [
      'Puddling destroys soil physical structure, forming a dense plow pan that impedes following non-rice crops',
      'High methane emissions under continuous flooding; huge water extraction'
    ],
    seasonsSuitable: ['kharif', 'summer'],
    coverCropCapable: false,
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    scientificName: 'Arachis hypogaea',
    family: 'Fabaceae (Leguminosae)',
    category: 'legume',
    durationDays: { min: 100, max: 140 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 450, max: 700 },
    optimalTemperatureC: { min: 22, max: 32 },
    soilPhPreference: { min: 5.8, max: 6.8 },
    soilTexturePreferences: ['Sandy Loam', 'Loamy Sand', 'Loam'],
    nitrogenImpact: 'fixer',
    rootDepth: 'medium',
    rootDescription: 'Moderately deep taproot system with prolific lateral roots and nodulation; pegs penetrate friable surface soils.',
    rotationBenefits: [
      'Fixes 40-80 kg N/ha, boosting succeeding cereal yields',
      'Dense foliage suppresses competitive weeds',
      'Excellent cash return in sandy, well-drained agricultural zones'
    ],
    risksAndPestVulnerabilities: [
      'Pod harvesting disturbs surface soil, increasing erosion vulnerability',
      'Aflatoxin (Aspergillus flavus) hazard if drought stress occurs near harvest'
    ],
    seasonsSuitable: ['kharif', 'zaid', 'summer'],
    coverCropCapable: false,
  },
  {
    id: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    family: 'Malvaceae',
    category: 'fiber',
    durationDays: { min: 140, max: 180 },
    waterRequirement: 'high',
    optimalRainfallMm: { min: 600, max: 950 },
    optimalTemperatureC: { min: 21, max: 35 },
    soilPhPreference: { min: 6.0, max: 8.0 },
    soilTexturePreferences: ['Deep Clay (Vertisols)', 'Clay Loam', 'Loam'],
    nitrogenImpact: 'heavy_feeder',
    rootDepth: 'deep',
    rootDescription: 'Strong deep taproot (down to 1.8m) capable of mining subsoil water in heavy soils with high water holding capacity.',
    rotationBenefits: [
      'Breaks cereal and legume specific pathogen cycles',
      'Deep root biopores improve water infiltration in tight clay soils',
      'High cash-crop economic value'
    ],
    risksAndPestVulnerabilities: [
      'Long duration limits flexibility for quick second crop',
      'High pesticide and nutrient footprint if not managed with integrated pest management (IPM)'
    ],
    seasonsSuitable: ['kharif', 'summer'],
    coverCropCapable: false,
  },
  {
    id: 'cover_crop_mix',
    name: 'Multi-Species Cover Crop (Vetch + Rye + Radish)',
    scientificName: 'Vicia villosa + Secale cereale + Raphanus sativus',
    family: 'Fabaceae (Leguminosae)',
    category: 'cover_crop',
    durationDays: { min: 50, max: 90 },
    waterRequirement: 'low',
    optimalRainfallMm: { min: 200, max: 500 },
    optimalTemperatureC: { min: 5, max: 24 },
    soilPhPreference: { min: 5.5, max: 7.5 },
    soilTexturePreferences: ['Loam', 'Sandy Loam', 'Clay Loam', 'Sand'],
    nitrogenImpact: 'fixer',
    rootDepth: 'deep',
    rootDescription: 'Daikon radish taproot drills open hardpans (bio-drilling), cereal rye builds dense surface root mass, and hairy vetch fixes active atmospheric N.',
    rotationBenefits: [
      'Continuous living roots drastically increase active soil microbial biomass and mycorrhizal colonization',
      'Prevents nutrient leaching during non-cash crop fallow windows',
      'Radish creates deep macro-pores for succeeding crop root penetration',
      'Suppresses 80%+ of spring weed seed emergence via physical mulch'
    ],
    risksAndPestVulnerabilities: [
      'Requires timely termination (crimping or mowing) before setting viable seed',
      'Can consume residual soil moisture if allowed to overgrow in dry spring zones'
    ],
    seasonsSuitable: ['rabi', 'winter', 'autumn', 'spring'],
    coverCropCapable: true,
  },

  // ----------------------------------------------------
  // HIGH-VALUE ROTATIONAL VEGETABLES
  // ----------------------------------------------------
  {
    id: 'tomato',
    name: 'Tomato (Solanaceae)',
    scientificName: 'Solanum lycopersicum',
    family: 'Solanaceae',
    category: 'vegetable',
    durationDays: { min: 75, max: 115 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 400, max: 700 },
    optimalTemperatureC: { min: 18, max: 30 },
    soilPhPreference: { min: 6.0, max: 6.8 },
    soilTexturePreferences: ['Sandy Loam', 'Loam', 'Clay Loam'],
    nitrogenImpact: 'heavy_feeder',
    rootDepth: 'medium',
    rootDescription: 'Deep branched taproot system (0.8-1.2m) with intensive lateral feeder roots scavenging surface phosphorus and potassium.',
    rotationBenefits: [
      'High-value market cash crop providing excellent economic returns after winter cover crops or pulses',
      'Breaks cereal root rot and take-all fungal cycles',
      'Responds exceptionally well to organic nitrogen fixed by preceding legumes'
    ],
    risksAndPestVulnerabilities: [
      'Vulnerable to early/late blight (Phytophthora) and root-knot nematodes; never follow or precede potatoes/eggplants',
      'High potassium and calcium demand to prevent blossom end rot'
    ],
    seasonsSuitable: ['kharif', 'summer', 'spring', 'zaid'],
    coverCropCapable: false,
  },
  {
    id: 'potato',
    name: 'Potato (Tuber Vegetable)',
    scientificName: 'Solanum tuberosum',
    family: 'Solanaceae',
    category: 'vegetable',
    durationDays: { min: 85, max: 120 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 450, max: 750 },
    optimalTemperatureC: { min: 15, max: 23 },
    soilPhPreference: { min: 5.2, max: 6.5 },
    soilTexturePreferences: ['Sandy Loam', 'Loam', 'Silt Loam'],
    nitrogenImpact: 'moderate_feeder',
    rootDepth: 'shallow',
    rootDescription: 'Fibrous root network (0.4-0.6m) centered around stolons and swelling tubers; naturally loosens and aerates tight soil crusts.',
    rotationBenefits: [
      'Tuber bulking and harvest naturally breaks up sub-surface soil compaction without heavy deep tillage',
      'High caloric and economic cash return per hectare',
      'Excellent cool-season transition crop following summer legumes or cereals'
    ],
    risksAndPestVulnerabilities: [
      'Do not rotate within 3 years of other Solanaceae to break bacterial wilt and Colorado beetle cycles',
      'Sensitive to water stress during tuber initiation and scab in high-pH alkaline soils'
    ],
    seasonsSuitable: ['rabi', 'winter', 'spring'],
    coverCropCapable: false,
  },
  {
    id: 'carrot',
    name: 'Carrot & Root Crops',
    scientificName: 'Daucus carota',
    family: 'Apiaceae',
    category: 'vegetable',
    durationDays: { min: 70, max: 105 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 350, max: 600 },
    optimalTemperatureC: { min: 14, max: 24 },
    soilPhPreference: { min: 6.0, max: 7.0 },
    soilTexturePreferences: ['Sandy Loam', 'Deep Sand', 'Loamy Sand'],
    nitrogenImpact: 'light_feeder',
    rootDepth: 'deep',
    rootDescription: 'Vertical tapering storage taproot (up to 0.9m) that mines subsoil micronutrients (boron, potassium) and creates natural drainage biopores.',
    rotationBenefits: [
      'Low nitrogen demand preserves nitrogen reserves left by preceding legume crops',
      'Taproot bio-drilling improves water infiltration for succeeding seasonal crops',
      'Leaves clean, low-residue beds ready for rapid zero-till secondary planting'
    ],
    risksAndPestVulnerabilities: [
      'Stony or compacted soils cause root forking and stunted development',
      'Carrot rust fly and Alternaria leaf blight during humid summer periods'
    ],
    seasonsSuitable: ['rabi', 'winter', 'autumn', 'spring'],
    coverCropCapable: false,
  },
  {
    id: 'green_peas',
    name: 'Green Peas / Garden Peas',
    scientificName: 'Pisum sativum',
    family: 'Fabaceae (Leguminosae)',
    category: 'vegetable',
    durationDays: { min: 60, max: 85 },
    waterRequirement: 'low',
    optimalRainfallMm: { min: 300, max: 550 },
    optimalTemperatureC: { min: 10, max: 22 },
    soilPhPreference: { min: 6.0, max: 7.5 },
    soilTexturePreferences: ['Loam', 'Sandy Loam', 'Silt Loam'],
    nitrogenImpact: 'fixer',
    rootDepth: 'shallow',
    rootDescription: 'Delicate nodulated root system with active Rhizobium leguminosarum colonies fixing 40-70 kg N/ha in a rapid growing cycle.',
    rotationBenefits: [
      'Ultra-fast 60-80 day harvest fits perfectly into tight multi-crop seasonal rotations',
      'Fixes atmospheric nitrogen, drastically cutting synthetic fertilizer costs for the next crop',
      'Low water footprint makes it ideal for cool-season or early spring sowing'
    ],
    risksAndPestVulnerabilities: [
      'Highly sensitive to waterlogging and poor soil drainage',
      'Vulnerable to powdery mildew (Erysiphe pisi) during warm dry spells'
    ],
    seasonsSuitable: ['rabi', 'winter', 'spring'],
    coverCropCapable: false,
  },
  {
    id: 'cabbage',
    name: 'Cabbage & Brassica Greens',
    scientificName: 'Brassica oleracea',
    family: 'Brassicaceae',
    category: 'vegetable',
    durationDays: { min: 70, max: 100 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 400, max: 650 },
    optimalTemperatureC: { min: 12, max: 25 },
    soilPhPreference: { min: 6.0, max: 7.5 },
    soilTexturePreferences: ['Loam', 'Clay Loam', 'Silt Loam'],
    nitrogenImpact: 'heavy_feeder',
    rootDepth: 'medium',
    rootDescription: 'Dense lateral root crown (0.5-0.9m) that aggressively absorbs residual nitrates and stabilizes surface topsoil.',
    rotationBenefits: [
      'Natural bio-fumigation: Brassica root tissues exude glucosinolates that naturally suppress soil fungal pathogens and nematodes',
      'Dense leafy canopy completely smothers competitive winter weed flushes',
      'High market demand and cold frost tolerance down to -3°C'
    ],
    risksAndPestVulnerabilities: [
      'Clubroot (Plasmodiophora brassicae) risk in acidic soils (maintain pH > 6.5)',
      'Diamondback moth and cabbage looper caterpillar pressure'
    ],
    seasonsSuitable: ['rabi', 'winter', 'spring', 'autumn'],
    coverCropCapable: false,
  },
  {
    id: 'onion',
    name: 'Onion & Alliums',
    scientificName: 'Allium cepa',
    family: 'Alliaceae',
    category: 'vegetable',
    durationDays: { min: 90, max: 150 },
    waterRequirement: 'moderate',
    optimalRainfallMm: { min: 350, max: 600 },
    optimalTemperatureC: { min: 13, max: 28 },
    soilPhPreference: { min: 6.0, max: 7.0 },
    soilTexturePreferences: ['Sandy Loam', 'Muck Soil', 'Loam'],
    nitrogenImpact: 'light_feeder',
    rootDepth: 'shallow',
    rootDescription: 'Shallow adventitious root system (0.2-0.3m); requires friable, well-aerated upper soil horizon free of crusting.',
    rotationBenefits: [
      'Natural allicin and sulfur compounds release biological volatiles that deter subterranean nematodes, wireworms, and aphids',
      'Outstanding companion or follow-up crop after cereal grains or green manure crops',
      'High storage longevity and high commercial market flexibility'
    ],
    risksAndPestVulnerabilities: [
      'Poor competitor against weeds due to sparse, erect foliage; requires clean weed-free seedbeds',
      'Susceptible to onion thrips and purple blotch under humid cloudy conditions'
    ],
    seasonsSuitable: ['rabi', 'winter', 'spring', 'zaid'],
    coverCropCapable: false,
  }
];

export function getCropById(id: string): Crop | undefined {
  return CROP_DATABASE.find(c => c.id === id);
}
