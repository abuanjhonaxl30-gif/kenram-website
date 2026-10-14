import Image from "next/image";
import { getFleet } from "@/lib/vehicles";

export default async function Fleet() {
  const fleet = await getFleet();

  return (
    <section id="fleet" className="border-t border-line bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-semibold text-navy">
            The fleet
          </h2>
          <p className="mt-3 font-body text-base text-muted">
            Five vehicles, each suited to a different kind of trip. Ask about
            current availability and daily rates.
          </p>
        </div>

        <div className="mt-10 border-t border-line">
          {fleet.length === 0 ? (
            <p className="py-8 font-body text-sm text-muted">
              No vehicles listed right now — please check back soon, or call
              us directly.
            </p>
          ) : (
            fleet.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col gap-6 border-b border-line py-8 sm:flex-row sm:items-center"
              >
                <div className="relative h-40 w-full shrink-0 overflow-hidden border border-line bg-cream sm:h-32 sm:w-52">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    sizes="(min-width: 640px) 208px, 100vw"
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-medium text-ink">
                      {vehicle.name}
                    </h3>
                    <p className="font-body text-sm text-muted">
                      {vehicle.goodFor}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: vehicle.available
                            ? "var(--color-available)"
                            : "var(--color-muted)",
                        }}
                      />
                      <span
                        className="font-body text-xs font-medium"
                        style={{
                          color: vehicle.available
                            ? "var(--color-available)"
                            : "var(--color-muted)",
                        }}
                      >
                        {vehicle.available ? "Available" : "Currently booked"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-body text-sm text-muted">
                    <span>{vehicle.transmission}</span>
                    <span>{vehicle.seats} seats</span>
                    <a
                      href="/contact"
                      className="font-medium text-navy underline decoration-line underline-offset-4 transition-colors hover:decoration-amber"
                    >
                      Inquire
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}