import React from 'react';
import { Activity, Github } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-zinc-100 rounded-sm">
          <Activity className="w-5 h-5 text-black" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-[#fafafa] leading-none block">CASHLENS</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5 block">Intelligence Engine</span>
        </div>
      </div>
      
      <a 
        href="https://github.com" 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-900 border border-transparent hover:border-[#27272a]"
      >
        <Github className="w-4 h-4" />
        <span className="uppercase tracking-wider font-semibold">Open Source</span>
      </a>
    </nav>
  );
}