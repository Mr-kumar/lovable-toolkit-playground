import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Props = {
  pageNumbersPosition: string;
  setPageNumbersPosition: (v: string) => void;
  pageNumbersStart: number;
  setPageNumbersStart: (v: number) => void;
};

export default function PageNumbersSettings({
  pageNumbersPosition,
  setPageNumbersPosition,
  pageNumbersStart,
  setPageNumbersStart,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Position
          </label>
          <Select
            value={pageNumbersPosition}
            onValueChange={setPageNumbersPosition}
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-center">Top Center</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-center">Bottom Center</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Start Number
          </label>
          <Input
            type="number"
            min={1}
            value={pageNumbersStart}
            onChange={(e) => setPageNumbersStart(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
