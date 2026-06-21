'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface TrendLineProps {
  data: { date: string; balance: number }[];
}

export default function TrendLine({ data }: TrendLineProps) {
  return (
    <div className="w-full h-72 bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-zinc-400 mb-4">Net Capital Trajectory Trend</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} />
          <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#141417', borderColor: '#27272a', borderRadius: '8px' }}
          />
          <defs>
            <linearGradient id="trendColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="balance" name="Net Velocity" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#trendColor)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}