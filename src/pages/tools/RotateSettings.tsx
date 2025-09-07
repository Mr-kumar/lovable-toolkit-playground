import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingRow from "@/components/Settings/SettingRow";

type Props = {
  rotationAngle: number;
  setRotationAngle: (v: number) => void;
  pageRange: string;
  setPageRange: (v: string) => void;
};

export default function RotateSettings({
  rotationAngle,
  setRotationAngle,
  pageRange,
  setPageRange,
}: Props) {
  return (
    <div className="space-y-4">
      <SettingRow label="Rotation Angle">
        <Select
          value={rotationAngle.toString()}
          onValueChange={(v) => setRotationAngle(Number(v))}
        >
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90">90° Clockwise</SelectItem>
            <SelectItem value="180">180° (Upside Down)</SelectItem>
            <SelectItem value="270">90° Counter-clockwise</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Page Range">
        <input
          className="input"
          value={pageRange}
          onChange={(e) => setPageRange(e.target.value)}
          placeholder="e.g., 1-5 or leave empty for all pages"
        />
      </SettingRow>
    </div>
  );
}
