"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  CheckboxField,
  FormErrorSummary,
  FormSection,
  SelectField,
  TextField,
} from "@/components/forms/fields";
import { GODPET_PRICING } from "@/lib/config/pricing";
import {
  GODPET_BREEDS,
  GODPET_LENGTHS,
  GODPET_ORIGINS,
  GODPET_PERSONALITIES,
  GODPET_STYLES,
  encodeGodpetCertificate,
  generateGodpetNames,
  newCertificateId,
  type GodpetName,
} from "@/lib/data/demo/godpet";

type Step = "form" | "results" | "photo" | "tip";

const PHOTO_STORAGE_PREFIX = "godpet:photo:";

function scoreBar(value: number, label: string) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] text-muted">
        <span>{label}</span>
        <span className="tabular font-semibold text-navy-800">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream-100">
        <div
          className="h-full rounded-full bg-navy-700"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function GodpetForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "">("");
  const [personality, setPersonality] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [color, setColor] = useState("");
  const [origin, setOrigin] = useState("");
  const [length, setLength] = useState("");
  const [letterPref, setLetterPref] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Array<{ fieldId: string; message: string }>>([]);

  const [names, setNames] = useState<GodpetName[]>([]);
  const [regenerations, setRegenerations] = useState(0);
  const [chosen, setChosen] = useState<GodpetName | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState("");
  const [tipError, setTipError] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  function generate(regeneration = 0) {
    if (!breed || !sex || style === "") return;
    const result = generateGodpetNames(
      { breed, sex: sex as "male" | "female", personality, style, color: color || undefined, origin: origin || undefined, length: length || undefined, letterPref: letterPref || undefined },
      regeneration,
    );
    setNames(result);
  }

  function togglePersonality(value: string) {
    setPersonality((current) => {
      if (current.includes(value)) return current.filter((item) => item !== value);
      if (current.length >= 2) return current;
      return [...current, value];
    });
  }

  function validateForm(): boolean {
    const nextErrors: Array<{ fieldId: string; message: string }> = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.push({ fieldId: "godpet-email", message: "Enter a valid email address." });
    }
    if (!breed) nextErrors.push({ fieldId: "godpet-breed", message: "Choose a breed." });
    if (!sex) nextErrors.push({ fieldId: "godpet-sex", message: "Choose the sex." });
    if (personality.length === 0) {
      nextErrors.push({ fieldId: "godpet-personality", message: "Pick at least one personality trait." });
    }
    if (!style) nextErrors.push({ fieldId: "godpet-style", message: "Choose a style." });
    setErrors(nextErrors);
    return nextErrors.length === 0;
  }

  function onSubmitForm(event: React.FormEvent) {
    event.preventDefault();
    if (!validateForm()) return;
    generate(0);
    setRegenerations(0);
    setStep("results");
  }

  function onRegenerate() {
    if (regenerations >= 1) return;
    setRegenerations((value) => value + 1);
    generate(regenerations + 1);
  }

  function onChoose(name: GodpetName) {
    setChosen(name);
    setStep("photo");
  }

  function onPhotoPicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) { setTipError("Choose a JPG or PNG image up to 5 MB."); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  function finalize() {
    if (!chosen) return;
    const id = newCertificateId();
    const generatedAt = new Date().toISOString();
    const cert = { id, name: chosen, breed, sex: sex as "male" | "female", color: color || undefined, generatedAt };
    if (photoDataUrl) {
      try {
        localStorage.setItem(`${PHOTO_STORAGE_PREFIX}${id}`, photoDataUrl);
      } catch {
        // Storage unavailable; the public page falls back to the placeholder.
      }
    }
    router.push(`/godpet/certificate/${id}?d=${encodeGodpetCertificate(cert)}`);
  }

  function onTip() {
    const amount = Number(tipAmount);
    if (tipAmount.trim() !== "" && (!Number.isFinite(amount) || amount < GODPET_PRICING.tip.minUsd || amount > GODPET_PRICING.tip.maxUsd)) {
      setTipError(`Tip must be between $${GODPET_PRICING.tip.minUsd} and $${GODPET_PRICING.tip.maxUsd}.`);
      return;
    }
    setTipError(undefined);
    // Payment is disabled in this preview; the PDF stays free either way.
    finalize();
  }

  return (
    <div className="surface p-5 sm:p-8">
      <div className="mb-6">
        <Alert tone="neutral" title="Demo tool">
          Names are generated locally in your browser — no GPT call, no email is sent and no payment
          is processed in this preview. The PDF is free even with a $0 tip.
        </Alert>
      </div>

      {step === "form" ? (
        <form onSubmit={onSubmitForm} noValidate>
          <FormErrorSummary errors={errors} />
          <div className="mt-6 space-y-8">
            <FormSection title="Your dog" description="Tell us who we are naming.">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="godpet-email"
                  name="email"
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  hint="Used only for the demo — nothing is sent."
                />
                <SelectField
                  id="godpet-breed"
                  name="breed"
                  label="Breed"
                  required
                  value={breed}
                  onChange={(event) => setBreed(event.target.value)}
                  placeholder="Select a breed"
                  options={GODPET_BREEDS.map((item) => ({ value: item, label: item }))}
                />
                <SelectField
                  id="godpet-sex"
                  name="sex"
                  label="Sex"
                  required
                  value={sex}
                  onChange={(event) => setSex(event.target.value as "male" | "female")}
                  placeholder="Select"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
                <SelectField
                  id="godpet-style"
                  name="style"
                  label="Style"
                  required
                  value={style}
                  onChange={(event) => setStyle(event.target.value)}
                  placeholder="Select a style"
                  options={GODPET_STYLES.map((item) => ({ value: item, label: item }))}
                />
              </div>

              <fieldset>
                <legend className="field-label">
                  Personality <span className="ml-1 text-orange-700" aria-hidden="true">*</span>
                  <span className="ml-1.5 font-normal text-muted">(up to 2)</span>
                </legend>
                <div id="godpet-personality" className="mt-2 flex flex-wrap gap-2">
                  {GODPET_PERSONALITIES.map((trait) => {
                    const active = personality.includes(trait);
                    const disabled = !active && personality.length >= 2;
                    return (
                      <button
                        key={trait}
                        type="button"
                        aria-pressed={active}
                        disabled={disabled}
                        onClick={() => togglePersonality(trait)}
                        className={`inline-flex min-h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                          active
                            ? "border-navy-700 bg-navy-700 text-white"
                            : "border-line bg-white text-navy-800 hover:border-navy-300"
                        }`}
                      >
                        {trait}
                      </button>
                    );
                  })}
                </div>
                {errors.some((error) => error.fieldId === "godpet-personality") ? (
                  <p className="field-error mt-1.5">
                    <Icon name="warning" className="mt-px h-3.5 w-3.5 shrink-0" />
                    Pick at least one personality trait.
                  </p>
                ) : null}
              </fieldset>
            </FormSection>

            <FormSection title="Optional preferences" description="All optional — leave blank if unsure.">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="godpet-color"
                  name="color"
                  label="Coat color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
                <TextField
                  id="godpet-letter"
                  name="letterPref"
                  label="Preferred first letter"
                  maxLength={1}
                  value={letterPref}
                  onChange={(event) => setLetterPref(event.target.value)}
                  hint="Single letter, e.g. M."
                />
                <SelectField
                  id="godpet-origin"
                  name="origin"
                  label="Origin"
                  value={origin}
                  onChange={(event) => setOrigin(event.target.value)}
                  placeholder="No preference"
                  options={GODPET_ORIGINS.map((item) => ({ value: item, label: item }))}
                />
                <SelectField
                  id="godpet-length"
                  name="length"
                  label="Length"
                  value={length}
                  onChange={(event) => setLength(event.target.value)}
                  placeholder="No preference"
                  options={GODPET_LENGTHS.map((item) => ({ value: item, label: item }))}
                />
              </div>
              <CheckboxField
                id="godpet-consent"
                name="consent"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                label="Email me my results and CanibookStud tips (max 1 per week, unsubscribe anytime)."
                hint="Unchecked by default. No email is sent in this preview."
              />
            </FormSection>

            <div className="flex justify-end gap-3 border-t border-line pt-5">
              <Button type="submit" size="lg" iconRight={<Icon name="sparkle" className="h-4 w-4" />}>
                Generate 6 names
              </Button>
            </div>
          </div>
        </form>
      ) : null}

      {step === "results" ? (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Your names</p>
              <h2 className="mt-2 font-display text-3xl text-navy-900">
                6 names for your {breed}
              </h2>
            </div>
            <Button
              variant="secondary"
              onClick={onRegenerate}
              disabled={regenerations >= 1}
              iconLeft={<Icon name="sparkle" className="h-4 w-4" />}
            >
              {regenerations >= 1 ? "1 free regeneration used" : "Regenerate (1 free)"}
            </Button>
          </div>
          <p className="mt-2 text-[13px] text-muted">
            {regenerations >= 1
              ? "You have used your free regeneration. A tip in production unlocks six bonus names and other bonus features."
              : "One free regeneration is available."}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {names.map((name) => (
              <div key={name.name} className="flex flex-col rounded-2xl border border-line bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-3xl text-navy-900">{name.name}</p>
                    <p className="text-[12px] text-muted">{name.pronunciation}</p>
                  </div>
                  <span className="tabular rounded-full bg-navy-50 px-2.5 py-1 text-[12px] font-bold text-navy-800">
                    {name.score}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink">{name.meaning}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{name.why}</p>
                <div className="mt-4 space-y-2">
                  {scoreBar(name.phoneticScore, "Phonetic")}
                  {scoreBar(name.raceScore, "Race")}
                  {scoreBar(name.personalityScore, "Personality")}
                  {scoreBar(name.confusionScore, "Clarity")}
                  {scoreBar(name.uniquenessScore, "Uniqueness")}
                </div>
                <div className="mt-4 flex items-center gap-4 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Icon name={name.instagramAvailable ? "check" : "close"} className="h-3.5 w-3.5" />
                    Instagram {name.instagramAvailable ? "available" : "taken"} (simulated)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name={name.domainAvailable ? "check" : "close"} className="h-3.5 w-3.5" />
                    Domain {name.domainAvailable ? "available" : "taken"} (simulated)
                  </span>
                </div>
                <Button className="mt-4" fullWidth onClick={() => onChoose(name)}>
                  Choose this name
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-start">
            <Button variant="ghost" onClick={() => setStep("form")} iconLeft={<Icon name="arrow-left" className="h-4 w-4" />}>
              Back
            </Button>
          </div>
        </div>
      ) : null}

      {step === "photo" && chosen ? (
        <div>
          <p className="eyebrow">Almost there</p>
          <h2 className="mt-2 font-display text-3xl text-navy-900">Great choice: {chosen.name}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Would you like a photo of your dog on the certificate PDF? This is the only step where we
            ask — the name step never asks for a photo.
          </p>
          {tipError ? <p role="alert" className="my-3 text-danger-700">{tipError}</p> : null}
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => fileRef.current?.click()} iconLeft={<Icon name="file" className="h-4 w-4" />}>
                Add a photo
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={onPhotoPicked}
              />
              <Button variant="ghost" onClick={() => setPhotoDataUrl(null)}>
                No photo, use placeholder
              </Button>
            </div>
            {photoDataUrl ? (
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoDataUrl}
                  alt="Preview of the chosen dog"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-line"
                />
                <p className="text-[12px] text-muted">Photo stored locally in this browser only — preview build.</p>
              </div>
            ) : null}
            <div className="border-t border-line pt-4">
              <Button size="lg" onClick={() => setStep("tip")} iconRight={<Icon name="arrow-right" className="h-4 w-4" />}>
                Create my certificate
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {step === "tip" ? (
        <div className="mx-auto max-w-lg text-center">
          <p className="eyebrow justify-center">Free</p>
          <h2 className="mt-2 font-display text-3xl text-navy-900">Tip the Godfather</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            GODPET is free. If you enjoyed it, tip whatever you like — the PDF stays free either way,
            even with a $0 tip.
          </p>
          <div className="mt-6 text-left">
            <TextField
              id="godpet-tip"
              name="tip"
              label="Tip amount (USD)"
              type="number"
              inputMode="decimal"
              min={GODPET_PRICING.tip.minUsd}
              max={GODPET_PRICING.tip.maxUsd}
              placeholder="Ex: 5"
              value={tipAmount}
              error={tipError}
              onChange={(event) => setTipAmount(event.target.value)}
              hint={`Single free field, $${GODPET_PRICING.tip.minUsd}–$${GODPET_PRICING.tip.maxUsd}. No preset amount buttons.`}
            />
            {tipError ? null : (
              <p className="mt-2 text-[11px] text-muted">
                Payment is disabled in this preview — the tip is not collected.
              </p>
            )}
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={onTip} iconLeft={<Icon name="heart" className="h-4 w-4" />}>
              Tip
            </Button>
            <Button size="lg" variant="secondary" onClick={finalize}>
              No thanks, skip
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
