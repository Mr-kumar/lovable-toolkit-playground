import React from "react";
import { Info } from "lucide-react";

type Props = {
  repairAction: string;
  setRepairAction: (v: "auto" | "extract-pages" | "extract-images") => void;
};

export default function RepairSettings({
  repairAction,
  setRepairAction,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Repair Action
        </label>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 text-sm font-medium mb-1">
                Repair PDF Instructions:
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Upload the damaged PDF file</li>
                <li>• Choose Auto Repair or an extraction option</li>
                <li>• Preview recovered pages and download results</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setRepairAction("auto")}
            className={`p-3 rounded-lg border ${
              repairAction === "auto"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            Auto Repair (recommended)
          </button>
          <button
            onClick={() => setRepairAction("extract-pages")}
            className={`p-3 rounded-lg border ${
              repairAction === "extract-pages"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            Extract Pages Only
          </button>
          <button
            onClick={() => setRepairAction("extract-images")}
            className={`p-3 rounded-lg border ${
              repairAction === "extract-images"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            Extract Images/Text
          </button>
        </div>
      </div>
    </div>
  );
}
