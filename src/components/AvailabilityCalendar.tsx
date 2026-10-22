"use client";

import { useState, type CSSProperties } from "react";
import type { DateRange } from "@/lib/availability";

type Props = {
  ranges: DateRange[]; // mga naka-book na petsa ng kotseng ito
  today: string; // YYYY-MM-DD (Asia/Manila), galing sa server
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Hanggang ilang buwan pasulong ang makikita
const MAX_MONTHS_AHEAD = 12;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function AvailabilityCalendar({ ranges, today }: Props) {
  const [ty, tm] = today.split("-").map(Number);
  const [offset, setOffset] = useState(0); // 0 = kasalukuyang buwan

  const monthIndex = tm - 1 + offset;
  const year = ty + Math.floor(monthIndex / 12);
  const month = ((monthIndex % 12) + 12) % 12;

  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: Array<number | null> = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isBooked = (date: string) => ranges.some((r) => r.start <= date && date <= r.end);

  return (
    <div className="font-body">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((o) => o - 1)}
          disabled={offset === 0}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-navy">
          {MONTHS[month]} {year}
        </p>
        <button
          type="button"
          onClick={() => setOffset((o) => o + 1)}
          disabled={offset >= MAX_MONTHS_AHEAD}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-[10px] font-medium uppercase text-muted">
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;

          const date = `${year}-${pad(month + 1)}-${pad(day)}`;
          const isPast = date < today;
          const booked = !isPast && isBooked(date);
          const isToday = date === today;

          let style: CSSProperties = {};
          let label = "";
          let textClass = "text-ink";

          if (isPast) {
            textClass = "text-muted opacity-40";
          } else if (booked) {
            style = { backgroundColor: "#fee2e2", color: "#b91c1c" };
            label = "Booked";
            textClass = "";
          } else {
            style = {
              backgroundColor: "color-mix(in srgb, var(--color-available) 14%, white)",
              color: "var(--color-available)",
            };
            label = "Available";
            textClass = "";
          }

          return (
            <div
              key={date}
              style={style}
              title={isPast ? "" : booked ? "Booked" : "Available"}
              className={`flex aspect-square flex-col items-center justify-center rounded-md leading-none ${textClass} ${
                isToday ? "ring-1 ring-navy" : ""
              }`}
            >
              <span className="text-xs font-medium">{day}</span>
              {label && <span className="mt-0.5 text-[7px] font-medium">{label}</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: "var(--color-available)" }}
          />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: "#b91c1c" }} />
          Booked
        </span>
      </div>
    </div>
  );
}