
import React, { useState } from 'react';
import { User, Consultation, Message } from '../../types';
import { db } from '../../services/db';
import { medicalBot } from '../../services/medicalBot';
import { Send, UserPlus, HeartPulse, History } from 'lucide-react';

export const PatientApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = db.addUser({
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      allergies: (formData.get('allergies') as string).split(',').map(s => s.trim()).filter(Boolean),
      medications: (formData.get('medications') as string).split(',').map(s => s.trim()).filter(Boolean),
    });
    setUser(newUser);
  };

  const startConsultation = () => {
    if (!user) return;
    const newConsult = db.startConsultation(user.id);
    setConsultation(newConsult);
    
    // Bot greeting
    const greeting = `Hello ${user.name}! I'm Dr. AI. I'm here to help you understand your symptoms. What's bothering you today?`;
    db.addMessage(newConsult.id, 'bot', greeting);
    setMessages(db.getMessages(newConsult.id));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !consultation || loading) return;

    const userMsg = input;
    setInput('');
    setLoading(true);

    await medicalBot.processMessage(consultation.id, userMsg);
    
    setMessages(db.getMessages(consultation.id));
    setConsultation(db.getConsultation(consultation.id) || null);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 px-6 py-8 text-white text-center">
          <HeartPulse className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Welcome to AI Doctor</h2>
          <p className="text-blue-100 mt-2">Please register to begin your consultation</p>
        </div>
        <form onSubmit={handleRegister} className="p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input name="name" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input name="age" type="number" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select name="gender" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Allergies (comma separated)</label>
            <input name="allergies" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Peanuts, Penicillin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications</label>
            <input name="medications" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Aspirin, Vitamin D" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <UserPlus size={20} />
            Start Consultation
          </button>
        </form>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <div className="bg-white p-12 rounded-3xl shadow-lg border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-800">Hello, {user.name}!</h2>
          <p className="text-slate-500 mt-4 text-lg">Ready to start your medical assessment? Our AI will guide you through a series of questions.</p>
          <button 
            onClick={startConsultation}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-105"
          >
            Start New Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <header className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">DR</div>
          <div>
            <h3 className="font-bold text-slate-800">Dr. AI Assistant</h3>
            <span className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active Assessment
            </span>
          </div>
        </div>
        <button onClick={() => setConsultation(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <History size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
              m.type === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              <div className={`text-[10px] mt-1 opacity-50 ${m.type === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={consultation.status === 'completed'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder={consultation.status === 'completed' ? "Consultation completed" : "Describe your symptoms or answer the doctor..."}
            className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:opacity-50"
            rows={2}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || consultation.status === 'completed' || loading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
          >
            <Send size={24} />
          </button>
        </div>
      </form>
    </div>
  );
};
