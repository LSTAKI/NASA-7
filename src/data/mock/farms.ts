import { Farm } from '@/types';

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-us-iowa-01',
    name: 'Prairie Horizon Agro-Ecology',
    location: {
      latitude: 42.0308,
      longitude: -93.6319
    },
    country: 'United States',
    region: 'Story County, Iowa',
    areaHectares: 180,
    irrigationType: 'rainfed',
    currentCrops: ['maize', 'soybean'],
    historicalCrops: ['maize', 'soybean', 'cover_crop_mix'],
    soil: {
      phH2O: 6.4,
      organicCarbon: 28.5,
      nitrogen: 2.4,
      sand: 22,
      clay: 28,
      silt: 50,
      source: 'soilgrids',
      depthRange: '0-30cm',
      lastUpdated: '2026-10-12'
    },
    notes: 'Corn-soybean belt. Heavy Mollisol soils with high organic matter. Focus on reducing tile drainage nitrate loss.',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-11-10T14:30:00Z'
  },
  {
    id: 'farm-in-punjab-02',
    name: 'Satluj Green Basin Fields',
    location: {
      latitude: 30.9010,
      longitude: 75.8573
    },
    country: 'India',
    region: 'Ludhiana, Punjab',
    areaHectares: 24,
    irrigationType: 'sprinkler',
    currentCrops: ['wheat', 'rice'],
    historicalCrops: ['rice', 'wheat', 'chickpea'],
    soil: {
      phH2O: 7.8,
      organicCarbon: 6.2,
      nitrogen: 0.8,
      sand: 45,
      clay: 18,
      silt: 37,
      source: 'soilgrids',
      depthRange: '0-30cm',
      lastUpdated: '2026-09-20'
    },
    notes: 'Alluvial Indo-Gangetic plain. Groundwater depletion is critical; transitioning to water-efficient pulses and pearl millet.',
    createdAt: '2026-07-22T11:15:00Z',
    updatedAt: '2026-11-08T16:00:00Z'
  },
  {
    id: 'farm-ke-rift-03',
    name: 'Great Rift Valley Agroforestry',
    location: {
      latitude: -0.3031,
      longitude: 36.0800
    },
    country: 'Kenya',
    region: 'Nakuru County',
    areaHectares: 45,
    irrigationType: 'rainfed',
    currentCrops: ['maize', 'sorghum'],
    historicalCrops: ['maize', 'groundnut', 'cover_crop_mix'],
    soil: {
      phH2O: 6.1,
      organicCarbon: 18.2,
      nitrogen: 1.6,
      sand: 38,
      clay: 26,
      silt: 36,
      source: 'soilgrids',
      depthRange: '0-30cm',
      lastUpdated: '2026-10-01'
    },
    notes: 'Volcanic soils with good aeration. Semi-arid rainfall variability. Intercropping maize with pigeon pea and cover crops.',
    createdAt: '2026-09-05T08:30:00Z',
    updatedAt: '2026-11-12T10:45:00Z'
  },
  {
    id: 'farm-es-albacete-04',
    name: 'La Mancha Mediterranean Drylands',
    location: {
      latitude: 38.9943,
      longitude: -1.8585
    },
    country: 'Spain',
    region: 'Castilla-La Mancha',
    areaHectares: 120,
    irrigationType: 'drip',
    currentCrops: ['chickpea', 'pearl_millet'],
    historicalCrops: ['wheat', 'chickpea', 'sorghum'],
    soil: {
      phH2O: 8.1,
      organicCarbon: 9.8,
      nitrogen: 0.9,
      sand: 32,
      clay: 34,
      silt: 34,
      source: 'soilgrids',
      depthRange: '0-30cm',
      lastUpdated: '2026-10-18'
    },
    notes: 'Calcareous Mediterranean plateau. Summer drought and high vapor pressure deficit. Pulse and drought cereal rotations.',
    createdAt: '2026-08-30T13:20:00Z',
    updatedAt: '2026-11-02T12:00:00Z'
  }
];
