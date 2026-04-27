
import { Symptom } from '../types';

export class SafetyChecker {
  private redFlags = [
    'chest pain',
    'difficulty breathing',
    'shortness of breath',
    'severe bleeding',
    'unconscious',
    'stroke',
    'seizure',
    'vision loss'
  ];

  checkEmergency(symptoms: Symptom[], message: string): { isEmergency: boolean; message: string } {
    const text = (message + ' ' + symptoms.map(s => s.name).join(' ')).toLowerCase();
    
    for (const flag of this.redFlags) {
      if (text.includes(flag)) {
        return {
          isEmergency: true,
          message: `URGENT: Your symptoms (${flag}) may indicate a serious condition. Please seek immediate emergency medical attention or call 911.`
        };
      }
    }

    return { isEmergency: false, message: '' };
  }
}
