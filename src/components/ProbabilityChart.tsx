import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

interface ProbabilityChartProps {
  title: string;
  data: any;
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

type ChartType = 'pie' | 'bar';

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ title, data }) => {
  const [chartType, setChartType] = useState<ChartType>('pie');
  
  let chartData: Array<{ name: string; value: number }> = [];
  
  if (!data) {
    return (
      <div className="p-4 sm:p-6 border border-white/10 bg-[#0a0a0c] min-h-[320px] w-full max-w-full overflow-hidden">
        <h3 className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-white/20 text-sm">
          No data available
        </div>
      </div>
    );
  }
  
  if (Array.isArray(data)) {
    chartData = data
      .filter(item => item.probability > 0.01)
      .map(item => ({
        name: item.label,
        value: item.probability * 100
      }));
  } else if (typeof data === 'object') {
    chartData = Object.entries(data)
      .filter(([_, value]) => (value as number) > 0.01)
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' '),
        value: (value as number) * 100
      }));
  }
  
  if (chartData.length === 0) {
    return (
      <div className="p-4 sm:p-6 border border-white/10 bg-[#0a0a0c] min-h-[320px] w-full max-w-full overflow-hidden">
        <h3 className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-white/20 text-sm">
          No probability data available
        </div>
      </div>
    );
  }
  
  chartData.sort((a, b) => b.value - a.value);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0c] border border-emerald-500/30 rounded-lg px-3 py-2 shadow-xl backdrop-blur-sm">
          <p className="text-[10px] font-mono text-emerald-400 font-bold mb-1">{payload[0].payload.name}</p>
          <p className="text-[11px] text-white">
            Probability: <span className="text-emerald-400 font-bold">{payload[0].value.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Truncate long labels on Y-Axis for mobile bar chart
  const renderYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const label = payload.value.length > 10 ? `${payload.value.substring(0, 9)}…` : payload.value;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-5} y={3} dy={0} textAnchor="end" fill="#ffffff60" fontSize={10} fontFamily="monospace">
          {label}
        </text>
      </g>
    );
  };
  
  return (
    <div className="p-4 sm:p-6 border border-white/10 bg-[#0a0a0c] min-h-[380px] w-full max-w-full overflow-hidden box-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[11px] font-mono text-white/40 uppercase tracking-wider truncate mr-2">{title}</h3>
        <div className="flex gap-1 bg-white/5 rounded p-0.5 shrink-0">
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
      
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={false} /* Turned off outer pie labels to stop mobile clipping */
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0a0a0c" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                wrapperStyle={{ 
                  fontSize: '10px', 
                  fontFamily: 'monospace',
                  paddingTop: '8px',
                  width: '100%',
                  overflowX: 'auto'
                }}
                formatter={(value) => <span className="text-white/60 hover:text-emerald-400 transition-colors cursor-pointer mr-2">{value}</span>}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#ffffff40', fontSize: 10 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={renderYAxisTick}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
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