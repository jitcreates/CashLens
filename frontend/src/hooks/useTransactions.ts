import { useAppStore } from '../store/useAppStore';

export const useTransactions = () => {
  const { setAnalysisData, setProcessingStatus, setErrorSignal } = useAppStore();

  const uploadStatementFile = async (targetFile: File) => {
    setProcessingStatus(true);
    setErrorSignal(null);

    const dataPayload = new FormData();
    dataPayload.append('file', targetFile);

    try {
      const serverTarget = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const executionCall = await fetch(`${serverTarget}/api/analyze`, {
        method: 'POST',
        body: dataPayload,
      });

      if (!executionCall.ok) {
        const errorBody = await executionCall.json();
        throw new Error(errorBody.detail || 'Failed to process financial statement contents.');
      }

      const responsePayload = await executionCall.json();
      
      // Unpack the valid nested data payload from the backend wrapper structure
      if (responsePayload.status === 'success') {
        setAnalysisData(responsePayload.data);
      } else {
        throw new Error(responsePayload.message || 'Analysis framework returned an operational error.');
      }

    } catch (err: any) {
      setErrorSignal(err.message || 'An unexpected runtime connection error occurred.');
      setAnalysisData(null);
    } finally {
      setProcessingStatus(false);
    }
  };

  return {
    uploadStatementFile,
  };
};