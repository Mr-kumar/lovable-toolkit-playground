import React, { memo } from "react";
import FileList from "./FileList";
import ToolGrid from "@/components/ToolGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";

interface ToolSelectionProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onSelectTool: (toolId: string) => void;
  onReset: () => void;
  errors: string[];
  clearErrors: () => void;
  onDismissError?: (index: number) => void;
}

const ToolSelection: React.FC<ToolSelectionProps> = ({
  files,
  onRemoveFile,
  onSelectTool,
  onReset,
  errors,
  clearErrors,
  onDismissError = () => {},
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6 lg:gap-8">
        {/* Sidebar with selected files */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Files</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 flex items-center"
                onClick={onReset}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Start Over
              </Button>
            </div>
            <FileList files={files} onRemoveFile={onRemoveFile} />

            {/* Error display */}
            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-labelledby="error-heading">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 id="error-heading" className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-1 text-sm text-red-700">
                      <ul className="list-none space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="flex items-start justify-between">
                            <span className="mr-2">{error}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => onDismissError(index)}
                              className="text-red-600 hover:bg-red-100 p-1 h-auto"
                              aria-label={`Dismiss error: ${error}`}
                            >
                              <X className="h-3 w-3" aria-hidden="true" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {errors.length > 1 && (
                      <div className="mt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={clearErrors}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Dismiss All
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content with tools */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Select a Tool
            </h2>
            <p className="text-gray-600">
              Choose the right tool for your files. We've highlighted the most
              relevant options based on your selection.
            </p>
          </div>

          <ToolGrid files={files} onSelectTool={onSelectTool} />
        </div>
      </div>
    </div>
  );
};

export default memo(ToolSelection);