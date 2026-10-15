"use server";

import { createDocument } from "@/lib/firebase-admin";

export type InquiryResult = { ok: true } | { ok: false; error: string };

function clean(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  // Honeypot: tinatago sa tao, pinupunan ng bots.
  if (clean(formData.get("website"), 100)) return { ok: true };

  const name = clean(formData.get("name"), 100);
  const phone = clean(formData.get("phone"), 30);
  const email = clean(formData.get("email"), 120);
  const destination = clean(formData.get("destination"), 150);
  const pickupDate = clean(formData.get("pickupDate"), 10);
  const returnDate = clean(formData.get("returnDate"), 10);
  const message = clean(formData.get("message"), 1000);

  if (!name || !phone || !destination) {
    return { ok: false, error: "Pakilagay ang pangalan, phone, at destination." };
  }

  if (!DATE_RE.test(pickupDate) || !DATE_RE.test(returnDate)) {
    return { ok: false, error: "Pakilagay ang pick-up date at return date." };
  }

  if (returnDate < pickupDate) {
    return { ok: false, error: "Hindi puwedeng mas maaga ang return date kaysa pick-up date." };
  }

  try {
    await createDocument("inquiries", {
      name,
      phone,
      email,
      destination,
      pickupDate,
      returnDate,
      message,
      createdAt: new Date(),
    });
    return { ok: true };
  } catch (err) {
    console.error("submitInquiry failed:", err);
    return { ok: false, error: "May error sa pagpapadala. Subukan ulit o tumawag sa 0997-243-4914." };
  }
}