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
  signatureType: string;
  setSignatureType: (v: string) => void;
  signatureText: string;
  setSignatureText: (v: string) => void;
};

export default function SignSettings({
  signatureType,
  setSignatureType,
  signatureText,
  setSignatureText,
}: Props) {
  return (
    <div className="space-y-4">
      <SettingRow label="Signature Type">
        <Select value={signatureType} onValueChange={setSignatureType}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text Signature</SelectItem>
            <SelectItem value="draw">Draw Signature</SelectItem>
            <SelectItem value="upload">Upload Image</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {signatureType === "text" && (
        <SettingRow label="Signature Text">
          <Input
            type="text"
            value={signatureText}
            onChange={(e) => setSignatureText(e.target.value)}
            placeholder="Your name"
          />
        </SettingRow>
      )}
    </div>
  );
}
