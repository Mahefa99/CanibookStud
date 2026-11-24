import { Icon } from "@/components/ui/icon";

/** Route-level loading state for the directory. */
export default function StudsLoading() {
  return (
    <>
      <div className="border-b border-line bg-cream-50">
        <div className="shell py-10 lg:py-14">
          <div className="h-3 w-32 animate-pulse rounded bg-cream-200" />
          <div className="mt-5 h-12 w-full max-w-2xl animate-pulse rounded-lg bg-cream-200" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-cream-200" />
        </div>
      </div>
      <div className="shell py-8">
        <div className="grid gap-8 lg:grid-cols-[276px_minmax(0,1fr)]">
          <div className="h-[420px] animate-pulse rounded-2xl border border-line bg-white" />
          <div>
            <div className="flex items-center justify-between">
              <div className="h-7 w-40 animate-pulse rounded bg-cream-200" />
              <div className="h-9 w-48 animate-pulse rounded-full bg-cream-200" />
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="aspect-[4/3] animate-pulse bg-cream-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 animate-pulse rounded bg-cream-200" />
                    <div className="h-6 w-32 animate-pulse rounded bg-cream-200" />
                    <div className="h-3 w-40 animate-pulse rounded bg-cream-200" />
                    <div className="h-8 w-full animate-pulse rounded-full bg-cream-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status">
        <Icon name="spinner" className="hidden" />
        Loading the stud directory.
      </p>
    </>
  );
}
