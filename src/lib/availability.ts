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