import React from "react";

export default function DatePicker(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="date"
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 ${props.className || ""}`}
    />
  );
}
