"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/inquiries";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const result = await submitInquiry(new FormData(form));

    if (result.ok) {
      form.reset();
      setStatus("sent");
    } else {
      setErrorMsg(result.error);
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Contact Kenram Car Rental</h1>
        <p className="mt-3 text-gray-600">
          Send an inquiry and we&apos;ll confirm availability and rate.
        </p>
        <ul className="mt-6 space-y-2 text-gray-700">
          <li>📍 Isulan, Sultan Kudarat</li>
          <li>📞 0997-243-4914</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" required placeholder="Full name" className={inputClass} />
        <input name="phone" required placeholder="Phone number" className={inputClass} />
        <input name="email" type="email" placeholder="Email (optional)" className={inputClass} />
        <input name="date" type="date" className={inputClass} />
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Which vehicle and dates are you interested in?"
          className={inputClass}
        />
        {/* Honeypot — huwag alisin */}
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send inquiry"}
        </button>
        {status === "sent" && (
          <p className="text-green-600">Salamat! We&apos;ll get back to you soon.</p>
        )}
        {status === "error" && <p className="text-red-600">{errorMsg}</p>}
      </form>
    </section>
  );
}