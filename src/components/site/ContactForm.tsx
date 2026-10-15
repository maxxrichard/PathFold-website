"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { sendContactMessage, type ActionState } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(sendContactMessage, {});

  if (state.ok) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-success/30 bg-success/10 px-6 py-12 text-center" role="status">
        <CheckCircle2 className="h-10 w-10 text-success" />
        <h3 className="font-display mt-4 text-xl font-semibold text-fg">Thank you!</h3>
        <p className="mt-2 text-sm text-fg-muted">Your message has been received. We will get back to you soon.</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.error && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-fg" role="alert">
          {state.error}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={err.name} defaultValue={v.name} autoComplete="name" required />
        <Field label="E-mail" name="email" type="email" error={err.email} defaultValue={v.email} autoComplete="email" required />
      </div>
      <Field label="Subject" name="subject" error={err.subject} defaultValue={v.subject} required />
      <Field label="Message" name="message" error={err.message} defaultValue={v.message} textarea required />
      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-fg-subtle">Your message is stored securely and only used to answer your request.</p>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  defaultValue,
  textarea,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  textarea?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-fg">
        {label} {required && <span className="text-misfold">*</span>}
      </label>
      {textarea ? (
        <textarea id={id} name={name} rows={6} defaultValue={defaultValue} className={cn("input mt-2", error && "border-danger")} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue} autoComplete={autoComplete} className={cn("input mt-2", error && "border-danger")} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
