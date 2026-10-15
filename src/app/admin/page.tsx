import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-session";
import { login, logout } from "@/lib/admin-actions";
import { getInquiries, type Inquiry } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Kenram Car Rental",
  robots: { index: false, follow: false },
};

const TZ = "Asia/Manila";

function todayManila(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

function formatTime(ms: number): string {
  if (!ms) return "";
  return new Date(ms).toLocaleString("en-PH", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(day: string): string {
  if (!day) return "";
  const d = new Date(`${day}T00:00:00+08:00`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString("en-PH", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dayOf(ms: number): string {
  return new Date(ms).toLocaleDateString("en-CA", { timeZone: TZ });
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="font-body text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold text-navy">
        {value}
      </p>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-body text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-0.5 font-body text-sm font-medium text-ink">{children}</p>
    </div>
  );
}

function InquiryCard({ q, isNew }: { q: Inquiry; isNew: boolean }) {
  const hasTrip = q.destination || q.pickupDate || q.returnDate || q.date;
  const btn =
    "inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 font-body text-sm font-medium text-navy transition-colors hover:bg-cream";

  return (
    <li className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            {q.name}
          </h2>
          {isNew && (
            <span className="rounded-full bg-navy px-2 py-0.5 font-body text-[11px] font-medium text-white">
              New
            </span>
          )}
        </div>
        <p className="font-body text-xs text-muted">{formatTime(q.createdAt)}</p>
      </div>

      {hasTrip && (
        <div className="mt-4 grid gap-4 rounded-lg bg-cream p-4 sm:grid-cols-3">
          {q.destination && <Detail label="Destination">{q.destination}</Detail>}
          {q.pickupDate && <Detail label="Pick-up">{formatDay(q.pickupDate)}</Detail>}
          {q.returnDate && <Detail label="Return">{formatDay(q.returnDate)}</Detail>}
          {/* Lumang inquiry na may isang "date" lang */}
          {!q.pickupDate && q.date && <Detail label="Date">{q.date}</Detail>}
        </div>
      )}

      {q.message && (
        <p className="mt-4 whitespace-pre-wrap font-body text-sm text-ink">
          {q.message}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={`tel:${q.phone}`}
          className="inline-flex items-center justify-center rounded-lg bg-navy px-4 py-2 font-body text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Call {q.phone}
        </a>
        <a href={`sms:${q.phone}`} className={btn}>
          Text
        </a>
        {q.email && (
          <a href={`mailto:${q.email}`} className={btn}>
            Email
          </a>
        )}
      </div>
    </li>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdmin())) {
    const { error } = await searchParams;
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm">
          <p className="font-body text-xs font-medium uppercase tracking-wide text-muted">
            Kenram Car Rental
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy">
            Admin login
          </h1>
          <form action={login} className="mt-6 space-y-4">
            <input
              name="password"
              type="password"
              required
              autoFocus
              placeholder="Password"
              className="w-full rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-navy px-6 py-2.5 font-body text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Login
            </button>
            {error && (
              <p className="font-body text-sm text-red-600">Incorrect password.</p>
            )}
          </form>
        </div>
      </main>
    );
  }

  const inquiries = await getInquiries();
  const today = todayManila();
  const now = Date.now();

  const todayCount = inquiries.filter((q) => q.createdAt && dayOf(q.createdAt) === today).length;
  const upcoming = inquiries.filter((q) => q.pickupDate && q.pickupDate >= today).length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-display text-lg font-semibold text-navy">
              Kenram Car Rental
            </p>
            <p className="font-body text-xs text-muted">Inquiries dashboard</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-line px-4 py-2 font-body text-sm font-medium text-navy transition-colors hover:bg-cream"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total" value={inquiries.length} />
          <StatCard label="Today" value={todayCount} />
          <StatCard label="Upcoming pickups" value={upcoming} />
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold text-navy">
          Latest inquiries
        </h2>

        {inquiries.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-line bg-white/60 p-10 text-center">
            <p className="font-body text-sm text-muted">No inquiries yet.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {inquiries.map((q) => (
              <InquiryCard
                key={q.id}
                q={q}
                isNew={q.createdAt > 0 && now - q.createdAt < 24 * 60 * 60 * 1000}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}