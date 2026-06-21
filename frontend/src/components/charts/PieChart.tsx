'use client';

import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data: { name: string; value: number }[];
}

const COLOR_PALETTE = ['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#eab308', '#a1a1aa'];

export default function PieChart({ data }: PieChartProps) {
  return (
    <div className="w-full h-72 bg-card border border-border rounded-xl p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-zinc-400 mb-2">Category Spending Distribution</h3>
      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#141417', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
}