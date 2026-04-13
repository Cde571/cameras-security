import React from "react";

export default function PDFPreview({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-gray-600">
        Placeholder: aquí conectamos el generador PDF real (tu proyecto ya tiene `lib/pdf/actaPDF.ts`).
      </p>
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
        Vista previa PDF (pendiente)
      </div>
    </div>
  );
}
