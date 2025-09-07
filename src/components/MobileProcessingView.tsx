import React from 'react';
import { CheckCircle, Download, Eye, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PDFProcessingState } from '@/hooks/usePDFProcessor';

interface MobileProcessingViewProps {
  state: PDFProcessingState;
  onDownload?: () => void;
  onPreview?: () => void;
  onRestart?: () => void;
  onErase?: () => void;
}

export const MobileProcessingView: React.FC<MobileProcessingViewProps> = ({
  state,
  onDownload,
  onPreview,
  onRestart,
  onErase,
}) => {
  if (state.error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-red-800 text-lg font-semibold mb-2">
            Processing Failed
          </h3>
          <p className="text-red-600 text-sm mb-4">
            {state.error}
          </p>
          <Button
            onClick={onRestart}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (state.isProcessing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-gray-900 text-lg font-semibold mb-2">
            Processing your file...
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {state.currentStep}
          </p>
          <Progress value={state.progress} className="h-3 mb-4 bg-gray-200" />
          <p className="text-gray-600 text-base font-medium">
            {Math.round(state.progress)}% complete
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Please don't close this page while processing
          </p>
        </div>
      </div>
    );
  }

  if (state.result) {
    return (
      <div className="space-y-4">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-green-800 text-lg font-semibold mb-2">
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

        {/* Action Buttons - Mobile Optimized */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-base font-semibold text-gray-900 mb-4 text-center">
            What would you like to do next?
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={onPreview}
              className="bg-green-600 hover:bg-green-700 text-white h-12 text-sm font-medium"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button
              onClick={onErase}
              variant="outline"
              className="h-12 text-sm font-medium border-gray-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Erase
            </Button>
            <Button
              onClick={onRestart}
              variant="outline"
              className="h-12 text-sm font-medium border-gray-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MobileProcessingView;
