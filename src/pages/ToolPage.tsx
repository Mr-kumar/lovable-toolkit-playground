import { useMemo, useRef, useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  Info,
  Star,
  ArrowLeft,
  Merge as MergeIcon,
  Scissors,
  Archive,
  FileText as DocIcon,
  Presentation,
  FileSpreadsheet,
  File as HtmlIcon,
  Unlock,
  Lock,
  PenTool,
  RotateCw,
  Crop,
  Hash,
  FileImage,
  Wrench,
  GitCompare,
  Square,
  Scan,
  Search,
  FileCheck,
  X,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Shield,
  ExternalLink,
  ChevronDown,
  Settings,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolMeta {
  id: string;
  name: string;
  description: string;
  icon: any;
  heroColor: string;
  features: string[];
}

const TOOLS: Record<string, ToolMeta> = {
  "merge-pdf": {
    id: "merge-pdf",
    name: "Merge PDF",
    description:
      "Combine multiple PDF documents into a single file quickly and easily.",
    icon: MergeIcon,
    heroColor: "bg-violet-600",
    features: [
      "Merge multiple PDFs into a single file",
      "Reorder pages before merging",
      "Keep original quality and formatting",
      "Works on any device, no install",
    ],
  },
  "compress-pdf": {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining excellent quality.",
    icon: Archive,
    heroColor: "bg-red-600",
    features: [
      "Reduce size up to 90%",
      "Fast, browser‑based compression",
      "Keeps visual quality intact",
      "Secure, temporary processing",
    ],
  },
  "split-pdf": {
    id: "split-pdf",
    name: "Split PDF",
    description: "Break large PDF files into smaller, manageable documents.",
    icon: Scissors,
    heroColor: "bg-amber-600",
    features: [
      "Split by ranges or extract pages",
      "Preview and choose pages",
      "No quality loss",
      "Download instantly",
    ],
  },
  "pdf-to-word": {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Transform PDF documents into editable Word files.",
    icon: DocIcon,
    heroColor: "bg-sky-600",
    features: [
      "High‑accuracy conversion",
      "Preserve layout and fonts",
      "Supports images and tables",
      "Editable DOCX output",
    ],
  },
  "word-to-pdf": {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF for universal compatibility.",
    icon: DocIcon,
    heroColor: "bg-slate-800",
    features: [
      "Pixel‑perfect rendering",
      "Keeps fonts and formatting",
      "Works with DOC and DOCX",
      "Share‑ready output",
    ],
  },
  "powerpoint-to-pdf": {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Convert PPT and PPTX slideshows into PDF for easy sharing.",
    icon: Presentation,
    heroColor: "bg-orange-600",
    features: [
      "Accurate slide rendering",
      "Preserves images",
      "No installation needed",
      "Optimized for printing",
    ],
  },
  "excel-to-pdf": {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Turn spreadsheets into polished PDFs that are easy to share.",
    icon: FileSpreadsheet,
    heroColor: "bg-emerald-600",
    features: [
      "Keeps table structure",
      "Auto‑fit to pages",
      "Great for reports",
      "Fast and secure",
    ],
  },
  "pdf-to-jpg": {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Export pages or images from your PDF as JPG files.",
    icon: FileImage,
    heroColor: "bg-yellow-600",
    features: [
      "Extract every page as image",
      "Keep quality high",
      "Batch export",
      "Quick downloads",
    ],
  },
  "jpg-to-pdf": {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG and PNG images into a single PDF.",
    icon: FileImage,
    heroColor: "bg-pink-600",
    features: [
      "Multiple images supported",
      "Reorder before export",
      "Choose page size",
      "Crisp output",
    ],
  },
  "rotate-pdf": {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate pages in your PDF and save the orientation.",
    icon: RotateCw,
    heroColor: "bg-indigo-600",
    features: [
      "Rotate single or all pages",
      "Preview before saving",
      "Lossless output",
      "Fast processing",
    ],
  },
  watermark: {
    id: "watermark",
    name: "Add Watermark",
    description: "Protect documents with text or image watermarks.",
    icon: PenTool,
    heroColor: "bg-teal-600",
    features: [
      "Custom text or image",
      "Position and opacity",
      "Repeat across pages",
      "Brand your PDFs",
    ],
  },
  "html-to-pdf": {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert webpages or HTML into a clean PDF.",
    icon: HtmlIcon,
    heroColor: "bg-cyan-600",
    features: [
      "Paste a URL or HTML",
      "Great for receipts & docs",
      "Layouts preserved",
      "Works on any device",
    ],
  },
  "unlock-pdf": {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove password protection from PDFs you own.",
    icon: Unlock,
    heroColor: "bg-lime-600",
    features: [
      "Quick unlock flow",
      "Keep original file intact",
      "Secure handling",
      "Instant download",
    ],
  },
  "protect-pdf": {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Password‑protect your PDFs to control access.",
    icon: Lock,
    heroColor: "bg-stone-700",
    features: [
      "Strong encryption",
      "Set open password",
      "Simple to remove later",
      "Easy sharing",
    ],
  },
  "organize-pdf": {
    id: "organize-pdf",
    name: "Organize PDF",
    description: "Reorder, delete, or duplicate pages in your PDF.",
    icon: FileText,
    heroColor: "bg-fuchsia-600",
    features: [
      "Drag & drop pages",
      "Delete or duplicate",
      "Combine with merge",
      "Visual page grid",
    ],
  },
  "pdf-to-pdfa": {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Convert to archivable PDF/A format for long‑term storage.",
    icon: FileCheck,
    heroColor: "bg-blue-700",
    features: [
      "ISO‑standard output",
      "Great for records",
      "Keeps text searchable",
      "Consistent rendering",
    ],
  },
  "repair-pdf": {
    id: "repair-pdf",
    name: "Repair PDF",
    description: "Try to recover data from a damaged or corrupted PDF.",
    icon: Wrench,
    heroColor: "bg-rose-600",
    features: [
      "Recover as much as possible",
      "Best‑effort restoration",
      "Safe processing",
      "Download fixed file",
    ],
  },
  "page-numbers": {
    id: "page-numbers",
    name: "Add page numbers",
    description: "Insert page numbers with custom position and style.",
    icon: Hash,
    heroColor: "bg-violet-700",
    features: [
      "Top/bottom placement",
      "Choose start number",
      "Font options",
      "Applies to ranges",
    ],
  },
  "scan-to-pdf": {
    id: "scan-to-pdf",
    name: "Scan to PDF",
    description: "Send scans from your phone directly as PDFs.",
    icon: Scan,
    heroColor: "bg-zinc-700",
    features: [
      "Mobile friendly",
      "Auto crop and enhance",
      "Instant sync",
      "Share with a link",
    ],
  },
  "ocr-pdf": {
    id: "ocr-pdf",
    name: "OCR PDF",
    description: "Make scanned PDFs searchable with OCR.",
    icon: Search,
    heroColor: "bg-sky-700",
    features: [
      "Detects text in images",
      "Keeps layout intact",
      "Great for archives",
      "Boosts searchability",
    ],
  },
  "compare-pdf": {
    id: "compare-pdf",
    name: "Compare PDF",
    description: "Spot differences between two PDF versions side‑by‑side.",
    icon: GitCompare,
    heroColor: "bg-purple-700",
    features: [
      "Visual diff view",
      "Highlight changes",
      "Great for reviews",
      "Export summary",
    ],
  },
  "redact-pdf": {
    id: "redact-pdf",
    name: "Redact PDF",
    description: "Permanently remove sensitive text and graphics.",
    icon: Square,
    heroColor: "bg-neutral-800",
    features: [
      "Manual or pattern redaction",
      "Burn‑in securely",
      "Compliant workflows",
      "Audit‑friendly",
    ],
  },
  "crop-pdf": {
    id: "crop-pdf",
    name: "Crop PDF",
    description: "Trim margins or select an area to keep across pages.",
    icon: Crop,
    heroColor: "bg-amber-700",
    features: [
      "Custom crop box",
      "Apply to ranges",
      "Precise controls",
      "Live preview",
    ],
  },
};

const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png";

// UI States
type UIState = "upload" | "preview" | "processing" | "results";

const ToolPage = () => {
  const { toolId = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meta: ToolMeta | undefined = useMemo(() => TOOLS[toolId], [toolId]);

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uiState, setUiState] = useState<UIState>("upload");
  const [processedFile, setProcessedFile] = useState<{
    name: string;
    size: string;
    reduction?: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Comprehensive tool-specific settings
  const [dpi, setDpi] = useState(144);
  const [imageQuality, setImageQuality] = useState(75);
  const [colorMode, setColorMode] = useState("no-change");
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [targetSize, setTargetSize] = useState("");
  const [password, setPassword] = useState("");
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [watermarkPosition, setWatermarkPosition] = useState("center");
  const [rotationAngle, setRotationAngle] = useState(90);
  const [pageRange, setPageRange] = useState("");
  const [splitMethod, setSplitMethod] = useState("every-page");
  const [mergeOrder, setMergeOrder] = useState("upload-order");
  const [pageNumbersPosition, setPageNumbersPosition] =
    useState("bottom-right");
  const [pageNumbersStart, setPageNumbersStart] = useState(1);
  const [cropMargins, setCropMargins] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [ocrLanguage, setOcrLanguage] = useState("english");
  const [outputFormat, setOutputFormat] = useState("docx");
  const [imageFormat, setImageFormat] = useState("jpg");
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [marginSize, setMarginSize] = useState("normal");
  const [htmlUrl, setHtmlUrl] = useState("");
  const [signatureType, setSignatureType] = useState("text");
  const [signatureText, setSignatureText] = useState("");
  const [redactPattern, setRedactPattern] = useState("");
  const [compareMode, setCompareMode] = useState("side-by-side");

  // Check for files from Index page on component mount
  useEffect(() => {
    const hasFilesParam = searchParams.get("files");
    const uploadedFilesData = sessionStorage.getItem("uploadedFiles");
    const fileCount = sessionStorage.getItem("fileCount");

    if (hasFilesParam && uploadedFilesData && fileCount) {
      try {
        const filesData = JSON.parse(uploadedFilesData);
        // Convert file data back to File objects (simplified for demo)
        const mockFiles = filesData.map((fileData: any) => {
          const file = new File([""], fileData.name, {
            type: fileData.type,
            lastModified: fileData.lastModified,
          });
          // Override the size property
          Object.defineProperty(file, "size", {
            value: fileData.size,
            writable: false,
          });
          return file;
        });

        setFiles(mockFiles);
        setUiState("preview");

        // Clear sessionStorage after use
        sessionStorage.removeItem("uploadedFiles");
        sessionStorage.removeItem("fileCount");
        sessionStorage.removeItem("fileTypes");

        // Clean up URL params
        navigate(`/tool/${toolId}`, { replace: true });
      } catch (error) {
        console.error("Error loading uploaded files:", error);
      }
    }
  }, [searchParams, toolId, navigate]);

  // Get comprehensive tool-specific settings
  const getToolSettings = () => {
    switch (toolId) {
      case "compress-pdf":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Compression Level
                </label>
                <Select
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Best Quality)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Smallest Size)</SelectItem>
                    <SelectItem value="extreme">
                      Extreme (Maximum Compression)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Target Size (KB)
                </label>
                <Input
                  type="number"
                  value={targetSize}
                  onChange={(e) => setTargetSize(e.target.value)}
                  placeholder="e.g., 500"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  DPI
                </label>
                <Select
                  value={dpi.toString()}
                  onValueChange={(value) => setDpi(Number(value))}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="72">72 DPI (Web)</SelectItem>
                    <SelectItem value="144">144 DPI (Standard)</SelectItem>
                    <SelectItem value="300">300 DPI (Print)</SelectItem>
                    <SelectItem value="600">600 DPI (High Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Image Quality
                </label>
                <div className="flex">
                  <Input
                    type="number"
                    min="10"
                    max="100"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(Number(e.target.value))}
                    className="bg-white border-gray-300 text-gray-900 rounded-r-none"
                  />
                  <span className="bg-gray-100 border border-l-0 border-gray-300 text-gray-700 px-3 py-2 rounded-r-md">
                    %
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Color Mode
                </label>
                <Select value={colorMode} onValueChange={setColorMode}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No Change</SelectItem>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                    <SelectItem value="color">Color</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "merge-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Merge Order
              </label>
              <Select value={mergeOrder} onValueChange={setMergeOrder}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload-order">Upload Order</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="file-size">File Size</SelectItem>
                  <SelectItem value="custom">Custom Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> Drag and drop files to reorder them before
                merging.
              </p>
            </div>
          </div>
        );

      case "split-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Split Method
              </label>
              <Select value={splitMethod} onValueChange={setSplitMethod}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="every-page">
                    Every Page (Individual Files)
                  </SelectItem>
                  <SelectItem value="page-ranges">Page Ranges</SelectItem>
                  <SelectItem value="bookmarks">Split by Bookmarks</SelectItem>
                  <SelectItem value="custom-size">Custom File Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {splitMethod === "page-ranges" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Page Ranges
                </label>
                <Input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g., 1-5, 10-15, 20"
                  className="bg-white border-gray-300 text-gray-900"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Separate ranges with commas
                </p>
              </div>
            )}
          </div>
        );

      case "protect-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <strong>Security:</strong> Choose a strong password. You'll need
                it to open the PDF.
              </p>
            </div>
          </div>
        );

      case "unlock-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                PDF Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PDF password"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                <strong>Note:</strong> Only works with PDFs you own. We don't
                store passwords.
              </p>
            </div>
          </div>
        );

      case "watermark":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Watermark Text
              </label>
              <Input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Opacity
                </label>
                <div className="flex">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={watermarkOpacity}
                    onChange={(e) =>
                      setWatermarkOpacity(Number(e.target.value))
                    }
                    className="bg-white border-gray-300 text-gray-900 rounded-r-none"
                  />
                  <span className="bg-gray-100 border border-l-0 border-gray-300 text-gray-700 px-3 py-2 rounded-r-md">
                    %
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Position
                </label>
                <Select
                  value={watermarkPosition}
                  onValueChange={setWatermarkPosition}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "rotate-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Rotation Angle
              </label>
              <Select
                value={rotationAngle.toString()}
                onValueChange={(value) => setRotationAngle(Number(value))}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90° Clockwise</SelectItem>
                  <SelectItem value="180">180° (Upside Down)</SelectItem>
                  <SelectItem value="270">90° Counter-clockwise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Page Range
              </label>
              <Input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="e.g., 1-5 or leave empty for all pages"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
          </div>
        );

      case "page-numbers":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Position
                </label>
                <Select
                  value={pageNumbersPosition}
                  onValueChange={setPageNumbersPosition}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Start Number
                </label>
                <Input
                  type="number"
                  min="1"
                  value={pageNumbersStart}
                  onChange={(e) => setPageNumbersStart(Number(e.target.value))}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </div>
        );

      case "crop-pdf":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Top Margin
                </label>
                <Input
                  type="number"
                  min="0"
                  value={cropMargins.top}
                  onChange={(e) =>
                    setCropMargins((prev) => ({
                      ...prev,
                      top: Number(e.target.value),
                    }))
                  }
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Right Margin
                </label>
                <Input
                  type="number"
                  min="0"
                  value={cropMargins.right}
                  onChange={(e) =>
                    setCropMargins((prev) => ({
                      ...prev,
                      right: Number(e.target.value),
                    }))
                  }
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Bottom Margin
                </label>
                <Input
                  type="number"
                  min="0"
                  value={cropMargins.bottom}
                  onChange={(e) =>
                    setCropMargins((prev) => ({
                      ...prev,
                      bottom: Number(e.target.value),
                    }))
                  }
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Left Margin
                </label>
                <Input
                  type="number"
                  min="0"
                  value={cropMargins.left}
                  onChange={(e) =>
                    setCropMargins((prev) => ({
                      ...prev,
                      left: Number(e.target.value),
                    }))
                  }
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> Values are in points (1 inch = 72 points)
              </p>
            </div>
          </div>
        );

      case "ocr-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                OCR Language
              </label>
              <Select value={ocrLanguage} onValueChange={setOcrLanguage}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                <strong>OCR:</strong> Makes scanned PDFs searchable and
                selectable.
              </p>
            </div>
          </div>
        );

      case "pdf-to-word":
      case "pdf-to-powerpoint":
      case "pdf-to-excel":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Output Format
              </label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">DOCX (Word 2007+)</SelectItem>
                  <SelectItem value="doc">DOC (Word 97-2003)</SelectItem>
                  <SelectItem value="rtf">RTF (Rich Text)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Quality:</strong> Complex layouts may require manual
                adjustment.
              </p>
            </div>
          </div>
        );

      case "pdf-to-jpg":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Image Format
                </label>
                <Select value={imageFormat} onValueChange={setImageFormat}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="tiff">TIFF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Quality
                </label>
                <div className="flex">
                  <Input
                    type="number"
                    min="10"
                    max="100"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(Number(e.target.value))}
                    className="bg-white border-gray-300 text-gray-900 rounded-r-none"
                  />
                  <span className="bg-gray-100 border border-l-0 border-gray-300 text-gray-700 px-3 py-2 rounded-r-md">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "jpg-to-pdf":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Page Size
                </label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Orientation
                </label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Margins
                </label>
                <Select value={marginSize} onValueChange={setMarginSize}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Margins</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "html-to-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Website URL
              </label>
              <Input
                type="url"
                value={htmlUrl}
                onChange={(e) => setHtmlUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Some websites may block PDF conversion.
              </p>
            </div>
          </div>
        );

      case "sign-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Signature Type
              </label>
              <Select value={signatureType} onValueChange={setSignatureType}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Signature</SelectItem>
                  <SelectItem value="draw">Draw Signature</SelectItem>
                  <SelectItem value="upload">Upload Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {signatureType === "text" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Signature Text
                </label>
                <Input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="Your name"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            )}
          </div>
        );

      case "redact-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Redaction Pattern
              </label>
              <Input
                type="text"
                value={redactPattern}
                onChange={(e) => setRedactPattern(e.target.value)}
                placeholder="e.g., email addresses, phone numbers"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">
                <strong>Warning:</strong> Redaction is permanent and cannot be
                undone.
              </p>
            </div>
          </div>
        );

      case "compare-pdf":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Compare Mode
              </label>
              <Select value={compareMode} onValueChange={setCompareMode}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="side-by-side">Side by Side</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="highlight">
                    Highlight Differences
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Upload two PDF files to compare them.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <Settings className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">
              No additional settings required for this tool.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Click the process button to continue.
            </p>
          </div>
        );
    }
  };

  // Get tool-specific action button text
  const getActionButtonText = () => {
    switch (toolId) {
      case "compress-pdf":
        return "Compress";
      case "merge-pdf":
        return "Merge";
      case "split-pdf":
        return "Split";
      case "protect-pdf":
        return "Protect";
      case "unlock-pdf":
        return "Unlock";
      case "watermark":
        return "Add Watermark";
      case "rotate-pdf":
        return "Rotate";
      case "pdf-to-word":
        return "Convert to Word";
      case "word-to-pdf":
        return "Convert to PDF";
      default:
        return "Process";
    }
  };

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const newFiles = Array.from(list);
    setFiles((prev) => [...prev, ...newFiles]);
    setUiState("preview");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      setUiState("upload");
    }
  };

  const startProcessing = () => {
    if (files.length === 0) return;
    setUiState("processing");
    setIsProcessing(true);
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(() => {
            setIsProcessing(false);
            setProgress(0);
            // Simulate processed file
            const originalSize = files[0].size / 1024 / 1024;
            const newSize = originalSize * 0.48; // 52% reduction
            setProcessedFile({
              name: files[0].name,
              size: `${newSize.toFixed(2)} MB`,
              reduction: "52.23%",
            });
            setUiState("results");
          }, 800);
          return 100;
        }
        return p + Math.random() * 18;
      });
    }, 180);
  };

  const resetTool = () => {
    setFiles([]);
    setUiState("upload");
    setProcessedFile(null);
    setProgress(0);
    setIsProcessing(false);
  };

  // Handle invalid tool redirect
  useEffect(() => {
    if (!meta) {
      navigate("/", { replace: true });
    }
  }, [meta, navigate]);

  if (!meta) {
    return null;
  }

  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* SEO Meta Information */}
        <div className="sr-only">
          <h1>{meta.name} - Free Online PDF Tool</h1>
          <p>{meta.description}</p>
          <p>
            Process PDF files online for free. No registration required. Secure
            and fast.
          </p>
        </div>
        <button
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>

        {/* Tool Title */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            {meta.name}
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            {meta.description}
          </p>

          {/* Features */}
          <div
            className="flex justify-center space-x-8 mt-6"
            role="list"
            aria-label="Tool features"
          >
            <div className="flex items-center text-green-600" role="listitem">
              <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-sm font-medium">Free</span>
            </div>
            <div className="flex items-center text-green-600" role="listitem">
              <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-sm font-medium">Online</span>
            </div>
            <div className="flex items-center text-green-600" role="listitem">
              <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-sm font-medium">No limits</span>
            </div>
          </div>
        </header>

        {/* State 1: Upload Interface */}
        {uiState === "upload" && (
          <section className="space-y-8" aria-label="File upload">
            {/* Main Upload Area */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div
                className={`border-2 border-dashed rounded-2xl p-16 text-center ${
                  isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDrop={onDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
              >
                {/* Rating */}
                <div className="absolute top-6 left-6 flex items-center text-yellow-500">
                  <Star className="h-5 w-5 fill-current mr-2" />
                  <span className="text-sm font-medium">4.9 (8,604 votes)</span>
                </div>

                {/* Download Desktop App */}
                <div className="absolute top-6 right-6">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    Download Desktop App
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </button>
                </div>

                {/* Upload Icon and Button */}
                <div className="mt-12 mb-8">
                  <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Upload className="h-10 w-10 text-blue-600" />
                  </div>
                  <Button
                    onClick={() => inputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg"
                  >
                    Choose files
                  </Button>
                  <p className="text-gray-500 mt-4 text-lg">
                    or drop files here
                  </p>
                </div>

                {/* Terms */}
                <p className="text-gray-500 text-sm mt-8">
                  By using this function, you accept our{" "}
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                    terms of service
                  </span>
                </p>

                {/* Security & Cloud Storage */}
                <div className="absolute bottom-6 left-6 flex items-center text-green-600">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">
                    File protection is active
                  </span>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    G
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    D
                  </div>
                  <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    O
                  </div>
                  <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    +
                  </div>
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPT}
                aria-label="Upload files"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Free thanks to advertising */}
            <div className="text-center text-gray-500 text-sm">
              🙂 100% free thanks to advertising
            </div>
          </section>
        )}

        {/* State 2: File Preview with Settings */}
        {uiState === "preview" && (
          <section className="space-y-8" aria-label="File preview and settings">
            {/* File Preview Area */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
                {/* File Preview */}
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-gray-50 rounded-xl p-6 max-w-sm border border-gray-200">
                    <div className="bg-white rounded-lg h-40 w-64 flex items-center justify-center mb-4 shadow-sm border border-gray-200">
                      <FileText className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-gray-700 text-center font-medium">
                      {files[0]?.name}
                    </p>
                    <p className="text-gray-500 text-sm text-center mt-1">
                      {(files[0]?.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>

                {/* File Actions */}
                <div className="flex justify-center space-x-6 mb-8">
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                    title="Preview file"
                    aria-label="Preview file"
                  >
                    <Eye className="h-5 w-5" />
                    <span className="text-sm font-medium">Preview</span>
                  </button>
                  <button
                    onClick={() => removeFile(0)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                    title="Remove file"
                    aria-label="Remove file"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Remove</span>
                  </button>
                </div>

                {/* Security & Cloud Storage */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-green-600">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">
                      File protection is active
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      G
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      D
                    </div>
                    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      +
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Settings
              </h3>
              {getToolSettings()}
            </div>

            {/* Process Button */}
            <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <p className="text-gray-600 mb-6 text-lg">
                File loaded and ready to process
              </p>
              <Button
                onClick={startProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                {getActionButtonText()}
              </Button>
              {toolId === "compress-pdf" && (
                <p className="text-gray-500 text-sm mt-4">
                  Compression Level: {compressionLevel}, DPI: {dpi}, Image
                  quality: {imageQuality}%, Color:{" "}
                  {colorMode === "no-change" ? "No change" : colorMode}
                </p>
              )}
            </div>
          </section>
        )}

        {/* State 3: Processing */}
        {uiState === "processing" && (
          <section
            className="text-center space-y-8"
            aria-label="File processing"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <h3 className="text-gray-900 text-2xl font-semibold mb-4">
                Processing your file...
              </h3>
              <Progress value={progress} className="h-3 mb-4 bg-gray-200" />
              <p className="text-gray-600 text-lg">
                {Math.round(progress)}% complete
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Please don't close this page while processing
              </p>
            </div>
          </section>
        )}

        {/* State 4: Results */}
        {uiState === "results" && (
          <section className="space-y-8" aria-label="Processing results">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-green-800 text-xl font-semibold mb-4">
                  {toolId === "compress-pdf" && (
                    <>
                      Success! Your PDF has been compressed. Size reduced by{" "}
                      <span className="text-blue-600 font-bold">
                        {processedFile?.reduction}
                      </span>
                    </>
                  )}
                  {toolId === "merge-pdf" && (
                    <>
                      Your PDFs have been successfully merged into one document.
                    </>
                  )}
                  {toolId === "split-pdf" && (
                    <>
                      Your PDF has been successfully split into separate files.
                    </>
                  )}
                  {toolId === "protect-pdf" && (
                    <>
                      Your PDF has been successfully protected with a password.
                    </>
                  )}
                  {toolId === "unlock-pdf" && (
                    <>Your PDF has been successfully unlocked.</>
                  )}
                  {toolId === "watermark" && (
                    <>Watermark has been successfully added to your PDF.</>
                  )}
                  {toolId === "rotate-pdf" && (
                    <>Your PDF pages have been successfully rotated.</>
                  )}
                  {toolId === "pdf-to-word" && (
                    <>
                      Your PDF has been successfully converted to Word format.
                    </>
                  )}
                  {toolId === "word-to-pdf" && (
                    <>
                      Your Word document has been successfully converted to PDF.
                    </>
                  )}
                  {![
                    "compress-pdf",
                    "merge-pdf",
                    "split-pdf",
                    "protect-pdf",
                    "unlock-pdf",
                    "watermark",
                    "rotate-pdf",
                    "pdf-to-word",
                    "word-to-pdf",
                  ].includes(toolId) && (
                    <>Your file has been successfully processed.</>
                  )}
                </h3>
                <div className="flex items-center justify-center mt-4">
                  <PenTool className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">
                    {processedFile?.name} - {processedFile?.size}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                What would you like to do next?
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold shadow-lg">
                  <Eye className="h-5 w-5 mr-2" />
                  Preview
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Erase
                </Button>
                <Button
                  onClick={resetTool}
                  className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold shadow-lg"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Restart
                </Button>
              </div>
            </div>

            {/* Additional Tools */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                More PDF Tools
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: "📧", name: "Email", color: "purple" },
                  { icon: "📦", name: "Dropbox", color: "blue" },
                  { icon: "☁️", name: "Google Drive", color: "blue" },
                  { icon: "📠", name: "Fax", color: "red" },
                  { icon: "🔗", name: "Merge", color: "blue" },
                  { icon: "✏️", name: "Edit", color: "yellow" },
                  { icon: "🔒", name: "Protect", color: "red" },
                  { icon: "✂️", name: "Split", color: "pink" },
                  { icon: "📊", name: "Metadata", color: "gray" },
                ].map((tool, index) => (
                  <button
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center border border-gray-200"
                  >
                    <div className="text-3xl mb-2">{tool.icon}</div>
                    <div className="text-gray-700 text-sm font-medium">
                      {tool.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Free thanks to advertising */}
            <div className="text-center text-gray-500 text-sm">
              🙂 100% free thanks to advertising
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ToolPage;
