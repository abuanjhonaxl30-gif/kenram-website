"use server";

import { createDocument } from "@/lib/firebase-admin";

export type InquiryResult = { ok: true } | { ok: false; error: string };

function clean(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  // Honeypot: tinatago sa tao, pinupunan ng bots.
  if (clean(formData.get("website"), 100)) return { ok: true };

  const name = clean(formData.get("name"), 100);
  const phone = clean(formData.get("phone"), 30);
  const email = clean(formData.get("email"), 120);
  const date = clean(formData.get("date"), 20);
  const message = clean(formData.get("message"), 1000);

  if (!name || !phone || !message) {
    return { ok: false, error: "Pakilagay ang pangalan, phone, at mensahe." };
  }

  try {
    await createDocument("inquiries", {
      name,
      phone,
      email,
      date,
      message,
      createdAt: new Date(),
    });
    return { ok: true };
  } catch (err) {
    console.error("submitInquiry failed:", err);
    return { ok: false, error: "May error sa pagpapadala. Subukan ulit o tumawag sa 0997-243-4914." };
  }
}