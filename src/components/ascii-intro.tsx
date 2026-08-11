"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { drawAsciiFrame } from "@/lib/ascii-renderer";

const INTRO_KEY = "hub-ascii-intro-seen";
const INTRO_DURATION = 5500;
const EXIT_DURATION = 220;

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

export function AsciiIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<CanvasImageSource | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const completionRef = useRef<number | undefined>(undefined);
  const exitRef = useRef<number | undefined>(undefined);
  const finishingRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    sessionStorage.setItem(INTRO_KEY, "true");
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (completionRef.current) clearTimeout(completionRef.current);
    setExiting(true);
    exitRef.current = window.setTimeout(() => setVisible(false), EXIT_DURATION);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem(INTRO_KEY)) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(window.innerWidth * scale);
      canvas.height = Math.ceil(window.innerHeight * scale);
    };
    resize();
    window.addEventListener("resize", resize);
    sourceRef.current = fallbackSource();
    const image = new Image();
    image.onload = () => { sourceRef.current = image; };
    image.onerror = () => { sourceRef.current = fallbackSource(); };
    image.src = "/ascii-sunset.webp";

    let active = true;
    const draw = (time: number) => {
      if (!active || !sourceRef.current) return;
      drawAsciiFrame(context, sourceRef.current, canvas.width, canvas.height, time);
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);
    completionRef.current = window.setTimeout(finish, INTRO_DURATION);

    return () => {
      active = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (completionRef.current) clearTimeout(completionRef.current);
      if (exitRef.current) clearTimeout(exitRef.current);
      image.onload = null;
      image.onerror = null;
      window.removeEventListener("resize", resize);
      document.body.style.overflow = previousOverflow;
    };
  }, [finish, visible]);

  if (!visible) return null;

  return <div className={`ascii-intro${exiting ? " ascii-intro--exit" : ""}`} role="presentation">
    <canvas ref={canvasRef} aria-hidden="true" />
    <button className="ascii-intro__skip" type="button" onClick={finish} aria-label="Saltar introducción">Saltar intro</button>
  </div>;
}
