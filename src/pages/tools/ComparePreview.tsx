import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  files: File[];
  onCompare: () => void;
  onRemove: (index: number) => void;
};

export default function ComparePreview({ files, onCompare, onRemove }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Compare PDFs</h3>
        <p className="text-sm text-gray-500">
          Select exactly two PDFs to compare side-by-side
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => {
          const file = files[i];
          return (
            <div
              key={i}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
            >
              <FileText className="mx-auto h-10 w-10 text-sky-600" />
              <p className="mt-2 font-medium">{file?.name ?? "No file"}</p>
              <p className="text-sm text-gray-500">
                {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "-"}
              </p>
              {file && (
                <div className="mt-3">
                  <Button onClick={() => onRemove(i)} variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Button onClick={onCompare} variant="default">
          Compare
        </Button>
      </div>
    </div>
  );
}
