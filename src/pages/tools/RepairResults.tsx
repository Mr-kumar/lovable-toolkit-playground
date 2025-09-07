import React from "react";
import { Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  report?: { recoveredPages?: number; extractedText?: boolean };
  onDownload: () => void;
  onContinue: () => void;
};

export default function RepairResults({
  report,
  onDownload,
  onContinue,
}: Props) {
  return (
    <div className="space-y-6 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
      <h3 className="text-lg font-semibold">Repair complete</h3>
      <p className="text-gray-600 text-sm">
        Recovered pages: {report?.recoveredPages ?? 0}
      </p>
      <p className="text-gray-600 text-sm">
        Text extracted: {report?.extractedText ? "Yes" : "No"}
      </p>

      <div className="flex items-center justify-center space-x-3">
        <Button onClick={onDownload} variant="default">
          <Download className="h-4 w-4 mr-2" />
          Download repaired PDF
        </Button>
        <Button onClick={onContinue} variant="ghost">
          Continue
        </Button>
      </div>
    </div>
  );
}
