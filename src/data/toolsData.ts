import {
  FileText,
  Scissors,
  Archive,
  FileImage,
  FileSpreadsheet,
  Presentation,
  File,
  Lock,
  Unlock,
  PenTool,
  RotateCw,
  Crop,
  Search,
  Wrench,
  Scan,
  Hash,
  GitCompare,
  Square,
  FileCheck,
  Merge,
  Droplets,
  Plus,
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string[];
  popular?: boolean;
  new?: boolean;
  isWorkflow?: boolean;
}

export const toolsData: Tool[] = [
  // Organize PDF Tools
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF documents into a single file quickly and easily.",
    icon: Merge,
    category: ["All", "Organize PDF", "Workflows"],
    popular: true,
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Break large PDF files into smaller, manageable documents with precision.",
    icon: Scissors,
    category: ["All", "Organize PDF", "Workflows"],
    popular: true,
  },
  {
    id: "organize-pdf",
    name: "Organize PDF",
    description: "Sort pages of your PDF file however you like. Delete or add PDF pages to your document.",
    icon: FileText,
    category: ["All", "Organize PDF", "Workflows"],
  },
  {
    id: "remove-pages",
    name: "Remove Pages",
    description: "Delete specific pages from your PDF documents with ease.",
    icon: FileText,
    category: ["All", "Organize PDF"],
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    description: "Extract specific pages from PDF documents and save them as separate files.",
    icon: FileText,
    category: ["All", "Organize PDF"],
  },
  {
    id: "scan-to-pdf",
    name: "Scan to PDF",
    description: "Capture document scans from your mobile device and convert them to PDF.",
    icon: Scan,
    category: ["All", "Organize PDF"],
  },

  // Optimize PDF Tools
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining excellent quality.",
    icon: Archive,
    category: ["All", "Optimize PDF", "Workflows"],
    popular: true,
  },
  {
    id: "repair-pdf",
    name: "Repair PDF",
    description: "Repair a damaged PDF and recover data from corrupt PDF files.",
    icon: Wrench,
    category: ["All", "Optimize PDF"],
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    description: "Easily convert scanned PDF into searchable and selectable documents.",
    icon: Search,
    category: ["All", "Optimize PDF"],
  },

  // Convert PDF Tools
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Transform PDF documents into editable Word files with high accuracy.",
    icon: FileText,
    category: ["All", "Convert PDF", "Workflows"],
    popular: true,
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Convert PDF presentations into editable PowerPoint slideshows.",
    icon: Presentation,
    category: ["All", "Convert PDF"],
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract data from PDF tables and convert them into Excel spreadsheets.",
    icon: FileSpreadsheet,
    category: ["All", "Convert PDF"],
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    icon: FileImage,
    category: ["All", "Convert PDF"],
  },
  {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Transform your PDF to PDF/A, the ISO-standardized version for long-term archiving.",
    icon: FileCheck,
    category: ["All", "Convert PDF"],
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF format for universal compatibility.",
    icon: FileText,
    category: ["All", "Convert PDF", "Workflows"],
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Transform PowerPoint presentations into PDF files for easy sharing.",
    icon: Presentation,
    category: ["All", "Convert PDF"],
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF format for better distribution.",
    icon: FileSpreadsheet,
    category: ["All", "Convert PDF"],
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: FileImage,
    category: ["All", "Convert PDF", "Workflows"],
    popular: true,
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want.",
    icon: File,
    category: ["All", "Convert PDF"],
  },

  // Edit PDF Tools
  {
    id: "edit-pdf",
    name: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document.",
    icon: PenTool,
    category: ["All", "Edit PDF"],
    popular: true,
    new: true,
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    icon: RotateCw,
    category: ["All", "Edit PDF"],
  },
  {
    id: "page-numbers",
    name: "Add Page Numbers",
    description: "Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.",
    icon: Hash,
    category: ["All", "Edit PDF"],
  },
  {
    id: "watermark",
    name: "Add Watermark",
    description: "Stamp an image or text over your PDF in seconds. Choose typography, transparency and position.",
    icon: Droplets,
    category: ["All", "Edit PDF"],
  },
  {
    id: "crop-pdf",
    name: "Crop PDF",
    description: "Crop margins of PDF documents or select specific areas, then apply changes.",
    icon: Crop,
    category: ["All", "Edit PDF"],
    new: true,
  },

  // PDF Security Tools
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    icon: Lock,
    category: ["All", "PDF Security"],
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    icon: Unlock,
    category: ["All", "PDF Security"],
  },
  {
    id: "sign-pdf",
    name: "Sign PDF",
    description: "Sign yourself or request electronic signatures from others.",
    icon: PenTool,
    category: ["All", "PDF Security"],
  },
  {
    id: "redact-pdf",
    name: "Redact PDF",
    description: "Redact text and graphics to permanently remove sensitive information from a PDF.",
    icon: Square,
    category: ["All", "PDF Security"],
    new: true,
  },
  {
    id: "compare-pdf",
    name: "Compare PDF",
    description: "Show a side-by-side document comparison and easily spot changes between file versions.",
    icon: GitCompare,
    category: ["All", "PDF Security"],
    new: true,
  },
];

// Workflow templates
export const workflowTemplates: Tool[] = [
  {
    id: "create-workflow",
    name: "Create a workflow",
    description: "Create custom workflows with your favorite tools, automate tasks, and reuse them anytime.",
    icon: Plus,
    category: ["Workflows"],
    isWorkflow: true,
  },
];

export const getToolsByCategory = (category: string) => {
  if (category === "All") {
    return toolsData;
  }
  if (category === "Workflows") {
    return [...toolsData.filter(tool => tool.category.includes("Workflows")), ...workflowTemplates];
  }
  return toolsData.filter(tool => tool.category.includes(category));
};