import React from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  mergedFile?: { name: string; size?: number | string };
  onDownload: () => void;
  onRestart: () => void;
};

export default function MergeResults({
  mergedFile,
  onDownload,
  onRestart,
}: Props) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <FileText className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="text-lg font-semibold mt-2">Merge completed</h3>
        <p className="text-gray-500 text-sm">
          {mergedFile?.name ?? "Your merged PDF"}
        </p>
        {mergedFile?.size && (
          <p className="text-gray-500 text-sm">{mergedFile.size}</p>
        )}
      </div>

      <div className="flex items-center justify-center space-x-3">
        <Button onClick={onDownload} variant="default">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={onRestart} variant="ghost">
          Merge another
        </Button>
      </div>
    </div>
  );
}
