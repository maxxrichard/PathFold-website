import type { LucideIcon } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="field-paper-2 grid-12 gap-y-4 px-6 py-14 sm:px-10">
      <h3 className="t-head col-span-12 lg:col-start-6 lg:col-span-7">{title}</h3>
      {description && <p className="t-lead col-span-12 max-w-[40ch] text-ink-soft lg:col-start-6 lg:col-span-7">{description}</p>}
      {action && <div className="col-span-12 mt-2 lg:col-start-6 lg:col-span-7">{action}</div>}
    </div>
  );
}
