import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Shield,
  PenTool,
  RotateCw,
  Crop,
  Eye,
  EyeOff,
  Search,
  Wrench,
  Scan,
  Hash,
  GitCompare,
  Square,
  FileCheck,
  Merge,
  Split,
  Minimize2,
  Droplets,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const tools = [
  // Row 1 - Core PDF Tools
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description:
      "Combine multiple PDF documents into a single file quickly and easily.",
    icon: Merge,
    category: "All",
    popular: false,
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description:
      "Break large PDF files into smaller, manageable documents with precision.",
    icon: Scissors,
    category: "All",
    popular: false,
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining excellent quality.",
    icon: Archive,
    category: "All",
    popular: false,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description:
      "Transform PDF documents into editable Word files with high accuracy.",
    icon: FileText,
    category: "All",
    popular: false,
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description:
      "Convert PDF presentations into editable PowerPoint slideshows.",
    icon: Presentation,
    category: "All",
    popular: false,
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description:
      "Extract data from PDF tables and convert them into Excel spreadsheets.",
    icon: FileSpreadsheet,
    category: "All",
    popular: false,
  },

  // Row 2 - Convert to PDF
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description:
      "Convert Word documents to PDF format for universal compatibility.",
    icon: FileText,
    category: "All",
    popular: false,
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description:
      "Transform PowerPoint presentations into PDF files for easy sharing.",
    icon: Presentation,
    category: "All",
    popular: false,
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description:
      "Convert Excel spreadsheets to PDF format for better distribution.",
    icon: FileSpreadsheet,
    category: "All",
    popular: false,
  },
  {
    id: "edit-pdf",
    name: "Edit PDF",
    description:
      "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
    icon: PenTool,
    category: "All",
    popular: true,
    new: true,
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description:
      "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    icon: FileImage,
    category: "All",
    popular: false,
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description:
      "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: FileImage,
    category: "All",
    popular: false,
  },

  // Row 3 - Security & Signing
  {
    id: "sign-pdf",
    name: "Sign PDF",
    description: "Sign yourself or request electronic signatures from others.",
    icon: PenTool,
    category: "All",
    popular: false,
  },
  {
    id: "watermark-pdf",
    name: "Watermark",
    description:
      "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
    icon: Droplets,
    category: "All",
    popular: false,
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description:
      "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    icon: RotateCw,
    category: "All",
    popular: false,
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description:
      "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.",
    icon: File,
    category: "All",
    popular: false,
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description:
      "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    icon: Unlock,
    category: "All",
    popular: false,
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description:
      "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    icon: Lock,
    category: "All",
    popular: false,
  },

  // Row 4 - Organization & Optimization
  {
    id: "organize-pdf",
    name: "Organize PDF",
    description:
      "Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.",
    icon: FileText,
    category: "All",
    popular: false,
  },
  {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description:
      "Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting when accessed in the future.",
    icon: FileCheck,
    category: "All",
    popular: false,
  },
  {
    id: "repair-pdf",
    name: "Repair PDF",
    description:
      "Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.",
    icon: Wrench,
    category: "All",
    popular: false,
  },
  {
    id: "page-numbers",
    name: "Page numbers",
    description:
      "Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.",
    icon: Hash,
    category: "All",
    popular: false,
  },
  {
    id: "scan-to-pdf",
    name: "Scan to PDF",
    description:
      "Capture document scans from your mobile device and send them instantly to your browser.",
    icon: Scan,
    category: "All",
    popular: false,
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    description:
      "Easily convert scanned PDF into searchable and selectable documents.",
    icon: Search,
    category: "All",
    popular: false,
  },

  // Row 5 - Advanced Tools
  {
    id: "compare-pdf",
    name: "Compare PDF",
    description:
      "Show a side-by-side document comparison and easily spot changes between different file versions.",
    icon: GitCompare,
    category: "All",
    popular: false,
    new: true,
  },
  {
    id: "redact-pdf",
    name: "Redact PDF",
    description:
      "Redact text and graphics to permanently remove sensitive information from a PDF.",
    icon: Square,
    category: "All",
    popular: false,
    new: true,
  },
  {
    id: "crop-pdf",
    name: "Crop PDF",
    description:
      "Crop margins of PDF documents or select specific areas, then apply the changes to one page or the whole document.",
    icon: Crop,
    category: "All",
    popular: false,
    new: true,
  },
];

interface ToolGalleryProps {
  selectedCategory: string;
}

export const ToolGallery = ({ selectedCategory }: ToolGalleryProps) => {
  const [processingTool, setProcessingTool] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  const handleToolClick = (tool: any) => {
    navigate(`/${tool.id}`);
  };

  return (
    <section id="tools" className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tools Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="relative overflow-hidden h-full border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
                  {(tool.popular || tool.new) && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                      <Badge
                        className={`text-xs px-2 py-1 ${
                          tool.new
                            ? "bg-orange-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {tool.new ? "New!" : "Popular"}
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-col h-full p-4 sm:p-6">
                    <div className="flex-1">
                      <div className="mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 bg-gray-100 rounded-lg w-fit group-hover:bg-gray-200 transition-colors">
                          <tool.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {processingTool === tool.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Processing...</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </motion.div>
                      )}

                      <Button
                        className="w-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 text-xs sm:text-sm py-2"
                        onClick={() => handleToolClick(tool)}
                      >
                        Try Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Create Workflow Card */}
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: filteredTools.length * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ y: -4 }}
              className="group sm:col-span-2 lg:col-span-1"
            >
              <Card className="relative overflow-hidden h-full border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 transition-all duration-300">
                <div className="flex flex-col h-full p-4 sm:p-6 items-center justify-center text-center">
                  <div className="mb-3 sm:mb-4">
                    <div className="p-3 sm:p-4 bg-orange-200 rounded-full w-fit mx-auto">
                      <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                    Create a workflow
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                    Create custom workflows with your favorite tools, automate
                    tasks, and reuse them anytime.
                  </p>

                  <Button className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 text-xs sm:text-sm py-2">
                    Create workflow
                    <Plus className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full page now handles interfaces via routes */}
    </section>
  );
};
