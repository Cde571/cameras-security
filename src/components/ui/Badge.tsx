import React from "react";

export default function Badge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "gray" | "blue" | "green" | "yellow" | "red";
}) {
  const styles =
    color === "blue"
      ? "bg-blue-100 text-blue-700"
      : color === "green"
      ? "bg-green-100 text-green-700"
      : color === "yellow"
      ? "bg-yellow-100 text-yellow-700"
      : color === "red"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles}`}>{children}</span>;
}
