import React from "react";
import { Input } from "@/components/ui/input";
import SettingRow from "@/components/Settings/SettingRow";
import NumberWithSuffix from "@/components/Settings/NumberWithSuffix";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  watermarkText: string;
  setWatermarkText: (v: string) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (v: number) => void;
  watermarkPosition: string;
  setWatermarkPosition: (v: string) => void;
};

export default function WatermarkSettings({
  watermarkText,
  setWatermarkText,
  watermarkOpacity,
  setWatermarkOpacity,
  watermarkPosition,
  setWatermarkPosition,
}: Props) {
  return (
    <div className="space-y-4">
      <SettingRow label="Watermark Text">
        <Input
          type="text"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          placeholder="Enter watermark text"
        />
      </SettingRow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingRow label="Opacity">
          <NumberWithSuffix
            value={watermarkOpacity}
            onChange={setWatermarkOpacity}
            min={1}
            max={100}
            suffix="%"
          />
        </SettingRow>

        <SettingRow label="Position">
          <Select
            value={watermarkPosition}
            onValueChange={setWatermarkPosition}
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </div>
    </div>
  );
}
