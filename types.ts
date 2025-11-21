export interface VisualFindings {
  color: string;
  shape: string;
  coating: string;
  moisture: string;
  fissures: string;
  features: string; // petechiae, spots, etc.
}

export interface TcmPattern {
  vitalSubstances: string; // Qi, Blood, Yin, Yang
  zangFu: string; // Organ systems
  condition: string; // Excess/Deficiency
  pathogen: string; // Cold, Heat, Dampness, etc.
}

export interface Treatment {
  acupuncturePoints: string[];
  technique: string;
  herbalRecommendations: string[];
}

export interface Icd10Entry {
  code: string;
  description: string;
}

export interface AnalysisResult {
  visualFindings: VisualFindings;
  tcmPattern: TcmPattern;
  diagnosisReasoning: string;
  treatment: Treatment;
  icd10: Icd10Entry[];
}