"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { sendContactMessage, type ActionState } from "@/lib/admin/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(sendContactMessage, {});

  if (state.ok) {
    return (
      <div className="field-sky px-6 py-12" role="status">
        <h3 className="t-head">Thank you.</h3>
        <p className="t-lead mt-4 max-w-[36ch] text-ink-soft">Your message has been received. We will get back to you soon.</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6" noValidate data-ui>
      {state.error && (
        <p className="bg-coral px-4 py-3 t-body text-ink" role="alert">
          {state.error}
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
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
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-small max-w-[40ch] text-ink-soft">Your message is stored securely and only used to answer your request.</p>
        <Button type="submit" disabled={pending} className="h-12 shrink-0 rounded-none px-6 text-base font-medium hover:bg-native">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Sending…" : "Send message"}
        </Button>
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
  const field = cn("mt-2 rounded-none border-border-strong bg-white text-base shadow-none", error && "border-misfold");
  return (
    <div>
      <Label htmlFor={id} className="t-body font-medium">
        {label}
        {required && (
          <span className="text-misfold" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {textarea ? (
        <Textarea
          id={id}
          name={name}
          rows={7}
          defaultValue={defaultValue}
          required={required}
          className={cn(field, "min-h-44")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          required={required}
          className={cn(field, "h-12")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="t-small mt-1.5 text-misfold">
          {error}
        </p>
      )}
    </div>
  );
}
