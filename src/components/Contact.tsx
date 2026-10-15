"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/inquiries";

type Status = "idle" | "sending" | "sent" | "error";

function todayLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function Contact({ car = "" }: { car?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pickup, setPickup] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const result = await submitInquiry(new FormData(form));

    if (result.ok) {
      form.reset();
      setPickup("");
      setStatus("sent");
    } else {
      setErrorMsg(result.error);
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";
  const today = todayLocal();

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
        <div>
          <label htmlFor="name" className={labelClass}>Full name</label>
          <input id="name" name="name" required className={inputClass} />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>Phone number</label>
          <input id="phone" name="phone" type="tel" required className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email (optional)</label>
          <input id="email" name="email" type="email" className={inputClass} />
        </div>

        <div>
          <label htmlFor="destination" className={labelClass}>Destination</label>
          <input
            id="destination"
            name="destination"
            required
            placeholder="e.g. General Santos City"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pickupDate" className={labelClass}>Pick-up date</label>
            <input
              id="pickupDate"
              name="pickupDate"
              type="date"
              required
              min={today}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="returnDate" className={labelClass}>Return date</label>
            <input
              id="returnDate"
              name="returnDate"
              type="date"
              required
              min={pickup || today}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>Vehicle / notes (optional)</label>
          <textarea
            key={car}
            id="message"
            name="message"
            rows={3}
            defaultValue={car ? `Interested in ${car}` : ""}
            placeholder="Which vehicle are you interested in?"
            className={inputClass}
          />
        </div>

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