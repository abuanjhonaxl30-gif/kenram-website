import { getFleet } from "@/lib/vehicles";
import { getBusyCars } from "@/lib/availability";
import FleetCard from "@/components/FleetCard";

// "2026-10-18" -> "Oct 19" (kinabukasan ng return date)
function availableAgain(returnDate: string): string {
  const d = new Date(`${returnDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toLocaleDateString("en-PH", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
}

export default async function Fleet() {
  const [fleet, busy] = await Promise.all([getFleet(), getBusyCars()]);

  const cards = fleet.map((vehicle) => {
    const until = busy.get(vehicle.name.trim().toLowerCase());
    return { vehicle, until, isAvailable: vehicle.available && !until };
  });
  const availableCount = cards.filter((c) => c.isAvailable).length;

  return (
    <section id="fleet" className="border-t border-line bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
            The fleet
          </h2>
          <p className="mt-3 font-body text-base text-muted">
            Each vehicle is suited to a different kind of trip. Tap a car to see
            its details, then send an inquiry — we&apos;ll confirm availability
            and the daily rate.
          </p>
          {fleet.length > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 font-body text-xs font-medium text-ink">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-available)" }}
              />
              {availableCount} of {fleet.length} available now
            </p>
          )}
        </div>

        {fleet.length === 0 ? (
          <p className="mt-10 border-t border-line py-8 font-body text-sm text-muted">
            No vehicles listed right now — please check back soon, or call us
            directly.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ vehicle, until, isAvailable }) => (
              <FleetCard
                key={vehicle.id}
                vehicle={{
                  id: vehicle.id,
                  name: vehicle.name,
                  image: vehicle.image,
                  goodFor: vehicle.goodFor,
                  transmission: vehicle.transmission,
                  seats: vehicle.seats,
                }}
                isAvailable={isAvailable}
                availableAgain={until ? availableAgain(until) : ""}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}