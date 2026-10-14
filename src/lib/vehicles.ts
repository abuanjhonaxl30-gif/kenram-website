import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";

export type Vehicle = {
  id: string;
  name: string;
  transmission: "Automatic" | "Manual";
  seats: number;
  goodFor: string;
  image: string;
  available: boolean;
};

// Mga booking status na HINDI humaharang sa kotse (libre na ulit).
// Lahat ng iba (pending, confirmed, active, etc.) = booked.
const INACTIVE_STATUSES = new Set([
  "cancelled",
  "canceled",
  "rejected",
  "declined",
  "returned",
  "completed",
]);

const DAY_MS = 24 * 60 * 60 * 1000;

// Kinukuha ang mga kotseng may active booking ngayon.
async function getBookedKeys(): Promise<Set<string>> {
  const booked = new Set<string>();

  try {
    const now = Date.now();
    const snapshot = await getAdminDb()
      .collection("bookings")
      .where("endDate", ">", Timestamp.fromMillis(now - DAY_MS))
      .get();

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const status = String(data.status ?? "").trim().toLowerCase();
      if (INACTIVE_STATUSES.has(status)) continue;

      const start = data.startDate?.toMillis?.();
      const end = data.endDate?.toMillis?.();
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

// Ginagamit ang Admin SDK dito (hindi ang client `firebase/firestore`)
// dahil server-side ito laging tumatakbo (build time at bawat request).
// Ang client Web SDK ay dinisenyo para sa browser, at kapag paulit-ulit
// itong ginamit sa Node.js server, nag-iiwan ito ng mga bukas na
// koneksyon na nagdudulot ng memory buildup at posibleng OOM crash
// habang nagbu-build.
export async function getFleet(): Promise<Vehicle[]> {
  try {
    const [snapshot, booked] = await Promise.all([
      getAdminDb().collection("vehicles").orderBy("order", "asc").get(),
      getBookedKeys(),
    ]);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const name = typeof data.name === "string" ? data.name : "";

      const isBooked =
        booked.has(`name:${name.trim().toLowerCase()}`) ||
        booked.has(`id:${doc.id.trim().toLowerCase()}`);

      return {
        id: doc.id,
        name,
        transmission: data.transmission === "Manual" ? "Manual" : "Automatic",
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