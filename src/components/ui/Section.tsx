import { cn } from "@/lib/utils";

type Tone = "default" | "elevated" | "sky" | "coral" | "night";

const TONES: Record<Tone, string> = {
  default: "",
  elevated: "field-paper-2",
  sky: "field-sky",
  coral: "field-coral",
  night: "field-night",
};

/**
 * One page of the report. Sections are separated by space and by a change of
 * ground, never by rules. `tone` turns a section into a whole colour page.
 */
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
    <section id={id} className={cn("relative", TONES[tone], tight ? "py-16 sm:py-20" : "py-section", className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

/**
 * A heading on the axis: the title begins at column 6, a short deck may sit in
 * the left zone. The heading carries its own weight; there is no label above it.
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
    <div className={cn("grid-12 gap-y-6", className)}>
      {(aside || action) && (
        <div className="aside-zone order-2 flex flex-col justify-end gap-4 t-body text-ink-soft lg:order-1 lg:pb-2">
          {aside}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn("axis order-1 lg:order-2", !aside && !action && "lg:col-start-6")}>
        <Tag className="t-head text-balance">{title}</Tag>
        {description && <p className="t-lead mt-6 max-w-[42ch] text-ink-soft">{description}</p>}
      </div>
    </div>
  );
}

/**
 * The first screen of an inner page: a short deck in the left zone, the title
 * across the whole width in the largest size on the page, the standfirst back
 * in the left zone and anything else hanging from the axis.
 */
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
    <header className={cn("relative pt-24 pb-12 sm:pt-32 sm:pb-16", TONES[tone])}>
      <div className="container-x">
        <div className="grid-12 gap-y-7">
          {eyebrow && (
            <p className="rise aside-zone t-lead font-medium text-ink-soft" aria-hidden="true">
              {eyebrow}
            </p>
          )}
          <h1 className="rise rise-1 t-title col-span-12">{title}</h1>
          {description && <p className="rise rise-2 t-lead col-span-12 max-w-[44ch] text-ink-soft lg:col-span-5">{description}</p>}
          {children && <div className={cn("rise rise-3 col-span-12", description ? "lg:col-start-6 lg:col-span-7" : "lg:col-span-7")}>{children}</div>}
        </div>
      </div>
    </header>
  );
}
