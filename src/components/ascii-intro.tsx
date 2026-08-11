"use client";

import { useEffect, useRef } from "react";
import { introCanvasSize, introCellSize } from "@/lib/ascii-intro-config";
import { canScheduleFrame, drawAsciiFrame, settledFrameTime, shouldDrawFrame } from "@/lib/ascii-renderer";

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
  const lastFrameRef = useRef(-Infinity);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let active = true;
    let paused = document.hidden;
    let cellSize = introCellSize(window.innerWidth);
    const render = (time: number) => {
      if (!active || paused || !sourceRef.current) return;
      if (!reducedMotion && !shouldDrawFrame(lastFrameRef.current, time)) return;
      if (startedAtRef.current === null) startedAtRef.current = time;
      drawAsciiFrame(context, sourceRef.current, canvas.width, canvas.height, settledFrameTime(time - startedAtRef.current, reducedMotion), {
        cellSize,
        contrast: 115,
        tintOpacity: 0.32,
        animationIntensity: 0.6,
      });
      lastFrameRef.current = time;
    };
    const schedule = () => {
      if (!canScheduleFrame(frameRef.current !== undefined, reducedMotion, paused)) return;
      frameRef.current = requestAnimationFrame((time) => {
        frameRef.current = undefined;
        render(time);
        schedule();
      });
    };
    const resize = () => {
      const size = introCanvasSize(window.innerWidth, window.innerHeight, window.devicePixelRatio);
      cellSize = introCellSize(window.innerWidth);
      canvas.width = size.width;
      canvas.height = size.height;
      lastFrameRef.current = -Infinity;
      render(performance.now());
      schedule();
    };
    sourceRef.current = fallbackSource();
    const image = new Image();
    image.onload = () => { sourceRef.current = image; lastFrameRef.current = -Infinity; render(performance.now()); schedule(); };
    image.onerror = () => { sourceRef.current = fallbackSource(); };
    image.src = "/ascii-sunset.webp";
    const onVisibilityChange = () => {
      paused = document.hidden;
      if (paused && frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
      if (!paused) {
        lastFrameRef.current = -Infinity;
        render(performance.now());
        schedule();
      }
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
      lastFrameRef.current = -Infinity;
      render(performance.now());
      schedule();
    };
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      active = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      image.onload = null;
      image.onerror = null;
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <div className="ascii-background" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
