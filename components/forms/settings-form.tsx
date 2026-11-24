"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  CheckboxField,
  FormErrorSummary,
  SelectField,
  TextField,
} from "@/components/forms/fields";
import { US_STATES } from "@/lib/data/us-states";
import { ACTIVITY_LABELS, type Activity } from "@/lib/types/domain";

const ACTIVITY_DETAILS: Record<Activity, string> = {
  stud_owner: "Publish male profiles and answer breeding requests.",
  dam_owner: "Keep private female profiles and a heat calendar.",
  breeder: "Plan litters and manage reservations.",
  buyer: "Find a puppy and manage reservations.",
  professional: "Manage a business profile and service listing.",
  club_manager: "Manage a club, recommendations and events.",
  sponsor: "Manage sponsor placements and reporting.",
};

/**
 * Account settings preview.
 *
 * There is no session or persistence API. "Save" validates the fields and
 * reports that the change is local only. Activity changes deliberately do not
 * mutate the dashboard navigation: section visibility must be authorised by the
 * backend, not by a checkbox in the browser.
 */
export function SettingsForm() {
  const [firstName, setFirstName] = useState("Jordan");
  const [lastName, setLastName] = useState("Ellis");
  const [email, setEmail] = useState("jordan.ellis@example.com");
  const [city, setCity] = useState("Austin");
  const [stateCode, setStateCode] = useState("TX");
  const [activities, setActivities] = useState<Activity[]>([
    "stud_owner",
    "dam_owner",
    "buyer",
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function toggleActivity(activity: Activity, checked: boolean) {
    setSaved(false);
    setActivities((current) =>
      checked ? [...current, activity] : current.filter((value) => value !== activity),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "Enter a first name.";
    if (!lastName.trim()) next.lastName = "Enter a last name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!city.trim()) next.city = "Enter a city.";
    if (!stateCode) next.stateCode = "Select a state.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("settings-errors")?.focus();
      return;
    }
    setSaved(true);
  }

  const activitySections = [
    activities.includes("professional") ? "My Business" : null,
    activities.includes("club_manager") ? "My Club" : null,
    activities.includes("club_manager") ? "My Events" : null,
    activities.includes("sponsor") ? "Sponsorships" : null,
  ].filter(Boolean) as string[];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {saved ? (
        <Alert tone="success" title="Saved locally">
          These changes are held in the page only. No server request was made and no account was
          modified.
        </Alert>
      ) : null}

      <div id="settings-errors" tabIndex={-1}>
        <FormErrorSummary
          errors={Object.entries(errors).map(([fieldId, message]) => ({ fieldId, message }))}
        />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Account details</h2>
        <p className="mt-1 text-[11px] text-muted">
          This is a sample account. Do not enter real personal information.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="firstName"
            name="firstName"
            label="First name"
            required
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
              setSaved(false);
            }}
            error={errors.firstName}
          />
          <TextField
            id="lastName"
            name="lastName"
            label="Last name"
            required
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
              setSaved(false);
            }}
            error={errors.lastName}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSaved(false);
            }}
            error={errors.email}
            hint="Email verification is not connected in this preview."
            autoComplete="email"
          />
          <div className="rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
            <p className="font-semibold text-ink">Email status</p>
            <p className="mt-1">Not verified — no verification email is sent in the preview.</p>
          </div>
          <TextField
            id="city"
            name="city"
            label="City"
            required
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              setSaved(false);
            }}
            error={errors.city}
          />
          <SelectField
            id="stateCode"
            name="stateCode"
            label="State"
            required
            value={stateCode}
            onChange={(event) => {
              setStateCode(event.target.value);
              setSaved(false);
            }}
            error={errors.stateCode}
            placeholder="Select a state"
            options={US_STATES.map((state) => ({ value: state.code, label: state.name }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Activities</h2>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
          One account can hold several activities. The dashboard shows sections based on the
          activities the server grants; this checkbox list previews that mapping and does not
          authorise anything.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(ACTIVITY_DETAILS) as Activity[]).map((activity) => (
            <div key={activity} className="rounded-xl border border-line bg-cream-50 p-3">
              <CheckboxField
                id={`activity-${activity}`}
                name={`activity-${activity}`}
                checked={activities.includes(activity)}
                onChange={(event) => toggleActivity(activity, event.target.checked)}
                label={ACTIVITY_LABELS[activity]}
                hint={ACTIVITY_DETAILS[activity]}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-line bg-white p-3 text-[11px] text-muted">
          <p className="font-semibold text-ink">Sections this would unlock</p>
          <p className="mt-1">
            {activitySections.length > 0
              ? activitySections.join(" · ")
              : "No activity-specific sections beyond the core workspace."}
          </p>
          <p className="mt-1 text-[10px]">
            The sidebar is not changed live: permissions must come from the backend session.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Notifications</h2>
        <p className="mt-1 text-[11px] text-muted">
          Email delivery is not connected. Preferences are shown for layout review only.
        </p>
        <div className="mt-3 space-y-3">
          <CheckboxField
            id="notify-requests"
            name="notifyRequests"
            label="New breeding requests"
            checked
            onChange={() => undefined}
            disabled
            hint="Requires the email service to be connected."
          />
          <CheckboxField
            id="notify-heat"
            name="notifyHeat"
            label="Heat and cycle reminders"
            checked
            onChange={() => undefined}
            disabled
            hint="Estimates only; reminders are not sent in the preview."
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="submit" iconRight={<Icon name="check" className="h-4 w-4" />}>
          Save changes
        </Button>
        <p className="text-[10px] text-muted">Local preview — no account is modified.</p>
      </div>

      <section className="rounded-2xl border border-danger-600/20 bg-danger-50/40 p-5">
        <h2 className="font-display text-xl text-danger-700">Delete account</h2>
        <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">
          Account deletion, data retention and payout obligations must be defined with the backend
          and legal review. The action is disabled in the preview.
        </p>
        <Button variant="danger" size="sm" className="mt-3" disabled>
          Delete account
        </Button>
      </section>
    </form>
  );
}
