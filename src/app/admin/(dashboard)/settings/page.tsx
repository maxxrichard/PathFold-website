import { getSettings } from "@/lib/settings";
import { SettingsForm, PasswordForm } from "@/components/admin/SettingsForms";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Settings</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-fg">Site settings</h1>
      <p className="mt-1 text-sm text-fg-muted">Texts and contact details used across the public site.</p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
      <h2 className="font-display mt-14 text-2xl font-semibold text-fg">Change password</h2>
      <div className="mt-6">
        <PasswordForm />
      </div>
    </div>
  );
}
