import { useMemo, useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

const ToolPage = () => {
  const { toolId = "" } = useParams();
  const navigate = useNavigate();
  const meta: ToolMeta | undefined = useMemo(() => TOOLS[toolId], [toolId]);

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const newFiles = Array.from(list);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const startProcessing = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(() => {
            setIsProcessing(false);
            setProgress(0);
          }, 800);
          return 100;
        }
        return p + Math.random() * 18;
      });
    }, 180);
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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <button
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>

        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
          {meta.name}
        </h1>

        {/* Hero Upload Section */}
        <section className="mt-6">
          <div
            className={`${meta.heroColor} rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center text-white`}
          >
            <div className="flex justify-center">
              <div className="bg-white/10 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-5 sm:px-6 py-3 text-gray-900 font-medium hover:bg-gray-50"
                >
                  CHOOSE FILES
                </button>
              </div>
            </div>
            <p className="mt-3 text-white/90 text-sm">or drop files here</p>

            <div
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              className={`mt-6 sm:mt-8 border-2 border-dashed rounded-xl sm:rounded-2xl bg-white/5 ${
                isDragOver ? "border-white" : "border-white/40"
              }`}
            >
              <div className="h-24 sm:h-40" />
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
        </section>

        {/* Description + bullets */}
        <section className="mt-6 grid sm:grid-cols-2 gap-6">
          <p className="text-gray-700 leading-relaxed">
            {meta.description} The tool is free to use and works directly in
            your browser.
          </p>
          <ul className="space-y-3">
            {meta.features.map((f, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <span className="text-gray-700">{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Selected files + action */}
        {files.length > 0 && (
          <section className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-3">Selected files</h3>
            <div className="space-y-2">
              {files.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-800 truncate max-w-[60vw] sm:max-w-none">
                      {f.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {(f.size / 1024 / 1024).toFixed(1)} MB
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full sm:w-auto mt-4 bg-red-500 hover:bg-red-600 text-white"
              onClick={startProcessing}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Start"}
            </Button>

            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Working...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </section>
        )}

        {/* Info cards */}
        <section className="mt-10 grid md:grid-cols-3 gap-6">
          <Card className="p-5">
            <h4 className="font-semibold text-gray-900 mb-1">Simple & Fast</h4>
            <p className="text-sm text-gray-700">
              Upload your files and let PDFFlow do the rest. No installation. No
              watermarks.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-gray-900 mb-1">
              Secure by Default
            </h4>
            <p className="text-sm text-gray-700">
              Files are processed securely and removed automatically after
              processing.
            </p>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-gray-900 mb-1">Works Anywhere</h4>
            <p className="text-sm text-gray-700">
              Fully browser‑based. Works on macOS, Windows, Linux, iOS and
              Android.
            </p>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ToolPage;
