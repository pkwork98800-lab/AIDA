
import { db } from './db';
import { User, TreatmentPlan } from '../types';

export class TreatmentRecommender {
  generate(diagnosis: string, durationDays: number, user: User): TreatmentPlan | null {
    const disease = db.getDiseases().find(d => d.name === diagnosis);
    if (!disease) return null;

    let phase: keyof typeof disease.treatmentProtocols = 'acute_1_3_days';
    if (durationDays > 7) phase = 'chronic_8_plus_days';
    else if (durationDays > 3) phase = 'subacute_4_7_days';

    const protocol = disease.treatmentProtocols[phase];
    
    // Adjust dosage for pediatric patients
    const isPediatric = user.age < 18;
    const adjustedMedications = protocol.medications.map(med => ({
      ...med,
      dosage: isPediatric ? med.dosage_pediatric : med.dosage_adult
    }));

    return {
      ...protocol,
      medications: adjustedMedications as any // Simplification for types
    };
  }
}
