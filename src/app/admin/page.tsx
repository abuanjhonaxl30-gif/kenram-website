import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-session";
import { login, logout } from "@/lib/admin-actions";
import { getInquiries } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Kenram Car Rental",
  robots: { index: false, follow: false },
};

function formatTime(ms: number): string {
  if (!ms) return "";
  return new Date(ms).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDay(day: string): string {
  if (!day) return "";
  const d = new Date(`${day}T00:00:00+08:00`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdmin())) {
    const { error } = await searchParams;
    return (
      <main className="mx-auto max-w-sm px-4 py-24">
        <h1 className="text-2xl font-bold">Admin</h1>
        <form action={login} className="mt-6 space-y-4">
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Login
          </button>
          {error && <p className="text-red-600">Maling password.</p>}
        </form>
      </main>
    );
  }

  const inquiries = await getInquiries();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inquiries ({inquiries.length})</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-600 underline">
            Logout
          </button>
        </form>
      </div>

      {inquiries.length === 0 && (
        <p className="mt-8 text-gray-600">Wala pang inquiry.</p>
      )}

      <ul className="mt-6 space-y-4">
        {inquiries.map((q) => (
          <li key={q.id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-lg font-semibold">{q.name}</p>
              <p className="text-sm text-gray-500">{formatTime(q.createdAt)}</p>
            </div>

            {q.destination && (
              <p className="mt-2 text-gray-900">
                <span className="text-gray-500">Destination: </span>
                <span className="font-medium">{q.destination}</span>
              </p>
            )}

            {(q.pickupDate || q.returnDate) && (
              <p className="mt-1 text-gray-900">
                <span className="text-gray-500">Pick-up: </span>
                <span className="font-medium">{formatDay(q.pickupDate)}</span>
                <span className="text-gray-500"> → Return: </span>
                <span className="font-medium">{formatDay(q.returnDate)}</span>
              </p>
            )}

            {/* Lumang inquiry na may isang "date" lang */}
            {!q.pickupDate && q.date && (
              <p className="mt-1 text-gray-900">
                <span className="text-gray-500">Date: </span>
                {q.date}
              </p>
            )}

            {q.message && (
              <p className="mt-2 whitespace-pre-wrap text-gray-800">{q.message}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <a href={`tel:${q.phone}`} className="font-medium text-blue-700 underline">
                {q.phone}
              </a>
              {q.email && <span>{q.email}</span>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}