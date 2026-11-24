"use client";

import { useEffect, useState } from "react";
import { AnimalHealthPanel } from "./animal-health-panel";
import { Button } from "@/components/ui/button";

interface Dog {
  id: string;
  name: string;
  breed: string;
  sex: string;
  dob: string;
  chip: string;
  brucellosis: string;
  brucellosisDate: string;
  dna: number;
  photo: boolean;
  vaccines: boolean;
  tests: boolean;
  published?: boolean;
}
const empty = (): Dog => ({
  id: crypto.randomUUID(),
  name: "",
  breed: "",
  sex: "female",
  dob: "",
  chip: "",
  brucellosis: "missing",
  brucellosisDate: "",
  dna: 0,
  photo: false,
  vaccines: false,
  tests: false,
});

export function BulkImportWorkspace() {
  const [dogs, setDogs] = useState<Dog[]>([]),
    [filter, setFilter] = useState("");
  const [certify, setCertify] = useState(false),
    [kyc, setKyc] = useState(false),
    [w9, setW9] = useState(false),
    [licenses, setLicenses] = useState(false);
  const [page, setPage] = useState(1),
    [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const filteredDogs = dogs.filter((d) =>
    d.breed.toLowerCase().includes(filter.toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filteredDogs.length / 12));
  const currentPage = Math.min(page, pageCount);
  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("canibook.bulk-drafts.v12") ?? "[]",
      );
      if (Array.isArray(data))
        setDogs(
          data
            .filter(
              (d) =>
                d &&
                typeof d.id === "string" &&
                typeof d.name === "string" &&
                typeof d.breed === "string" &&
                ["sex", "dob", "chip", "brucellosis"].every(
                  (key) => typeof d[key] === "string",
                ) &&
                typeof d.dna === "number" &&
                Number.isFinite(d.dna) &&
                ["photo", "vaccines", "tests"].every(
                  (key) => typeof d[key] === "boolean",
                ),
            )
            .map((d) => ({ ...d, published: false })),
        );
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const save = () => {
      try {
        localStorage.setItem("canibook.bulk-drafts.v12", JSON.stringify(dogs));
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    };
    const timer = setTimeout(save, 1000);
    return () => clearTimeout(timer);
  }, [dogs, hydrated]);
  const [message, setMessage] = useState(""),
    [url, setUrl] = useState("");
  const errors = (d: Dog) =>
    [
      !d.name || !d.breed || !d.dob || !d.sex ? "Identity incomplete" : "",
      !["male", "female"].includes(d.sex.trim().toLowerCase())
        ? "Sex must be male or female"
        : "",
      !/^\d{15}$/.test(d.chip) ? "Microchip must contain 15 digits" : "",
      dogs.some((x) => x.id !== d.id && x.chip === d.chip) && d.chip
        ? "Duplicate microchip"
        : "",
      d.brucellosis !== "negative" ? "Negative brucellosis required" : "",
      !Number.isFinite(d.dna) || d.dna <= 95 || d.dna > 100
        ? "DNA must be >95% and at most 100%"
        : "",
      !d.vaccines ? "Vaccinations missing" : "",
      !d.photo ? "Photo missing" : "",
      !d.tests ? "Genetic panel review missing" : "",
      !d.brucellosisDate ||
      !Number.isFinite(Date.parse(d.brucellosisDate)) ||
      Date.parse(d.brucellosisDate) > Date.now() ||
      Date.now() - Date.parse(d.brucellosisDate) >= 14 * 86400000
        ? "Current brucellosis date required"
        : "",
      d.dob &&
      (new Date(d.dob) > new Date() ||
        !Number.isFinite(Date.parse(d.dob)) ||
        new Date(d.dob).toISOString().slice(0, 10) !== d.dob)
        ? "Invalid birth date"
        : "",
    ].filter(Boolean);
  const update = (
    id: string,
    key: keyof Dog,
    value: string | number | boolean,
  ) =>
    setDogs((rows) =>
      rows.map((d) =>
        d.id === id ? { ...d, [key]: value, published: false } : d,
      ),
    );
  const template =
    "Name,Breed,DOB,Sex,Microchip\nSample A,French Bulldog,2024-01-01,female,123456789012345\nSample B,Labrador Retriever,2024-02-01,male,123456789012346\n";
  async function importCsv(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Maximum CSV size: 5 MB.");
      return;
    }
    const lines = (await file.text())
      .replace(/^\uFEFF/, "")
      .trim()
      .split(/\r?\n/);
    if (!/^Name,Breed,DOB,Sex,Microchip$/i.test((lines[0] ?? "").trim())) {
      setMessage(
        "Use the downloadable CSV template. Quoted fields are not supported in this local preview.",
      );
      return;
    }
    if (
      lines
        .slice(1)
        .some(
          (line) =>
            line && (line.includes('"') || line.split(",").length !== 5),
        )
    ) {
      setMessage(
        "Each CSV row must contain exactly five unquoted fields. Correct the file and try again; existing drafts are unchanged.",
      );
      return;
    }
    const rows = lines
      .slice(1)
      .filter(Boolean)
      .map((line) => {
        const [name, breed, dob, sex, chip] = line
          .split(",")
          .map((value) => value.trim());
        return {
          ...empty(),
          name: name ?? "",
          breed: breed ?? "",
          dob: dob ?? "",
          sex: sex ?? "",
          chip: chip ?? "",
        };
      });
    setDogs((current) => [...current, ...rows]);
    setMessage(
      `${rows.length} local drafts imported. Health evidence remains incomplete.`,
    );
  }
  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <h2 className="font-display text-2xl">1. Owner KYC</h2>
        <p className="my-3 text-sm text-muted">
          Demo checklist only: no identity documents or personal data are
          collected. A real owner needs age 18+, ID/selfie match, address
          evidence, SMS/email OTP, Stripe Connect and a KYC score of at least
          80%.
        </p>
        {[
          [kyc, setKyc, "Simulate owner KYC reviewed (score ≥80%)"],
          [w9, setW9, "Simulate W9 received"],
          [
            licenses,
            setLicenses,
            "Simulate USDA / state Pet Dealer / business / AKC licence review, where applicable",
          ],
        ].map(([value, setter, label]) => (
          <label key={String(label)} className="my-3 flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) =>
                (setter as (x: boolean) => void)(e.target.checked)
              }
            />
            {String(label)}
          </label>
        ))}
      </section>
      <section className="surface p-5">
        <h2 className="font-display text-2xl">2. Import dogs</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">CSV / Excel</h3>
            <a
              className="my-3 block text-sm underline"
              download="dogs-template.csv"
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(template)}`}
            >
              Download sample CSV template
            </a>
            <label className="field-label">
              CSV (max 5 MB)
              <input
                className="form-input"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f)
                    void importCsv(f).catch(() =>
                      setMessage(
                        "This CSV could not be read. Choose it again; existing drafts are unchanged.",
                      ),
                    );
                  e.target.value = "";
                }}
              />
            </label>
            <p className="mt-2 text-xs text-muted">
              CSV import works locally. XLSX mapping needs the production import
              service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Website / AKC URL</h3>
            <label className="field-label mt-3">
              Source URL
              <input
                className="form-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <Button className="mt-3" disabled>
              AI scan — service not connected
            </Button>
            <p className="mt-2 text-xs text-muted">
              Owner and kennel matching is required before any production scan.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Pedigree / vet PDF</h3>
            <label className="field-label mt-3">
              PDF or image files
              <input
                className="form-input"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setMessage(
                    Array.from(e.target.files ?? []).length > 20 ||
                      Array.from(e.target.files ?? []).some(
                        (f) => f.size > 10 * 1024 * 1024,
                      )
                      ? "Maximum 20 files, 10 MB each."
                      : "Files selected locally. OCR is not connected; no documents were uploaded.",
                  )
                }
              />
            </label>
          </div>
        </div>
        <Button
          className="mt-5"
          variant="secondary"
          onClick={() => setDogs([...dogs, empty()])}
        >
          Add one dog manually
        </Button>
      </section>
      <section className="surface p-5">
        <h2 className="font-display text-2xl">3. Review {dogs.length} dogs</h2>
        <label className="field-label my-4">
          Filter breeds
          <input
            className="form-input"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Animal draft table, scroll horizontally for health and actions"
          tabIndex={0}
        >
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Imported local animal drafts</caption>
            <thead>
              <tr>
                {[
                  "Name",
                  "Breed",
                  "Sex",
                  "DOB",
                  "Microchip",
                  "Health & completion",
                  "Actions",
                ].map((x) => (
                  <th key={x} className="p-2">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDogs
                .slice((currentPage - 1) * 12, currentPage * 12)
                .map((d) => (
                  <tr key={d.id} className="border-t border-line">
                    {(["name", "breed", "sex", "dob", "chip"] as const).map(
                      (key) => (
                        <td key={key} className="min-w-36 p-2">
                          <input
                            aria-label={`${key} for ${d.name || "draft"}`}
                            className="form-input"
                            type={key === "dob" ? "date" : "text"}
                            value={d[key]}
                            onChange={(e) => update(d.id, key, e.target.value)}
                          />
                        </td>
                      ),
                    )}
                    <td className="min-w-64 p-2">
                      <label>
                        Brucellosis
                        <select
                          className="form-input"
                          value={d.brucellosis}
                          onChange={(e) =>
                            update(d.id, "brucellosis", e.target.value)
                          }
                        >
                          <option value="missing">Missing</option>
                          <option value="negative">Negative (declared)</option>
                          <option value="positive">Positive — blocked</option>
                        </select>
                      </label>
                      <label>
                        Brucellosis test date
                        <input
                          className="form-input"
                          type="date"
                          value={d.brucellosisDate ?? ""}
                          max={new Date().toISOString().slice(0, 10)}
                          onChange={(e) =>
                            update(d.id, "brucellosisDate", e.target.value)
                          }
                        />
                      </label>
                      <label>
                        DNA %
                        <input
                          className="form-input"
                          type="number"
                          min="0"
                          max="100"
                          value={d.dna}
                          onChange={(e) =>
                            update(d.id, "dna", Number(e.target.value))
                          }
                        />
                      </label>
                      {(["photo", "vaccines", "tests"] as const).map((key) => (
                        <label className="mr-3" key={key}>
                          <input
                            type="checkbox"
                            checked={d[key]}
                            onChange={(e) =>
                              update(d.id, key, e.target.checked)
                            }
                          />
                          {key} (demo)
                        </label>
                      ))}
                      <p className="mt-2 text-xs">
                        {d.published
                          ? "Local eligible draft — not published"
                          : errors(d).length
                            ? errors(d).join(" · ")
                            : "100% declared fields — evidence review pending"}
                      </p>
                      {d.dob &&
                      Date.now() - Date.parse(d.dob) < 304 * 86400000 ? (
                        <p className="text-warning-800">
                          Under 10 months — review age eligibility
                        </p>
                      ) : null}
                    </td>
                    <td className="min-w-36 p-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setDogs([
                            ...dogs,
                            {
                              ...d,
                              id: crypto.randomUUID(),
                              name: `${d.name} sibling`,
                              chip: "",
                              published: false,
                            },
                          ])
                        }
                      >
                        Duplicate sibling
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setDogs(dogs.filter((x) => x.id !== d.id));
                          setPage(1);
                        }}
                      >
                        Remove draft
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="my-4 flex items-center gap-3">
          <Button
            variant="secondary"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous page
          </Button>
          <span className="text-sm">
            Page {currentPage} / {pageCount} · {filteredDogs.length} matching
            drafts
          </span>
          <Button
            variant="secondary"
            disabled={currentPage >= pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Next page
          </Button>
        </div>
        {!dogs.length ? (
          <p className="my-5 text-muted">
            No drafts yet. Import the sample template or add a dog.
          </p>
        ) : null}
        {dogs.length > 0 && !filteredDogs.length ? (
          <p role="status" className="my-5 text-muted">
            No drafts match this breed.{" "}
            <button
              type="button"
              className="underline"
              onClick={() => {
                setFilter("");
                setPage(1);
              }}
            >
              Clear breed filter
            </button>
          </p>
        ) : null}
        <AnimalHealthPanel />
        <label className="my-4 flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={certify}
            onChange={(e) => setCertify(e.target.checked)}
          />
          I reviewed each local draft and certify the declared information.
        </label>
        <Button
          disabled={
            !kyc ||
            !w9 ||
            !licenses ||
            !certify ||
            !dogs.some((d) => !errors(d).length)
          }
          onClick={() => {
            setDogs(dogs.map((d) => ({ ...d, published: !errors(d).length })));
            setMessage(
              "Eligible drafts marked locally. No dogs were published, no evidence verified and no server data changed.",
            );
          }}
        >
          Preview eligible publication
        </Button>
      </section>
      {saveError ? (
        <p role="alert" className="rounded-xl bg-warning-50 p-4 text-sm">
          Local saving is unavailable. Keep this tab open; draft edits will be
          lost when you leave.
        </p>
      ) : null}
      <p role="status" className="rounded-xl bg-info-50 p-4 text-sm">
        {message ||
          "Animal drafts auto-save locally in this browser. No server data is changed. Never use real identity documents in this demo."}
      </p>
    </div>
  );
}
