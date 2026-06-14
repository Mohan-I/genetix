import React from 'react';
import { MaternalHealthData } from '../types';
import { HeartPulse, Thermometer, UserCheck } from 'lucide-react';

interface Props {
  data: MaternalHealthData;
  onChange: (data: MaternalHealthData) => void;
}

export const MaternalHealthInput: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof MaternalHealthData, value: number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-[#0a0a0c] p-6 border border-emerald-500/10 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-500/10 rounded-sm">
          <HeartPulse className="w-4 h-4 text-emerald-500" />
        </div>
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Maternal Health Data</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Age (Mother)</label>
          <input 
            type="number"
            value={data.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Glucose (mg/dL)</label>
          <input 
            type="number"
            value={data.glucoseLevel}
            onChange={(e) => handleChange('glucoseLevel', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Systolic BP</label>
          <input 
            type="number"
            value={data.systolicBP}
            onChange={(e) => handleChange('systolicBP', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Diastolic BP</label>
          <input 
            type="number"
            value={data.diastolicBP}
            onChange={(e) => handleChange('diastolicBP', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      <p className="text-[9px] text-white/20 italic font-mono leading-relaxed">
        * Inputs are used for high-risk pregnancy prediction models (91% Accuracy).
      </p>
    </div>
  );
};
