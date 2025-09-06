import { motion } from "framer-motion";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PDFToolsDropdownProps {
  activeDropdown: string;
  onToolClick?: () => void;
}

const pdfTools = {
  organize: [
    {
      id: "merge-pdf",
      name: "Merge PDF",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      id: "split-pdf",
      name: "Split PDF",
      icon: Scissors,
      color: "text-green-500",
    },
    { id: "remove-pages", name: "Remove pages", icon: FileText, color: "text-red-500" },
    { id: "extract-pages", name: "Extract pages", icon: FileText, color: "text-purple-500" },
    {
      id: "organize-pdf",
      name: "Organize PDF",
      icon: FileText,
      color: "text-orange-500",
    },
    {
      id: "scan-to-pdf",
      name: "Scan to PDF",
      icon: Scan,
      color: "text-indigo-500",
    },
  ],
  optimize: [
    {
      id: "compress-pdf",
      name: "Compress PDF",
      icon: Archive,
      color: "text-green-500",
    },
    {
      id: "repair-pdf",
      name: "Repair PDF",
      icon: Wrench,
      color: "text-green-500",
    },
    { id: "ocr-pdf", name: "OCR PDF", icon: Search, color: "text-green-500" },
  ],
  "convert-to": [
    {
      id: "jpg-to-pdf",
      name: "JPG to PDF",
      icon: FileImage,
      color: "text-yellow-500",
    },
    {
      id: "word-to-pdf",
      name: "WORD to PDF",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      id: "powerpoint-to-pdf",
      name: "POWERPOINT to PDF",
      icon: Presentation,
      color: "text-orange-500",
    },
    {
      id: "excel-to-pdf",
      name: "EXCEL to PDF",
      icon: FileSpreadsheet,
      color: "text-green-500",
    },
    {
      id: "html-to-pdf",
      name: "HTML to PDF",
      icon: File,
      color: "text-yellow-500",
    },
  ],
  "convert-from": [
    {
      id: "pdf-to-jpg",
      name: "PDF to JPG",
      icon: FileImage,
      color: "text-yellow-500",
    },
    {
      id: "pdf-to-word",
      name: "PDF to WORD",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      id: "pdf-to-powerpoint",
      name: "PDF to POWERPOINT",
      icon: Presentation,
      color: "text-orange-500",
    },
    {
      id: "pdf-to-excel",
      name: "PDF to EXCEL",
      icon: FileSpreadsheet,
      color: "text-green-500",
    },
    {
      id: "pdf-to-pdfa",
      name: "PDF to PDF/A",
      icon: FileCheck,
      color: "text-blue-500",
    },
  ],
  edit: [
    {
      id: "rotate-pdf",
      name: "Rotate PDF",
      icon: RotateCw,
      color: "text-purple-500",
    },
    {
      id: "page-numbers",
      name: "Add page numbers",
      icon: Hash,
      color: "text-indigo-500",
    },
    {
      id: "watermark",
      name: "Add watermark",
      icon: FileText,
      color: "text-cyan-500",
    },
    { id: "crop-pdf", name: "Crop PDF", icon: Crop, color: "text-pink-500" },
    { id: "edit-pdf", name: "Edit PDF", icon: PenTool, color: "text-emerald-500" },
  ],
  security: [
    {
      id: "unlock-pdf",
      name: "Unlock PDF",
      icon: Unlock,
      color: "text-green-500",
    },
    {
      id: "protect-pdf",
      name: "Protect PDF",
      icon: Lock,
      color: "text-red-500",
    },
    { id: "sign-pdf", name: "Sign PDF", icon: PenTool, color: "text-blue-500" },
    {
      id: "redact-pdf",
      name: "Redact PDF",
      icon: Square,
      color: "text-gray-500",
    },
    {
      id: "compare-pdf",
      name: "Compare PDF",
      icon: GitCompare,
      color: "text-purple-500",
    },
  ],
};

export const PDFToolsDropdown = ({ activeDropdown, onToolClick }: PDFToolsDropdownProps) => {
  const navigate = useNavigate();

  const handleToolClick = (tool: any) => {
    if (!tool?.id) return;
    navigate(`/${tool.id}`);
    onToolClick?.(); // Close dropdown after navigation
  };

  // CONVERT PDF Dropdown
  if (activeDropdown === "convert") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="py-6 px-4 sm:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Convert TO PDF */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                CONVERT TO PDF
              </h3>
              <div className="space-y-3">
                {pdfTools["convert-to"].map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded-lg cursor-pointer group"
                    onClick={() => handleToolClick(tool)}
                  >
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                      {tool.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Convert FROM PDF */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                CONVERT FROM PDF
              </h3>
              <div className="space-y-3">
                {pdfTools["convert-from"].map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded-lg cursor-pointer group"
                    onClick={() => handleToolClick(tool)}
                  >
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                      {tool.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ALL PDF TOOLS Dropdown
  if (activeDropdown !== "all-tools") {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="py-6 px-4 sm:px-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8 max-w-7xl mx-auto">
          {/* Organize PDF */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
              ORGANIZE PDF
            </h3>
            <div className="space-y-3">
              {pdfTools.organize.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Optimize PDF */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
              OPTIMIZE PDF
            </h3>
            <div className="space-y-3">
              {pdfTools.optimize.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Convert to PDF */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
              CONVERT TO PDF
            </h3>
            <div className="space-y-3">
              {pdfTools["convert-to"].map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Convert from PDF */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
              CONVERT FROM PDF
            </h3>
            <div className="space-y-3">
              {pdfTools["convert-from"].map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Edit PDF */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
              EDIT PDF
            </h3>
            <div className="space-y-3">
              {pdfTools.edit.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* PDF Security */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
              PDF SECURITY
            </h3>
            <div className="space-y-3">
              {pdfTools.security.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interfaces handled via routes */}
    </>
  );
};
