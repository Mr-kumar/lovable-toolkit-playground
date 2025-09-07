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
  compressionLevel: string;
  setCompressionLevel: (v: string) => void;
  targetSize: string;
  setTargetSize: (v: string) => void;
  dpi: number;
  setDpi: (v: number) => void;
  imageQuality: number;
  setImageQuality: (v: number) => void;
  colorMode: string;
  setColorMode: (v: string) => void;
};

import SettingRow from "@/components/Settings/SettingRow";
import NumberWithSuffix from "@/components/Settings/NumberWithSuffix";

export default function CompressSettings({
  compressionLevel,
  setCompressionLevel,
  targetSize,
  setTargetSize,
  dpi,
  setDpi,
  imageQuality,
  setImageQuality,
  colorMode,
  setColorMode,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingRow label="Compression Level">
          <Select value={compressionLevel} onValueChange={setCompressionLevel}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (Best Quality)</SelectItem>
              <SelectItem value="medium">Medium (Balanced)</SelectItem>
              <SelectItem value="high">High (Smallest Size)</SelectItem>
              <SelectItem value="extreme">
                Extreme (Maximum Compression)
              </SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow label="Target Size (KB)">
          <Input
            type="number"
            value={targetSize}
            onChange={(e) => setTargetSize(e.target.value)}
            placeholder="e.g., 500"
          />
        </SettingRow>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SettingRow label="DPI">
          <Select
            value={dpi.toString()}
            onValueChange={(v) => setDpi(Number(v))}
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="72">72 DPI (Web)</SelectItem>
              <SelectItem value="144">144 DPI (Standard)</SelectItem>
              <SelectItem value="300">300 DPI (Print)</SelectItem>
              <SelectItem value="600">600 DPI (High Quality)</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Image Quality">
          <NumberWithSuffix
            value={imageQuality}
            onChange={setImageQuality}
            min={10}
            max={100}
            suffix="%"
          />
        </SettingRow>

        <SettingRow label="Color Mode">
          <Select value={colorMode} onValueChange={setColorMode}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-change">No Change</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="color">Color</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </div>
    </div>
  );
}
