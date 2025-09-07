import React from "react";
import { Input } from "@/components/ui/input";

type Props = { htmlUrl: string; setHtmlUrl: (v: string) => void };

export default function HtmlToPdfSettings({ htmlUrl, setHtmlUrl }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Website URL
        </label>
        <Input
          type="url"
          value={htmlUrl}
          onChange={(e) => setHtmlUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Some websites may block PDF conversion.
        </p>
      </div>
    </div>
  );
}
