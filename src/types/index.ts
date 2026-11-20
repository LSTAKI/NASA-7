// ARACHNOVA - Core Data Types & Schema Definitions
// Designed for PostgreSQL compatibility in future backend migrations

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type IrrigationType = 'rainfed' | 'drip' | 'sprinkler' | 'flood' | 'furrow' | 'center_pivot';

export interface SoilProperties {
  phH2O?: number;            // pH in H2O
  organicCarbon?: number;    // g/kg or %
  nitrogen?: number;         // cg/kg or g/kg
  sand?: number;             // % sand (50-2000 um)
  clay?: number;             // % clay (< 2 um)
  silt?: number;             // % silt (2-50 um)
  source: 'soilgrids' | 'manual_test' | 'estimated' | 'demonstration';
  depthRange?: string;       // e.g. "0-30cm"
  lastUpdated?: string;
}

export interface Farm {
  id: string;
  name: string;
  location: Coordinates;
  country: string;
  region?: string;
  areaHectares: number;
  irrigationType: IrrigationType;
  currentCrops: string[];
  historicalCrops?: string[];
  soil?: SoilProperties;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// NASA POWER Daily Point Normalized Observation
export interface NasaDailyRecord {
  date: string;              // YYYYMMDD or YYYY-MM-DD
  t2m: number | null;        // Temperature at 2m (C)
  t2mMax: number | null;     // Max temperature (C)
  t2mMin: number | null;     // Min temperature (C)
  precipitation: number | null; // Corrected precipitation (mm/day)
  solarRadiation: number | null; // All Sky Insolation Incident on a Horizontal Surface (MJ/m^2/day)
}

export interface NasaPowerResponse {
  source: 'NASA_POWER_AG_POINT';
  attribution: string;
  coordinates: Coordinates;
  startDate: string;
  endDate: string;
  dailyRecords: NasaDailyRecord[];
  summary: {
    avgTemperature: number;
    totalPrecipitation: number;
    maxTemperature: number;
    minTemperature: number;
    avgSolarRadiation: number;
  };
  isDemonstrationData?: boolean;
}

// Open-Meteo Historical / Archive Weather Normalized Record
export interface HistoricalWeatherRecord {
  date: string;
  temperatureMean: number | null;
  precipitation: number | null;
  relativeHumidity: number | null;
  et0Evapotranspiration: number | null; // Reference ET0 (mm)
  soilTemperature: number | null;       // 0-7cm (C)
  soilMoisture: number | null;          // 0-7cm (m3/m3)
}

export interface OpenMeteoResponse {
  source: 'OPEN_METEO_ERA5_ARCHIVE';
  attribution: string;
  coordinates: Coordinates;
  elevation?: number;
  dailyRecords: HistoricalWeatherRecord[];
  summary: {
    avgTemp: number;
    totalRain: number;
    totalEt0: number;
    avgSoilMoisture: number;
    avgSoilTemp: number;
    waterDeficit: number; // Rain - ET0
  };
  isDemonstrationData?: boolean;
}

// ISRIC SoilGrids Normalized Data
export interface SoilGridsPropertyDepth {
  depth: string;
  mean: number;
  uncertainty?: number;
}

export interface SoilGridsResponse {
  source: 'ISRIC_SOILGRIDS_V2';
  attribution: string;
  coordinates: Coordinates;
  phH2O: number | null;         // standard pH (0-14)
  socGkg: number | null;        // Soil Organic Carbon (g/kg)
  socPercent: number | null;     // SOC converted to %
  nitrogenGkg: number | null;    // Total Nitrogen (g/kg)
  sandPercent: number | null;    // Sand (50-2000 um) %
  clayPercent: number | null;    // Clay (<2 um) %
  siltPercent: number | null;    // Silt (2-50 um) %
  textureClass?: string;         // e.g. "Loam", "Clay Loam", "Sandy Loam"
  dataCompleteness: number;      // 0 - 100%
  isDemonstrationData?: boolean;
}

// Agronomic Crop Knowledge Model
export type CropFamily = 'Poaceae (Gramineae)' | 'Fabaceae (Leguminosae)' | 'Brassicaceae' | 'Solanaceae' | 'Malvaceae' | 'Asteraceae' | 'Alliaceae' | 'Apiaceae';
export type CropCategory = 'cereal' | 'legume' | 'vegetable' | 'cover_crop' | 'fiber' | 'oilseed';
export type RootDepthCategory = 'shallow' | 'medium' | 'deep';
export type NitrogenImpact = 'fixer' | 'heavy_feeder' | 'moderate_feeder' | 'light_feeder';
export type WaterRequirementLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  family: CropFamily;
  category?: CropCategory;
  durationDays: { min: number; max: number };
  waterRequirement: WaterRequirementLevel;
  optimalRainfallMm: { min: number; max: number };
  optimalTemperatureC: { min: number; max: number };
  soilPhPreference: { min: number; max: number };
  soilTexturePreferences: string[];
  nitrogenImpact: NitrogenImpact;
  rootDepth: RootDepthCategory;
  rootDescription: string;
  rotationBenefits: string[];
  risksAndPestVulnerabilities: string[];
  seasonsSuitable: ('kharif' | 'rabi' | 'zaid' | 'spring' | 'summer' | 'autumn' | 'winter')[];
  coverCropCapable: boolean;
}

// Rotation Evaluation Factors
export interface FarmerPriorities {
  soilHealth: number;       // 1 - 5 weight
  waterConservation: number;// 1 - 5 weight
  economicYield: number;    // 1 - 5 weight
  pestDiseaseBreak: number; // 1 - 5 weight
}

export interface CropRotationScore {
  crop: Crop;
  overallScore: number;     // 0 - 100
  breakdown: {
    soilCompatibility: { score: number; rationale: string };
    climateCompatibility: { score: number; rationale: string };
    waterBalanceSuitability: { score: number; rationale: string };
    nutrientCyclingBenefit: { score: number; rationale: string };
    familyDiversityScore: { score: number; rationale: string };
    farmerPriorityFit: { score: number; rationale: string };
  };
  keyAdvantages: string[];
  managementTips: string[];
  confidence: 'high' | 'moderate' | 'indicative';
}

// Strategy Simulator Types
export interface RotationStrategy {
  id: string;
  title: string;
  subtitle: string;
  cropSequence: string[];
  soilConsiderations: string;
  waterRequirements: string;
  climateCompatibility: string;
  potentialAdvantages: string[];
  potentialRisks: string[];
  dataConfidence: 'High' | 'Moderate' | 'Indicative';
  metrics: {
    organicMatterImpact: 'Positive' | 'Neutral' | 'Slight Depletion';
    waterUsageIndex: 'Low (Conserving)' | 'Moderate' | 'High (Demanding)';
    nitrogenBalance: 'Surplus (+N)' | 'Balanced' | 'Deficit (-N)';
    soilCoverDuration: string; // e.g. "9 months / year"
  };
}

// Agricultural Insights & Alerts
export interface AgriculturalInsight {
  id: string;
  type: 'rainfall_anomaly' | 'temperature_extreme' | 'water_stress' | 'soil_health' | 'rotation_opportunity';
  severity: 'info' | 'advisory' | 'warning';
  title: string;
  observation: string;
  agronomicRecommendation: string;
  confidence: string;
  dataSource: string;
  timestamp: string;
}
