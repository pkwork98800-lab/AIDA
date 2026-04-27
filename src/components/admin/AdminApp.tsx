
import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, MessageSquare } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { DiseaseLibrary } from './DiseaseLibrary';
import { UserLogs } from './UserLogs';

export const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'diseases' | 'users'>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'diseases', label: 'Disease Library', icon: BookOpen },
    { id: 'users', label: 'Consultation Logs', icon: MessageSquare },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-medium ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-500 hover:bg-white hover:text-slate-800'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </aside>

      <div className="md:col-span-3 space-y-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'diseases' && <DiseaseLibrary />}
        {activeTab === 'users' && <UserLogs />}
      </div>
    </div>
  );
};
