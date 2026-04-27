
import React, { useMemo } from 'react';
import { db } from '../../services/db';
import { Users, ClipboardList, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard: React.FC = () => {
  const users = db.getUsers();
  const consultations = db.getConsultations();
  const emergencies = consultations.filter(c => c.emergencyFlag).length;

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    consultations.forEach(c => {
      if (c.diagnosis) {
        counts[c.diagnosis] = (counts[c.diagnosis] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Number of Diagnoses',
          data: Object.values(counts),
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    };
  }, [consultations]);

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
    { label: 'Total Consultations', value: consultations.length, icon: ClipboardList, color: 'indigo' },
    { label: 'Emergencies', value: emergencies, icon: AlertTriangle, color: 'red' },
    { label: 'Completion Rate', value: `${consultations.length ? Math.round((consultations.filter(c => c.status === 'completed').length / consultations.length) * 100) : 0}%`, icon: TrendingUp, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-slate-800">Top Diagnoses</h3>
        <div className="h-[300px]">
          <Bar 
            data={chartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} 
          />
        </div>
      </div>
    </div>
  );
};
