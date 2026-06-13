// src/components/ProbabilityChart.tsx - With chart type toggle
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

interface ProbabilityChartProps {
  title: string;
  data: any; // Can be array of TraitProbability or Record<string, number>
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

type ChartType = 'pie' | 'bar';

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ title, data }) => {
  const [chartType, setChartType] = useState<ChartType>('pie');
  
  console.log(`Rendering ${title} chart with data:`, data);
  
  // Convert data to chart format
  let chartData: Array<{ name: string; value: number }> = [];
  
  if (!data) {
    console.warn(`No data provided for ${title}`);
    return (
      <div className="p-6 border border-white/10 bg-[#0a0a0c] min-h-[320px]">
        <h3 className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-white/20 text-sm">
          No data available
        </div>
      </div>
    );
  }
  
  // Handle array format (TraitProbability[])
  if (Array.isArray(data)) {
    chartData = data
      .filter(item => item.probability > 0.01)
      .map(item => ({
        name: item.label,
        value: item.probability * 100
      }));
  } 
  // Handle object format (Record<string, number>)
  else if (typeof data === 'object') {
    chartData = Object.entries(data)
      .filter(([_, value]) => (value as number) > 0.01)
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' '),
        value: (value as number) * 100
      }));
  }
  
  if (chartData.length === 0) {
    return (
      <div className="p-6 border border-white/10 bg-[#0a0a0c] min-h-[320px]">
        <h3 className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-white/20 text-sm">
          No probability data available
        </div>
      </div>
    );
  }
  
  // Sort by value descending for better visualization
  chartData.sort((a, b) => b.value - a.value);
  
  return (
    <div className="p-6 border border-white/10 bg-[#0a0a0c] min-h-[380px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[11px] font-mono text-white/40 uppercase tracking-wider">{title}</h3>
        <div className="flex gap-1 bg-white/5 rounded p-0.5">
          <button
            onClick={() => setChartType('pie')}
            className={`p-1.5 rounded transition-all ${chartType === 'pie' ? 'bg-emerald-500/20 text-emerald-500' : 'text-white/30 hover:text-white/50'}`}
            title="Pie Chart"
          >
            <PieChartIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded transition-all ${chartType === 'bar' ? 'bg-emerald-500/20 text-emerald-500' : 'text-white/30 hover:text-white/50'}`}
            title="Bar Chart"
          >
            <BarChartIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => {
                  const pct = (percent * 100).toFixed(0);
                  return pct !== '0' ? `${name}: ${pct}%` : '';
                }}
                labelLine={{ stroke: '#ffffff30', strokeWidth: 1 }}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0a0a0c" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0c', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={46}
                wrapperStyle={{ 
                  fontSize: '10px', 
                  fontFamily: 'monospace',
                  paddingTop: '10px'
                }}
                formatter={(value) => <span className="text-white/60">{value}</span>}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData} layout="vertical" margin={{ left: 60, right: 20, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#ffffff40', fontSize: 10 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }}
                width={60}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0c', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
              />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};