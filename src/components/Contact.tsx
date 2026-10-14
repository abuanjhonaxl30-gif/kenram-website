"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      // TODO: ikonekta sa src/lib/inquiries.ts (server action o API route)
      console.log("Inquiry:", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      form.reset();
      setStatus("sent");
    } catch {
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
          <li>📞 0900-000-0000</li>
          <li>✉️ hello@example.com</li>
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
        {status === "error" && (
          <p className="text-red-600">May error. Please try again.</p>
        )}
      </form>
    </section>
  );
}