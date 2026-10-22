export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-5">
        <div className="md:col-span-3">
          <h1 className="font-display text-4xl font-semibold leading-tight text-navy md:text-5xl">
            A reliable ride for every trip around Sultan Kudarat.
          </h1>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-muted">
            Kenram Car Rental keeps a well-maintained fleet in Isulan, ready
            for self-drive or with-driver bookings — sedans for the city,
            vans for the whole family.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="/fleet" className="rounded-sm bg-amber px-6 py-3 font-body text-sm font-medium text-cream transition-colors hover:bg-amber-light">
              See available cars
            </a>
            <a href="mailto:abuanjhonaxl@gmail.com" className="font-body text-sm font-medium text-navy underline decoration-line underline-offset-4 transition-colors hover:decoration-amber">
              Or Email us.
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <RouteIllustration />
        </div>
      </div>
    </section>
  );
}

function RouteIllustration() {
  return (
    <svg viewBox="0 0 320 260" className="h-auto w-full" role="img" aria-label="Illustrated route from Isulan through Sultan Kudarat">
      <path d="M20 220 C 90 220, 70 140, 140 130 S 220 60, 200 20" fill="none" stroke="var(--color-line)" strokeWidth="10" strokeLinecap="round" />
      <path d="M20 220 C 90 220, 70 140, 140 130 S 220 60, 200 20" fill="none" stroke="var(--color-navy)" strokeWidth="3" strokeDasharray="1 14" strokeLinecap="round" />
      <circle cx="20" cy="220" r="7" fill="var(--color-navy)" />
      <circle cx="200" cy="20" r="7" fill="var(--color-amber)" />
      <text x="34" y="224" className="font-body" fontSize="11" fill="var(--color-muted)">
        Isulan
      </text>
      <text x="180" y="12" className="font-body" fontSize="11" fill="var(--color-muted)" textAnchor="end">
        Your destination
      </text>
    </svg>
  );
}