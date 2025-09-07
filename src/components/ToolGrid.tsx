import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { toolsConfig, FileType } from "@/data/toolsConfig";

interface ToolGridProps {
  files: File[];
  onSelectTool: (toolId: string) => void;
}

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

const ToolGrid: React.FC<ToolGridProps> = ({ files, onSelectTool }) => {
  const filesType = useMemo(() => getFilesType(files), [files]);

  // Filter tools based on file type compatibility
  const compatibleTools = useMemo(() => {
    const compatibleCategories: Record<string, typeof toolsConfig[keyof typeof toolsConfig]> = {};

    Object.entries(toolsConfig).forEach(([key, category]) => {
      const compatibleTools = category.tools.filter((tool) =>
        tool.compatibleWith.includes(filesType)
      );

      if (compatibleTools.length > 0) {
        compatibleCategories[key] = {
          ...category,
          tools: compatibleTools,
        };
      }
    });

    return compatibleCategories;
  }, [filesType]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="space-y-10">
      {Object.entries(compatibleTools).map(([categoryKey, category]) => (
        <div key={categoryKey}>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {category.title}
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {category.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectTool(tool.id)}
                >
                  <div className="p-5">
                    <div
                      className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {tool.description}
                    </p>
                    <div className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs text-gray-500"
                        >
                          <svg
                            className="h-3 w-3 text-green-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default ToolGrid;