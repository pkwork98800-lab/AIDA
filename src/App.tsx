
import { useState } from 'react';
import { PatientApp } from './components/patient/PatientApp';
import { AdminApp } from './components/admin/AdminApp';
import { Activity, ShieldCheck, UserCircle } from 'lucide-react';

function App() {
  const [view, setView] = useState<'patient' | 'admin'>('patient');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AI Doctor</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('patient')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${view === 'patient' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <UserCircle size={20} />
            <span className="font-medium">Patient Portal</span>
          </button>
          <button 
            onClick={() => setView('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${view === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <ShieldCheck size={20} />
            <span className="font-medium">Admin Panel</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {view === 'patient' ? <PatientApp /> : <AdminApp />}
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto">
        <p>&copy; 2024 AI Doctor Bot. Medical Information for Educational Purposes Only.</p>
      </footer>
    </div>
  );
}

export default App;
