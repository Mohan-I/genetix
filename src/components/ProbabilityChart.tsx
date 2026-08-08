// ============================================================
// PROBABILITY CHART - Fully Responsive with No Layout Shift
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface ProbabilityChartProps {
  title: string;
  data: any;
  height?: number;
  mobileHeight?: number;
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

type ChartType = 'pie' | 'bar';

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ 
  title, 
  data, 
  height = 280,
  mobileHeight = 240
}) => {
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  let chartData: Array<{ name: string; value: number }> = [];
  
  if (!data) {
    return (
      <div className="w-full p-4 sm:p-6 border border-white/10 bg-[#0a0a0c] min-h-[250px] sm:min-h-[320px]">
        <h3 className="text-[10px] sm:text-[11px] font-mono text-white/40 uppercase tracking-wider mb-4 truncate">{title}</h3>
        <div className="flex items-center justify-center h-32 sm:h-48 text-white/20 text-xs sm:text-sm">
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
      <div className="w-full p-4 sm:p-6 border border-white/10 bg-[#0a0a0c] min-h-[250px] sm:min-h-[320px]">
        <h3 className="text-[10px] sm:text-[11px] font-mono text-white/40 uppercase tracking-wider mb-4 truncate">{title}</h3>
        <div className="flex items-center justify-center h-32 sm:h-48 text-white/20 text-xs sm:text-sm">
          No probability data available
        </div>
      </div>
    );
  }
  
  chartData.sort((a, b) => b.value - a.value);

  // Format label for mobile
  const formatLabel = (name: string) => {
    if (isMobile && name.length > 10) {
      return name.substring(0, 8) + '…';
    }
    return name;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0c] border border-emerald-500/30 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 shadow-xl backdrop-blur-sm z-50">
          <p className="text-[8px] sm:text-[10px] font-mono text-emerald-400 font-bold mb-0.5 sm:mb-1">{payload[0].payload.name}</p>
          <p className="text-[9px] sm:text-[11px] text-white">
            Probability: <span className="text-emerald-400 font-bold">{payload[0].value.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom YAxis tick for mobile
  const renderYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const label = formatLabel(payload.value);
    const fontSize = isMobile ? 8 : 10;
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={-5} 
          y={3} 
          dy={0} 
          textAnchor="end" 
          fill="#ffffff60" 
          fontSize={fontSize} 
          fontFamily="monospace"
        >
          {label}
        </text>
      </g>
    );
  };

  const chartHeight = isMobile ? mobileHeight : height;

  // Determine if we should show labels on pie
  const showPieLabels = !isMobile || chartData.length <= 4;

  return (
    <div className="w-full min-w-0 p-3 sm:p-6 border border-white/10 bg-[#0a0a0c] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4 min-w-0">
        <h3 className="text-[9px] sm:text-[11px] font-mono text-white/40 uppercase tracking-wider truncate flex-1 mr-2">
          {title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex gap-0.5 bg-white/5 rounded p-0.5">
            <button
              onClick={() => setChartType('pie')}
              className={`p-1 sm:p-1.5 rounded transition-all ${
                chartType === 'pie' 
                  ? 'bg-emerald-500/20 text-emerald-500' 
                  : 'text-white/30 hover:text-white/50'
              }`}
              title="Pie Chart"
            >
              <PieChartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1 sm:p-1.5 rounded transition-all ${
                chartType === 'bar' 
                  ? 'bg-emerald-500/20 text-emerald-500' 
                  : 'text-white/30 hover:text-white/50'
              }`}
              title="Bar Chart"
            >
              <BarChartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="sm:hidden p-1 text-white/30 hover:text-white/50"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      {/* Chart Container - No absolute positioning */}
      <div 
        ref={containerRef}
        className={`w-full ${!expanded && 'hidden sm:block'}`}
        style={{ height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart margin={{ top: isMobile ? 0 : 10, right: isMobile ? 0 : 10, bottom: isMobile ? 0 : 10, left: isMobile ? 0 : 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy={isMobile ? '42%' : '45%'}
                innerRadius={isMobile ? 30 : 50}
                outerRadius={isMobile ? 55 : 80}
                paddingAngle={isMobile ? 1 : 2}
                dataKey="value"
                label={showPieLabels ? ({ name, percent }) => {
                  const pct = (percent * 100).toFixed(0);
                  if (isMobile) {
                    return pct !== '0' && pct !== '0%' ? `${pct}%` : '';
                  }
                  return pct !== '0' && pct !== '0%' ? `${formatLabel(name)}: ${pct}%` : '';
                } : false}
                labelLine={showPieLabels ? { stroke: '#ffffff30', strokeWidth: isMobile ? 0.5 : 1 } : false}
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#0a0a0c" 
                    strokeWidth={isMobile ? 1 : 2} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={isMobile ? 40 : 60}
                wrapperStyle={{ 
                  fontSize: isMobile ? '8px' : '10px', 
                  fontFamily: 'monospace',
                  paddingTop: isMobile ? '4px' : '10px',
                  width: '100%'
                }}
                formatter={(value) => (
                  <span className="text-white/60 hover:text-emerald-400 transition-colors cursor-pointer mr-1">
                    {formatLabel(value as string)}
                  </span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart 
              data={chartData} 
              layout={isMobile ? 'horizontal' : 'vertical'} 
              margin={{ 
                left: isMobile ? 5 : 55, 
                right: isMobile ? 5 : 15, 
                top: isMobile ? 5 : 10, 
                bottom: isMobile ? 35 : 10 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              {isMobile ? (
                <>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#ffffff40', fontSize: 8, fontFamily: 'monospace' }}
                    angle={-35}
                    textAnchor="end"
                    height={40}
                    interval={0}
                    tickFormatter={formatLabel}
                  />
                  <YAxis 
                    type="number" 
                    domain={[0, 100]} 
                    tick={{ fill: '#ffffff40', fontSize: 8 }}
                    width={25}
                  />
                </>
              ) : (
                <>
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    tick={{ fill: '#ffffff40', fontSize: 10 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={renderYAxisTick}
                    width={55}
                  />
                </>
              )}
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={isMobile ? [4, 4, 0, 0] : [0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Mobile summary when collapsed */}
      {isMobile && !expanded && chartData.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {chartData.slice(0, 3).map((item, idx) => (
            <span 
              key={idx}
              className="text-[7px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5 rounded"
            >
              {formatLabel(item.name)}: {item.value.toFixed(0)}%
            </span>
          ))}
          {chartData.length > 3 && (
            <span className="text-[7px] font-mono text-white/20">+{chartData.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProbabilityChart;