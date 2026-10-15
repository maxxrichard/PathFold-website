import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-4xl font-bold text-fg">This pathway leads nowhere</h1>
      <p className="mt-3 max-w-md text-fg-muted">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to the home page
      </Link>
    </div>
  );
}
