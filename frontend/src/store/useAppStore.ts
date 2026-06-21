import { create } from 'zustand';
import { AnalysisPayload } from '../types';

interface AppState {
  analysisData: AnalysisPayload | null;
  isProcessing: boolean;
  errorSignal: string | null;
  setAnalysisData: (data: AnalysisPayload | null) => void;
  setProcessingStatus: (status: boolean) => void;
  setErrorSignal: (msg: string | null) => void;
  resetStore: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  analysisData: null,
  isProcessing: false,
  errorSignal: null,
  setAnalysisData: (data) => set({ analysisData: data }),
  setProcessingStatus: (status) => set({ isProcessing: status }),
  setErrorSignal: (msg) => set({ errorSignal: msg }),
  resetStore: () => set({ analysisData: null, isProcessing: false, errorSignal: null }),
}));