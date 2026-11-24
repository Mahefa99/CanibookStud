import type { StudAvailabilityWindow } from "@/lib/types/domain";
import { formatDate } from "@/lib/utils";

/**
 * Owner-provided availability for the reference month and the next one.
 * Unmarked days are "not specified", not "unavailable" — the legend and the
 * screen-reader summary say so explicitly.
 */
export function AvailabilityCalendar({
  windows,
  referenceDate,
}: {
  windows: StudAvailabilityWindow[];
  referenceDate: string;
}) {
  const reference = new Date(`${referenceDate}T00:00:00Z`);
  const months = [0, 1].map((offset) => {
    const date = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + offset, 1));
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
  });

  const statusFor = (isoDate: string): StudAvailabilityWindow["status"] | null => {
    const window = windows.find((entry) => isoDate >= entry.startDate && isoDate <= entry.endDate);
    return window?.status ?? null;
  };

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
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
                  const status = statusFor(iso);
                  return (
                    <span
                      key={iso}
                      title={
                        status === "available"
                          ? `${formatDate(iso)} — available`
                          : status === "booked"
                            ? `${formatDate(iso)} — booked`
                            : `${formatDate(iso)} — not specified`
                      }
                      aria-label={
                        status === "available"
                          ? `${formatDate(iso)}: available`
                          : status === "booked"
                            ? `${formatDate(iso)}: booked`
                            : undefined
                      }
                      className={
                        status === "available"
                          ? "tabular grid h-8 place-items-center rounded-md bg-success-50 text-[11px] font-semibold text-success-700 ring-1 ring-inset ring-success-600/30"
                          : status === "booked"
                            ? "tabular grid h-8 place-items-center rounded-md bg-navy-50 text-[11px] text-navy-600 line-through decoration-navy-300"
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

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-success-50 ring-1 ring-inset ring-success-600/30" />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-navy-50 ring-1 ring-inset ring-navy-200" />
          Booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-line" />
          Not specified
        </span>
      </div>

      <ul className="sr-only">
        {windows.map((window) => (
          <li key={`${window.startDate}-${window.endDate}`}>
            {window.status === "available" ? "Available" : "Booked"} from{" "}
            {formatDate(window.startDate)} to {formatDate(window.endDate)}.
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Availability is provided by the owner for this sample profile. It is not a confirmed
        booking, and dates may change once a request is discussed.
      </p>
    </div>
  );
}
