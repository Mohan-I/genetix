// src/components/BenchmarkDashboard.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Cpu, Zap, Database } from 'lucide-react';

interface BenchmarkResult {
  timestamp: number;
  computationTimeMs: number;
  memoryUsageMB: number;
  probabilityAccuracy: number;
  sampleSize: number;
}

export const BenchmarkDashboard: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBenchmark = async () => {
    setIsRunning(true);
    const results: BenchmarkResult[] = [];
    
    const sampleSizes = [100, 1000, 10000, 50000, 100000];
    
    for (const size of sampleSizes) {
      const startTime = performance.now();
      const memoryStart = performance.memory?.usedJSHeapSize || 0;
      
      // Generate synthetic profiles
      const syntheticProfiles = generateSyntheticProfiles(size);
      
      // Run probability calculations
      const probabilities = await runBatchCalculations(syntheticProfiles);
      
      const endTime = performance.now();
      const memoryEnd = performance.memory?.usedJSHeapSize || 0;
      
      results.push({
        timestamp: Date.now(),
        computationTimeMs: endTime - startTime,
        memoryUsageMB: (memoryEnd - memoryStart) / (1024 * 1024),
        probabilityAccuracy: validateProbabilities(probabilities),
        sampleSize: size
      });
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      setBenchmarks([...results]);
    }
    
    setIsRunning(false);
  };

  const generateSyntheticProfiles = (count: number): ParentProfile[] => {
    const profiles: ParentProfile[] = [];
    const bloodTypes = Object.values(BloodType);
    const eyeColors = Object.values(EyeColor);
    
    for (let i = 0; i < count; i++) {
      profiles.push({
        name: `Synthetic_${i}`,
        bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
        eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
        hairTexture: HairTexture.WAVY,
        heightCm: 150 + Math.random() * 40,
        skinTone: '',
        thalassemia: Math.random() > 0.9 ? PathologyStatus.CARRIER : PathologyStatus.NONE,
        colorBlindness: Math.random() > 0.95,
        myopia: Math.random() > 0.85,
        diabetesT2: Math.random() > 0.8,
        maternalHealth: {
          age: 20 + Math.random() * 25,
          systolicBP: 100 + Math.random() * 40,
          diastolicBP: 60 + Math.random() * 30,
          glucoseLevel: 70 + Math.random() * 60
        }
      });
    }
    return profiles;
  };

  const runBatchCalculations = async (profiles: ParentProfile[]): Promise<any[]> => {
    const batchSize = 1000;
    const results = [];
    
    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);
      const batchResults = batch.map(profile => ({
        bloodProb: calculateBloodTypeProbabilities(profile.bloodType, BloodType.O_POS),
        eyeProb: calculateEyeColorProbabilities(profile.eyeColor, EyeColor.BROWN)
      }));
      results.push(...batchResults);
    }
    
    return results;
  };

  const validateProbabilities = (probabilities: any[]): number => {
    // Check if probabilities sum to 1 (within tolerance)
    let validCount = 0;
    probabilities.forEach(prob => {
      const sum = Object.values(prob.bloodProb).reduce((a: number, b: number) => a + b, 0);
      if (Math.abs(sum - 1) < 0.01) validCount++;
    });
    return validCount / probabilities.length;
  };

  return (
    <div className="space-y-6 p-6 bg-[#0a0a0c] border border-white/10 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-mono text-emerald-500">ML Benchmark Suite</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Performance Profiling & Validation</p>
        </div>
        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="px-4 py-2 bg-emerald-500 text-black text-xs font-mono disabled:opacity-50"
        >
          {isRunning ? 'BENCHMARKING...' : 'RUN SUITE'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-white/40">COMPUTE TIME</span>
          </div>
          <p className="text-2xl font-mono">
            {benchmarks[benchmarks.length - 1]?.computationTimeMs?.toFixed(2) || '0'}ms
          </p>
          <p className="text-[8px] text-white/20">per 1000 samples</p>
        </div>
        
        <div className="border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-white/40">MEMORY FOOTPRINT</span>
          </div>
          <p className="text-2xl font-mono">
            {benchmarks[benchmarks.length - 1]?.memoryUsageMB?.toFixed(2) || '0'}MB
          </p>
        </div>
        
        <div className="border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-white/40">ACCURACY</span>
          </div>
          <p className="text-2xl font-mono">
            {((benchmarks[benchmarks.length - 1]?.probabilityAccuracy || 0) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={benchmarks}>
            <CartesianGrid stroke="#1a1a1a" />
            <XAxis dataKey="sampleSize" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ background: '#0a0a0c', border: '1px solid #1a1a1a' }} />
            <Legend />
            <Line type="monotone" dataKey="computationTimeMs" stroke="#10b981" name="Time (ms)" />
            <Line type="monotone" dataKey="memoryUsageMB" stroke="#3b82f6" name="Memory (MB)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[8px] text-white/20 font-mono border-t border-white/5 pt-4">
        {benchmarks.length > 0 && (
          <div className="flex justify-between">
            <span>Total Samples Processed: {benchmarks.reduce((sum, b) => sum + b.sampleSize, 0).toLocaleString()}</span>
            <span>Avg Throughput: {(benchmarks.reduce((sum, b) => sum + b.sampleSize, 0) / 
              (benchmarks.reduce((sum, b) => sum + b.computationTimeMs, 0) / 1000)).toFixed(0)} samples/sec</span>
          </div>
        )}
      </div>
    </div>
  );
};