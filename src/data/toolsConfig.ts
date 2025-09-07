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

// File type detection
export type FileType =
  | "pdf"
  | "image"
  | "document"
  | "presentation"
  | "spreadsheet"
  | "mixed";

export interface Tool {
  id: string;
  name: string;
  icon: any; // LucideIcon type
  color: string;
  description: string;
  compatibleWith: FileType[];
  features: string[];
}

export interface ToolCategory {
  title: string;
  tools: Tool[];
}

// Comprehensive Tools Configuration
export const toolsConfig: Record<string, ToolCategory> = {
  // ORGANIZE PDF
  organize: {
    title: "Organize PDF",
    tools: [
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
  },

  // OPTIMIZE PDF
  optimize: {
    title: "Optimize PDF",
    tools: [
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
  },

  // CONVERT TO PDF
  convertToPdf: {
    title: "Convert to PDF",
    tools: [
      {
        id: "jpg-to-pdf",
        name: "JPG to PDF",
        icon: Image,
        color: "bg-blue-500",
        description: "Convert JPG images to PDF",
        compatibleWith: ["image"],
        features: [
          "Multiple images",
          "Custom page size",
          "Image optimization",
        ],
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
          "Hyperlink preservation",
        ],
      },
      {
        id: "ppt-to-pdf",
        name: "PowerPoint to PDF",
        icon: Presentation,
        color: "bg-blue-500",
        description: "Convert PowerPoint to PDF",
        compatibleWith: ["presentation"],
        features: [
          "Preserve animations",
          "High-quality graphics",
          "Slide notes options",
        ],
      },
      {
        id: "excel-to-pdf",
        name: "Excel to PDF",
        icon: FileSpreadsheet,
        color: "bg-blue-500",
        description: "Convert Excel spreadsheets to PDF",
        compatibleWith: ["spreadsheet"],
        features: [
          "Fit to page options",
          "Sheet selection",
          "Header/footer options",
        ],
      },
    ],
  },

  // CONVERT FROM PDF
  convertFromPdf: {
    title: "Convert from PDF",
    tools: [
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        icon: FileImage,
        color: "bg-indigo-500",
        description: "Convert PDF pages to JPG images",
        compatibleWith: ["pdf"],
        features: [
          "Quality settings",
          "Page range selection",
          "Bulk conversion",
        ],
      },
      {
        id: "pdf-to-word",
        name: "PDF to Word",
        icon: FileText,
        color: "bg-indigo-500",
        description: "Convert PDF to editable Word",
        compatibleWith: ["pdf"],
        features: [
          "Editable text",
          "Layout preservation",
          "Image extraction",
        ],
      },
      {
        id: "pdf-to-ppt",
        name: "PDF to PowerPoint",
        icon: Presentation,
        color: "bg-indigo-500",
        description: "Convert PDF to PowerPoint slides",
        compatibleWith: ["pdf"],
        features: [
          "Slide creation",
          "Image quality control",
          "Editable elements",
        ],
      },
      {
        id: "pdf-to-excel",
        name: "PDF to Excel",
        icon: FileSpreadsheet,
        color: "bg-indigo-500",
        description: "Convert PDF tables to Excel",
        compatibleWith: ["pdf"],
        features: [
          "Table detection",
          "Formula preservation",
          "Multi-sheet support",
        ],
      },
      {
        id: "pdf-to-text",
        name: "PDF to Text",
        icon: FileType,
        color: "bg-indigo-500",
        description: "Extract plain text from PDF",
        compatibleWith: ["pdf"],
        features: [
          "Format preservation",
          "Character encoding",
          "Layout options",
        ],
      },
    ],
  },

  // PROTECT PDF
  protect: {
    title: "Protect PDF",
    tools: [
      {
        id: "encrypt-pdf",
        name: "Encrypt PDF",
        icon: Lock,
        color: "bg-purple-500",
        description: "Password protect your PDF",
        compatibleWith: ["pdf"],
        features: [
          "Strong encryption",
          "Permission controls",
          "Owner & user passwords",
        ],
      },
      {
        id: "unlock-pdf",
        name: "Unlock PDF",
        icon: Unlock,
        color: "bg-purple-500",
        description: "Remove password from PDF",
        compatibleWith: ["pdf"],
        features: [
          "Fast decryption",
          "Batch processing",
          "No quality loss",
        ],
      },
      {
        id: "watermark-pdf",
        name: "Watermark PDF",
        icon: FileCheck,
        color: "bg-purple-500",
        description: "Add text or image watermark",
        compatibleWith: ["pdf"],
        features: [
          "Custom text & images",
          "Opacity control",
          "Position settings",
        ],
      },
      {
        id: "redact-pdf",
        name: "Redact PDF",
        icon: Shield,
        color: "bg-purple-500",
        description: "Permanently remove sensitive info",
        compatibleWith: ["pdf"],
        features: [
          "Text redaction",
          "Image redaction",
          "Pattern matching",
        ],
      },
    ],
  },

  // EDIT PDF
  edit: {
    title: "Edit PDF",
    tools: [
      {
        id: "edit-text",
        name: "Edit Text",
        icon: Edit3,
        color: "bg-yellow-500",
        description: "Edit text content in PDF",
        compatibleWith: ["pdf"],
        features: [
          "In-place editing",
          "Font customization",
          "Text formatting",
        ],
      },
      {
        id: "annotate-pdf",
        name: "Annotate PDF",
        icon: PenTool,
        color: "bg-yellow-500",
        description: "Add comments and annotations",
        compatibleWith: ["pdf"],
        features: [
          "Highlighting",
          "Notes & comments",
          "Drawing tools",
        ],
      },
      {
        id: "rotate-pdf",
        name: "Rotate PDF",
        icon: RotateCw,
        color: "bg-yellow-500",
        description: "Rotate PDF pages",
        compatibleWith: ["pdf"],
        features: [
          "90° increments",
          "Individual page rotation",
          "Save orientation",
        ],
      },
      {
        id: "crop-pdf",
        name: "Crop PDF",
        icon: Crop,
        color: "bg-yellow-500",
        description: "Crop PDF pages",
        compatibleWith: ["pdf"],
        features: [
          "Custom dimensions",
          "Batch cropping",
          "Margin adjustment",
        ],
      },
      {
        id: "add-page-numbers",
        name: "Add Page Numbers",
        icon: Hash,
        color: "bg-yellow-500",
        description: "Add page numbers to PDF",
        compatibleWith: ["pdf"],
        features: [
          "Custom formatting",
          "Position control",
          "Start page options",
        ],
      },
      {
        id: "compare-pdf",
        name: "Compare PDFs",
        icon: GitCompare,
        color: "bg-yellow-500",
        description: "Compare two PDF documents",
        compatibleWith: ["pdf"],
        features: [
          "Side-by-side view",
          "Highlight differences",
          "Text comparison",
        ],
      },
    ],
  },
};