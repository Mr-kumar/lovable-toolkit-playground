import React from "react";
import { Input } from "@/components/ui/input";
import SettingRow from "@/components/Settings/SettingRow";
import NumberWithSuffix from "@/components/Settings/NumberWithSuffix";

type Props = {
  cropMargins: { top: number; right: number; bottom: number; left: number };
  setCropMargins: (v: any) => void;
};

export default function CropSettings({ cropMargins, setCropMargins }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SettingRow label="Top Margin">
          <NumberWithSuffix
            value={cropMargins.top}
            onChange={(v) =>
              setCropMargins((prev: any) => ({ ...prev, top: Number(v) }))
            }
            min={0}
            type="number"
          />
        </SettingRow>
        <SettingRow label="Right Margin">
          <NumberWithSuffix
            value={cropMargins.right}
            onChange={(v) =>
              setCropMargins((prev: any) => ({ ...prev, right: Number(v) }))
            }
            min={0}
            type="number"
          />
        </SettingRow>
        <SettingRow label="Bottom Margin">
          <NumberWithSuffix
            value={cropMargins.bottom}
            onChange={(v) =>
              setCropMargins((prev: any) => ({ ...prev, bottom: Number(v) }))
            }
            min={0}
            type="number"
          />
        </SettingRow>
        <SettingRow label="Left Margin">
          <NumberWithSuffix
            value={cropMargins.left}
            onChange={(v) =>
              setCropMargins((prev: any) => ({ ...prev, left: Number(v) }))
            }
            min={0}
            type="number"
          />
        </SettingRow>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          <strong>Tip:</strong> Values are in points (1 inch = 72 points)
        </p>
      </div>
    </div>
  );
}
