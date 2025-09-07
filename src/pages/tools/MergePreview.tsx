import React from "react";
import { FileText, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  files: File[];
  onRemoveFile: (index: number) => void;
  handleDragStart: (e: React.DragEvent, index: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleReorderDrop: (e: React.DragEvent, index: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export default function MergePreview({
  files,
  onRemoveFile,
  handleDragStart,
  handleDragOver,
  handleReorderDrop,
  inputRef,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {files.length} PDF file{files.length !== 1 ? "s" : ""} ready to merge
        </h3>
        <p className="text-gray-600 text-sm">
          Drag files to reorder them before merging
        </p>
      </div>

      <div className="grid gap-3">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleReorderDrop(e, index)}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-move transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm">
                {index + 1}
              </div>
              <FileText className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium text-gray-900 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onRemoveFile(index)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button
          onClick={() => inputRef.current?.click()}
          variant="outline"
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <Upload className="h-4 w-4 mr-2" />
          Add More PDFs
        </Button>
      </div>
    </div>
  );
}
