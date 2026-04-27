
import { User, Consultation, Message, Disease } from '../types';

const INITIAL_DISEASES: Disease[] = [
  {
    id: '1',
    name: 'Common Cold',
    category: 'Respiratory',
    severity: 'mild',
    description: 'A viral infection of your nose and throat (upper respiratory tract).',
    typicalDuration: '7-10 days',
    symptoms: [
      { name: 'runny nose', frequency: 'very common' },
      { name: 'sore throat', frequency: 'common' },
      { name: 'cough', frequency: 'common' },
      { name: 'congestion', frequency: 'common' }
    ],
    diagnosticQuestions: ['Do you have a fever?', 'Is your throat sore?', 'Are you sneezing?'],
    treatmentProtocols: {
      acute_1_3_days: {
        medications: [{ name: 'Acetaminophen', dosage_adult: '500mg', dosage_pediatric: '250mg', frequency: 'Every 6 hours', purpose: 'Pain/Fever' }],
        home_care: ['Rest', 'Hydration'],
        foods_to_eat: ['Chicken soup', 'Fruit'],
        foods_to_avoid: ['Dairy', 'Sugary drinks'],
        warning_signs: ['High fever', 'Difficulty breathing'],
        follow_up: 'Continue monitoring'
      },
      subacute_4_7_days: {
        medications: [{ name: 'Vitamin C', dosage_adult: '1000mg', dosage_pediatric: '500mg', frequency: 'Daily', purpose: 'Immune support' }],
        home_care: ['Steam inhalation'],
        foods_to_eat: ['Warm liquids'],
        foods_to_avoid: [],
        warning_signs: ['Symptoms worsening after 7 days'],
        follow_up: 'Consult if no improvement'
      },
      chronic_8_plus_days: {
        medications: [],
        home_care: [],
        foods_to_eat: [],
        foods_to_avoid: [],
        warning_signs: [],
        follow_up: 'Please see a doctor'
      }
    },
    isActive: true
  },
  {
    id: '2',
    name: 'Influenza (Flu)',
    category: 'Respiratory',
    severity: 'moderate',
    description: 'A viral infection that attacks your respiratory system — your nose, throat and lungs.',
    typicalDuration: '1-2 weeks',
    symptoms: [
      { name: 'fever', frequency: 'very common' },
      { name: 'body aches', frequency: 'common' },
      { name: 'fatigue', frequency: 'common' },
      { name: 'chills', frequency: 'common' }
    ],
    diagnosticQuestions: ['Do you have body aches?', 'Is your temperature above 100.4F?', 'Do you feel extremely tired?'],
    treatmentProtocols: {
      acute_1_3_days: {
        medications: [{ name: 'Ibuprofen', dosage_adult: '400mg', dosage_pediatric: '200mg', frequency: 'Every 8 hours', purpose: 'Pain/Inflammation' }],
        home_care: ['Complete bed rest', 'Electrolytes'],
        foods_to_eat: ['Broth', 'Herbal tea'],
        foods_to_avoid: ['Alcohol', 'Caffeine'],
        warning_signs: ['Chest pain', 'Confusion'],
        follow_up: 'Monitor temperature closely'
      },
      subacute_4_7_days: {
        medications: [],
        home_care: ['Gradual return to activity'],
        foods_to_eat: [],
        foods_to_avoid: [],
        warning_signs: [],
        follow_up: 'Ensure fever has subsided for 24h'
      },
      chronic_8_plus_days: {
        medications: [],
        home_care: [],
        foods_to_eat: [],
        foods_to_avoid: [],
        warning_signs: [],
        follow_up: 'See a professional if fatigue persists'
      }
    },
    isActive: true
  }
];

class DBService {
  private users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  private consultations: Consultation[] = JSON.parse(localStorage.getItem('consultations') || '[]');
  private messages: Message[] = JSON.parse(localStorage.getItem('messages') || '[]');
  private diseases: Disease[] = JSON.parse(localStorage.getItem('diseases') || JSON.stringify(INITIAL_DISEASES));

  private save() {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('consultations', JSON.stringify(this.consultations));
    localStorage.setItem('messages', JSON.stringify(this.messages));
    localStorage.setItem('diseases', JSON.stringify(this.diseases));
  }

  getUsers() { return this.users; }
  getUser(id: string) { return this.users.find(u => u.id === id); }
  addUser(user: Omit<User, 'id' | 'createdAt'>) {
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  getConsultations() { return this.consultations; }
  getConsultation(id: string) { return this.consultations.find(c => c.id === id); }
  startConsultation(userId: string) {
    const consultation: Consultation = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      timestamp: new Date().toISOString(),
      chiefComplaint: '',
      status: 'active',
      emergencyFlag: false,
      symptoms: []
    };
    this.consultations.push(consultation);
    this.save();
    return consultation;
  }

  updateConsultation(id: string, updates: Partial<Consultation>) {
    const index = this.consultations.findIndex(c => c.id === id);
    if (index !== -1) {
      this.consultations[index] = { ...this.consultations[index], ...updates };
      this.save();
    }
  }

  getMessages(consultationId: string) {
    return this.messages.filter(m => m.consultationId === consultationId);
  }

  addMessage(consultationId: string, type: 'bot' | 'user', content: string) {
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      consultationId,
      type,
      content,
      timestamp: new Date().toISOString()
    };
    this.messages.push(message);
    this.save();
    return message;
  }

  getDiseases() { return this.diseases; }
  addDisease(disease: Omit<Disease, 'id'>) {
    const newDisease = { ...disease, id: Math.random().toString(36).substr(2, 9) };
    this.diseases.push(newDisease);
    this.save();
    return newDisease;
  }
}

export const db = new DBService();
