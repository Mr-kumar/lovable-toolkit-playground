import React, { useRef } from 'react';
import { Upload, Shield, Star, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileUploadAreaProps {
  onFilesSelected: (files: FileList) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  accept?: string;
  multiple?: boolean;
}

export const MobileUploadArea: React.FC<MobileUploadAreaProps> = ({
  onFilesSelected,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png",
  multiple = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 md:p-16 text-center transition-colors ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {/* Mobile-optimized header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8">
          {/* Rating - Mobile positioned at top center */}
          <div className="flex items-center justify-center sm:justify-start text-yellow-500 mb-4 sm:mb-0">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current mr-2" />
            <span className="text-xs sm:text-sm font-medium">4.9 (8,604 votes)</span>
          </div>

          {/* Download Desktop App - Hidden on small mobile */}
          <div className="hidden sm:block">
            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center">
              Download Desktop App
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Upload Icon and Button - Mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
          </div>
          
          <Button
            onClick={handleFileSelect}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2 sm:hidden" />
            Choose files
          </Button>
          
          <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-lg">
            or drop files here
          </p>
        </div>

        {/* Terms - Mobile optimized */}
        <p className="text-gray-500 text-xs sm:text-sm px-4 sm:px-0">
          By using this function, you accept our{" "}
          <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            terms of service
          </span>
        </p>

        {/* Bottom section - Mobile stacked */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 sm:mt-8 space-y-4 sm:space-y-0">
          {/* Security */}
          <div className="flex items-center justify-center sm:justify-start text-green-600">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-xs sm:text-sm font-medium">
              File protection is active
            </span>
          </div>

          {/* Cloud Storage Icons */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md">
              G
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md">
              D
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md">
              O
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md">
              +
            </div>
          </div>
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

export default MobileUploadArea;
