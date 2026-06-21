"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Activity, Shield, ArrowUpRight, ArrowDownRight, 
  Lock, PieChart as PieIcon, CreditCard, Wallet, 
  TrendingUp, LayoutGrid, ChevronDown, ChevronUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default function Dashboard() {
  const [report, setReport] = useState<any>(null);
  
  // --- NEW: State to control the Ledger Dropdown ---
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("cashlens_report");
    if (savedData) {
      setReport(JSON.parse(savedData).data);
    }
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="text-zinc-600 flex items-center gap-3 font-medium text-lg">
          <Activity className="w-6 h-6 animate-pulse text-zinc-900" /> 
          Securing Local Telemetry...
        </div>
      </div>
    );
  }

  const { health_score, spending_dna, financial_story, transactions } = report;

  const expenses = transactions.filter((t: any) => t.type === 'debit');
  const totalInflow = transactions.filter((t: any) => t.type === 'credit').reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
  const totalOutflow = expenses.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
  const netFlow = totalInflow - totalOutflow;

  const categoryTotals = expenses.reduce((acc: any, tx: any) => {
    acc[tx.category] = (acc[tx.category] || 0) + parseFloat(tx.amount);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals)
    .map(key => ({ name: key, value: categoryTotals[key] }))
    .sort((a, b) => b.value - a.value);

  const keyTransactions = [...transactions]
    .sort((a: any, b: any) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 10);

  const COLORS = ['#09090b', '#27272a', '#52525b', '#71717a', '#a1a1aa', '#10b981'];

  const displayArchetype = (spending_dna?.archetype && spending_dna.archetype !== "Unknown") 
    ? spending_dna.archetype 
    : (health_score?.overall_score >= 65 ? "The Pragmatist" : "The Consumer");

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-zinc-200 pb-24 text-zinc-900">
      
      <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-950 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CashLens</span>
            <span className="hidden md:block px-2.5 py-1 ml-2 rounded bg-zinc-100 text-zinc-700 text-xs font-semibold">
              Intelligence Terminal
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-zinc-700 text-sm font-semibold">
              <Lock className="w-4 h-4" /> Air-Gapped Mode
            </span>
            <Link href="/upload" className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors shadow-sm">
              New Statement
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 pt-10">
        
        <div className="mb-10 bg-zinc-950 rounded-2xl p-8 text-white shadow-md border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-300 text-sm font-semibold mb-3">
            <Shield className="w-5 h-5" /> Flagship Narrative Profile
          </div>
          <h1 className="text-2xl font-medium tracking-tight max-w-4xl leading-relaxed text-zinc-100">
            {financial_story || "Your transactional footprint reveals stable structural foundations, but requires deeper optimization in discretionary lifestyle outflow."}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
            <h3 className="text-zinc-800 text-sm font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" /> Financial Health Index
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold tracking-tighter text-zinc-950">{health_score?.overall_score || "0"}</span>
              <span className="text-zinc-600 font-semibold text-lg">/ 100</span>
            </div>
            <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm font-bold w-fit">
              Tier Grade: {health_score?.grade || "N/A"}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
            <h3 className="text-zinc-800 text-sm font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-500" /> Capital Velocity
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-zinc-600">Inbound Capital</span>
                  <ArrowDownRight className="w-4 h-4 text-emerald-600"/>
                </div>
                <div className="text-2xl font-bold text-zinc-950 tracking-tight">{formatINR(totalInflow)}</div>
              </div>
              <div className="h-px w-full bg-zinc-200"></div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-zinc-600">Outbound Capital</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500"/>
                </div>
                <div className="text-2xl font-bold text-zinc-950 tracking-tight">{formatINR(totalOutflow)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors">
            <h3 className="text-zinc-800 text-sm font-semibold mb-6 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-zinc-500" /> Structural Ratios
            </h3>
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold text-zinc-800 mb-2">
                <span>Cash Flow Margin</span>
                <span>{health_score?.breakdown?.cash_flow_strength || 0}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                <div className="h-full bg-emerald-500" style={{ width: `${health_score?.breakdown?.cash_flow_strength || 0}%` }}></div>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold text-zinc-800 mb-2">
                <span>Saving Discipline</span>
                <span>{health_score?.breakdown?.saving_discipline || 0}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                <div className="h-full bg-zinc-900" style={{ width: `${health_score?.breakdown?.saving_discipline || 0}%` }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200 flex justify-between items-center">
               <span className="text-sm font-semibold text-zinc-600">Net Cycle Retention</span>
               <span className={`text-lg font-bold tracking-tight ${netFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                 {netFlow > 0 ? '+' : ''}{formatINR(netFlow)}
               </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm flex flex-col hover:border-zinc-300 transition-colors">
            <h3 className="text-zinc-800 text-sm font-semibold mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-500" /> Behavioral Profile
            </h3>
            <div className="text-3xl font-bold text-zinc-950 mb-3 tracking-tight">{displayArchetype}</div>
            <p className="text-base text-zinc-700 leading-relaxed flex-grow font-medium">
              Based on the density and trajectory of your capital outflows, your financial DNA indicates a highly structured methodology to asset allocation.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          <div className="lg:col-span-2 bg-white rounded-xl p-8 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <PieIcon className="w-5 h-5 text-zinc-700" />
              <h3 className="text-zinc-900 font-bold text-lg">Capital Allocation Matrix</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '14px', fontWeight: 600 }}
                    itemStyle={{ color: '#09090b' }}
                    formatter={(value: number) => formatINR(value)}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={115}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <CreditCard className="w-5 h-5 text-zinc-700" />
              <h3 className="text-zinc-900 font-bold text-lg">Primary Drains</h3>
            </div>
            <div className="space-y-6">
              {chartData.slice(0, 5).map((category, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-base font-semibold text-zinc-800">{category.name}</span>
                  </div>
                  <span className="text-base font-bold text-zinc-950 tracking-tight">{formatINR(category.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- THE DROPDOWN LEDGER FIX --- */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
          
          {/* Clickable Header Area */}
          <button 
            onClick={() => setIsLedgerOpen(!isLedgerOpen)}
            className="w-full bg-zinc-50 p-6 flex justify-between items-center hover:bg-zinc-100 transition-colors outline-none"
          >
             <div className="flex items-center gap-3">
               <Wallet className="w-5 h-5 text-zinc-700" />
               <h3 className="text-zinc-950 font-bold text-lg">Key Transactions Data</h3>
             </div>
             <div className="flex items-center gap-4">
               <span className="px-3 py-1 rounded bg-white border border-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm">
                 Top 10 High-Impact Events
               </span>
               <div className="p-1 rounded bg-white border border-zinc-200 shadow-sm">
                 {isLedgerOpen ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
               </div>
             </div>
          </button>
          
          {/* Conditionally Rendered Table */}
          {isLedgerOpen && (
            <div className="border-t border-zinc-200 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-white">
                    <th className="px-6 py-5 text-sm font-bold text-zinc-800">Date</th>
                    <th className="px-6 py-5 text-sm font-bold text-zinc-800">Processed Entity</th>
                    <th className="px-6 py-5 text-sm font-bold text-zinc-800">Classification</th>
                    <th className="px-6 py-5 text-sm font-bold text-zinc-800 text-right">Net Amount</th>
                  </tr>
                </thead>
                <tbody className="text-base text-zinc-800">
                  {keyTransactions.map((tx: any, idx: number) => (
                    <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-5 font-medium text-zinc-600 whitespace-nowrap">{tx.date}</td>
                      <td className="px-6 py-5 font-semibold text-zinc-950">
                        {tx.merchant.startsWith("CACHED:") ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md">Cache</span>
                            {tx.merchant.replace("CACHED:", "").trim()}
                          </div>
                        ) : tx.merchant.startsWith("P2P:") ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-1 rounded-md">P2P</span>
                            {tx.merchant.replace("P2P:", "").trim()}
                          </div>
                        ) : (
                          tx.merchant
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm font-semibold">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`px-6 py-5 text-right font-bold tracking-tight ${tx.type === 'credit' ? 'text-emerald-600' : 'text-zinc-950'}`}>
                        {tx.type === 'credit' ? '+' : ''}{formatINR(parseFloat(tx.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}