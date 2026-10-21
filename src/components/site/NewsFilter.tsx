import Link from "next/link";
import { cn } from "@/lib/utils";

export function NewsFilter({ categories, active }: { categories: string[]; active: string }) {
  const items = ["All", ...categories];
  return (
    <nav aria-label="Filter news by category" className="flex flex-wrap gap-x-6 gap-y-2 t-body">
      {items.map((c) => (
        <Link
          key={c}
          href={c === "All" ? "/news" : `/news?category=${encodeURIComponent(c)}`}
          className={cn("link py-2", active === c ? "font-semibold decoration-current" : "text-ink-soft")}
          aria-current={active === c ? "page" : undefined}
        >
          {c}
        </Link>
      ))}
    </nav>
  );
}
