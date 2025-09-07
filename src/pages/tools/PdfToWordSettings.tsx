import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { outputFormat: string; setOutputFormat: (v: string) => void };

export default function PdfToWordSettings({
  outputFormat,
  setOutputFormat,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Output Format
        </label>
        <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="docx">DOCX (Word 2007+)</SelectItem>
            <SelectItem value="doc">DOC (Word 97-2003)</SelectItem>
            <SelectItem value="rtf">RTF (Rich Text)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          <strong>Quality:</strong> Complex layouts may require manual
          adjustment.
        </p>
      </div>
    </div>
  );
}
