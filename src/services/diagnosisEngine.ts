
import { db } from './db';
import { Symptom, Disease } from '../types';

export class DiagnosisEngine {
  diagnose(reportedSymptoms: Symptom[]) {
    const diseases = db.getDiseases();
    const scored: { disease: Disease; score: number }[] = [];

    const reportedNames = reportedSymptoms.map(s => s.name.toLowerCase());

    diseases.forEach(disease => {
      if (!disease.isActive) return;

      const diseaseSymptoms = disease.symptoms.map(s => s.name.toLowerCase());
      const matches = reportedNames.filter(rn => 
        diseaseSymptoms.some(dn => dn.includes(rn) || rn.includes(dn))
      );

      const score = diseaseSymptoms.length > 0 ? matches.length / diseaseSymptoms.length : 0;
      if (score > 0) {
        scored.push({ disease, score });
      }
    });

    scored.sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      const primary = scored[0];
      return {
        primary: {
          condition: primary.disease.name,
          confidence: primary.score > 0.7 ? 'High' : (primary.score > 0.4 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
          description: primary.disease.description
        },
        differentials: scored.slice(1, 3).map(s => ({ condition: s.disease.name }))
      };
    }

    return {
      primary: { condition: 'Unknown Condition', confidence: 'Low' as const, description: 'We could not find a clear match for your symptoms.' },
      differentials: []
    };
  }
}
