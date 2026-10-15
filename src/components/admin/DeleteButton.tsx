"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEntry } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

export function DeleteButton({ modelKey, id, label, compact }: { modelKey: string; id: string; label: string; compact?: boolean }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();

  if (!confirm) {
    return (
      <button type="button" onClick={() => setConfirm(true)} className={cn("btn", compact ? "btn-ghost btn-sm text-danger" : "btn-danger btn-sm")}>
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => start(() => deleteEntry(modelKey, id))}
        className="btn btn-danger btn-sm"
        disabled={pending}
        aria-label={`Confirm deleting this ${label.toLowerCase()}`}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Confirm
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="btn btn-ghost btn-sm" disabled={pending}>
        Cancel
      </button>
    </span>
  );
}
