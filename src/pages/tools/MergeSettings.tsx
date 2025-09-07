import React from "react";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  mergeOrder: string;
  setMergeOrder: (v: string) => void;
};

export default function MergeSettings({ mergeOrder, setMergeOrder }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Merge Order
        </label>
        <Select value={mergeOrder} onValueChange={setMergeOrder}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upload-order">Upload Order</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="file-size-asc">
              File Size (Small to Large)
            </SelectItem>
            <SelectItem value="file-size-desc">
              File Size (Large to Small)
            </SelectItem>
            <SelectItem value="custom">Custom Order (Drag & Drop)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 text-sm font-medium mb-1">
              Multiple PDF Merge Instructions:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Upload 2 or more PDF files</li>
              <li>• Drag files in the preview to reorder them</li>
              <li>• Files will be merged in the order shown</li>
              <li>• All pages from each PDF will be included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
