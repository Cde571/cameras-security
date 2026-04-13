import React, { useState } from "react";

type Item = { key: string; label: string; content: React.ReactNode };

export default function Tabs({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.key ?? "");

  const current = items.find((x) => x.key === active) ?? items[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`rounded-lg px-4 py-2 text-sm ${
              current?.key === item.key
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{current?.content}</div>
    </div>
  );
}
