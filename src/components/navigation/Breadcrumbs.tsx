import React, { useMemo } from "react";

type Item = { label: string; href?: string };

export default function Breadcrumbs(props: { items?: Item[] }) {
  const items = useMemo(() => {
    if (props.items?.length) return props.items;

    if (typeof window === "undefined") return [{ label: "Inicio", href: "/" }];

    const parts = window.location.pathname.split("/").filter(Boolean);
    const dynamicItems: Item[] = [{ label: "Inicio", href: "/" }];

    let acc = "";
    parts.forEach((part) => {
      acc += `/${part}`;
      dynamicItems.push({
        label: decodeURIComponent(part),
        href: acc,
      });
    });

    return dynamicItems;
  }, [props.items]);

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a href={item.href} className="hover:text-gray-800">
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? "font-medium text-gray-800" : ""}>{item.label}</span>
              )}
              {!isLast ? <span>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
