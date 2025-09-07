import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Settings,
  Info,
  ArrowLeft,
  Star,
  Eye,
  RotateCcw,
  Trash2,
  Mail,
  Share2,
  Scissors,
  Edit,
  Shield,
  FileSearch,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getToolsByCategory } from "@/data/toolsData";

interface ToolInterfaceProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolIcon: React.ComponentType<any>;
  onClose: () => void;
}

export const ToolInterface = ({
  toolId,
  toolName,
  toolDescription,
  toolIcon: ToolIcon,
  onClose,
}: ToolInterfaceProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [compressionSettings, setCompressionSettings] = useState({
    dpi: 144,
    imageQuality: 75,
    colorMode: "no-change"
  });
  const [compressionResult, setCompressionResult] = useState<{
    originalSize: number;
    compressedSize: number;
    reductionPercentage: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles).filter(
        (file) =>
          file.type === "application/pdf" || file.type.startsWith("image/")
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setIsProcessed(true);
            // Simulate compression results
            const originalSize = files.reduce((sum, file) => sum + file.size, 0);
            const compressionRatio = toolId === "compress-pdf" ? 0.35 : 0.8; // 65% reduction for compression
            const compressedSize = originalSize * compressionRatio;
            setCompressionResult({
              originalSize,
              compressedSize,
              reductionPercentage: ((originalSize - compressedSize) / originalSize) * 100
            });
            setProgress(0);
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  const resetInterface = () => {
    setFiles([]);
    setIsProcessed(false);
    setCompressionResult(null);
    setProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getToolFeatures = () => {
    const features = {
      "merge-pdf": [
        "Combine multiple PDFs into one document",
        "Maintain original quality and formatting",
        "Reorder pages as needed",
        "Process up to 20 files at once",
      ],
      "split-pdf": [
        "Split PDFs by page ranges",
        "Extract individual pages",
        "Split by bookmarks or text",
        "Maintain original quality",
      ],
      "compress-pdf": [
        "Reduce file size up to 99%",
        "Maintain visual quality",
        "GDPR compliant processing",
        "Browser-based compression",
      ],
      "pdf-to-word": [
        "High accuracy conversion",
        "Preserve formatting and layout",
        "Convert tables and images",
        "Editable Word documents",
      ],
      "word-to-pdf": [
        "Universal compatibility",
        "Preserve fonts and formatting",
        "Convert DOC and DOCX files",
        "High-quality output",
      ],
    };

    return (
      features[toolId as keyof typeof features] || [
        "Professional quality output",
        "Secure file processing",
        "No file size limits",
        "Instant processing",
      ]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ToolIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {toolName}
              </h2>
              <p className="text-sm text-gray-600">
                {toolDescription}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          {files.length === 0 ? (
            // Initial upload interface
            <div className="p-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  Choose {toolName === "Merge PDF" ? "PDFs" : "PDF"} to {toolName.toLowerCase()}
                </h3>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors max-w-md mx-auto ${
                    isDragOver
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        or drop files here
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    aria-label="Upload files"
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Security & Privacy
                        </h4>
                        <p className="text-sm text-blue-700">
                          Your files are processed securely and automatically
                          deleted after processing.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-start space-x-3">
                      <Star className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">
                          100% Free
                        </h4>
                        <p className="text-sm text-green-700">
                          All our PDF tools are completely free to use with no
                          hidden charges.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-purple-900 mb-1">
                          High Quality
                        </h4>
                        <p className="text-sm text-purple-700">
                          Professional quality output that maintains document
                          integrity.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            // Enhanced interface after file upload - matches screenshot design
            <div className="p-6 space-y-6 bg-gray-50 min-h-full">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What would you like to do?
                </h2>
                
                {/* File status indicator */}
                <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm border mb-6">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">
                    {files.length} file{files.length > 1 ? 's' : ''} uploaded
                  </span>
                  <span className="text-gray-400 ml-1">• PDF Document{files.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* File preview cards */}
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                  {files.map((file, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm relative">
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <div className="w-12 h-16 bg-red-100 rounded flex items-center justify-center">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{file.name}</h4>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        <p className="text-xs text-gray-400">PDF File</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-xs mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload different files link */}
              <div className="text-center mb-8">
                <Button
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Upload different files
                </Button>
              </div>

              {/* Tools available indicator */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
                  <Zap className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    24 tools available for your PDF file
                  </span>
                </div>
              </div>

              {/* Tool categories */}
              {["Organize PDF", "Optimize PDF", "Convert PDF", "Edit PDF", "PDF Security"].map((category) => {
                const categoryTools = getToolsByCategory(category);
                if (categoryTools.length === 0) return null;
                
                return (
                  <div key={category} className="mb-8">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                        {category}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {categoryTools.length} tools available
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      {categoryTools.slice(0, 4).map((tool) => (
                        <Card key={tool.id} className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer group bg-white border border-gray-200">
                          <div className="flex flex-col items-center space-y-3">
                            <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                              category === "Organize PDF" ? "bg-orange-100" :
                              category === "Optimize PDF" ? "bg-blue-100" :
                              category === "Convert PDF" ? "bg-green-100" :
                              category === "Edit PDF" ? "bg-purple-100" :
                              "bg-red-100"
                            }`}>
                              <tool.icon className={`h-6 w-6 ${
                                category === "Organize PDF" ? "text-orange-600" :
                                category === "Optimize PDF" ? "text-blue-600" :
                                category === "Convert PDF" ? "text-green-600" :
                                category === "Edit PDF" ? "text-purple-600" :
                                "text-red-600"
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">{tool.name}</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">{tool.description}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Process button */}
              <div className="text-center pt-6">
                <Button
                  onClick={processFiles}
                  disabled={isProcessing}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `${toolName} Now`
                  )}
                </Button>
              </div>
            </div>
          )}
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
