import { useState, useCallback } from 'react';

export interface PDFProcessingState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  result: ProcessedFile | null;
}

export interface ProcessedFile {
  name: string;
  size: string;
  originalSize: string;
  reduction?: string;
  downloadUrl?: string;
  previewUrl?: string;
}

export interface CompressionSettings {
  level: 'low' | 'medium' | 'high' | 'extreme';
  targetSize?: number;
  dpi: number;
  imageQuality: number;
  colorMode: 'no-change' | 'grayscale' | 'color';
}

export interface ProcessingOptions {
  compression?: CompressionSettings;
  password?: string;
  watermark?: {
    text: string;
    opacity: number;
    position: string;
  };
  rotation?: number;
  pageRange?: string;
  settings?: Record<string, unknown>;
}

/**
 * Custom hook for PDF processing operations with proper state management
 */
export const usePDFProcessor = () => {
  const [state, setState] = useState<PDFProcessingState>({
    isProcessing: false,
    progress: 0,
    currentStep: '',
    error: null,
    result: null,
  });

  const updateProgress = useCallback((progress: number, step: string) => {
    setState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
      currentStep: step,
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      isProcessing: false,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      progress: 0,
      currentStep: '',
      error: null,
      result: null,
    });
  }, []);

  const processFiles = useCallback(async (
    files: File[],
    toolId: string,
    options: ProcessingOptions = {}
  ): Promise<ProcessedFile | null> => {
    if (files.length === 0) {
      setError('No files selected for processing');
      return null;
    }

    setState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      error: null,
      result: null,
    }));

    try {
      // Simulate processing steps
      const steps = getProcessingSteps(toolId);
      
      for (let i = 0; i < steps.length; i++) {
        updateProgress((i / steps.length) * 100, steps[i]);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
      }

      // Simulate final result
      const result = await simulateProcessing(files[0], toolId, options);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        progress: 100,
        currentStep: 'Complete',
        result,
      }));

      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Processing failed');
      return null;
    }
  }, [updateProgress, setError]);

  return {
    state,
    processFiles,
    updateProgress,
    setError,
    clearError,
    reset,
  };
};

// Helper functions
const getProcessingSteps = (toolId: string): string[] => {
  const commonSteps = ['Uploading file', 'Analyzing document'];
  
  switch (toolId) {
    case 'compress-pdf':
      return [...commonSteps, 'Optimizing images', 'Compressing content', 'Finalizing'];
    case 'merge-pdf':
      return [...commonSteps, 'Merging documents', 'Optimizing structure', 'Finalizing'];
    case 'split-pdf':
      return [...commonSteps, 'Splitting pages', 'Creating new documents', 'Finalizing'];
    case 'protect-pdf':
      return [...commonSteps, 'Applying encryption', 'Setting permissions', 'Finalizing'];
    case 'unlock-pdf':
      return [...commonSteps, 'Verifying password', 'Removing protection', 'Finalizing'];
    default:
      return [...commonSteps, 'Processing document', 'Finalizing'];
  }
};

const simulateProcessing = async (
  file: File,
  toolId: string,
  options: ProcessingOptions
): Promise<ProcessedFile> => {
  const originalSizeMB = file.size / 1024 / 1024;
  
  let newSizeMB = originalSizeMB;
  let reduction = '';

  // Simulate different processing results based on tool
  switch (toolId) {
    case 'compress-pdf': {
      const compressionLevel = options.compression?.level || 'medium';
      const reductionFactor = {
        low: 0.85,
        medium: 0.52,
        high: 0.35,
        extreme: 0.25,
      }[compressionLevel];
      
      newSizeMB = originalSizeMB * reductionFactor;
      reduction = `${((1 - reductionFactor) * 100).toFixed(1)}%`;
      break;
    }
      
    case 'merge-pdf': {
      // Merged file might be slightly larger due to metadata
      newSizeMB = originalSizeMB * 1.02;
      break;
    }
      
    default:
      newSizeMB = originalSizeMB * 0.98; // Slight optimization
  }

  return {
    name: file.name,
    size: `${newSizeMB.toFixed(2)} MB`,
    originalSize: `${originalSizeMB.toFixed(2)} MB`,
    reduction,
    downloadUrl: '#', // In real app, this would be the actual download URL
    previewUrl: '#', // In real app, this would be the preview URL
  };
};
