import { useRef } from "react";
import { Upload, Plus, Link, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileHandler } from "@/hooks/useFileHandler";

interface UploadSectionProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  errors: string[];
  clearErrors: () => void;
}

const UploadSection = ({
  onFilesSelected,
  isUploading,
  errors,
  clearErrors,
}: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    isDragOver, 
    onDrop: handleDrop, 
    onDragOver, 
    onDragLeave,
    handleFiles
  } = useFileHandler();
  
  // Custom onDrop handler that calls the parent's onFilesSelected
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const validFiles = await handleDrop(e);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };
  
  // Custom handleFileInput that calls the parent's onFilesSelected
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = await handleFiles(e.target.files);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };
  
  return (
    <section className="space-y-16" aria-label="File upload">
      {/* Hero Section */}
      <div className="text-center container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Online PDF Converter
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Convert, merge, split, compress and edit PDF files online for
          free
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            PDF to Word
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Merge PDFs
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Compress PDF
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Split PDF
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            And 25+ more tools
          </span>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="max-w-4xl mx-auto mb-6 container px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Upload Errors
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <button
                    onClick={clearErrors}
                    className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="max-w-4xl mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-16 text-center transition-all duration-200 ${
              isDragOver
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            aria-label="File upload area. Drag and drop files here or use the button below to select files."
          >
            {/* Upload Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-10 w-10 text-red-600" />
              </div>
            </div>

            {/* Upload Button */}
            <div className="mb-8">
              {isUploading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">
                    Processing files...
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    disabled={isUploading}
                    aria-label="Choose files to upload"
                  >
                    <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                    Choose Files
                  </Button>
                  <p className="text-sm text-gray-500 mt-3">
                    or drag and drop files here
                  </p>
                </>
              )}
            </div>

            {/* Supported Formats */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">
                Supported formats:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  PDF
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  DOC, DOCX
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  PPT, PPTX
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  XLS, XLSX
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  JPG, PNG
                </span>
              </div>
            </div>

            {/* Cloud Storage Options */}
            <div className="flex justify-center space-x-6">
              <button
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50"
                title="Upload from Google Drive"
                aria-label="Upload from Google Drive"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">G</span>
                </div>
                <span className="text-xs text-gray-600">
                  Google Drive
                </span>
              </button>
              <button
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50"
                title="Upload from Dropbox"
                aria-label="Upload from Dropbox"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">D</span>
                </div>
                <span className="text-xs text-gray-600">Dropbox</span>
              </button>
              <button
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50"
                title="Upload from URL"
                aria-label="Upload from URL"
              >
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Link className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">URL</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
              aria-label="Upload files"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>
      </div>

      {/* Privacy & Security Notice */}
      <div className="max-w-4xl mx-auto mb-12 container px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Your files are secure and private
              </h3>
              <p className="text-sm text-blue-800">
                All files are processed securely and automatically deleted
                after processing. We don't store your files permanently or
                share them with third parties. Your privacy is our
                priority.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Convert Section */}
      <div className="text-center container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              1. Upload Files
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Upload your PDF, Word, Excel, PowerPoint, or image files.
              Our system automatically detects the file type.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2. Choose Tool
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Select from 29+ PDF tools. We show only the tools that work
              with your uploaded files.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              3. Download Results
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get your processed files instantly. No registration
              required, completely free to use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;