import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  Plus,
  Link,
  FileImage,
  Archive,
  Scissors,
  Merge,
  Lock,
  Unlock,
  RotateCw,
  Wrench,
  PenTool,
  Square,
  GitCompare,
  Hash,
  Crop,
  Search,
  Scan,
  Presentation,
  FileSpreadsheet,
  FileCheck,
  File,
  Image,
  FileType,
  Shield,
  Edit3,
  Settings,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// UI States
type UIState = "upload" | "tool-selection";

// File type detection
type FileType =
  | "pdf"
  | "image"
  | "document"
  | "presentation"
  | "spreadsheet"
  | "mixed";

const getFileType = (file: File): FileType => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "pdf") return "pdf";
  if (
    ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff"].includes(
      extension || ""
    )
  )
    return "image";
  if (["doc", "docx"].includes(extension || "")) return "document";
  if (["ppt", "pptx"].includes(extension || "")) return "presentation";
  if (["xls", "xlsx"].includes(extension || "")) return "spreadsheet";

  return "mixed";
};

const getFilesType = (files: File[]): FileType => {
  if (files.length === 0) return "mixed";

  const types = files.map(getFileType);
  const uniqueTypes = [...new Set(types)];

  if (uniqueTypes.length === 1) return uniqueTypes[0];
  return "mixed";
};

const Index = () => {
  const [uiState, setUiState] = useState<UIState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // File validation constants
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_EXTENSIONS = [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "tiff",
  ];

  // File validation functions
  const validateFile = (file: File): string[] => {
    const errors: string[] = [];

    // Check file extension
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      errors.push(
        `${file.name}: Unsupported file format. Please upload PDF, Word, Excel, PowerPoint, or image files.`
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: File too large. Maximum size is 50MB.`);
    }

    // Check for empty files
    if (file.size === 0) {
      errors.push(`${file.name}: File is empty.`);
    }

    return errors;
  };

  const validateMultipleFiles = (
    fileList: File[]
  ): { validFiles: File[]; errors: string[] } => {
    const allErrors: string[] = [];
    const validFiles: File[] = [];

    fileList.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        allErrors.push(...fileErrors);
      }
    });

    return { validFiles, errors: allErrors };
  };

  const handleFiles = async (list: FileList | null) => {
    if (!list) return;

    setIsUploading(true);
    setErrors([]);

    const fileList = Array.from(list);
    const { validFiles, errors: validationErrors } =
      validateMultipleFiles(fileList);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsUploading(false);
      return;
    }

    if (validFiles.length === 0) {
      setErrors(["No valid files selected."]);
      setIsUploading(false);
      return;
    }

    // Simulate upload delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    setFiles((prev) => [...prev, ...validFiles]);
    setUiState("tool-selection");
    setIsUploading(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // File metadata helper
  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "pdf") return FileText;
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff"].includes(
        extension || ""
      )
    )
      return Image;
    if (["doc", "docx"].includes(extension || "")) return FileText;
    if (["ppt", "pptx"].includes(extension || "")) return Presentation;
    if (["xls", "xlsx"].includes(extension || "")) return FileSpreadsheet;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      setUiState("upload");
    }
  };

  const selectTool = (toolId: string) => {
    // Validate tool-specific requirements
    const toolRequirements = {
      "merge-pdf": {
        minFiles: 2,
        message: "Merge PDF requires at least 2 files",
      },
      "compare-pdf": {
        minFiles: 2,
        message: "Compare PDF requires exactly 2 files",
      },
    };

    const requirement =
      toolRequirements[toolId as keyof typeof toolRequirements];
    if (requirement && files.length < requirement.minFiles) {
      setErrors([requirement.message]);
      return;
    }

    if (toolId === "compare-pdf" && files.length > 2) {
      setErrors([
        "Compare PDF requires exactly 2 files. Please remove extra files.",
      ]);
      return;
    }

    // Store files in sessionStorage to pass to tool page
    const filesData = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    sessionStorage.setItem("uploadedFiles", JSON.stringify(filesData));
    sessionStorage.setItem("fileCount", files.length.toString());
    sessionStorage.setItem(
      "fileTypes",
      JSON.stringify(files.map((f) => getFileType(f)))
    );

    navigate(`/tool/${toolId}?files=${files.length}`);
  };

  const resetUpload = () => {
    setFiles([]);
    setUiState("upload");
  };

  // Comprehensive Tools Configuration
  const allTools = {
    // ORGANIZE PDF
    organize: [
      {
        id: "merge-pdf",
        name: "Merge PDF",
        icon: Merge,
        color: "bg-orange-500",
        description: "Combine multiple PDFs into one",
        compatibleWith: ["pdf"],
        features: [
          "Drag & drop order",
          "Page range selection",
          "Custom page order",
        ],
      },
      {
        id: "split-pdf",
        name: "Split PDF",
        icon: Scissors,
        color: "bg-orange-500",
        description: "Split PDF into separate files",
        compatibleWith: ["pdf"],
        features: ["Split by pages", "Split by size", "Custom page ranges"],
      },
      {
        id: "remove-pages",
        name: "Remove Pages",
        icon: FileText,
        color: "bg-red-500",
        description: "Delete specific pages from PDF",
        compatibleWith: ["pdf"],
        features: [
          "Select pages to remove",
          "Preview before deletion",
          "Bulk page removal",
        ],
      },
      {
        id: "extract-pages",
        name: "Extract Pages",
        icon: FileImage,
        color: "bg-purple-500",
        description: "Extract specific pages as new PDF",
        compatibleWith: ["pdf"],
        features: [
          "Page range selection",
          "Multiple extractions",
          "Preserve quality",
        ],
      },
      {
        id: "organize-pdf",
        name: "Organize PDF",
        icon: Settings,
        color: "bg-orange-500",
        description: "Reorder and reorganize pages",
        compatibleWith: ["pdf"],
        features: ["Drag & drop reorder", "Page rotation", "Batch operations"],
      },
      {
        id: "scan-to-pdf",
        name: "Scan to PDF",
        icon: Scan,
        color: "bg-blue-500",
        description: "Convert scanned documents to PDF",
        compatibleWith: ["image"],
        features: [
          "OCR text recognition",
          "Multiple image formats",
          "Quality optimization",
        ],
      },
    ],

    // OPTIMIZE PDF
    optimize: [
      {
        id: "compress-pdf",
        name: "Compress PDF",
        icon: Archive,
        color: "bg-green-500",
        description: "Reduce PDF file size",
        compatibleWith: ["pdf"],
        features: [
          "Size target setting",
          "Quality control",
          "Batch compression",
        ],
      },
      {
        id: "repair-pdf",
        name: "Repair PDF",
        icon: Wrench,
        color: "bg-green-500",
        description: "Fix corrupted PDF files",
        compatibleWith: ["pdf"],
        features: ["Auto-repair", "Structure validation", "Recovery options"],
      },
      {
        id: "ocr-pdf",
        name: "OCR PDF",
        icon: Search,
        color: "bg-green-500",
        description: "Extract text from scanned PDFs",
        compatibleWith: ["pdf"],
        features: [
          "Multi-language support",
          "Text accuracy control",
          "Searchable PDF",
        ],
      },
    ],

    // CONVERT TO PDF
    convertToPdf: [
      {
        id: "jpg-to-pdf",
        name: "JPG to PDF",
        icon: Image,
        color: "bg-yellow-500",
        description: "Convert images to PDF",
        compatibleWith: ["image"],
        features: ["Multiple images", "Page size options", "Quality settings"],
      },
      {
        id: "word-to-pdf",
        name: "Word to PDF",
        icon: FileText,
        color: "bg-blue-500",
        description: "Convert Word documents to PDF",
        compatibleWith: ["document"],
        features: [
          "Preserve formatting",
          "Font embedding",
          "High quality output",
        ],
      },
      {
        id: "powerpoint-to-pdf",
        name: "PowerPoint to PDF",
        icon: Presentation,
        color: "bg-orange-500",
        description: "Convert presentations to PDF",
        compatibleWith: ["presentation"],
        features: [
          "Slide layout preservation",
          "Notes inclusion",
          "Animation handling",
        ],
      },
      {
        id: "excel-to-pdf",
        name: "Excel to PDF",
        icon: FileSpreadsheet,
        color: "bg-green-500",
        description: "Convert spreadsheets to PDF",
        compatibleWith: ["spreadsheet"],
        features: [
          "Sheet selection",
          "Print area control",
          "Grid line options",
        ],
      },
      {
        id: "html-to-pdf",
        name: "HTML to PDF",
        icon: FileType,
        color: "bg-yellow-500",
        description: "Convert web pages to PDF",
        compatibleWith: ["mixed"],
        features: ["URL input", "Custom styling", "Page size control"],
      },
    ],

    // CONVERT FROM PDF
    convertFromPdf: [
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        icon: Image,
        color: "bg-yellow-500",
        description: "Convert PDF pages to images",
        compatibleWith: ["pdf"],
        features: [
          "Page range selection",
          "Quality control",
          "Batch conversion",
        ],
      },
      {
        id: "pdf-to-word",
        name: "PDF to Word",
        icon: FileText,
        color: "bg-blue-500",
        description: "Convert PDF to Word document",
        compatibleWith: ["pdf"],
        features: [
          "Text extraction",
          "Format preservation",
          "Table recognition",
        ],
      },
      {
        id: "pdf-to-powerpoint",
        name: "PDF to PowerPoint",
        icon: Presentation,
        color: "bg-orange-500",
        description: "Convert PDF to presentation",
        compatibleWith: ["pdf"],
        features: [
          "Slide creation",
          "Layout detection",
          "Content organization",
        ],
      },
      {
        id: "pdf-to-excel",
        name: "PDF to Excel",
        icon: FileSpreadsheet,
        color: "bg-green-500",
        description: "Convert PDF tables to Excel",
        compatibleWith: ["pdf"],
        features: ["Table detection", "Data extraction", "Format preservation"],
      },
      {
        id: "pdf-to-pdfa",
        name: "PDF to PDF/A",
        icon: FileCheck,
        color: "bg-blue-600",
        description: "Convert to archival PDF format",
        compatibleWith: ["pdf"],
        features: [
          "Compliance validation",
          "Long-term preservation",
          "Standards compliance",
        ],
      },
    ],

    // EDIT PDF
    edit: [
      {
        id: "rotate-pdf",
        name: "Rotate PDF",
        icon: RotateCw,
        color: "bg-purple-500",
        description: "Rotate PDF pages",
        compatibleWith: ["pdf"],
        features: ["90° increments", "Page range selection", "Batch rotation"],
      },
      {
        id: "add-page-numbers",
        name: "Add Page Numbers",
        icon: Hash,
        color: "bg-purple-500",
        description: "Add page numbers to PDF",
        compatibleWith: ["pdf"],
        features: [
          "Position control",
          "Format options",
          "Start number setting",
        ],
      },
      {
        id: "add-watermark",
        name: "Add Watermark",
        icon: FileImage,
        color: "bg-blue-500",
        description: "Add text or image watermarks",
        compatibleWith: ["pdf"],
        features: [
          "Text/Image watermarks",
          "Opacity control",
          "Position options",
        ],
      },
      {
        id: "crop-pdf",
        name: "Crop PDF",
        icon: Crop,
        color: "bg-pink-500",
        description: "Crop PDF pages",
        compatibleWith: ["pdf"],
        features: ["Precise margins", "Visual crop tool", "Batch cropping"],
      },
      {
        id: "edit-pdf",
        name: "Edit PDF",
        icon: Edit3,
        color: "bg-green-500",
        description: "Edit text and images in PDF",
        compatibleWith: ["pdf"],
        features: ["Text editing", "Image replacement", "Font management"],
      },
    ],

    // PDF SECURITY
    security: [
      {
        id: "unlock-pdf",
        name: "Unlock PDF",
        icon: Unlock,
        color: "bg-teal-500",
        description: "Remove password protection",
        compatibleWith: ["pdf"],
        features: [
          "Password removal",
          "Permission restoration",
          "Batch unlocking",
        ],
      },
      {
        id: "protect-pdf",
        name: "Protect PDF",
        icon: Lock,
        color: "bg-red-500",
        description: "Add password protection",
        compatibleWith: ["pdf"],
        features: [
          "User/owner passwords",
          "Permission control",
          "Security levels",
        ],
      },
      {
        id: "sign-pdf",
        name: "Sign PDF",
        icon: PenTool,
        color: "bg-blue-500",
        description: "Add digital signatures",
        compatibleWith: ["pdf"],
        features: [
          "Digital signatures",
          "Signature placement",
          "Certificate validation",
        ],
      },
      {
        id: "redact-pdf",
        name: "Redact PDF",
        icon: Square,
        color: "bg-green-500",
        description: "Permanently remove sensitive content",
        compatibleWith: ["pdf"],
        features: ["Text redaction", "Pattern matching", "Secure deletion"],
      },
      {
        id: "compare-pdf",
        name: "Compare PDF",
        icon: GitCompare,
        color: "bg-purple-500",
        description: "Compare two PDF documents",
        compatibleWith: ["pdf"],
        features: [
          "Visual comparison",
          "Change highlighting",
          "Detailed reports",
        ],
      },
    ],
  };

  // Get tools based on file type
  const getAvailableTools = (fileType: FileType) => {
    const tools = [];

    // Always show PDF tools if PDF files are uploaded
    if (fileType === "pdf" || fileType === "mixed") {
      tools.push(...allTools.organize);
      tools.push(...allTools.optimize);
      tools.push(...allTools.convertFromPdf);
      tools.push(...allTools.edit);
      tools.push(...allTools.security);
    }

    // Show conversion tools based on file type
    if (fileType === "image") {
      tools.push(
        ...allTools.convertToPdf.filter((tool) =>
          tool.compatibleWith.includes("image")
        )
      );
    }

    if (fileType === "document") {
      tools.push(
        ...allTools.convertToPdf.filter((tool) =>
          tool.compatibleWith.includes("document")
        )
      );
    }

    if (fileType === "presentation") {
      tools.push(
        ...allTools.convertToPdf.filter((tool) =>
          tool.compatibleWith.includes("presentation")
        )
      );
    }

    if (fileType === "spreadsheet") {
      tools.push(
        ...allTools.convertToPdf.filter((tool) =>
          tool.compatibleWith.includes("spreadsheet")
        )
      );
    }

    // For mixed files, show all conversion tools
    if (fileType === "mixed") {
      tools.push(...allTools.convertToPdf);
    }

    return tools;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* SEO Meta Information */}
        <div className="sr-only">
          <h1>Online PDF Converter - Free PDF Tools</h1>
          <p>
            Convert, merge, split, compress and edit PDF files online for free.
            No registration required.
          </p>
        </div>

        {/* State 1: Upload Interface */}
        {uiState === "upload" && (
          <section className="space-y-16" aria-label="File upload">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
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
              <div className="max-w-4xl mx-auto mb-6">
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
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div
                  className={`border-2 border-dashed rounded-3xl p-12 sm:p-16 text-center transition-all duration-200 ${
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
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Security Notice */}
            <div className="max-w-4xl mx-auto mb-12">
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
            <div className="text-center">
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
                    <Settings className="h-10 w-10 text-blue-600" />
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
        )}

        {/* State 2: Tool Selection */}
        {uiState === "tool-selection" && (
          <section className="space-y-8" aria-label="Tool selection">
            {/* File Preview & Type Detection */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What would you like to do?
              </h2>

              {/* File Type Indicator */}
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md border border-gray-200">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {files.length} file{files.length > 1 ? "s" : ""} uploaded
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {getFilesType(files)}{" "}
                    {getFilesType(files) === "pdf" ? "document" : "file"}
                    {getFilesType(files) === "mixed" ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* File List with Enhanced Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-8">
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file);
                  const fileType = getFileType(file);

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm font-medium text-gray-900 truncate"
                            title={file.name}
                          >
                            {file.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 capitalize">
                            {fileType} file
                          </p>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 text-xs mt-2 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={resetUpload}
                className="text-gray-600 hover:text-gray-800 text-sm underline"
              >
                Upload different files
              </button>
            </div>

            {/* Smart Tool Selection */}
            {(() => {
              const fileType = getFilesType(files);
              const availableTools = getAvailableTools(fileType);

              // Group tools by category with better organization
              const categorizedTools = {
                "ORGANIZE PDF": allTools.organize.filter((tool) =>
                  availableTools.some((available) => available.id === tool.id)
                ),
                "OPTIMIZE PDF": allTools.optimize.filter((tool) =>
                  availableTools.some((available) => available.id === tool.id)
                ),
                "CONVERT TO PDF": allTools.convertToPdf.filter((tool) =>
                  availableTools.some((available) => available.id === tool.id)
                ),
                "CONVERT FROM PDF": allTools.convertFromPdf.filter((tool) =>
                  availableTools.some((available) => available.id === tool.id)
                ),
                "EDIT PDF": allTools.edit.filter((tool) =>
                  availableTools.some((available) => available.id === tool.id)
                ),
                "PDF SECURITY": allTools.security.filter((tool) =>
                  availableTools.some((available) => available.id === tool.id)
                ),
              };

              // Get total tools count
              const totalTools = Object.values(categorizedTools).reduce(
                (sum, tools) => sum + tools.length,
                0
              );

              return (
                <div className="max-w-7xl mx-auto">
                  {/* Tools Summary */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-6 py-3 border border-blue-200">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {totalTools} tools available for your {fileType} file
                        {files.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Tools Grid - More Compact and Organized */}
                  <div className="space-y-12">
                    {Object.entries(categorizedTools).map(
                      ([category, tools]) => {
                        if (tools.length === 0) return null;

                        return (
                          <div key={category} className="space-y-6">
                            <div className="text-center">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {category}
                              </h3>
                              <p className="text-gray-600">
                                {tools.length} tool{tools.length > 1 ? "s" : ""}{" "}
                                available
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                              {tools.map((tool) => {
                                const Icon = tool.icon;
                                return (
                                  <button
                                    key={tool.id}
                                    onClick={() => selectTool(tool.id)}
                                    className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md border border-gray-200 group"
                                  >
                                    <div className="space-y-3">
                                      <div
                                        className={`w-16 h-16 ${tool.color} rounded-xl flex items-center justify-center mx-auto group-hover:scale-105`}
                                      >
                                        <Icon className="h-8 w-8 text-white" />
                                      </div>
                                      <div>
                                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                                          {tool.name}
                                        </h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                          {tool.description}
                                        </p>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Quick Actions for Common Tasks */}
                  {fileType === "pdf" && (
                    <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                          onClick={() => selectTool("compress-pdf")}
                          className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md border border-gray-200"
                        >
                          <Archive className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Compress
                          </span>
                        </button>
                        <button
                          onClick={() => selectTool("merge-pdf")}
                          className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md border border-gray-200"
                        >
                          <Merge className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Merge
                          </span>
                        </button>
                        <button
                          onClick={() => selectTool("split-pdf")}
                          className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md border border-gray-200"
                        >
                          <Scissors className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Split
                          </span>
                        </button>
                        <button
                          onClick={() => selectTool("pdf-to-word")}
                          className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md border border-gray-200"
                        >
                          <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <span className="text-sm font-medium text-gray-900">
                            To Word
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
