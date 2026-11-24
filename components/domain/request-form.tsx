"use client";

import { STUD_PRICING } from "@/lib/config/pricing";

import { useRef, useState } from "react";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import {
  CheckboxField,
  FormErrorSummary,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/fields";
import { Icon } from "@/components/ui/icon";
import type { DamSummary } from "@/lib/types/domain";

interface RequestFormProps {
  studName: string;
  studSlug: string;
  dams: DamSummary[];
  referenceDate: string;
}

/**
 * Demo request form.
 *
 * No network call is made. On valid input the component displays a clearly
 * labelled draft state instead of a success screen, because no request exists
 * server-side. In production the next step would create a payment intent and
 * unlock nothing until the webhook confirms it.
 */
export function RequestForm({
  studName,
  studSlug,
  dams,
  referenceDate,
}: RequestFormProps) {
  const [damId, setDamId] = useState(dams[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [shareConsent, setShareConsent] = useState(false);
  const [feeConsent, setFeeConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const selectedDam = dams.find((dam) => dam.id === damId);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!damId) next.damId = "Select the dam for this request.";
    if (!shareConsent) {
      next.shareConsent =
        "Confirm you are authorized to share this dam's records.";
    }
    if (!feeConsent) {
      next.feeConsent =
        "Acknowledge the request fee and the preview limitation.";
    }
    if (message.length > 800)
      next.message = "Keep the message under 800 characters.";
    setErrors(next);

    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        document.getElementById("request-errors")?.focus();
      });
      return false;
    }
    return true;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (submitted && selectedDam) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-info-600/20 bg-white p-6 shadow-card"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-info-50 text-info-700">
          <Icon name="file" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-info-700">
          Preview draft · not submitted
        </p>
        <h2 className="mt-1 font-display text-2xl text-navy-900">
          Request ready to review
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          This is a local draft for design review. No request was sent, no
          payment was taken, and no contact details were unlocked.
        </p>

        <dl className="mt-5 space-y-2 rounded-xl bg-cream-50 p-4 text-[13px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Stud</dt>
            <dd className="font-medium text-ink">{studName}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Dam</dt>
            <dd className="font-medium text-ink">
              {selectedDam.name} · {selectedDam.breed}
            </dd>
          </div>
          {plannedDate ? (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Preferred date</dt>
              <dd className="font-medium text-ink">{plannedDate}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Request fee</dt>
            <dd className="tabular font-semibold text-ink">
              $400 — not charged
            </dd>
          </div>
        </dl>

        {message ? (
          <div className="mt-4 rounded-xl border border-line p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              Message
            </p>
            <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-muted">
              {message}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setSubmitted(false)}>
            Edit draft
          </Button>
          <a
            href={`/studs/${studSlug}`}
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-navy-800 hover:bg-cream-50"
          >
            Back to profile
          </a>
        </div>

        <Alert
          tone="info"
          className="mt-5"
          title="What production would do next"
        >
          The request would be saved as <strong>awaiting payment</strong>. A
          payment intent would be created server-side; contact details would
          stay private until a signed webhook confirms the payment. A redirect
          to a success page would never be enough.
        </Alert>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div id="request-errors">
        <FormErrorSummary
          errors={Object.entries(errors).map(([fieldId, message]) => ({
            fieldId,
            message,
          }))}
        />
      </div>

      <section
        aria-labelledby="request-details-heading"
        className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6"
      >
        <h2
          id="request-details-heading"
          className="font-display text-2xl text-navy-900"
        >
          Request details
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Only the selected dam&apos;s relevant details are shared with this
          stud owner. Female profiles stay private by default.
        </p>

        <div className="mt-5 space-y-5">
          <SelectField
            id="damId"
            name="damId"
            label="Dam"
            required
            value={damId}
            onChange={(event) => setDamId(event.target.value)}
            error={errors.damId}
            hint="Only females on your account can be selected."
            placeholder="Select a dam"
            options={dams.map((dam) => ({
              value: dam.id,
              label: `${dam.name} · ${dam.breed}`,
            }))}
          />

          {selectedDam ? (
            <div className="rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
              <p className="font-semibold text-ink">
                Shared with the stud owner
              </p>
              <p className="mt-1">
                {selectedDam.name}&apos;s breed, age, registration number format
                status, brucellosis test date and your message. Exact address
                and contact details are not shared until both sides agree.
              </p>
            </div>
          ) : null}

          <TextField
            id="plannedDate"
            name="plannedDate"
            type="date"
            label="Preferred date"
            optionalLabel="optional"
            min={referenceDate}
            value={plannedDate}
            onChange={(event) => setPlannedDate(event.target.value)}
            hint="An estimate only. It does not reserve the stud or confirm availability."
          />

          <div>
            <TextareaField
              id="message"
              name="message"
              label="Message to the owner"
              optionalLabel="optional"
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, 800))}
              error={errors.message}
              hint="Do not include payment details, government IDs or exact addresses."
              placeholder="Introduce your dam, your timeline and any questions about the agreement."
              rows={5}
            />
            <p className="mt-1 text-right text-[10px] text-muted">
              {message.length}/800
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="request-consent-heading"
        className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6"
      >
        <h2
          id="request-consent-heading"
          className="font-display text-2xl text-navy-900"
        >
          Confirmations
        </h2>
        <div className="mt-4 space-y-4">
          <CheckboxField
            id="shareConsent"
            name="shareConsent"
            checked={shareConsent}
            onChange={(event) => setShareConsent(event.target.checked)}
            error={errors.shareConsent}
            required
            label={`I am authorized to share ${selectedDam?.name ?? "this dam"}'s records with this stud owner.`}
          />
          <CheckboxField
            id="feeConsent"
            name="feeConsent"
            checked={feeConsent}
            onChange={(event) => setFeeConsent(event.target.checked)}
            error={errors.feeConsent}
            required
            label={
              <>
                I understand the{" "}
                <strong>
                  {STUD_PRICING.depositUsd} USD deposit is applied toward the
                  stud fee
                </strong>
                , and that this preview does not charge or send anything.
              </>
            }
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[11px] leading-relaxed text-muted">
          Next: payment. Contact details are never unlocked by this form or by a
          redirect.
        </p>
        <Button
          type="submit"
          size="lg"
          iconRight={<Icon name="arrow-right" className="h-4 w-4" />}
        >
          Review request
        </Button>
      </div>
    </form>
  );
}
