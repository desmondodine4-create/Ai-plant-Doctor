export type NavTab = 'home' | 'diagnose' | 'library' | 'history' | 'profile';

export interface DiagnosisResult {
  id: string;
  createdAt: string;
  imageDataUrl: string;
  isPlantImage: boolean;
  isUncertain: boolean;
  uncertaintyReason: string;
  plantName: string;
  scientificName: string;
  isHealthy: boolean;
  diseaseName: string;
  confidenceLevel: 'High' | 'Medium' | 'Low' | string;
  confidenceScore: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Critical' | string;
  diseaseDescription: string;
  symptomsDetected: string[];
  possibleCauses: string[];
  recommendedTreatment: string;
  stepByStepTreatment: string[];
  preventionTips: string[];
  followUpCare: string[];
}

export interface CommonDisease {
  name: string;
  pathogenType: string;
  symptoms: string;
  prevention: string;
}

export interface PlantGuide {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  imageUrl?: string;
  overview: string;
  sunlight: string;
  water: string;
  soilPh: string;
  temperature: string;
  spacing: string;
  harvestWindow: string;
  commonDiseases: CommonDisease[];
  preventionAdvice: string[];
}

export interface UserProfile {
  name: string;
  location: string;
  role: string;
  units: 'Metric' | 'Imperial';
  autoSaveHistory: boolean;
  wateringReminders: boolean;
  diseaseAlerts: boolean;
  followUpReminders: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
