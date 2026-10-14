const REASONS = [
  {
    title: "Maintained fleet",
    body: "Every vehicle is checked and serviced between bookings, so it's ready before you are.",
  },
  {
    title: "Local know-how",
    body: "Based in Isulan — we know the roads across Sultan Kudarat and can advise on routes and timing.",
  },
  {
    title: "Flexible arrangements",
    body: "Self-drive or with a driver, single day or an extended trip, we work around what you need.",
  },
];

export default function WhyKenram() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-3xl font-semibold text-navy">
        Why people rent from Kenram
      </h2>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title}>
            <h3 className="font-display text-base font-medium text-ink">
              {reason.title}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted">
              {reason.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}