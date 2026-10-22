import { runQuery, docId } from "@/lib/firebase-admin";

export type Vehicle = {
  id: string;
  name: string;
  transmission: "Automatic" | "Manual";
  fuelType: string; // "Unleaded" | "Diesel" | "" kung hindi alam
  seats: number;
  goodFor: string;
  image: string;
  available: boolean;
};

// Fuel type batay sa pangalan ng kotse, kung walang `fuelType` field sa Firestore.
const FUEL_BY_MODEL: Array<[string, string]> = [
  ["avanza", "Unleaded"],
  ["vios", "Unleaded"],
  ["wigo", "Unleaded"],
  ["hiace", "Diesel"],
  ["innova", "Diesel"],
];

function resolveFuelType(name: string, raw: unknown): string {
  // 1) Kung may `fuelType` field sa Firestore, iyon ang uunahin.
  if (typeof raw === "string" && raw.trim()) {
    const v = raw.trim().toLowerCase();
    if (v.includes("diesel")) return "Diesel";
    if (v.includes("unleaded") || v.includes("gas")) return "Unleaded";
    return raw.trim();
  }

  // 2) Kung wala, hulaan batay sa pangalan.
  const lower = name.toLowerCase();
  for (const [model, fuel] of FUEL_BY_MODEL) {
    if (lower.includes(model)) return fuel;
  }
  return "";
}

// Mga booking status na HINDI humaharang sa kotse (libre na ulit).
const INACTIVE_STATUSES = new Set([
  "cancelled",
  "canceled",
  "rejected",
  "declined",
  "returned",
  "completed",
]);

const DAY_MS = 24 * 60 * 60 * 1000;

// Kinukuha ang mga kotseng may active booking ngayon, via Firestore REST API.
async function getBookedKeys(): Promise<Set<string>> {
  const booked = new Set<string>();

  try {
    const now = Date.now();

    const docs = await runQuery({
      from: [{ collectionId: "bookings" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "endDate" },
          op: "GREATER_THAN",
          value: { timestampValue: new Date(now - DAY_MS).toISOString() },
        },
      },
    });

    for (const doc of docs) {
      const data = doc.fields;

      const status = String(data.status ?? "").trim().toLowerCase();
      if (INACTIVE_STATUSES.has(status)) continue;

      const start = data.startDate as number | undefined;
      const end = data.endDate as number | undefined;
      if (typeof start !== "number" || typeof end !== "number") continue;

      if (start <= now && end + DAY_MS > now) {
        if (typeof data.carName === "string") {
          booked.add(`name:${data.carName.trim().toLowerCase()}`);
        }
        if (typeof data.carId === "string") {
          booked.add(`id:${data.carId.trim().toLowerCase()}`);
        }
      }
    }
  } catch (error) {
    console.error("Failed to check bookings for availability:", error);
  }

  return booked;
}

export async function getFleet(): Promise<Vehicle[]> {
  try {
    const [docs, booked] = await Promise.all([
      runQuery({
        from: [{ collectionId: "vehicles" }],
        orderBy: [{ field: { fieldPath: "order" }, direction: "ASCENDING" }],
      }),
      getBookedKeys(),
    ]);

    return docs.map((doc) => {
      const data = doc.fields;
      const id = docId(doc.name);
      const name = typeof data.name === "string" ? data.name : "";

      const isBooked =
        booked.has(`name:${name.trim().toLowerCase()}`) ||
        booked.has(`id:${id.trim().toLowerCase()}`);

      return {
        id,
        name,
        transmission: data.transmission === "Manual" ? "Manual" : "Automatic",
        fuelType: resolveFuelType(name, data.fuelType),
        seats: typeof data.seats === "number" ? data.seats : 0,
        goodFor: typeof data.goodFor === "string" ? data.goodFor : "",
        image: typeof data.image === "string" ? data.image : "",
        available: Boolean(data.available) && !isBooked,
      };
    });
  } catch (error) {
    console.error("Failed to load fleet from Firestore:", error);
    return [];
  }
}