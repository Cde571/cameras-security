import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
) {
  const { variant = "primary", className = "", ...rest } = props;

  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : variant === "secondary"
      ? "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-transparent text-gray-700 hover:bg-gray-100";

  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${styles} ${className}`}
    />
  );
}
