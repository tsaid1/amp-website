import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <p className="font-display text-6xl font-bold text-[var(--color-primary)]">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold text-[var(--foreground-heading)]">
          Page not found
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="btn-lift">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="secondary" className="btn-lift">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
