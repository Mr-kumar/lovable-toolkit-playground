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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
            setProgress(0);
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ToolIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{toolName}</h2>
              <p className="text-sm text-gray-600">{toolDescription}</p>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Upload Files</h3>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
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

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Selected Files:
                    </h4>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Process Button */}
                <Button
                  onClick={processFiles}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Process Files
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="space-y-3">
                  {getToolFeatures().map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Security & Privacy
                    </h4>
                    <p className="text-sm text-blue-700">
                      Your files are processed securely and automatically
                      deleted after processing. We never store your documents on
                      our servers.
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
                      hidden charges or subscriptions.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
