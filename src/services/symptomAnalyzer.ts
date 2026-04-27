
import { Symptom } from '../types';

export class SymptomAnalyzer {
  private keywords = {
    pain: ['pain', 'hurt', 'ache', 'sore', 'throbbing', 'sharp'],
    fever: ['fever', 'hot', 'temperature', 'chills', 'sweat'],
    respiratory: ['cough', 'sneeze', 'congestion', 'breathe', 'shortness', 'nose'],
    gastro: ['nausea', 'vomit', 'stomach', 'diarrhea', 'bloating']
  };

  extractChiefComplaint(message: string): string {
    return message.slice(0, 200);
  }

  analyzeResponse(message: string): Symptom {
    const msgLower = message.toLowerCase();
    
    // Extract potential symptom name
    let foundSymptom = 'unknown';
    for (const words of Object.values(this.keywords)) {
      for (const word of words) {
        if (msgLower.includes(word)) {
          foundSymptom = word;
          break;
        }
      }
    }

    // Extract duration
    let duration = '';
    const dayMatch = msgLower.match(/(\d+)\s*day/);
    if (dayMatch) duration = `${dayMatch[1]} days`;
    const weekMatch = msgLower.match(/(\d+)\s*week/);
    if (weekMatch) duration = `${weekMatch[1]} weeks`;

    // Extract severity
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';
    if (msgLower.match(/(10|9|8|severe|terrible|unbearable)/)) severity = 'severe';
    else if (msgLower.match(/(7|6|5|4|moderate|bad)/)) severity = 'moderate';

    return {
      name: foundSymptom,
      duration,
      severity,
      location: '' // Simple heuristic could be added here
    };
  }

  calculateDurationDays(symptoms: Symptom[]): number {
    let maxDays = 1;
    symptoms.forEach(s => {
      if (s.duration) {
        const match = s.duration.match(/\d+/);
        if (match) {
          const num = parseInt(match[0]);
          if (s.duration.includes('week')) maxDays = Math.max(maxDays, num * 7);
          else maxDays = Math.max(maxDays, num);
        }
      }
    });
    return maxDays;
  }
}
