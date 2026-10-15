"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export function Flash({ saved, deleted }: { saved?: boolean; deleted?: boolean }) {
  const message = saved ? "Saved successfully." : deleted ? "Entry deleted." : null;
  const [visible, setVisible] = useState(!!message);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [message]);
  if (!message || !visible) return null;
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-fg" role="status" aria-live="polite">
      <CheckCircle2 className="h-4 w-4 text-success" /> {message}
      <button type="button" onClick={() => setVisible(false)} className="ml-auto text-fg-subtle hover:text-fg" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
