"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { decodeGodpetCertificate, type GodpetCertificate } from "@/lib/data/demo/godpet";

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

export function GodpetCertificateView() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const token = searchParams.get("d") ?? "";
  const certificate: GodpetCertificate | null = token ? decodeGodpetCertificate(token) : null;
  const id = params?.id ?? "";

  let photoUrl: string | null = null;
  if (certificate && typeof window !== "undefined") {
    try {
      photoUrl = localStorage.getItem(`${PHOTO_STORAGE_PREFIX}${certificate.id}`);
    } catch {
      photoUrl = null;
    }
  }

  if (!certificate || certificate.id !== id) {
    return (
      <div className="shell py-12">
        <EmptyState
          icon="paw"
          title="Certificate not found"
          description="This certificate does not exist in this preview browser. Generate a name to create your own certificate."
          action={<ButtonLink href="/godpet">Generate a name</ButtonLink>}
        />
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`My dog's GODPET name is ${certificate.name.name}!`);

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="shell py-8 lg:py-12">
      <div className="mx-auto max-w-2xl rounded-3xl border-2 border-[#D4AF37] bg-white p-6 shadow-card sm:p-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Certificate of naming · GODPET by CanibookStud
        </p>

        <div className="mt-6 flex flex-col items-center">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={certificate.name.name}
              className="h-40 w-40 rounded-full object-cover ring-4 ring-[#D4AF37]"
            />
          ) : (
            <span className="grid h-40 w-40 place-items-center rounded-full bg-cream-50 text-navy-200 ring-4 ring-[#D4AF37]">
              <Icon name="paw" className="h-16 w-16" />
            </span>
          )}

          <h1
            className="mt-6 text-center font-display text-5xl leading-none sm:text-6xl"
            style={{ color: "#D4AF37" }}
          >
            {certificate.name.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {certificate.breed}
            {certificate.color ? ` · ${certificate.color}` : ""} ·{" "}
            {certificate.sex === "male" ? "Male" : "Female"}
          </p>
          <p className="mt-1 text-[12px] text-muted">{certificate.name.pronunciation}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-cream-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Meaning</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{certificate.name.meaning}</p>
          </div>
          <div className="rounded-2xl border border-line bg-cream-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Why it fits</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{certificate.name.why}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Match scores</p>
            <span className="tabular rounded-full bg-navy-700 px-3 py-1 text-sm font-bold text-white">
              {certificate.name.score}
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            {scoreBar(certificate.name.phoneticScore, "Phonetic")}
            {scoreBar(certificate.name.raceScore, "Race")}
            {scoreBar(certificate.name.personalityScore, "Personality")}
            {scoreBar(certificate.name.confusionScore, "Clarity")}
            {scoreBar(certificate.name.uniquenessScore, "Uniqueness")}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button fullWidth size="lg" disabled iconLeft={<Icon name="file" className="h-4 w-4" />}>
            Download PDF — available in production
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <ButtonLink
              href={`https://www.instagram.com/share?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
              variant="secondary"
              iconLeft={<Icon name="external" className="h-4 w-4" />}
            >
              Instagram
            </ButtonLink>
            <ButtonLink
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              variant="secondary"
              iconLeft={<Icon name="external" className="h-4 w-4" />}
            >
              Facebook
            </ButtonLink>
            <Button variant="secondary" onClick={copyLink} className="col-span-2">
              {copied ? "Link copied" : "Copy link"}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Alert tone="neutral" title="Preview build">
            The PDF download and social sharing are static placeholders. This certificate is stored in
            the current browser only — no backend, no QR code and no email are wired in this demo.
          </Alert>
        </div>
      </div>

      <p className="mt-6 text-center">
        <Link href="/godpet" className="text-sm font-semibold text-navy-800 underline underline-offset-4 hover:text-navy-600">
          Generate another name
        </Link>
      </p>
    </div>
  );
}
