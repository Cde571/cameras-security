import React, { useState } from "react";

export default function SoporteUpload({ pagoId }: { pagoId?: string }) {
  const [files, setFiles] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []).map((f) => f.name);
    setFiles(list);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Soportes de pago</h2>
        <p className="text-sm text-gray-500">
          {pagoId ? `Pago: ${pagoId}` : "Adjunta comprobantes en desarrollo local."}
        </p>
      </div>

      <input
        type="file"
        multiple
        onChange={onChange}
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      {files.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {files.map((name) => (
            <li key={name} className="rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No hay soportes cargados.</p>
      )}
    </div>
  );
}
