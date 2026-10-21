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
    <div className="panel px-6 py-12 text-center sm:px-10">
      <h3 className="text-[1.25rem] font-semibold tracking-[-0.015em]">{title}</h3>
      {description && <p className="t-body mx-auto mt-2 max-w-[44ch] text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
