"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import type { DateRange } from "@/lib/availability";

export type FleetCardVehicle = {
  id: string;
  name: string;
  image: string;
  goodFor: string;
  transmission: string;
  seats: number | string;
  fuelType?: string;
};

// ============================================================
// BAGUHIN MO ITO: ilagay ang totoong contact details ng owner
// ============================================================
// Facebook page username lang (yung nasa dulo ng facebook.com/<username>)
const OWNER_MESSENGER_USERNAME = "YOUR_PAGE_USERNAME";
// Email address ng owner
const OWNER_EMAIL = "owner@example.com";

// Background ng bawat sasakyan: maliwanag sa gitna, may banayad na "sahig" sa ilalim.
const STAGE_BG =
  "linear-gradient(to top, color-mix(in srgb, var(--color-navy) 9%, transparent) 0%, transparent 38%), radial-gradient(ellipse 80% 70% at 50% 55%, #ffffff 0%, var(--color-cream) 100%)";

type Props = {
  vehicle: FleetCardVehicle;
  isAvailable: boolean;
  availableAgain: string; // hal. "Oct 19", o "" kung wala
  bookedRanges?: DateRange[]; // mga naka-book na petsa ng kotseng ito
  today?: string; // YYYY-MM-DD (Asia/Manila)
};

export default function FleetCard({
  vehicle,
  isAvailable,
  availableAgain,
  bookedRanges = [],
  today,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const color = isAvailable ? "var(--color-available)" : "var(--color-muted)";
  const statusLabel = isAvailable ? "Available" : "Unavailable";
  const inquireHref = `/contact?car=${encodeURIComponent(vehicle.name)}`;

  // Direktang message sa owner (imbes na tumawag)
  const messengerHref = `https://m.me/${OWNER_MESSENGER_USERNAME}`;
  const emailHref = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
    `Inquiry: ${vehicle.name}`
  )}&body=${encodeURIComponent(
    `Hi! I'm interested in renting the ${vehicle.name}.\n\nPickup date:\nReturn date:\nDestination:\n\nThank you!`
  )}`;

  // Sa desktop na walang default email app, mag-open ng Gmail compose sa browser.
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    OWNER_EMAIL
  )}&su=${encodeURIComponent(`Inquiry: ${vehicle.name}`)}&body=${encodeURIComponent(
    `Hi! I'm interested in renting the ${vehicle.name}.\n\nPickup date:\nReturn date:\nDestination:\n\nThank you!`
  )}`;

  const handleEmailClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) return; // sa phone, hayaan ang mailto: na magbukas ng email app
    e.preventDefault();
    window.open(gmailHref, "_blank", "noopener,noreferrer");
  };

  const stageImage = (sizes: string, padding: string) => (
    <>
      <div
        aria-hidden="true"
        className="absolute bottom-[17%] left-1/2 h-5 w-3/5 -translate-x-1/2 rounded-full bg-black/25 blur-lg"
      />
      <Image
        src={vehicle.image}
        alt={vehicle.name}
        fill
        sizes={sizes}
        className={`object-contain ${padding} mix-blend-multiply transition-opacity ${
          isAvailable ? "" : "opacity-50 grayscale"
        }`}
      />
    </>
  );

  return (
    <>
      <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={`View details for ${vehicle.name}`}
          className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden text-left"
          style={{ background: STAGE_BG }}
        >
          {stageImage("(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw", "p-5")}

          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-body text-xs font-medium shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span style={{ color }}>{statusLabel}</span>
          </span>

          <span className="absolute bottom-3 right-3 rounded-full bg-navy/90 px-3 py-1 font-body text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            View details
          </span>
        </button>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-semibold text-ink">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              className="cursor-pointer text-left hover:underline hover:decoration-line hover:underline-offset-4"
            >
              {vehicle.name}
            </button>
          </h3>
          <p className="mt-1 font-body text-sm text-muted">{vehicle.goodFor}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-line px-3 py-1 font-body text-xs text-ink">
              {vehicle.transmission}
            </span>
            <span className="rounded-full border border-line px-3 py-1 font-body text-xs text-ink">
              {vehicle.seats} seats
            </span>
            {vehicle.fuelType && (
              <span className="rounded-full border border-line px-3 py-1 font-body text-xs text-ink">
                {vehicle.fuelType}
              </span>
            )}
          </div>

          <div className="mt-6 flex-1" />

          {isAvailable ? (
            <Link
              href={inquireHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-navy px-4 py-2.5 font-body text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Inquire about this car
            </Link>
          ) : (
            <div className="w-full rounded-lg border border-line bg-cream px-4 py-2.5 text-center font-body text-sm text-muted">
              {availableAgain ? `Available again ${availableAgain}` : "Currently unavailable"}
            </div>
          )}
        </div>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${vehicle.name} details`}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl md:grid-cols-2"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 font-body text-lg text-ink shadow-sm transition-colors hover:bg-cream"
            >
              ✕
            </button>

            <div
              className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[360px]"
              style={{ background: STAGE_BG }}
            >
              {stageImage("(min-width: 768px) 384px, 100vw", "p-6")}
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-3 py-1 font-body text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span style={{ color }}>{statusLabel}</span>
              </span>

              <h3 className="mt-3 font-display text-2xl font-semibold text-navy">
                {vehicle.name}
              </h3>
              <p className="mt-1 font-body text-sm text-muted">{vehicle.goodFor}</p>

              <dl className="mt-6 divide-y divide-line border-y border-line font-body text-sm">
                <div className="flex justify-between py-3">
                  <dt className="text-muted">Transmission</dt>
                  <dd className="font-medium text-ink">{vehicle.transmission}</dd>
                </div>
                {vehicle.fuelType && (
                  <div className="flex justify-between py-3">
                    <dt className="text-muted">Fuel type</dt>
                    <dd className="font-medium text-ink">{vehicle.fuelType}</dd>
                  </div>
                )}
                <div className="flex justify-between py-3">
                  <dt className="text-muted">Seats</dt>
                  <dd className="font-medium text-ink">{vehicle.seats} passengers</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted">Best for</dt>
                  <dd className="max-w-[60%] text-right font-medium text-ink">{vehicle.goodFor}</dd>
                </div>
              </dl>

              <p className="mt-4 font-body text-xs text-muted">
                Rates depend on your destination and rental length. Send an inquiry and
                we&apos;ll confirm the price and availability.
              </p>

              {today && (
                <div className="mt-6">
                  <p className="mb-2 font-body text-sm font-semibold text-navy">
                    Availability
                  </p>
                  <AvailabilityCalendar ranges={bookedRanges} today={today} />
                </div>
              )}

              <div className="mt-6 flex-1" />

              {isAvailable ? (
                <Link
                  href={inquireHref}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-navy px-4 py-3 font-body text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Inquire about this car
                </Link>
              ) : (
                <div className="w-full rounded-lg border border-line bg-cream px-4 py-3 text-center font-body text-sm text-muted">
                  {availableAgain ? `Available again ${availableAgain}` : "Currently unavailable"}
                </div>
              )}

              {/* Message the owner: Messenger (primary) at Email (secondary) */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={messengerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-navy px-4 py-2.5 font-body text-sm font-medium text-navy transition-colors hover:bg-cream"
                >
                  Message on Messenger
                </a>
                <a
                  href={emailHref}
                  onClick={handleEmailClick}
                  className="inline-flex items-center justify-center rounded-lg border border-line px-4 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-cream"
                >
                  Send an email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}