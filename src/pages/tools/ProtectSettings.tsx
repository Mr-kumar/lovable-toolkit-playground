import React from "react";
import { Input } from "@/components/ui/input";
import SettingRow from "@/components/Settings/SettingRow";

type Props = { password: string; setPassword: (v: string) => void };

export default function ProtectSettings({ password, setPassword }: Props) {
  return (
    <div className="space-y-4">
      <SettingRow label="Password">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter strong password"
        />
      </SettingRow>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-yellow-800 text-sm">
          <strong>Security:</strong> Choose a strong password. You'll need it to
          open the PDF.
        </p>
      </div>
    </div>
  );
}
