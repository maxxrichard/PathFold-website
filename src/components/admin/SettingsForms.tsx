"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { saveSettingsAction, changePasswordAction, type ActionState } from "@/lib/admin/actions";
import { SETTING_FIELDS, type Settings } from "@/lib/settings-config";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettingsAction, {});
  return (
    <form action={action} className="space-y-6">
      {state.ok && <Notice>Settings saved.</Notice>}
      {state.error && <Error>{state.error}</Error>}
      <div className="card grid gap-5 p-6 sm:grid-cols-2">
        {SETTING_FIELDS.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={`s-${f.key}`} className="block text-sm font-medium text-fg">
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea id={`s-${f.key}`} name={f.key} rows={3} defaultValue={settings[f.key]} className="input mt-2" />
            ) : (
              <input id={`s-${f.key}`} name={f.key} type={f.type} defaultValue={settings[f.key]} className="input mt-2" />
            )}
            {f.help && <p className="mt-1.5 text-xs text-fg-subtle">{f.help}</p>}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
        </button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});
  return (
    <form action={action} className="card space-y-5 p-6">
      {state.ok && <Notice>Password changed.</Notice>}
      {state.error && <Error>{state.error}</Error>}
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="current" className="block text-sm font-medium text-fg">
            Current password
          </label>
          <input id="current" name="current" type="password" autoComplete="current-password" required className="input mt-2" />
        </div>
        <div>
          <label htmlFor="next" className="block text-sm font-medium text-fg">
            New password
          </label>
          <input id="next" name="next" type="password" autoComplete="new-password" required minLength={10} className="input mt-2" />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-fg">
            Confirm new password
          </label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={10} className="input mt-2" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-secondary" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Update password
        </button>
      </div>
    </form>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm" role="status">
      <CheckCircle2 className="h-4 w-4 text-success" /> {children}
    </p>
  );
}
function Error({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm" role="alert">
      {children}
    </p>
  );
}
