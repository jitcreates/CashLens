'use client';

import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: { name: string; debit: number; credit: number }[];
}

export default function BarChart({ data }: BarChartProps) {
  return (
    <div className="w-full h-72 bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-zinc-400 mb-4">Inflow vs Outflow Velocity</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RechartsBar data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
          <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#141417', borderColor: '#27272a', borderRadius: '8px' }}
            labelStyle={{ color: '#fafafa', fontSize: '12px' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="credit" name="Inflow (Credits)" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="debit" name="Outflow (Debits)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}