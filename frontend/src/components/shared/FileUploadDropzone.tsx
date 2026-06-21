'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useAppStore } from '../../store/useAppStore';

export default function FileUploadDropzone() {
  const { uploadStatementFile } = useTransactions();
  const { isProcessing, errorSignal } = useAppStore();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFileSelection = (files: FileList | null) => {
    if (files && files[0]) {
      uploadStatementFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFileSelection(e.dataTransfer.files);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 bg-[#141417]/30 ${
          dragActive 
            ? "border-purple-500 bg-purple-500/5" 
            : "border-[#27272a] hover:border-zinc-700 hover:bg-[#141417]/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv,.txt"
          className="hidden"
          onChange={(e) => processFileSelection(e.target.files)}
          disabled={isProcessing}
        />

        <div className="p-4 rounded-full bg-zinc-900 border border-[#27272a]">
          <Upload className={`w-8 h-8 ${isProcessing ? "animate-pulse text-purple-500" : "text-zinc-400"}`} />
        </div>

        <div className="text-center">
          <p className="font-medium text-white">
            {isProcessing ? "Analyzing transactional behavior..." : "Upload your bank statement"}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            Drag & drop or click to browse files (PDF, CSV, or TXT)
          </p>
        </div>

        <div className="flex gap-4 items-center text-xs text-zinc-600 mt-2">
          <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Direct Local Parsing</span>
          <span>•</span>
          <span>Zero Server Storage Logs</span>
        </div>
      </div>

      {errorSignal && (
        <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-rose-500">Processing Error</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{errorSignal}</p>
          </div>
        </div>
      )}
    </div>
  );
}