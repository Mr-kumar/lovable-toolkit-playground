import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  splitMethod: string;
  setSplitMethod: (v: string) => void;
  pageRange: string;
  setPageRange: (v: string) => void;
};

export default function SplitSettings({
  splitMethod,
  setSplitMethod,
  pageRange,
  setPageRange,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Split Method
        </label>
        <Select value={splitMethod} onValueChange={setSplitMethod}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="every-page">
              Every Page (Individual Files)
            </SelectItem>
            <SelectItem value="page-ranges">Page Ranges</SelectItem>
            <SelectItem value="bookmarks">Split by Bookmarks</SelectItem>
            <SelectItem value="custom-size">Custom File Size</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {splitMethod === "page-ranges" && (
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Page Ranges
          </label>
          <Input
            type="text"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            placeholder="e.g., 1-5, 10-15"
          />
          <p className="text-gray-500 text-xs mt-1">
            Separate ranges with commas
          </p>
        </div>
      )}
    </div>
  );
}
