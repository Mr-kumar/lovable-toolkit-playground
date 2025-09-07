import React from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  summary?: { differences?: number };
  onDownload: () => void;
  onRestart: () => void;
};

export default function CompareResults({
  summary,
  onDownload,
  onRestart,
}: Props) {
  return (
    <div className="space-y-6 text-center">
      <FileText className="mx-auto h-12 w-12 text-indigo-600" />
      <h3 className="text-lg font-semibold">Compare complete</h3>
      <p className="text-gray-600">
        Differences found: {summary?.differences ?? 0}
      </p>

      <div className="flex items-center justify-center space-x-3">
        <Button onClick={onDownload} variant="default">
          <Download className="h-4 w-4 mr-2" />
          Download report
        </Button>
        <Button onClick={onRestart} variant="ghost">
          Compare again
        </Button>
      </div>
    </div>
  );
}
