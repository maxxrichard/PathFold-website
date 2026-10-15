import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  neutral: "border-border bg-white/4 text-fg-muted",
  cyan: "border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan",
  blue: "border-brand-blue/30 bg-brand-blue/10 text-sky-300",
  violet: "border-brand-violet/30 bg-brand-violet/10 text-violet-300",
  misfold: "border-misfold/30 bg-misfold/10 text-misfold",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
};

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: keyof typeof tones; className?: string }) {
  return <span className={cn("chip", tones[tone], className)}>{children}</span>;
}

export function statusTone(status: string): keyof typeof tones {
  switch (status) {
    case "Released":
    case "Achieved":
      return "success";
    case "In development":
    case "In progress":
      return "warning";
    case "Coordinator":
      return "cyan";
    case "Funding":
      return "violet";
    default:
      return "neutral";
  }
}
