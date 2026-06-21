'use client';

import React from 'react';
import { Fingerprint, CheckCircle2 } from 'lucide-react';
import { SpendingDna } from '../../types';

interface SpendingDnaCardProps {
  data: SpendingDna;
}

export default function SpendingDnaCard({ data }: SpendingDnaCardProps) {
  return (
    <div className="w-full bg-[#141417] border border-[#27272a] rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Fingerprint className="w-5 h-5 text-purple-500" />
          <h3 className="text-sm font-semibold text-zinc-300">Spending DNA Profile</h3>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-zinc-900/50 border border-[#27272a]">
          <span className="text-xs text-zinc-500 font-bold tracking-wider uppercase block">Archetype</span>
          <span className="text-xl font-bold text-purple-500 mt-0.5 block">{data.profile_name}</span>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs text-zinc-400 font-semibold block mb-1">Behavioral Attributes:</span>
 {data.traits.map((trait: string, idx: number) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 bg-zinc-900/30 p-2.5 rounded-lg border border-[#27272a]/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-normal">{trait}</p>
          </div>
        ))}
      </div>
    </div>
  );
}