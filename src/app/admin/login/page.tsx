import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.25),transparent)] blur-2xl" />
      <div className="card relative w-full max-w-md p-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo-mark.png" alt="" width={44} height={20} className="h-5 w-auto" />
          <span className="font-display text-xl font-bold">
            Path<span className="text-gradient">Fold</span>
          </span>
        </Link>
        <h1 className="font-display mt-6 text-2xl font-semibold text-fg">Admin sign in</h1>
        <p className="mt-1 text-sm text-fg-muted">Manage news, publications, team, media and more.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
