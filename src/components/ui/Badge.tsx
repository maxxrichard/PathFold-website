import { cn } from "@/lib/utils";

/**
 * A small flat label, square-cornered, set in the text face. The tone tints the
 * ground with one of the page's own colours; it never becomes a pill.
 */
const tones: Record<string, string> = {
  neutral: "bg-paper-2 text-ink-soft",
  cyan: "bg-sky text-ink",
  blue: "bg-sky text-ink",
  violet: "bg-ink text-paper",
  misfold: "bg-coral text-ink",
  success: "bg-[#d6f1e2] text-[#0f5b36]",
  warning: "bg-[#fbe9c8] text-[#6b3f00]",
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
