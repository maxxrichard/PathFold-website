import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-dvh flex-col justify-center py-24">
      <div className="max-w-[40rem]">
        <p className="t-body font-medium text-native">404</p>
        <div className="mt-3">
          <h1 className="t-title">This pathway leads nowhere.</h1>
          <p className="t-lead mt-6 max-w-[36ch] text-ink-soft">The page you are looking for does not exist or has been moved.</p>
          <Link href="/" className="btn btn-primary mt-10">
            Back to the home page
          </Link>
        </div>
      </div>
    </div>
  );
}
