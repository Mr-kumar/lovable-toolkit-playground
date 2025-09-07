import React from "react";

type Props = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export default function SettingRow({ label, children, className = "" }: Props) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}
