"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, File, Loader2, AlertCircle, Shield, Activity } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError("");
    }
  };

  // Send the file to our Python Backend!
  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Calls your local FastAPI server
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Engine failed to parse this document. Ensure it's a valid bank statement.");
      }

      const data = await response.json();

      // Temporarily store the AI's output in the browser's local storage 
      // so the Dashboard page can read it on the next screen.
      localStorage.setItem("cashlens_report", JSON.stringify(data));

      // Push user to the dashboard
      router.push("/dashboard");
      
    } catch (err: any) {
      setError(err.message || "A local connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-zinc-200">
      {/* Minimalist Navbar */}
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-zinc-900 font-bold text-lg tracking-tight">CashLens</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-3">Upload Statement</h1>
          <p className="text-zinc-500 text-sm">Select a local file to begin the deterministic analysis.</p>
        </div>

        {/* Upload Box */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-10 shadow-sm relative">
          {!file ? (
            // No file selected yet -> Show Drag & Drop UI
            <div className="text-center">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".pdf,.csv,.xlsx" 
                onChange={handleFileChange}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer border-2 border-dashed border-zinc-300 rounded-xl block py-16 hover:border-zinc-500 hover:bg-zinc-50 transition-all"
              >
                <UploadCloud className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
                <span className="block text-zinc-900 font-semibold mb-1">Click to browse or drag file</span>
                <span className="block text-zinc-500 text-sm">PDF, CSV, or XLSX formats supported</span>
              </label>
            </div>
          ) : (
            // File Selected -> Show Confirmation UI
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200">
                <File className="w-8 h-8 text-zinc-900" />
              </div>
              <h3 className="text-zinc-900 font-semibold text-lg mb-1">{file.name}</h3>
              <p className="text-zinc-500 text-sm mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

              {error && (
                <div className="flex items-center justify-center gap-2 text-red-600 text-sm mb-6 bg-red-50 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setFile(null)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 font-medium text-sm hover:bg-zinc-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing Locally...</>
                  ) : (
                    "Run Intelligence Engine"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-zinc-500">
          <Shield className="w-4 h-4" />
          Direct Local Parsing <span className="mx-2">•</span> Zero Server Storage Logs
        </div>
      </main>
    </div>
  );
}