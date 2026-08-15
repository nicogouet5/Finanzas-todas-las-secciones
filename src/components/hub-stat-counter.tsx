"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 900;

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

/** Cuenta desde 0 hasta `value` al montar. Respeta prefers-reduced-motion mostrando el valor final. */
export function HubStatCounter({ value, padStart }: { value: number; padStart?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let frame: number;
    const start = performance.now();
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / DURATION_MS);
      setDisplay(Math.round(value * easeOutQuint(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const text = padStart ? display.toString().padStart(padStart, "0") : display.toString();
  return <>{text}</>;
}
