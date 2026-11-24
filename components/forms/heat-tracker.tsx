"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { DamSummary, HeatWindow } from "@/lib/types/domain";
import { addDays, formatDate } from "@/lib/utils";

interface HeatTrackerProps {
  dam: DamSummary;
  studNames: string[];
  referenceDate: string;
}

interface LocalMating {
  id: string;
  date: string;
  studName: string;
}

const HEAT_DAYS = 14;
const GESTATION_DAYS = 63;

/**
 * Local heat-calendar demonstration.
 *
 * Entries stay in component state. Nothing is saved, no notification is sent,
 * and a recorded mating never confirms a pregnancy. The calendar is private and
 * only shown inside the authenticated (demo) workspace.
 */
export function HeatTracker({ dam, studNames, referenceDate }: HeatTrackerProps) {
  const [heats, setHeats] = useState<HeatWindow[]>(dam.heatHistory);
  const [matings, setMatings] = useState<LocalMating[]>(dam.matings);
  const [heatDate, setHeatDate] = useState(referenceDate);
  const [matingDate, setMatingDate] = useState(referenceDate);
  const [studName, setStudName] = useState(studNames[0] ?? "");
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const latestHeat = [...heats].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
  const nextHeat = latestHeat ? addDays(latestHeat.startDate, dam.cycleLengthDays) : undefined;
  const latestMating = [...matings].sort((a, b) => b.date.localeCompare(a.date))[0];
  const dueDate = latestMating ? addDays(latestMating.date, GESTATION_DAYS) : undefined;

  const startMonth = latestHeat
    ? new Date(`${latestHeat.startDate.slice(0, 7)}-01T00:00:00Z`)
    : new Date(`${referenceDate.slice(0, 7)}-01T00:00:00Z`);
  const months = [0, 1, 2].map((offset) => {
    const date = new Date(Date.UTC(startMonth.getUTCFullYear(), startMonth.getUTCMonth() + offset, 1));
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
  });

  function dayStatus(iso: string): "heat" | "mating" | "due" | "today" | null {
    if (dueDate === iso) return "due";
    if (matings.some((entry) => entry.date === iso)) return "mating";
    if (heats.some((entry) => iso >= entry.startDate && iso <= entry.endDate)) return "heat";
    if (iso === referenceDate) return "today";
    return null;
  }

  function logHeat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (!heatDate) {
      setError("Choose the first day of the heat.");
      return;
    }
    if (heatDate > referenceDate) {
      setError("The heat date cannot be in the future.");
      return;
    }
    const newHeat: HeatWindow = {
      id: `heat-${Date.now()}`,
      startDate: heatDate,
      endDate: addDays(heatDate, HEAT_DAYS - 1),
    };
    setHeats((current) => [...current, newHeat]);
    setNotice(`Heat recorded for ${formatDate(heatDate)}. This is a local demo entry only.`);
  }

  function logMating(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (!matingDate) {
      setError("Choose the mating date.");
      return;
    }
    if (matingDate > referenceDate) {
      setError("The mating date cannot be in the future.");
      return;
    }
    const newMating: LocalMating = {
      id: `mating-${Date.now()}`,
      date: matingDate,
      studName: studName || "Stud not specified",
    };
    setMatings((current) => [...current, newMating]);
    setNotice(
      `Mating recorded for ${formatDate(matingDate)}. The due date shown below is an estimate; it does not confirm pregnancy.`,
    );
  }

  function resetDemo() {
    setHeats(dam.heatHistory);
    setMatings(dam.matings);
    setNotice(undefined);
    setError(undefined);
  }

  return (
    <div className="space-y-6">
      <Alert tone="info" title="Private by default · local demo entries">
        This calendar is not public. Entries you add below are held in the browser only, are not saved
        to a server and disappear on refresh. A recorded mating is not a pregnancy confirmation.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Last recorded heat</p>
          <p className="mt-1 font-display text-xl text-navy-900">
            {latestHeat ? formatDate(latestHeat.startDate) : "Not recorded"}
          </p>
          <p className="mt-1 text-[10px] text-muted">{dam.cycleLengthDays}-day cycle setting</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Next heat estimate</p>
          <p className="mt-1 font-display text-xl text-navy-900">{nextHeat ? formatDate(nextHeat) : "—"}</p>
          <p className="mt-1 text-[10px] text-muted">Estimate only, not a confirmed date.</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Due date estimate</p>
          <p className="mt-1 font-display text-xl text-navy-900">{dueDate ? formatDate(dueDate) : "No mating recorded"}</p>
          <p className="mt-1 text-[10px] text-muted">Mating + {GESTATION_DAYS} days. Not a diagnosis.</p>
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-navy-900">Calendar</h2>
            <p className="mt-1 text-sm text-muted">Heat windows, recorded matings and an estimated due date.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-[10px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-danger-600" /> Heat
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-navy-700" /> Mating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-plum-600" /> Estimated due
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {months.map(({ year, month }) => {
            const firstDay = new Date(Date.UTC(year, month, 1));
            const dayCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
            const leading = firstDay.getUTCDay();
            const label = new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }).format(firstDay);

            return (
              <div key={`${year}-${month}`}>
                <p className="text-sm font-semibold text-navy-900">{label}</p>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <span key={`${day}-${index}`} aria-hidden="true">
                      {day}
                    </span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {Array.from({ length: leading }).map((_, index) => (
                    <span key={`blank-${index}`} aria-hidden="true" />
                  ))}
                  {Array.from({ length: dayCount }, (_, index) => {
                    const day = index + 1;
                    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const status = dayStatus(iso);
                    const labels = {
                      heat: "heat",
                      mating: "mating",
                      due: "estimated due date",
                      today: "today",
                    } as const;
                    const label = status ? labels[status] : "no entry";
                    return (
                      <span
                        key={iso}
                        title={`${formatDate(iso)} — ${label}`}
                        aria-label={`${formatDate(iso)}: ${label}`}
                        className={
                          status === "due"
                            ? "tabular grid h-8 place-items-center rounded-md bg-plum-600 text-[11px] font-semibold text-white"
                            : status === "mating"
                              ? "tabular grid h-8 place-items-center rounded-md bg-navy-700 text-[11px] font-semibold text-white"
                              : status === "heat"
                                ? "tabular grid h-8 place-items-center rounded-md bg-danger-50 text-[11px] font-medium text-danger-700 ring-1 ring-inset ring-danger-600/30"
                                : status === "today"
                                  ? "tabular grid h-8 place-items-center rounded-md border border-orange-500 bg-orange-50 text-[11px] font-semibold text-orange-800"
                                  : "tabular grid h-8 place-items-center rounded-md text-[11px] text-muted"
                        }
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          The 182-day cycle and the 63-day due estimate are defaults for this sample. They are not a
          diagnosis and do not replace a veterinarian&apos;s assessment.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={logHeat} className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-xl text-navy-900">Log a heat</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            The first day of the heat. A 14-day sample window is added for display.
          </p>
          <div className="mt-3">
            <label htmlFor="heat-date" className="field-label">
              First day
            </label>
            <input
              id="heat-date"
              type="date"
              value={heatDate}
              max={referenceDate}
              onChange={(event) => setHeatDate(event.target.value)}
              className="form-input"
            />
          </div>
          <Button type="submit" size="sm" className="mt-3" iconRight={<Icon name="plus" className="h-3.5 w-3.5" />}>
            Add local heat
          </Button>
        </form>

        <form onSubmit={logMating} className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-xl text-navy-900">Log a mating</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            A mating is recorded separately from a pregnancy confirmation.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="mating-date" className="field-label">
                Date
              </label>
              <input
                id="mating-date"
                type="date"
                value={matingDate}
                max={referenceDate}
                onChange={(event) => setMatingDate(event.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="mating-stud" className="field-label">
                Stud
              </label>
              <select
                id="mating-stud"
                value={studName}
                onChange={(event) => setStudName(event.target.value)}
                className="form-input"
              >
                {studNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" size="sm" className="mt-3" iconRight={<Icon name="plus" className="h-3.5 w-3.5" />}>
            Add local mating
          </Button>
        </form>
      </div>

      {error ? (
        <p className="rounded-xl border border-danger-600/20 bg-danger-50 p-3 text-[12px] text-danger-700" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="rounded-xl border border-info-600/20 bg-info-50 p-3 text-[12px] text-info-700" role="status">
          {notice}
        </p>
      ) : null}

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl text-navy-900">Recorded entries</h2>
          <button type="button" onClick={resetDemo} className="text-[11px] font-semibold text-muted underline underline-offset-2">
            Reset demo entries
          </button>
        </div>
        <ul className="mt-3 space-y-2 text-[12px]">
          {[...heats]
            .sort((a, b) => b.startDate.localeCompare(a.startDate))
            .map((heat) => (
              <li key={heat.id} className="flex items-center justify-between gap-3 rounded-lg bg-cream-50 p-2.5">
                <span className="text-muted">
                  Heat · {formatDate(heat.startDate)} → {formatDate(heat.endDate)}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-danger-700">Recorded</span>
              </li>
            ))}
          {[...matings]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((mating) => (
              <li key={mating.id} className="flex items-center justify-between gap-3 rounded-lg bg-cream-50 p-2.5">
                <span className="text-muted">
                  Mating · {formatDate(mating.date)} · {mating.studName}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-navy-700">Recorded</span>
              </li>
            ))}
          {heats.length === 0 && matings.length === 0 ? (
            <li className="text-[12px] text-muted">No entries.</li>
          ) : null}
        </ul>
        <div className="mt-3 flex flex-wrap gap-3 border-t border-line pt-3 text-[11px]">
          <Link href="/dashboard/listings" className="font-semibold text-navy-800 underline underline-offset-2">
            Link a litter later
          </Link>
          <Link href="/dashboard/animals" className="font-semibold text-navy-800 underline underline-offset-2">
            Back to My Animals
          </Link>
          <span className="inline-flex items-center gap-1 text-muted">
            <Icon name="lock" className="h-3 w-3" />
            Saving and notifications are not connected
          </span>
        </div>
      </section>
    </div>
  );
}
