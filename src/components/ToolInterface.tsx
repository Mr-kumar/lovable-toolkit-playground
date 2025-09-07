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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
        className={`rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden ${
          files.length > 0 ? 'bg-gray-900 text-white' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          files.length > 0 ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ToolIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${files.length > 0 ? 'text-white' : 'text-gray-900'}`}>
                {toolName}
              </h2>
              <p className={`text-sm ${files.length > 0 ? 'text-gray-300' : 'text-gray-600'}`}>
                {toolDescription}
              </p>
              {files.length > 0 && (
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-400" /> Free
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-400" /> Online
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-400" /> No limits
                  </span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`hover:bg-gray-700 ${files.length > 0 ? 'text-white' : ''}`}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          {files.length === 0 ? (
            // Initial upload interface
            <div className="p-6">
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
          ) : (
            // Enhanced interface after file upload
            <div className="p-6 space-y-6">
              {/* File preview and upload area - matches screenshot design */}
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  {files.length === 1 ? (
                    // Single file preview (like screenshot)
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        {/* Search icon in top right */}
                        <div className="absolute -top-2 -right-2 bg-blue-500 p-1 rounded">
                          <FileSearch className="h-4 w-4 text-white" />
                        </div>
                        {/* PDF preview */}
                        <div className="w-40 h-52 bg-gray-700 rounded-lg border border-gray-600 p-2">
                          <div className="w-full h-full bg-white rounded overflow-hidden">
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <div className="text-xs text-gray-600 p-2 leading-tight">
                                {/* Simulated document content */}
                                <div className="space-y-1">
                                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                                  <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Filename */}
                        <p className="text-sm text-gray-300 mt-2">{files[0].name}</p>
                      </div>
                    </div>
                  ) : (
                    // Multiple files preview
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 relative">
                            <div className="w-24 h-32 bg-white rounded flex items-center justify-center mb-2">
                              <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-300 text-center truncate w-24">{file.name}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(index)}
                              className="absolute -top-1 -right-1 h-5 w-5 text-gray-400 hover:text-red-400 bg-gray-800 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Status indicators */}
                  <div className="flex items-center space-x-4 text-gray-400 mt-4">
                    <div className="bg-green-600 p-1 rounded">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-700 p-1 rounded">
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Compression settings for compress tool */}
              {toolId === "compress-pdf" && !isProcessed && (
                <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">DPI</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={compressionSettings.dpi}
                          onChange={(e) => setCompressionSettings(prev => ({
                            ...prev,
                            dpi: parseInt(e.target.value) || 144
                          }))}
                          className="bg-gray-700 border-gray-600 text-white w-20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Image quality</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">/{compressionSettings.imageQuality}</span>
                        <span className="text-gray-400">%</span>
                      </div>
                      <Slider
                        value={[compressionSettings.imageQuality]}
                        onValueChange={(value) => setCompressionSettings(prev => ({
                          ...prev,
                          imageQuality: value[0]
                        }))}
                        max={100}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Color</label>
                      <Select 
                        value={compressionSettings.colorMode}
                        onValueChange={(value) => setCompressionSettings(prev => ({
                          ...prev,
                          colorMode: value
                        }))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-change">No change</SelectItem>
                          <SelectItem value="grayscale">Grayscale</SelectItem>
                          <SelectItem value="color">Color</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* File loaded indicator */}
              {!isProcessing && !isProcessed && (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">File loaded</p>
                  <Button
                    onClick={processFiles}
                    className="px-12 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-full"
                  >
                    {toolId === "compress-pdf" ? "Compress" : "Process"}
                  </Button>
                </div>
              )}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="text-center space-y-4">
                  <div className="text-gray-400">
                    {toolId === "compress-pdf" 
                      ? `DPI: ${compressionSettings.dpi}, Image quality: ${compressionSettings.imageQuality}, Color: ${compressionSettings.colorMode}`
                      : "Processing your files..."
                    }
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-700" />
                </div>
              )}

              {/* Results section */}
              {isProcessed && compressionResult && (
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-green-500">
                    <div className="text-center space-y-4">
                      <div className="text-white">
                        <span className="text-gray-400">PDF24 has processed your job. The size has been reduced by </span>
                        <span className="text-blue-400 font-bold">
                          {compressionResult.reductionPercentage.toFixed(2)}%
                        </span>
                        <span className="text-gray-400">.</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2 text-green-400">
                        <FileText className="h-4 w-4" />
                        <span>{files[0]?.name} - {formatFileSize(compressionResult.compressedSize)}</span>
                      </div>
                      
                      <div className="flex justify-center space-x-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button className="bg-gray-600 hover:bg-gray-700 text-white px-4">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Erase
                        </Button>
                        <Button 
                          onClick={resetInterface}
                          className="bg-red-600 hover:bg-red-700 text-white px-4"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restart
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action toolbar */}
                  <div className="grid grid-cols-8 gap-2">
                    {[
                      { icon: Mail, label: "Email", color: "bg-gray-700" },
                      { icon: Share2, label: "Dropbox", color: "bg-blue-600" },
                      { icon: Share2, label: "Google Drive", color: "bg-green-600" },
                      { icon: FileText, label: "Fax", color: "bg-gray-700" },
                      { icon: FileText, label: "Merge", color: "bg-gray-700" },
                      { icon: Edit, label: "Edit", color: "bg-gray-700" },
                      { icon: Shield, label: "Protect", color: "bg-gray-700" },
                      { icon: Scissors, label: "Split", color: "bg-gray-700" },
                    ].map((action, index) => (
                      <div key={index} className="text-center">
                        <Button
                          className={`${action.color} hover:opacity-80 w-12 h-12 rounded-lg mb-1`}
                          size="icon"
                        >
                          <action.icon className="h-5 w-5" />
                        </Button>
                        <p className="text-xs text-gray-400">{action.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-yellow-400 text-sm">
                    🟡 100% free thanks to advertising
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
