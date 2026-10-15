import Link from "next/link";
import { cn } from "@/lib/utils";

export function NewsFilter({ categories, active }: { categories: string[]; active: string }) {
  const items = ["All", ...categories];
  return (
    <nav aria-label="Filter news by category" className="flex flex-wrap gap-2">
      {items.map((c) => (
        <Link
          key={c}
          href={c === "All" ? "/news" : `/news?category=${encodeURIComponent(c)}`}
          className={cn("chip transition", active === c ? "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan" : "hover:text-fg")}
          aria-current={active === c ? "page" : undefined}
        >
          {c}
        </Link>
      ))}
    </nav>
  );
}
