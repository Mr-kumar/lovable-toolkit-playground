import { useState, useCallback } from 'react';

// Types for processing state
export interface ToolProcessingState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  result: ProcessedResult | null;
}

export interface ProcessedResult {
  name: string;
  size: string;
  originalSize?: string;
  reduction?: string;
  downloadUrl?: string;
  previewUrl?: string;
  // For repair-pdf
  recoveryReport?: { recovered: number; total: number; notes?: string };
  extractionAvailable?: boolean;
  // For compare-pdf
  differences?: { page: number; type: string; description: string }[];
  similarityScore?: number;
}

export interface ToolProcessingOptions {
  // Compression settings
  compressionLevel?: 'low' | 'medium' | 'high' | 'extreme';
  targetSize?: number;
  dpi?: number;
  imageQuality?: number;
  colorMode?: 'no-change' | 'grayscale' | 'color';
  
  // Protection settings
  password?: string;
  
  // Watermark settings
  watermark?: {
    text: string;
    opacity: number;
    position: string;
  };
  
  // Rotation settings
  rotation?: number;
  
  // Split settings
  pageRange?: string;
  splitMethod?: string;
  
  // Merge settings
  mergeOrder?: string;
  
  // OCR settings
  ocrLanguage?: string;
  
  // Conversion settings
  outputFormat?: string;
  
  // Generic settings container
  settings?: Record<string, unknown>;
}

// Processing step configurations for each tool
const getProcessingSteps = (toolId: string): string[] => {
  const commonSteps = ['Uploading file', 'Analyzing document'];
  
  const toolSteps: Record<string, string[]> = {
    'compress-pdf': [...commonSteps, 'Optimizing images', 'Compressing content', 'Finalizing'],
    'merge-pdf': [...commonSteps, 'Merging documents', 'Optimizing structure', 'Finalizing'],
    'split-pdf': [...commonSteps, 'Splitting pages', 'Creating new documents', 'Finalizing'],
    'protect-pdf': [...commonSteps, 'Applying encryption', 'Setting permissions', 'Finalizing'],
    'unlock-pdf': [...commonSteps, 'Verifying password', 'Removing protection', 'Finalizing'],
    'watermark': [...commonSteps, 'Applying watermark', 'Rendering pages', 'Finalizing'],
    'rotate-pdf': [...commonSteps, 'Rotating pages', 'Saving orientation', 'Finalizing'],
    'repair-pdf': [...commonSteps, 'Scanning for issues', 'Repairing structure', 'Recovering data', 'Finalizing'],
    'ocr-pdf': [...commonSteps, 'Recognizing text', 'Building searchable PDF', 'Finalizing'],
    'pdf-to-word': [...commonSteps, 'Extracting content', 'Converting to Word format', 'Finalizing'],
    'pdf-to-jpg': [...commonSteps, 'Rendering pages', 'Converting to images', 'Finalizing'],
    'word-to-pdf': [...commonSteps, 'Processing document', 'Converting to PDF', 'Finalizing'],
    'jpg-to-pdf': [...commonSteps, 'Processing images', 'Creating PDF pages', 'Finalizing'],
    'compare-pdf': [...commonSteps, 'Comparing documents', 'Finding differences', 'Generating report', 'Finalizing'],
  };
  
  return toolSteps[toolId] || [...commonSteps, 'Processing document', 'Finalizing'];
};

// Simulate processing results based on tool
const simulateProcessing = async (
  files: File[],
  toolId: string,
  options: ToolProcessingOptions
): Promise<ProcessedResult> => {
  const file = files[0];
  const originalSizeMB = file.size / 1024 / 1024;
  
  let newSizeMB = originalSizeMB;
  let reduction = '';

  switch (toolId) {
    case 'compress-pdf': {
      const level = options.compressionLevel || 'medium';
      const reductionFactor = { low: 0.85, medium: 0.52, high: 0.35, extreme: 0.25 }[level];
      newSizeMB = originalSizeMB * reductionFactor;
      reduction = `${((1 - reductionFactor) * 100).toFixed(1)}%`;
      break;
    }
    case 'merge-pdf':
      newSizeMB = files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024 * 1.02;
      break;
    case 'repair-pdf':
      return {
        name: `repaired_${file.name}`,
        size: `${originalSizeMB.toFixed(2)} MB`,
        originalSize: `${originalSizeMB.toFixed(2)} MB`,
        recoveryReport: { recovered: 12, total: 15, notes: 'Recovered 12 of 15 pages' },
        extractionAvailable: true,
        downloadUrl: '#',
      };
    case 'compare-pdf':
      return {
        name: 'comparison_report.pdf',
        size: '0.5 MB',
        differences: [
          { page: 1, type: 'text', description: 'Modified paragraph on page 1' },
          { page: 3, type: 'image', description: 'New image added on page 3' },
        ],
        similarityScore: 85,
        downloadUrl: '#',
      };
    default:
      newSizeMB = originalSizeMB * 0.98;
  }

  const outputName = getOutputFileName(file.name, toolId);
  
  return {
    name: outputName,
    size: `${newSizeMB.toFixed(2)} MB`,
    originalSize: `${originalSizeMB.toFixed(2)} MB`,
    reduction,
    downloadUrl: '#',
    previewUrl: '#',
  };
};

// Generate output filename based on tool
const getOutputFileName = (originalName: string, toolId: string): string => {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const extension = originalName.split('.').pop() || 'pdf';
  
  const prefixes: Record<string, string> = {
    'compress-pdf': 'compressed_',
    'merge-pdf': 'merged_',
    'split-pdf': 'split_',
    'protect-pdf': 'protected_',
    'unlock-pdf': 'unlocked_',
    'watermark': 'watermarked_',
    'rotate-pdf': 'rotated_',
    'repair-pdf': 'repaired_',
    'ocr-pdf': 'searchable_',
    'pdf-to-word': '',
    'pdf-to-jpg': '',
  };
  
  const newExtensions: Record<string, string> = {
    'pdf-to-word': 'docx',
    'pdf-to-jpg': 'jpg',
    'word-to-pdf': 'pdf',
    'jpg-to-pdf': 'pdf',
  };
  
  const prefix = prefixes[toolId] || 'processed_';
  const newExt = newExtensions[toolId] || extension;
  
  return `${prefix}${baseName}.${newExt}`;
};

/**
 * Unified hook for processing files with any PDF tool
 * Handles loading state, progress, errors, and results
 */
export const useToolProcessor = () => {
  const [state, setState] = useState<ToolProcessingState>({
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
    setState(prev => ({ ...prev, error: null }));
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
    options: ToolProcessingOptions = {}
  ): Promise<ProcessedResult | null> => {
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
      const steps = getProcessingSteps(toolId);
      
      // Simulate processing steps with progress updates
      for (let i = 0; i < steps.length; i++) {
        updateProgress((i / steps.length) * 100, steps[i]);
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
      }

      // Generate result
      const result = await simulateProcessing(files, toolId, options);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        progress: 100,
        currentStep: 'Complete',
        result,
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      setError(errorMessage);
      return null;
    }
  }, [updateProgress, setError]);

  // Convenience method to check if tool requires multiple files
  const validateFilesForTool = useCallback((files: File[], toolId: string): { valid: boolean; error?: string } => {
    if (files.length === 0) {
      return { valid: false, error: 'Please select at least one file' };
    }

    const multiFileTools = ['merge-pdf', 'compare-pdf'];
    
    if (toolId === 'compare-pdf' && files.length !== 2) {
      return { valid: false, error: 'Compare PDF requires exactly 2 files' };
    }
    
    if (toolId === 'merge-pdf' && files.length < 2) {
      return { valid: false, error: 'Merge PDF requires at least 2 files' };
    }

    return { valid: true };
  }, []);

  return {
    state,
    processFiles,
    validateFilesForTool,
    updateProgress,
    setError,
    clearError,
    reset,
  };
};

export default useToolProcessor;
