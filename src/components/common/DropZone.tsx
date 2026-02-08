import React, { useRef } from 'react';
import { Upload, Plus, Shield, Star, Link, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFilesSelected: (files: FileList) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  accept?: string;
  multiple?: boolean;
  isUploading?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
  showCloudOptions?: boolean;
  showRating?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png",
  multiple = true,
  isUploading = false,
  className,
  variant = 'default',
  showCloudOptions = true,
  showRating = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const baseStyles = cn(
    "border-2 border-dashed rounded-2xl text-center transition-all duration-200",
    isDragOver ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-300 hover:border-gray-400",
    className
  );

  if (variant === 'compact') {
    return (
      <div
        className={cn(baseStyles, "p-4 sm:p-6")}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-center sm:text-left">
            <Button
              onClick={handleFileSelect}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Files
            </Button>
            <p className="text-gray-500 text-xs mt-1">or drop files here</p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          aria-label="Upload files"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div
        className={cn(baseStyles, "p-6 sm:p-8 md:p-12 lg:p-16")}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {/* Header with rating - responsive */}
        {showRating && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8">
            <div className="flex items-center justify-center sm:justify-start text-yellow-500 mb-4 sm:mb-0">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current mr-2" />
              <span className="text-xs sm:text-sm font-medium">4.9 (8,604 votes)</span>
            </div>
            <div className="hidden sm:block">
              <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center">
                Download Desktop App
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Icon and Button - Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
          </div>
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Processing files...</p>
            </div>
          ) : (
            <>
              <Button
                onClick={handleFileSelect}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2 sm:hidden" />
                Choose files
              </Button>
              <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-lg">
                or drop files here
              </p>
            </>
          )}
        </div>

        {/* Terms */}
        <p className="text-gray-500 text-xs sm:text-sm px-4 sm:px-0 mb-6">
          By using this function, you accept our{" "}
          <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            terms of service
          </span>
        </p>

        {/* Bottom section - Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          {/* Security */}
          <div className="flex items-center justify-center sm:justify-start text-green-600">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-xs sm:text-sm font-medium">
              File protection is active
            </span>
          </div>

          {/* Cloud Storage Icons */}
          {showCloudOptions && (
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <button 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-blue-600 transition-colors"
                title="Google Drive"
                aria-label="Upload from Google Drive"
              >
                G
              </button>
              <button 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-blue-700 transition-colors"
                title="Dropbox"
                aria-label="Upload from Dropbox"
              >
                D
              </button>
              <button 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white shadow-md hover:bg-gray-600 transition-colors"
                title="URL"
                aria-label="Upload from URL"
              >
                <Link className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        aria-label="Upload files"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default DropZone;
