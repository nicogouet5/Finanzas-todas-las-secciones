"use client";

import { useEffect, useRef } from "react";
import { introCanvasSize } from "@/lib/ascii-intro-config";
import { drawAsciiFrame } from "@/lib/ascii-renderer";

function fallbackSource() {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 90;
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#17070b");
  gradient.addColorStop(0.55, "#682019");
  gradient.addColorStop(1, "#ff7d42");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<CanvasImageSource | null>(null);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const size = introCanvasSize(window.innerWidth, window.innerHeight, window.devicePixelRatio);
      canvas.width = size.width;
      canvas.height = size.height;
      if (sourceRef.current) drawAsciiFrame(context, sourceRef.current, canvas.width, canvas.height, performance.now());
    };
    resize();
    window.addEventListener("resize", resize);
    sourceRef.current = fallbackSource();
    const image = new Image();
    image.onload = () => { sourceRef.current = image; };
    image.onerror = () => { sourceRef.current = fallbackSource(); };
    image.src = "/ascii-sunset.webp";

    const draw = (time: number) => {
      if (!sourceRef.current) return;
      drawAsciiFrame(context, sourceRef.current, canvas.width, canvas.height, time);
      if (!reducedMotion) frameRef.current = requestAnimationFrame(draw);
    };
    draw(0);
    if (!reducedMotion) frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      image.onload = null;
      image.onerror = null;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <div className="ascii-background" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
