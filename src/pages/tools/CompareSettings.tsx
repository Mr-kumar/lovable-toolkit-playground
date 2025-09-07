import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  compareMode: string;
  setCompareMode: (v: string) => void;
};

export default function CompareSettings({
  compareMode,
  setCompareMode,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Compare Mode
        </label>
        <Select value={compareMode} onValueChange={setCompareMode}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="side-by-side">Side by Side</SelectItem>
            <SelectItem value="overlay">Overlay</SelectItem>
            <SelectItem value="highlight">Highlight Differences</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Upload two PDF files to compare them.
        </p>
      </div>
    </div>
  );
}
