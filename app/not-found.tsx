import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[420px] max-w-[720px] flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-foreground/50">
          Not found
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          We could not find that quotation.
        </h1>
        <p className="text-foreground/60">
          The quotation may have expired, been deleted, or the link may be
          incorrect.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
      >
        Create a new build
      </Link>
    </main>
  );
}
