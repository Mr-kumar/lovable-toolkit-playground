import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { ocrLanguage: string; setOcrLanguage: (v: string) => void };

export default function OCRSettings({ ocrLanguage, setOcrLanguage }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          OCR Language
        </label>
        <Select value={ocrLanguage} onValueChange={setOcrLanguage}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
            <SelectItem value="arabic">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-green-800 text-sm">
          <strong>OCR:</strong> Makes scanned PDFs searchable and selectable.
        </p>
      </div>
    </div>
  );
}
