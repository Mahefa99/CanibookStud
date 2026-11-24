"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FileDropzone } from "@/components/forms/file-dropzone";
import {
  CheckboxField,
  FormErrorSummary,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/fields";
import { DEMO_CLUBS } from "@/lib/data/demo/clubs";
import { US_STATES } from "@/lib/data/us-states";
import { formatUsd, hashString } from "@/lib/utils";

const TIME_ZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
];

interface EventDraft {
  title: string;
  clubSlug: string;
  date: string;
  time: string;
  timeZone: string;
  locationName: string;
  address: string;
  city: string;
  stateCode: string;
  capacity: string;
  ticketPrice: string;
  description: string;
  sponsorTier: "none" | "official" | "premium";
}

const EMPTY: EventDraft = {
  title: "",
  clubSlug: DEMO_CLUBS[0]?.slug ?? "",
  date: "",
  time: "18:00",
  timeZone: "America/New_York",
  locationName: "",
  address: "",
  city: "",
  stateCode: "",
  capacity: "100",
  ticketPrice: "25",
  description: "",
  sponsorTier: "none",
};

export function EventCreateForm() {
  const [draft, setDraft] = useState<EventDraft>(EMPTY);
  const [image, setImage] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof EventDraft>(field: K, value: EventDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  const total = Number(draft.ticketPrice) + 2;

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.title.trim()) next.title = "Enter an event title.";
    if (!draft.clubSlug) next.clubSlug = "Select the organising club.";
    if (!draft.date) next.date = "Choose a date.";
    if (!draft.time) next.time = "Choose a start time.";
    if (!draft.locationName.trim()) next.locationName = "Enter the venue name.";
    if (!draft.address.trim()) next.address = "Enter the address.";
    if (!draft.city.trim()) next.city = "Enter the city.";
    if (!draft.stateCode) next.stateCode = "Select a state.";
    const capacity = Number(draft.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 1000) next.capacity = "Use 1 to 1,000 tickets.";
    const price = Number(draft.ticketPrice);
    if (!Number.isFinite(price) || price < 0 || price > 500) next.ticketPrice = "Use a ticket price from $0 to $500.";
    if (!draft.description.trim() || draft.description.trim().length < 40) {
      next.description = "Write at least 40 characters about the event.";
    }
    if (!consent) next.consent = "Confirm the review and no-payment statements.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("event-create-errors")?.focus();
      return false;
    }
    return true;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    const reference = `EVT-2026-${1000 + (hashString(draft.title + draft.date) % 9000)}`;
    const club = DEMO_CLUBS.find((entry) => entry.slug === draft.clubSlug);
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-orange-100 text-orange-700">
          <Icon name="calendar" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700">
          Submitted for review · demo only
        </p>
        <h2 className="mt-1 font-display text-2xl text-navy-900">{draft.title} is in the review queue</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          No event was published, no ticket was created and no sponsorship payment was taken. The
          sample state is “in review”; ticket sales are closed.
        </p>
        <dl className="mt-4 space-y-2 rounded-xl bg-cream-50 p-4 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="tabular font-semibold text-ink">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Club</dt>
            <dd className="font-medium text-ink">{club?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Ticket</dt>
            <dd className="tabular font-medium text-ink">
              {formatUsd(Number(draft.ticketPrice))} + {formatUsd(2)} = {formatUsd(total)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Sponsor interest</dt>
            <dd className="font-medium text-ink">{draft.sponsorTier === "none" ? "None" : draft.sponsorTier}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="warning">In review</Badge>
          <Badge tone="neutral">No ticket sales</Badge>
          <Badge tone="neutral">No payment</Badge>
        </div>
        <Alert tone="info" className="mt-4" title="What review checks">
          Club authority, venue details, capacity, time zone and ticket terms. A sponsor creative would
          be a separate review and contract.
        </Alert>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/events" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-4 text-sm font-semibold text-white">
            Event workspace
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
          <Link href="/events" className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800">
            Public events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div id="event-create-errors" tabIndex={-1}>
        <FormErrorSummary
          errors={Object.entries(errors).map(([fieldId, message]) => ({ fieldId, message }))}
        />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Event</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="title"
            name="title"
            label="Event title"
            required
            value={draft.title}
            onChange={(event) => update("title", event.target.value)}
            error={errors.title}
            className="sm:col-span-2"
          />
          <SelectField
            id="clubSlug"
            name="clubSlug"
            label="Organising club"
            required
            value={draft.clubSlug}
            onChange={(event) => update("clubSlug", event.target.value)}
            error={errors.clubSlug}
            options={DEMO_CLUBS.map((club) => ({ value: club.slug, label: club.name }))}
          />
          <SelectField
            id="timeZone"
            name="timeZone"
            label="Time zone"
            required
            value={draft.timeZone}
            onChange={(event) => update("timeZone", event.target.value)}
            options={TIME_ZONES}
          />
          <TextField
            id="event-date"
            name="date"
            type="date"
            label="Date"
            required
            value={draft.date}
            onChange={(event) => update("date", event.target.value)}
            error={errors.date}
          />
          <TextField
            id="event-time"
            name="time"
            type="time"
            label="Start time"
            required
            value={draft.time}
            onChange={(event) => update("time", event.target.value)}
            error={errors.time}
          />
          <TextField
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            max="1000"
            label="Capacity"
            required
            value={draft.capacity}
            onChange={(event) => update("capacity", event.target.value)}
            error={errors.capacity}
          />
          <TextField
            id="ticketPrice"
            name="ticketPrice"
            type="number"
            min="0"
            max="500"
            label="Ticket price (USD)"
            required
            prefix="$"
            value={draft.ticketPrice}
            onChange={(event) => update("ticketPrice", event.target.value)}
            error={errors.ticketPrice}
            hint={`+ $2 platform fee = ${formatUsd(total)} total.`}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="locationName"
            name="locationName"
            label="Venue"
            required
            value={draft.locationName}
            onChange={(event) => update("locationName", event.target.value)}
            error={errors.locationName}
          />
          <TextField
            id="address"
            name="address"
            label="Address"
            required
            value={draft.address}
            onChange={(event) => update("address", event.target.value)}
            error={errors.address}
          />
          <TextField
            id="city"
            name="city"
            label="City"
            required
            value={draft.city}
            onChange={(event) => update("city", event.target.value)}
            error={errors.city}
          />
          <SelectField
            id="stateCode"
            name="stateCode"
            label="State"
            required
            value={draft.stateCode}
            onChange={(event) => update("stateCode", event.target.value)}
            error={errors.stateCode}
            placeholder="Select a state"
            options={US_STATES.map((state) => ({ value: state.code, label: state.name }))}
          />
        </div>

        <div className="mt-4">
          <TextareaField
            id="description"
            name="description"
            label="About the event"
            required
            rows={4}
            value={draft.description}
            onChange={(event) => update("description", event.target.value.slice(0, 1000))}
            error={errors.description}
            hint={`${draft.description.length}/1000 characters. Minimum 40.`}
          />
        </div>

        <div className="mt-4">
          <FileDropzone
            id="event-image"
            label="Event image"
            hint="Local preview only. JPG, PNG or WebP."
            files={image}
            onChange={setImage}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Sponsorship interest</h2>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          A sponsor can express interest here. Creative approval and payment are separate. The
          announced 50/50 split is not a contract.
        </p>
        <div className="mt-3">
          <SelectField
            id="sponsorTier"
            name="sponsorTier"
            label="Sponsor tier"
            value={draft.sponsorTier}
            onChange={(event) => update("sponsorTier", event.target.value as EventDraft["sponsorTier"])}
            options={[
              { value: "none", label: "No sponsor yet" },
              { value: "official", label: "Official event · $149" },
              { value: "premium", label: "Premium event · $400" },
            ]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <CheckboxField
          id="consent"
          name="consent"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          error={errors.consent}
          required
          label="I confirm the event details are accurate, that no ticket is issued in this preview, and that no payment is collected."
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-sm text-[10px] leading-relaxed text-muted">
          No ticket inventory, QR code or sponsor payment is created.
        </p>
        <Button type="submit" size="lg" iconRight={<Icon name="arrow-right" className="h-4 w-4" />}>
          Submit event for review
        </Button>
      </div>
    </form>
  );
}
