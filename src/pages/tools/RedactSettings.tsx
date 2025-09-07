import React from "react";
import { Input } from "@/components/ui/input";

type Props = { redactPattern: string; setRedactPattern: (v: string) => void };

export default function RedactSettings({
  redactPattern,
  setRedactPattern,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Redaction Pattern
        </label>
        <Input
          type="text"
          value={redactPattern}
          onChange={(e) => setRedactPattern(e.target.value)}
          placeholder="e.g., email addresses, phone numbers"
        />
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-red-800 text-sm">
          <strong>Warning:</strong> Redaction is permanent and cannot be undone.
        </p>
      </div>
    </div>
  );
}
