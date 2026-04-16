import React, { useEffect, useRef } from "react";

type Props = {
  value?: string;
  onChange?: (dataUrl: string) => void;
  disabled?: boolean;
  label?: string;
};

export default function FirmaPad({
  value = "",
  onChange,
  disabled = false,
  label = "Firma del cliente",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const drawingRef = useRef(false);

  function getCanvas() {
    return canvasRef.current;
  }

  function getContext() {
    const canvas = getCanvas();
    if (!canvas) return null;
    return canvas.getContext("2d");
  }

  function setupCanvas() {
    const canvas = getCanvas();
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = Math.max(Math.floor(rect.width * ratio), 300);
    canvas.height = Math.max(Math.floor(180 * ratio), 180);
    canvas.style.width = `${Math.floor(rect.width)}px`;
    canvas.style.height = "180px";

    const ctx = getContext();
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#111827";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, 180);

    if (value && value.startsWith("data:image/")) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, 180);
      };
      img.src = value;
    }
  }

  function clearCanvas() {
    const canvas = getCanvas();
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    onChange?.("");
  }

  function getPoint(event: PointerEvent | React.PointerEvent<HTMLCanvasElement>) {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function beginDraw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;

    const ctx = getContext();
    if (!ctx) return;

    drawingRef.current = true;
    const p = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled || !drawingRef.current) return;

    const ctx = getContext();
    if (!ctx) return;

    const p = getPoint(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function endDraw() {
    if (disabled || !drawingRef.current) return;

    drawingRef.current = false;
    const canvas = getCanvas();
    if (!canvas) return;

    onChange?.(canvas.toDataURL("image/png"));
  }

  useEffect(() => {
    setupCanvas();

    const handleResize = () => setupCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setupCanvas();
  }, [value]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>

        <button
          type="button"
          onClick={clearCanvas}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          disabled={disabled}
        >
          Limpiar firma
        </button>
      </div>

      <div
        ref={wrapperRef}
        className="rounded-2xl border border-gray-300 bg-white p-3"
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none rounded-xl border border-dashed border-gray-300 bg-white"
          onPointerDown={beginDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
          onPointerCancel={endDraw}
        />
      </div>

      <p className="text-xs text-gray-500">
        Firma con el dedo en celular o tableta, o con el mouse en computador.
      </p>
    </div>
  );
}