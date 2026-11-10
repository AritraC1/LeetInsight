// Placeholder shown while the profile card is being fetched — mimics the
// layout of components/home/Card.tsx so the swap feels seamless.
export default function CardSkeleton() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Loading your profile card"
      className="mx-auto w-full max-w-220 animate-pulse"
    >
      <div className="rounded-[28px] border border-white/10 bg-white/3 p-5.5 text-white sm:p-9">
        {/* ---- Top: user + brand ---- */}
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-5">
            <div className="h-16 w-16 flex-none rounded-full bg-white/10 sm:h-23 sm:w-23" />
            <div className="space-y-3">
              <div className="h-6 w-40 rounded-lg bg-white/10 sm:h-7 sm:w-52" />
              <div className="h-4 w-24 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-5 w-24 flex-none rounded bg-white/10" />
        </div>

        {/* ---- Middle: solved ring + difficulty bars ---- */}
        <div className="mt-7 rounded-[20px] border border-white/8 bg-white/4.5 p-5.5">
          <div className="mb-4 h-3 w-36 rounded bg-white/10" />
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-5.5">
            <div className="h-24 w-24 flex-none rounded-full bg-white/10 sm:h-34 sm:w-34" />
            <div className="grid w-full flex-1 gap-3.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <div className="h-3 w-14 rounded bg-white/10" />
                    <div className="h-3 w-16 rounded bg-white/10" />
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Languages + badges ---- */}
        <div className="mt-4.5 flex flex-col gap-4.5 sm:flex-row sm:items-stretch">
          <div className="rounded-[20px] border border-white/8 bg-white/4.5 p-5.5 sm:w-70 sm:flex-none">
            <div className="mb-4 h-3 w-24 rounded bg-white/10" />
            <div className="grid gap-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded bg-white/10" />
                    <div className="h-3 w-20 rounded bg-white/10" />
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-white/8 bg-white/4.5 p-5.5 sm:min-w-0 sm:flex-1">
            <div className="mb-4 h-3 w-20 rounded bg-white/10" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 w-11 rounded-2xl bg-white/10 sm:h-14 sm:w-14"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---- Footer ---- */}
        <div className="mt-5.5 flex justify-between text-xs">
          <div className="h-3 w-40 rounded bg-white/10" />
          <div className="h-3 w-16 rounded bg-white/10" />
        </div>
      </div>
    </section>
  );
}
