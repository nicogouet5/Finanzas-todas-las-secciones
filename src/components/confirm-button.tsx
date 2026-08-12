"use client";

import { useState } from "react";

export function ConfirmButton({ label, confirmLabel, onConfirm, disabled }: { label: string; confirmLabel: string; onConfirm: () => void | Promise<void>; disabled?: boolean }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) return <button type="button" className="danger" disabled={disabled} onClick={() => setConfirming(true)}>{label}</button>;

  return <span className="confirm-button">
    <span>{confirmLabel}</span>
    <button type="button" className="danger" disabled={disabled} onClick={() => { setConfirming(false); void onConfirm(); }}>Sí</button>
    <button type="button" disabled={disabled} onClick={() => setConfirming(false)}>No</button>
  </span>;
}
