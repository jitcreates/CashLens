'use client';

import React from 'react';
import { ShieldCheck, Target, Zap, TrendingUp, Activity } from 'lucide-react';
import { HealthScore } from '../../types';

interface HealthScoreCardProps {
  data: HealthScore;
}

export default function HealthScoreCard({ data }: HealthScoreCardProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (grade.startsWith('B')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (grade.startsWith('C')) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  const metrics = [
    { label: 'Cash Flow Strength', value: data.breakdown.cash_flow_strength, icon: TrendingUp },
    { label: 'Saving Discipline', value: data.breakdown.saving_discipline, icon: Target },
    { label: 'Spending Stability', value: data.breakdown.spending_stability, icon: Activity },
    { label: 'Subscription Efficiency', value: data.breakdown.subscription_efficiency, icon: Zap },
  ];

  return (
    <div className="w-full bg-[#141417] border border-[#27272a] rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-semibold text-zinc-300">Financial Health Score</h3>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getGradeColor(data.grade)}`}>
            Grade {data.grade}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-extrabold text-white tracking-tight">{data.overall_score}</span>
          <span className="text-sm text-zinc-500 font-medium">/ 100</span>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Icon className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{metric.label}</span>
                </div>
                <span className="text-white font-semibold">{metric.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-[#27272a]/50">
                <div 
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}