"use client";

import { useState } from "react";

type CopyCallOpeningButtonProps = {
  text: string;
};

export function CopyCallOpeningButton({ text }: CopyCallOpeningButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="btn-secondary text-sm px-4 py-2">
      {copied ? "Copied" : "Copy call opening"}
    </button>
  );
}
