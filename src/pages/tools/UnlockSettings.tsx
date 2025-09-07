import React from "react";
import { Input } from "@/components/ui/input";

type Props = { password: string; setPassword: (v: string) => void };

export default function UnlockSettings({ password, setPassword }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          PDF Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter PDF password"
        />
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-green-800 text-sm">
          <strong>Note:</strong> Only works with PDFs you own. We don't store
          passwords.
        </p>
      </div>
    </div>
  );
}
