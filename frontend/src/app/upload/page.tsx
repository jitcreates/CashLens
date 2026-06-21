"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, File, Loader2, AlertCircle, Shield, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const [tenure, setTenure] = useState<"1" | "3" | "6">("1");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenure", tenure);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("The local intelligence engine failed to verify this document format.");
      }

      const data = await response.json();
      
      localStorage.setItem("cashlens_tenure", tenure);
      localStorage.setItem("cashlens_report", JSON.stringify(data));

      router.push("/dashboard");
      
    } catch (err: any) {
      setError(err.message || "Local connection timeout occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans text-zinc-900 antialiased selection:bg-zinc-200">
      
      {/* Ultra-Minimal Header */}
      <nav className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-zinc-950 flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CashLens</span>
          </Link>
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Local Telemetry
          </span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        
        {/* Header Typography */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 mb-3">
            Initialize Ledger
          </h1>
          <p className="text-zinc-500 font-medium text-sm max-w-md mx-auto">
            Select your analysis timeframe and provide a local document to begin offline processing.
          </p>
        </div>

        {/* Unified Command Card */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* Segmented Control Header */}
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
            <div className="flex items-center justify-between mb-3">
              <label className="text-zinc-950 font-semibold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" /> Target Tenure
              </label>
              <span className="text-xs font-medium text-zinc-400">Analysis Depth</span>
            </div>
            
            {/* iOS-Style Segmented Control */}
            <div className="flex bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/50">
              {[
                { id: "1", label: "1 Month" },
                { id: "3", label: "3 Months" },
                { id: "6", label: "6 Months" }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTenure(option.id as any)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    tenure === option.id 
                      ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50" 
                      : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dropzone Area */}
          <div className="p-8">
            {!file ? (
              <div className="relative group">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept=".pdf,.csv,.xlsx" 
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center py-16 bg-zinc-50/50 group-hover:bg-zinc-50 group-hover:border-zinc-300 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-zinc-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                    <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                  </div>
                  <span className="block text-zinc-950 font-semibold text-sm mb-1">Click to browse or drag file</span>
                  <span className="block text-zinc-400 text-xs font-medium">Supports PDF, CSV, and XLSX</span>
                </label>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                  <File className="w-6 h-6 text-zinc-950" />
                </div>
                <h3 className="text-zinc-950 font-semibold text-sm mb-1 max-w-xs mx-auto truncate">{file.name}</h3>
                <p className="text-zinc-400 text-xs font-medium mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                {error && (
                  <div className="flex items-center justify-center gap-2 text-red-600 text-xs font-semibold mb-6 bg-red-50 py-2.5 rounded-lg border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button 
                    onClick={() => setFile(null)}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 font-semibold text-sm hover:bg-zinc-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-lg bg-zinc-950 text-white font-semibold text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      "Run Engine"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs font-medium text-zinc-400 mt-6 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Client-side extraction only. Zero server persistence.
        </p>

      </main>
    </div>
  );
}