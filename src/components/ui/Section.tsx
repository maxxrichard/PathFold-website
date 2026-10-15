import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
  tone = "default",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "elevated";
}) {
  return (
    <section
      id={id}
      className={cn("relative py-20 sm:py-24", tone === "elevated" && "bg-bg-elevated border-y border-border", className)}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{description}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-border pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.22),transparent)] blur-2xl" />
      <div className="container-x relative">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-5 text-lg leading-relaxed text-fg-muted sm:text-xl">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
