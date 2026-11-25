"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SPONSOR_PRICING } from "@/lib/config/pricing";
import { formatUsd } from "@/lib/utils";

export function SponsorBooking({ eventTitle }: { eventTitle?: string }) {
  const noticeId = useId();
  const panel = useRef<HTMLElement>(null);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(0);
  const [invalidField, setInvalidField] = useState("");
  const [step, setStep] = useState(0),
    [channel, setChannel] = useState(eventTitle ? "event" : "site"),
    [tier, setTier] = useState("official");
  const [placement, setPlacement] = useState("sidebar"),
    [breed, setBreed] = useState("French Bulldog"),
    [page, setPage] = useState("/breeds/french-bulldog"),
    [month, setMonth] = useState("2026-12");
  const [company, setCompany] = useState(""),
    [email, setEmail] = useState(""),
    [proposal, setProposal] = useState(""),
    [creative, setCreative] = useState(false),
    [until, setUntil] = useState(0),
    [now, setNow] = useState(0),
    [notice, setNotice] = useState("");
  const [decision, setDecision] = useState("proposition"),
    [queued, setQueued] = useState(false);
  const steps = [
    "Channel",
    "Placement",
    "Company",
    "Creative",
    "Payment preview",
    "Review",
    "Workspace",
  ];
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const held = until > now && until > 0;
  useEffect(() => {
    if (previousStep.current !== step) {
      stepTitle.current?.focus();
      previousStep.current = step;
    }
  }, [step]);
  function fail(field: string, message: string) {
    setInvalidField(field);
    setNotice(message);
    panel.current
      ?.querySelector<HTMLElement>(`[data-field="${field}"]`)
      ?.focus();
  }
  const price =
    channel === "site"
      ? SPONSOR_PRICING.site.find((p) => p.id === tier)?.monthlyUsd
      : SPONSOR_PRICING.event.find((p) => p.id === tier)?.amountUsd;
  function next() {
    if (
      step === 1 &&
      (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
        month < new Date().toISOString().slice(0, 7) ||
        !breed.trim() ||
        !page)
    ) {
      fail(
        !breed.trim() ? "breed" : "month",
        "Select a breed, a current or future month and an allowed page.",
      );
      return;
    }
    if (
      step === 2 &&
      (!company.trim() ||
        !/^\S+@\S+\.\S+$/.test(email) ||
        (channel === "event" && !proposal.trim()))
    ) {
      fail(
        !company.trim()
          ? "company"
          : !/^\S+@\S+\.\S+$/.test(email)
            ? "email"
            : "proposal",
        "Enter a company, a valid email and an event proposal when applicable.",
      );
      return;
    }
    if (step === 3 && !creative) {
      fail("creative", "Choose one creative file to review locally.");
      return;
    }
    if (step === 1) {
      setNow(Date.now());
      setUntil(Date.now() + 15 * 60000);
    }
    if (step >= 4 && !held) {
      setStep(1);
      setNotice("Your local hold expired. Choose the placement again.");
      return;
    }
    setNotice("");
    setInvalidField("");
    setStep(Math.min(6, step + 1));
  }
  return (
    <section ref={panel} className="surface p-5 sm:p-7">
      <h2 className="font-display text-2xl">Reserve a defined placement</h2>
      <p className="my-3 text-sm text-muted">
        Interactive local simulation. Availability, holds and decisions are
        samples; no inventory is reserved, no creative uploaded and no payment
        taken.
      </p>
      <ol className="my-5 flex flex-wrap gap-2 text-xs">
        {steps.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? "step" : undefined}
            className={`rounded-full px-3 py-2 ${i === step ? "bg-navy-700 text-white" : "bg-cream-100 text-ink"}`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      <h3 ref={stepTitle} tabIndex={-1} className="mb-4 text-lg">
        {steps[step]}
      </h3>
      {step === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Channel
            <select
              className="form-input"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="site">Website placement / month</option>
              <option value="event">Event proposal</option>
            </select>
          </label>
          <label className="field-label">
            Tier
            <select
              className="form-input"
              value={tier}
              onChange={(e) => {
                setTier(e.target.value);
                if (e.target.value !== "premium") setPlacement("sidebar");
              }}
            >
              <option value="official">Official</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <p>
            {formatUsd(price ?? 0)} {channel === "site" ? "/ month" : "/ event"}
          </p>
        </div>
      ) : null}
      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field-label">
              Breed
              <input
                className="form-input"
                value={breed}
                data-field="breed"
                aria-invalid={invalidField === "breed"}
                aria-describedby={
                  invalidField === "breed" ? noticeId : undefined
                }
                onChange={(e) => setBreed(e.target.value)}
              />
            </label>
            <label className="field-label">
              Allowed page
              <select
                className="form-input"
                value={page}
                onChange={(e) => setPage(e.target.value)}
              >
                {[
                  "/breeds/french-bulldog",
                  "/",
                  "/studs",
                  "/map",
                  "/pet-services",
                  "/compare/insurance",
                  "/blog",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Format
              <select
                className="form-input"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
              >
                <option value="sidebar">Sidebar 300 × 250</option>
                <option value="topBanner" disabled={tier !== "premium"}>
                  Top banner 728 × 90 (Premium)
                </option>
                <option value="pin" disabled={tier !== "premium"}>
                  Gold map pin (Premium)
                </option>
              </select>
            </label>
            <label className="field-label">
              Month
              <input
                className="form-input"
                type="month"
                data-field="month"
                aria-invalid={invalidField === "month"}
                aria-describedby={
                  invalidField === "month" ? noticeId : undefined
                }
                min={new Date().toISOString().slice(0, 7)}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>
          </div>
          <div
            aria-label="Sample placement calendar"
            className="grid grid-cols-7 gap-2"
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="text-center text-xs font-semibold">
                {day}
              </span>
            ))}
            {Array.from(
              {
                length: /^\d{4}-\d{2}$/.test(month)
                  ? new Date(`${month}-01T12:00:00Z`).getUTCDay()
                  : 0,
              },
              (_, i) => (
                <span key={`blank-${i}`} aria-hidden="true" />
              ),
            )}
            {Array.from(
              {
                length: /^\d{4}-\d{2}$/.test(month)
                  ? new Date(
                      Date.UTC(
                        Number(month.slice(0, 4)),
                        Number(month.slice(5, 7)),
                        0,
                      ),
                    ).getUTCDate()
                  : 0,
              },
              (_, i) => (
                <span
                  key={i}
                  title={`${month}-${String(i + 1).padStart(2, "0")}: illustrative availability only`}
                  className={`min-w-0 rounded-lg px-0.5 py-2 text-center text-[10px] sm:text-xs ${i < 3 ? "bg-cream-100" : i === 10 || i === 11 ? "bg-danger-50 text-danger-700" : "bg-success-50 text-success-700"}`}
                >
                  {i + 1}
                  <br />
                  {i < 3
                    ? "Unavailable"
                    : i === 10 || i === 11
                      ? "Taken"
                      : "Free"}
                </span>
              ),
            )}
          </div>
          <p className="text-xs text-muted">
            Illustrative day colours. Reservation unit: one complete calendar
            month per breed, page and format. Server-side availability remains
            unconnected.
          </p>
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={queued}
              onChange={(e) => setQueued(e.target.checked)}
            />
            Join the local wait-list preview if this placement is taken
          </label>
        </div>
      ) : null}
      {step === 2 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Company
            <input
              className="form-input"
              value={company}
              data-field="company"
              aria-invalid={invalidField === "company"}
              aria-describedby={
                invalidField === "company" ? noticeId : undefined
              }
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
          <label className="field-label">
            Contact email
            <input
              className="form-input"
              type="email"
              data-field="email"
              aria-invalid={invalidField === "email"}
              aria-describedby={invalidField === "email" ? noticeId : undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {channel === "event" ? (
            <label className="field-label sm:col-span-2">
              Proposal for {eventTitle ?? "the club event"}
              <textarea
                className="form-input resize-none"
                rows={4}
                data-field="proposal"
                aria-invalid={invalidField === "proposal"}
                aria-describedby={
                  invalidField === "proposal" ? noticeId : undefined
                }
                value={proposal}
                onChange={(e) => {
                  setProposal(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </label>
          ) : null}
        </div>
      ) : null}
      {step === 3 ? (
        <label className="field-label">
          Creative image (PNG/JPG, max 10 MB)
          <input
            className="form-input"
            type="file"
            data-field="creative"
            aria-invalid={invalidField === "creative"}
            aria-describedby={
              invalidField === "creative" ? noticeId : undefined
            }
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const f = e.target.files?.[0];
              const valid =
                !!f &&
                f.size <= 10 * 1024 * 1024 &&
                ["image/png", "image/jpeg"].includes(f.type);
              setCreative(valid);
              setInvalidField(valid ? "" : "creative");
              setNotice(
                valid
                  ? "Creative selected locally — not uploaded."
                  : "Select PNG/JPG up to 10 MB.",
              );
            }}
          />
        </label>
      ) : null}
      {step === 4 ? (
        <div className="rounded-xl bg-cream-50 p-5">
          <p className="font-semibold">
            {formatUsd(price ?? 0)} · payment not connected
          </p>
          <p className="my-2 text-sm">
            No card details collected. Website subscriptions renew monthly in
            production, with a reminder seven days before renewal. An event
            payment would be held pending the club decision.
          </p>
          {channel === "event" && <p className="text-sm">{SPONSOR_PRICING.eventSplitLabel}</p>}
        </div>
      ) : null}
      {step === 5 ? (
        <div className="space-y-3 text-sm">
          <p>
            {company} · {breed} · {page} · {placement} · {month}
          </p>
          <p>
            Creative review: awaiting administrator. Payment: not taken.
            Campaign: not active.
          </p>
          <p>
            Club acceptance deadline: seven days after the production proposal.
            Refusal or no response triggers a full refund. Negotiation happens
            by direct email.
          </p>
          <p>
            Local hold remaining: {Math.max(0, Math.ceil((until - now) / 1000))}{" "}
            seconds.
          </p>
        </div>
      ) : null}
      {step === 6 ? (
        <div className="space-y-4">
          <p className="font-semibold">Draft campaign ready — not submitted</p>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              "Views",
              "Clicks",
              "CTR",
              "Conversions",
              "Cost / click",
              "Cost / conversion",
              "Top pages / breeds",
              "Tickets / attendees",
            ].map((x) => (
              <div className="rounded-xl bg-cream-50 p-3" key={x}>
                <p className="text-xs text-muted">{x}</p>
                <p className="mt-2">No measured data</p>
              </div>
            ))}
          </div>
          {channel === "event" ? (
            <>
              <p className="text-sm">
                Sponsor email: {email} (local entry). Club email: unavailable
                until an authorized production proposal exists. No chat is
                stored.
              </p>
              <label className="field-label">
                Simulate club decision
                <select
                  className="form-input"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <option value="proposition">Proposal pending</option>
                  <option value="accepted">Accepted - full sponsorship amount to the club</option>
                  <option value="refused">Refused — 100% refund due</option>
                  <option value="expired">
                    Expired after 7 days — 100% refund due
                  </option>
                  <option value="negotiation">Negotiate by direct email</option>
                </select>
              </label>
              <p role="status">
                {decision} · sample state only; no money moved.
              </p>
            </>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setStep(3)}>
              Change creative
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setUntil(0);
                setStep(1);
              }}
            >
              Extend / choose next month
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setStep(0);
                setUntil(0);
                setNotice(
                  "Local campaign draft cancelled. No subscription existed.",
                );
              }}
            >
              Cancel local draft
            </Button>
            <Button disabled>Export CSV / PDF — no measured data</Button>
          </div>
        </div>
      ) : null}
      {notice ? (
        <p
          id={noticeId}
          role={invalidField ? "alert" : "status"}
          className="my-4 rounded-xl bg-info-50 p-3 text-sm"
        >
          {notice}
        </p>
      ) : null}
      {step < 6 ? (
        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
          <Button onClick={next}>
            {step === 5 ? "Create local campaign draft" : "Continue"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
