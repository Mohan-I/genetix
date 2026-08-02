// src/pages/PedigreeBuilderPage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Save, Download, Upload, RefreshCw } from 'lucide-react';
import { PedigreeBuilder } from '../components/PedigreeBuilder';
import { PedigreeData, createDefaultPedigree } from '../types/pedigree';
// import { useSafeStorage } from '../utils/storage';

export const PedigreeBuilderPage: React.FC = () => {
  const [pedigreeData, setPedigreeData] = useSafeStorage<PedigreeData>(
    'pedigree_data',
    createDefaultPedigree()
  );

  // Save to localStorage whenever data changes
  const handleSave = (data: PedigreeData) => {
    setPedigreeData(data);
    console.log('💾 Pedigree saved');
  };

  const handleReset = () => {
    if (window.confirm('Reset to default pedigree? All unsaved changes will be lost.')) {
      const defaultData = createDefaultPedigree();
      setPedigreeData(defaultData);
    }
  };

  // Log storage availability
  useEffect(() => {
    const isAvailable = typeof localStorage !== 'undefined';
    console.log(`📦 localStorage ${isAvailable ? 'available' : 'not available (using memory fallback)'}`);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 bg-[#0a0a0c]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-white/40 hover:text-white/80 transition-colors p-2 hover:bg-white/5 rounded-md"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-[#0a0a0c] font-bold text-sm">G</span>
              </div>
              <span className="text-sm font-mono text-white/80 tracking-wider">GENETIX</span>
              <span className="text-[9px] font-mono text-emerald-500/60 bg-emerald-500/10 px-1.5 py-0.5 rounded">Pedigree</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/40 text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
            <Link
              to="/app"
              className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded hover:bg-emerald-500/20 transition-all"
            >
              Launch Analysis →
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PedigreeBuilder
          data={pedigreeData}
          onSave={handleSave}
          onMemberSelect={(member) => {
            console.log('👤 Member selected:', member);
          }}
        />
      </div>

      {/* Footer Stats */}
      <footer className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-[8px] text-white/20 font-mono">
            {pedigreeData.members.length} members • 
            {pedigreeData.relationships.length} relationships • 
            {pedigreeData.members.filter(m => m.myopia).length} with myopia • 
            {pedigreeData.members.filter(m => m.diabetes).length} with diabetes
          </div>
          <div className="text-[8px] text-white/20 font-mono">
            {typeof localStorage !== 'undefined' ? '💾 Auto-saved' : '📝 Memory only'}
          </div>
        </div>
      </footer>
    </div>
  );
};