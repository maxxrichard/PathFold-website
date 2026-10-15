"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  Users,
  Building2,
  Image as ImageIcon,
  Package,
  Layers,
  Flag,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { MODELS } from "@/lib/admin/registry";
import { logoutAction } from "@/lib/admin/actions";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Newspaper, BookOpen, Users, Building2, Image: ImageIcon, Package, Layers, Flag, Mail };

export function AdminShell({ user, children }: { user: Session; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
    ...MODELS.map((m) => ({ href: `/admin/${m.key}`, label: m.label, Icon: ICONS[m.icon] ?? Package, exact: false })),
    { href: "/admin/settings", label: "Settings", Icon: Settings, exact: false },
  ];

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Admin">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/logo-mark.png" alt="" width={40} height={18} className="h-4.5 w-auto" />
        <span className="font-display text-lg font-bold">
          Path<span className="text-gradient">Fold</span>
        </span>
        <span className="chip ml-auto">Admin</span>
      </Link>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-brand-blue/20 text-fg" : "text-fg-muted hover:bg-white/5 hover:text-fg",
                )}
                aria-current={active ? "page" : undefined}
              >
                <item.Icon className="h-4.5 w-4.5" /> {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg-muted hover:bg-white/5 hover:text-fg">
          <ExternalLink className="h-4.5 w-4.5" /> View site
        </Link>
        <div className="mt-2 flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet text-xs font-bold text-bg">
            {user.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-fg">{user.name}</p>
            <p className="truncate text-xs text-fg-subtle">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-subtle hover:bg-white/5 hover:text-fg" aria-label="Sign out" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-bg-elevated lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {/* mobile */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-bg/70 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div className={cn("absolute inset-y-0 left-0 w-72 border-r border-border bg-bg-elevated transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted hover:text-fg" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
          {sidebar}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-semibold">PathFold Admin</span>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
