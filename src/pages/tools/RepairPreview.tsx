import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  file?: File;
  onStartRepair: () => void;
  onRemove: () => void;
};

export default function RepairPreview({
  file,
  onStartRepair,
  onRemove,
}: Props) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <FileText className="mx-auto h-12 w-12 text-orange-600" />
        <h3 className="text-lg font-semibold mt-2">Ready to repair</h3>
        <p className="text-gray-500 text-sm">
          {file?.name ?? "No file selected"}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3">
        <Button onClick={onStartRepair} variant="default">
          Start Repair
        </Button>
        <Button onClick={onRemove} variant="ghost">
          Remove
        </Button>
      </div>
    </div>
  );
}
