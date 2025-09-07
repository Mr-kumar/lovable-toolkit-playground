import React, { memo } from "react";
import { X, FileText, Image, File, Presentation, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
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

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">Selected Files ({files.length})</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {files.map((file, index) => {
          const FileIcon = getFileIcon(file);
          return (
            <li key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-3 min-w-0 flex-wrap sm:flex-nowrap">
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                  <FileIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => onRemoveFile(index)}
                aria-label={`Remove file ${file.name}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Remove file</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FileList;