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
  pageSize: string;
  setPageSize: (v: string) => void;
  orientation: string;
  setOrientation: (v: string) => void;
  marginSize: string;
  setMarginSize: (v: string) => void;
};

export default function JpgToPdfSettings({
  pageSize,
  setPageSize,
  orientation,
  setOrientation,
  marginSize,
  setMarginSize,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SettingRow label="Page Size">
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="a3">A3</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Orientation">
          <Select value={orientation} onValueChange={setOrientation}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Margins">
          <Select value={marginSize} onValueChange={setMarginSize}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Margins</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </div>
    </div>
  );
}
