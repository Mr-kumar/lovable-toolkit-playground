import React from 'react';
import { CheckCircle, Download, Eye, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ProcessingState {
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
}

interface ProcessingViewProps {
  state: ProcessingState;
  onDownload?: () => void;
  onPreview?: () => void;
  onRestart?: () => void;
  onErase?: () => void;
  className?: string;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  state,
  onDownload,
  onPreview,
  onRestart,
  onErase,
  className,
}) => {
  // Error state
  if (state.error) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-4 sm:p-6", className)}>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
          <h3 className="text-red-800 text-base sm:text-lg font-semibold mb-2">
            Processing Failed
          </h3>
          <p className="text-red-600 text-sm mb-4">
            {state.error}
          </p>
          <Button
            onClick={onRestart}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white h-10 sm:h-12"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Processing state
  if (state.isProcessing) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-4 sm:p-6", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
          <h3 className="text-gray-900 text-base sm:text-lg font-semibold mb-2">
            Processing your file...
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {state.currentStep}
          </p>
          <Progress value={state.progress} className="h-2 sm:h-3 mb-4 bg-gray-200" />
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            {Math.round(state.progress)}% complete
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Please don't close this page while processing
          </p>
        </div>
      </div>
    );
  }

  // Success/Result state
  if (state.result) {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h3 className="text-green-800 text-base sm:text-lg font-semibold mb-2">
              Success!
            </h3>
            <p className="text-green-700 text-sm mb-4">
              Your file has been processed successfully
              {state.result.reduction && (
                <span className="block mt-1">
                  Size reduced by <strong>{state.result.reduction}</strong>
                </span>
              )}
            </p>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-gray-700 font-medium text-sm">
                {state.result.name}
              </p>
              <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span>New: {state.result.size}</span>
                {state.result.originalSize && (
                  <span>Original: {state.result.originalSize}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive grid */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 text-center">
            What would you like to do next?
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-12 text-xs sm:text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              Download
            </Button>
            <Button
              onClick={onPreview}
              className="bg-green-600 hover:bg-green-700 text-white h-10 sm:h-12 text-xs sm:text-sm font-medium"
            >
              <Eye className="h-4 w-4 mr-1 sm:mr-2" />
              Preview
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button
              onClick={onErase}
              variant="outline"
              className="h-10 sm:h-12 text-xs sm:text-sm font-medium border-gray-300"
            >
              <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
              Erase
            </Button>
            <Button
              onClick={onRestart}
              variant="outline"
              className="h-10 sm:h-12 text-xs sm:text-sm font-medium border-gray-300"
            >
              <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
              Restart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProcessingView;
