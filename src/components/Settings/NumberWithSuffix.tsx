import React from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: number | string;
  onChange: (v: any) => void;
  min?: number;
  max?: number;
  suffix?: string;
  type?: string;
  ariaLabel?: string;
  placeholder?: string;
};

export default function NumberWithSuffix({
  value,
  onChange,
  min,
  max,
  suffix,
  type = "number",
  ariaLabel = "number-input",
  placeholder = "",
}: Props) {
  return (
    <div className="flex">
      <Input
        type={type as any}
        min={min}
        max={max}
        value={value as any}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        aria-label={ariaLabel}
        placeholder={placeholder}
      />
      {suffix && (
        <span className="bg-gray-100 border border-l-0 border-gray-300 text-gray-700 px-3 py-2">
          {suffix}
        </span>
      )}
    </div>
  );
}
