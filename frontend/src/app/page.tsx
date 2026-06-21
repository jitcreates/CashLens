import React from 'react';
import Link from 'next/link';
import { UploadCloud, Shield, HardDrive, Github, Lock, ArrowUpRight, Activity } from 'lucide-react';

export default function Hero() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-zinc-200">
      
      {/* Refined Minimalist Navbar */}
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-zinc-900 font-bold text-lg tracking-tight">CashLens</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-500">
            <Link href="#" className="hover:text-zinc-900 transition-colors">Features</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">Docs</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">GitHub</Link>
          </div>
          <Link 
            href="/upload" 
            className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        {/* High-Contrast Typography Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-semibold uppercase tracking-widest mb-8">
            <HardDrive className="w-3 h-3" />
            Local Inference Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight">
            Institutional cash flow analysis. <br className="hidden md:block" />
            <span className="text-zinc-400">Zero cloud storage.</span>
          </h1>
          
          <p className="text-lg text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your bank statement and receive deep behavioral insights, strict risk grading, and offline categorization in seconds.
          </p>

          {/* Interactive Upload Dropzone (Now a working Link) */}
          <div className="max-w-2xl mx-auto">
            <Link href="/upload" className="block relative group cursor-pointer">
              <div className="absolute -inset-2 bg-zinc-900/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative border border-dashed border-zinc-300 rounded-xl bg-white p-12 text-center hover:border-zinc-500 transition-colors shadow-sm">
                <UploadCloud className="w-8 h-8 text-zinc-400 mx-auto mb-4 group-hover:text-zinc-900 transition-colors" />
                <h3 className="text-zinc-900 font-semibold text-lg mb-1">Select your statement</h3>
                <p className="text-zinc-500 text-sm mb-6">Drag & drop or click to browse (PDF, CSV, XLSX)</p>
                <div className="flex justify-center gap-3">
                  <span className="px-3 py-1 rounded bg-zinc-50 text-zinc-500 border border-zinc-200 text-xs font-medium">PDF</span>
                  <span className="px-3 py-1 rounded bg-zinc-50 text-zinc-500 border border-zinc-200 text-xs font-medium">CSV</span>
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-center gap-2 mt-5 text-sm text-zinc-500">
              <Lock className="w-4 h-4" />
              Data processed locally. <span className="text-zinc-900 font-medium">Never stored. Ever.</span>
            </div>
          </div>
        </div>

        {/* Minimalist Data Table Mockup */}
        <div className="mt-24 border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm">
          {/* Header */}
          <div className="border-b border-zinc-100 bg-zinc-50/50 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                <Shield className="w-4 h-4 text-zinc-900" />
              </div>
              <div>
                <h4 className="text-zinc-900 font-semibold text-sm">HDFC Bank Statement</h4>
                <p className="text-zinc-500 text-xs font-medium">May 1 – May 31, 2024</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-semibold">
              Processed Locally
            </span>
          </div>

          {/* Body */}
          <div className="grid md:grid-cols-3 gap-0">
            {/* Left Col: Ledger */}
            <div className="md:col-span-2 border-r border-zinc-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Ledger Log</h5>
                <h5 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Category</h5>
              </div>
              <div className="space-y-1">
                {/* Transaction 1 */}
                <div className="flex justify-between items-center py-3 border-b border-zinc-50">
                  <div className="flex flex-col">
                    <span className="text-zinc-900 text-sm font-medium">ACH/SALARY/TECHCORP</span>
                    <span className="text-zinc-500 text-xs mt-0.5">+ ₹1,25,000.00</span>
                  </div>
                  <span className="text-zinc-600 text-sm">Income</span>
                </div>
                {/* Transaction 2 */}
                <div className="flex justify-between items-center py-3 border-b border-zinc-50">
                  <div className="flex flex-col">
                    <span className="text-zinc-900 text-sm font-medium"><span className="text-zinc-400 font-mono text-xs mr-1">P2P:</span>Rahul Sharma</span>
                    <span className="text-zinc-500 text-xs mt-0.5">- ₹4,500.00</span>
                  </div>
                  <span className="text-zinc-600 text-sm">Transfers</span>
                </div>
                {/* Transaction 3 */}
                <div className="flex justify-between items-center py-3 border-b border-zinc-50">
                  <div className="flex flex-col">
                    <span className="text-zinc-900 text-sm font-medium"><span className="text-zinc-400 font-mono text-xs mr-1">CACHED:</span>PaytmQR28100</span>
                    <span className="text-zinc-500 text-xs mt-0.5">- ₹850.00</span>
                  </div>
                  <span className="text-zinc-600 text-sm">Shopping</span>
                </div>
                {/* Transaction 4 */}
                <div className="flex justify-between items-center py-3">
                  <div className="flex flex-col">
                    <span className="text-zinc-900 text-sm font-medium">Zomato Online</span>
                    <span className="text-zinc-500 text-xs mt-0.5">- ₹680.00</span>
                  </div>
                  <span className="text-zinc-600 text-sm">Food & Dining</span>
                </div>
              </div>
            </div>

            {/* Right Col: Metrics */}
            <div className="p-6 flex flex-col gap-4 bg-zinc-50/50">
              <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h6 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Financial Health</h6>
                  <span className="text-zinc-700 text-xs font-bold px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded">Grade B</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-zinc-900 tracking-tight">78</span>
                  <span className="text-zinc-400 font-medium text-sm">/100</span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm">
                <h6 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Cash Flow Strength</h6>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-zinc-900 tracking-tight">High <ArrowUpRight className="inline w-4 h-4 text-zinc-400" /></span>
                  <span className="text-zinc-500 font-medium text-sm">85%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 mt-3 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 w-[85%] rounded-full"></div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm">
                <h6 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Behavior Archetype</h6>
                <div className="text-lg font-bold text-zinc-900 tracking-tight">The Architect</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-zinc-200 pt-12">
          <div>
            <div className="flex items-center gap-2 text-zinc-900 font-semibold mb-2">
              <HardDrive className="w-4 h-4 text-zinc-400" /> 100% Local Processing
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Your files never leave your device's RAM.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-zinc-900 font-semibold mb-2">
              <Shield className="w-4 h-4 text-zinc-400" /> No Data Storage
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">We don't store or collect a single byte.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-zinc-900 font-semibold mb-2">
              <Github className="w-4 h-4 text-zinc-400" /> Open Source
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Transparent, verifiable, community driven.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-zinc-900 font-semibold mb-2">
              <Lock className="w-4 h-4 text-zinc-400" /> Secure by Design
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Built to institutional privacy standards.</p>
          </div>
        </div>
      </main>
    </div>
  );
}