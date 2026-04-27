
export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  weight?: number;
  height?: number;
  allergies: string[];
  medications: string[];
  createdAt: string;
}

export interface Symptom {
  name: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
  location?: string;
}

export interface Consultation {
  id: string;
  userId: string;
  timestamp: string;
  chiefComplaint: string;
  diagnosis?: string;
  confidenceLevel?: 'Low' | 'Medium' | 'High';
  status: 'active' | 'completed';
  emergencyFlag: boolean;
  symptoms: Symptom[];
}

export interface Message {
  id: string;
  consultationId: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
}

export interface Disease {
  id: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  typicalDuration: string;
  symptoms: { name: string; frequency: string }[];
  treatmentProtocols: {
    acute_1_3_days: TreatmentPlan;
    subacute_4_7_days: TreatmentPlan;
    chronic_8_plus_days: TreatmentPlan;
  };
  diagnosticQuestions: string[];
  isActive: boolean;
}

export interface TreatmentPlan {
  medications: {
    name: string;
    dosage_adult: string;
    dosage_pediatric: string;
    frequency: string;
    purpose: string;
  }[];
  home_care: string[];
  foods_to_eat: string[];
  foods_to_avoid: string[];
  warning_signs: string[];
  follow_up: string;
}
