import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TraitProbability } from '../types';

interface Props {
  data: TraitProbability[];
  title: string;
  color?: string;
}

const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'];

export const ProbabilityChart: React.FC<Props> = ({ data, title, color = "#10b981" }) => {
  return (
    <div className="bg-[#0a0a0c] p-6 border border-white/10 h-[350px] flex flex-col">
      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff05" />
            <XAxis
              type="number"
              domain={[0, 1]}
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              stroke="#ffffff20"
              fontSize={10}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              dataKey="label"
              type="category"
              width={80}
              stroke="#ffffff20"
              fontSize={10}
              fontFamily="JetBrains Mono"
            />
            <Tooltip
              cursor={{ fill: '#ffffff05' }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Probability"]}
              contentStyle={{
                backgroundColor: '#1a1a1a', // Changed to dark to match image_3bb439.png
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0px',
                fontSize: '10px',
                fontFamily: 'JetBrains Mono'
              }}
              /* This changes the "Brown" text */
              labelStyle={{
                color: '#ffffff',
                marginBottom: '4px'
              }}
              /* This changes the "Probability : 75.0%" text */
              itemStyle={{
                color: '#888888',
                padding: '0px'
              }}
            />
            <Bar dataKey="probability" radius={[0, 2, 2, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
