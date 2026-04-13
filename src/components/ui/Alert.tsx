import React from "react";

type Variant = "info" | "success" | "warning" | "danger";

export default function Alert({
  variant = "info",
  children,
}: {
  variant?: Variant;
  children: React.ReactNode;
}) {
  const styles =
    variant === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : variant === "warning"
      ? "border-yellow-200 bg-yellow-50 text-yellow-700"
      : variant === "danger"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}
