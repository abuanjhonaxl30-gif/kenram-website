import { runQuery } from "@/lib/firebase-admin";

export function todayManila(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
}

// Ibinabalik ang mga sasakyang may inquiry na hindi pa lumilipas ang return date.
// key = pangalan ng sasakyan (lowercase), value = pinakahuling return date (YYYY-MM-DD)
export async function getBusyCars(): Promise<Map<string, string>> {
  const busy = new Map<string, string>();

  try {
    const docs = await runQuery({
      from: [{ collectionId: "inquiries" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "returnDate" },
          op: "GREATER_THAN_OR_EQUAL",
          value: { stringValue: todayManila() },
        },
      },
    });

    for (const d of docs) {
      const car = String(d.fields.carName ?? "").trim().toLowerCase();
      const ret = String(d.fields.returnDate ?? "");
      if (!car || !ret) continue;
      const prev = busy.get(car);
      if (!prev || ret > prev) busy.set(car, ret);
    }
  } catch (err) {
    console.error("getBusyCars failed:", err);
  }

  return busy;
}

// ---------------------------------------------------------------
// Para sa calendar: mga petsang naka-book bawat sasakyan.
// ---------------------------------------------------------------

// Inclusive na range, parehong YYYY-MM-DD (Asia/Manila).
export type DateRange = { start: string; end: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

// Mga booking status na HINDI humaharang sa kotse (parehong listahan sa vehicles.ts).
const INACTIVE_STATUSES = new Set([
  "cancelled",
  "canceled",
  "rejected",
  "declined",
  "returned",
  "completed",
]);

function toManilaDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
}

// key = "name:<lowercase na pangalan>" o "id:<lowercase na id>"
// value = listahan ng mga naka-book na date range
export async function getBookedRanges(): Promise<Map<string, DateRange[]>> {
  const ranges = new Map<string, DateRange[]>();
  const today = todayManila();

  const add = (key: string, range: DateRange) => {
    const list = ranges.get(key);
    if (list) list.push(range);
    else ranges.set(key, [range]);
  };

  // 1) Mga inquiry (pickupDate hanggang returnDate)
  try {
    const docs = await runQuery({
      from: [{ collectionId: "inquiries" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "returnDate" },
          op: "GREATER_THAN_OR_EQUAL",
          value: { stringValue: today },
        },
      },
    });

    for (const d of docs) {
      const car = String(d.fields.carName ?? "").trim().toLowerCase();
      const end = String(d.fields.returnDate ?? "");
      if (!car || !DATE_RE.test(end)) continue;

      const pickup = String(d.fields.pickupDate ?? "");
      const start = DATE_RE.test(pickup) ? pickup : today;
      add(`name:${car}`, { start, end });
    }
  } catch (err) {
    console.error("getBookedRanges (inquiries) failed:", err);
  }

  // 2) Mga booking mula sa admin (startDate hanggang endDate)
  try {
    const docs = await runQuery({
      from: [{ collectionId: "bookings" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "endDate" },
          op: "GREATER_THAN",
          value: { timestampValue: new Date(Date.now() - DAY_MS).toISOString() },
        },
      },
    });

    for (const d of docs) {
      const data = d.fields;

      const status = String(data.status ?? "").trim().toLowerCase();
      if (INACTIVE_STATUSES.has(status)) continue;

      const startMs = data.startDate;
      const endMs = data.endDate;
      if (typeof startMs !== "number" || typeof endMs !== "number") continue;

      const range = { start: toManilaDate(startMs), end: toManilaDate(endMs) };

      if (typeof data.carName === "string" && data.carName.trim()) {
        add(`name:${data.carName.trim().toLowerCase()}`, range);
      }
      if (typeof data.carId === "string" && data.carId.trim()) {
        add(`id:${data.carId.trim().toLowerCase()}`, range);
      }
    }
  } catch (err) {
    console.error("getBookedRanges (bookings) failed:", err);
  }

  return ranges;
}