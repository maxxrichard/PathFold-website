import { cn } from "@/lib/utils";

type Tone = "default" | "elevated" | "sky" | "coral" | "night";

const TONES: Record<Tone, string> = {
  default: "",
  elevated: "field-paper-2",
  sky: "field-sky",
  coral: "field-coral",
  night: "field-night",
};

/** One section of the page. Sections are separated by space and a change of ground. */
export function Section({
  id,
  className,
  children,
  tone = "default",
  tight = false,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: Tone;
  tight?: boolean;
}) {
  return (
    <section id={id} className={cn("relative", TONES[tone], tight ? "py-14 sm:py-16" : "py-section", className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

/**
 * A section heading: title and standfirst on the left, an optional action on
 * the right of the same row. The heading carries its own weight; no label above it.
 */
export function SectionHeading({
  title,
  description,
  aside,
  action,
  className,
  level = 2,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  level?: 2 | 3;
}) {
  const Tag = level === 3 ? "h3" : "h2";
  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-[60ch]">
        <Tag className="t-head text-balance">{title}</Tag>
        {description && <p className="t-lead mt-4 text-ink-soft">{description}</p>}
        {aside && <div className="t-body mt-4 text-ink-soft">{aside}</div>}
      </div>
      {action && <div className="shrink-0 sm:pb-1">{action}</div>}
    </div>
  );
}

/** The first screen of an inner page: title, standfirst and anything the page adds. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <header className={cn("relative border-b border-border pt-28 pb-12 sm:pt-36 sm:pb-16", TONES[tone])}>
      <div className="container-x">
        <div className="max-w-[64rem]">
          {eyebrow && (
            <p className="rise t-body font-medium text-native" aria-hidden="true">
              {eyebrow}
            </p>
          )}
          <h1 className="rise rise-1 t-title mt-3 max-w-[22ch]">{title}</h1>
          {description && <p className="rise rise-2 t-lead mt-6 max-w-[62ch] text-ink-soft">{description}</p>}
          {children && <div className="rise rise-3 mt-8">{children}</div>}
        </div>
      </div>
    </header>
  );
}
