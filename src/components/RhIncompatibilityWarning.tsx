import React, { useState } from 'react';
import { AlertTriangle, Syringe, Stethoscope, ChevronDown, ChevronUp, Shield, Clock, Baby } from 'lucide-react';

interface RhIncompatibilityWarningProps {
  isAtRisk: boolean;
  message: string;
  recommendations: string[];
  requiresRhoGAM: boolean;
}

export const RhIncompatibilityWarning: React.FC<RhIncompatibilityWarningProps> = ({ 
  isAtRisk, 
  message, 
  recommendations,
  requiresRhoGAM 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!isAtRisk) {
    return (
      <div className="p-4 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-emerald-400 text-sm font-medium">✓ Rh Compatible</p>
            <p className="text-white/40 text-xs mt-0.5">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border border-red-500/30 bg-gradient-to-br from-red-500/5 to-red-600/5">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-red-400 text-sm font-bold uppercase tracking-wider">Rh Incompatibility Detected</p>
            <p className="text-white/60 text-xs mt-2 leading-relaxed">{message}</p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-red-400/80 bg-red-500/10 px-2 py-1 rounded">
                <Baby className="w-3 h-3" />
                <span>HDN Risk</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded">
                <Syringe className="w-3 h-3" />
                <span>RhoGAM Required</span>
              </div>
            </div>
            
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[10px] text-red-400/70 hover:text-red-400 mt-3 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Show Less' : 'View Prevention Protocol'}
            </button>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-red-500/20 bg-red-500/5 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Syringe className="w-4 h-4 text-emerald-500" />
            <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider">Medical Protocol: Rho(D) Immune Globulin (RhoGAM)</p>
          </div>
          
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-2 text-[11px]">
                <span className="text-emerald-500 flex-shrink-0 mt-0.5">→</span>
                <span className="text-white/50 leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20">
              <Clock className="w-3 h-3 text-emerald-500 mb-1" />
              <p className="text-[9px] text-white/40 uppercase">Timing</p>
              <p className="text-[10px] text-white/70">Week 28 & Post-delivery</p>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20">
              <Shield className="w-3 h-3 text-emerald-500 mb-1" />
              <p className="text-[9px] text-white/40 uppercase">Efficacy</p>
              <p className="text-[10px] text-white/70">99% Prevention Rate</p>
            </div>
          </div>
          
          <div className="p-3 bg-blue-500/5 border border-blue-500/20">
            <p className="text-[10px] text-blue-400/80 leading-relaxed">
              💡 Critical Information: Rh incompatibility is entirely preventable with modern prenatal care. 
              RhoGAM works by preventing your immune system from producing anti-Rh antibodies that could harm future pregnancies.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};