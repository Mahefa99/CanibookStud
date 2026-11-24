"use client";

import { useState } from "react";

const CORE = ["MDR1", "DM", "EIC", "PRA", "vWD", "HUU"];
const PANELS: Record<string, string[]> = {
  "Labrador Retriever": ["CNM", "HNPK"],
  "French Bulldog": ["CMR1", "JHC", "PK Def", "BOAS"],
  "German Shepherd": ["Hemophilia A", "Pituitary Dwarfism", "EPI"],
  "Golden Retriever": ["PRA1", "PRA2", "Ichthyosis", "NCL"],
  "English Bulldog": ["CMR1", "JHC", "PK Def", "BOAS"],
  Poodle: ["Neonatal Encephalopathy"],
  "Yorkshire Terrier": ["PLL"],
  Beagle: ["MLS"],
  "Border Collie": ["CEA", "TNS", "CL"],
};

export function AnimalHealthPanel({
  breed = "French Bulldog",
}: {
  breed?: string;
}) {
  const [percent, setPercent] = useState("");
  const [fileError, setFileError] = useState("");
  const invalidPercent =
    percent !== "" &&
    (!Number.isFinite(Number(percent)) ||
      Number(percent) < 0 ||
      Number(percent) > 100);
  const [results, setResults] = useState<Record<string, string>>({});
  const tests = Array.from(new Set([...CORE, ...(PANELS[breed] ?? [])]));
  const blocked = Object.values(results).some((value) => value === "positive");
  const complete = tests.every((test) => results[test] === "negative");
  return (
    <details className="surface my-5 p-5" open>
      <summary className="cursor-pointer font-semibold text-navy-900">
        DNA authenticity & health panel
      </summary>
      <p className="my-3 text-xs text-muted">
        Local draft only. Selecting a result does not verify a laboratory
        report. Production publication requires reviewed documents, current
        vaccinations, negative brucellosis and eligible DNA results.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Laboratory
          <select className="form-input" name="dnaLaboratory">
            <option value="">Choose laboratory</option>
            {["Embark", "Wisdom Panel", "UC Davis", "Other"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Main breed DNA (%)
          <input
            className="form-input"
            name="dnaPercent"
            type="number"
            min="0"
            max="100"
            aria-invalid={invalidPercent}
            aria-describedby="dna-percentage-status"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
        </label>
        <label className="field-label">
          Test date
          <input
            className="form-input"
            name="dnaTestDate"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
          />
        </label>
        <label className="field-label">
          Sample number
          <input className="form-input" name="dnaSampleNumber" />
        </label>
        <label className="field-label">
          DNA report (PDF, max 10 MB)
          <input
            className="form-input"
            name="dnaReport"
            type="file"
            accept="application/pdf"
            aria-invalid={Boolean(fileError)}
            aria-describedby={fileError ? "dna-file-error" : undefined}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileError("");
              if (
                file &&
                (file.size > 10 * 1024 * 1024 ||
                  !/\.pdf$/i.test(file.name) ||
                  (file.type && file.type !== "application/pdf"))
              ) {
                setFileError(
                  "Choose a PDF file no larger than 10 MB. The file stays on this device.",
                );
                e.target.value = "";
              }
            }}
          />
        </label>
        <label className="field-label">
          Secondary breeds
          <input
            className="form-input"
            name="secondaryBreeds"
            placeholder="Breed and percentage"
          />
        </label>
      </div>
      {fileError ? (
        <p id="dna-file-error" role="alert" className="field-error">
          {fileError}
        </p>
      ) : null}
      <p
        id="dna-percentage-status"
        role="status"
        className="mt-3 text-sm font-semibold"
      >
        {!percent
          ? "DNA report required before production publication"
          : invalidPercent
            ? "Enter a percentage between 0 and 100 — publication blocked"
            : Number(percent) > 95
              ? "Eligible percentage — document review still required"
              : Number(percent) >= 90
                ? "Partial authenticity — publication blocked"
                : "Crossbreed threshold — publication blocked"}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {tests.map((test) => (
          <label key={test} className="field-label">
            {test}
            <select
              className="form-input"
              value={results[test] ?? ""}
              onChange={(e) =>
                setResults({ ...results, [test]: e.target.value })
              }
            >
              <option value="">Missing</option>
              <option value="negative">Negative / Clear</option>
              <option value="carrier">Carrier — review required</option>
              <option value="positive">Positive homozygous / At risk</option>
            </select>
          </label>
        ))}
      </div>
      <p
        role="status"
        className={`mt-4 rounded-xl p-3 text-sm ${blocked ? "bg-danger-50 text-danger-700" : "bg-warning-50 text-warning-800"}`}
      >
        {blocked
          ? "Non-breeding: positive homozygous result blocks reproduction."
          : !complete
            ? "Missing tests or carrier review: Premium and publication remain blocked."
            : "Declared panel complete — supporting certificates require review."}
      </p>
    </details>
  );
}
