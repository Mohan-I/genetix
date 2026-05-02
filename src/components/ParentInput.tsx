import React from 'react';
import { ParentProfile, BloodType, EyeColor, HairTexture, PathologyStatus } from '../types';
import { User, Activity, Eye, Thermometer } from 'lucide-react';

interface Props {
  profile: ParentProfile;
  onChange: (profile: ParentProfile) => void;
  label: string;
}

export const ParentInput: React.FC<Props> = ({ profile, onChange, label }) => {
  const handleChange = (field: keyof ParentProfile, value: any) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div className="bg-[#0a0a0c] p-6 border border-white/10 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
          <User className="w-4 h-4 text-emerald-500" />
        </div>
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{label}</h2>
      </div>

      <div className="space-y-6">
        {/* Core Phenotypes */}
        <div className="space-y-4">
          <p className="text-[9px] uppercase text-white/20 tracking-widest font-mono">Core Phenotype</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Blood</label>
              <select 
                value={profile.bloodType}
                onChange={(e) => handleChange('bloodType', e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {Object.values(BloodType).map(bt => <option key={bt} value={bt} className="bg-[#1a1a1e]">{bt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Eyes</label>
              <select 
                value={profile.eyeColor}
                onChange={(e) => handleChange('eyeColor', e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {Object.values(EyeColor).map(ec => <option key={ec} value={ec} className="bg-[#1a1a1e]">{ec}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Hair</label>
              <select 
                value={profile.hairTexture}
                onChange={(e) => handleChange('hairTexture', e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {Object.values(HairTexture).map(ht => <option key={ht} value={ht} className="bg-[#1a1a1e]">{ht}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Height (cm)</label>
              <input 
                type="number"
                value={profile.heightCm}
                onChange={(e) => handleChange('heightCm', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pathological Expansion Pack */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase text-white/20 tracking-widest font-mono">Genomic Pathologies</p>
            <Activity className="w-3 h-3 text-emerald-500/40" />
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono text-white/30 uppercase mb-1.5">Thalassemia Status</label>
              <select 
                value={profile.thalassemia}
                onChange={(e) => handleChange('thalassemia', e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-emerald-500 outline-none transition-all"
              >
                {Object.values(PathologyStatus).map(s => <option key={s} value={s} className="bg-[#1a1a1e]">{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:bg-white/[0.08] transition-colors">
                <input 
                  type="checkbox"
                  checked={profile.myopia}
                  onChange={(e) => handleChange('myopia', e.target.checked)}
                  className="w-3 h-3 accent-emerald-500"
                />
                <span className="text-[10px] font-mono text-white/60">Myopia (Myopic)</span>
              </label>
              
              <label className="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:bg-white/[0.08] transition-colors">
                <input 
                  type="checkbox"
                  checked={profile.diabetesT2}
                  onChange={(e) => handleChange('diabetesT2', e.target.checked)}
                  className="w-3 h-3 accent-emerald-500"
                />
                <span className="text-[10px] font-mono text-white/60">Type 2 Diabetes</span>
              </label>

              <label className="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:bg-white/[0.08] transition-colors">
                <input 
                  type="checkbox"
                  checked={profile.colorBlindness}
                  onChange={(e) => handleChange('colorBlindness', e.target.checked)}
                  className="w-3 h-3 accent-emerald-500"
                />
                <span className="text-[10px] font-mono text-white/60">Color Blindness</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
