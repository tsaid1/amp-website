"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-2xl font-bold text-[var(--foreground-heading)]">
          Something went wrong
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          We encountered an unexpected error. Please try again, or contact us if
          the problem persists.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="btn-lift">
            Try again
          </Button>
          <Button asChild variant="secondary" className="btn-lift">
            <a href="mailto:hello@ampenergy.ae">Contact Support</a>
          </Button>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-[var(--muted)]">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
