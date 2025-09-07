import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingRow from "@/components/Settings/SettingRow";
import { Input } from "@/components/ui/input";

type Props = {
  imageFormat: string;
  setImageFormat: (v: string) => void;
  imageQuality: number;
  setImageQuality: (v: number) => void;
};

export default function PdfToJpgSettings({
  imageFormat,
  setImageFormat,
  imageQuality,
  setImageQuality,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingRow label="Image Format">
          <Select value={imageFormat} onValueChange={setImageFormat}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="tiff">TIFF</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Quality">
          <Input
            type="number"
            min={10}
            max={100}
            value={imageQuality}
            onChange={(e) => setImageQuality(Number(e.target.value))}
          />
        </SettingRow>
      </div>
    </div>
  );
}
