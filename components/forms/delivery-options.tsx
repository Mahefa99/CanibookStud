"use client";
import { useState } from "react";
import { DELIVERY } from "@/lib/config/pricing";
export function DeliveryOptions() {
  const [date, setDate] = useState("");
  const release = date
    ? new Date(`${date}T12:00:00Z`).getTime() + 48 * 3600000
    : 0;
  return (
    <fieldset className="my-6 rounded-2xl border border-line bg-white p-5">
      <legend className="px-2 font-semibold text-navy-900">
        Pick-up & approved delivery
      </legend>
      <label className="field-label">
        Delivery mode
        <select
          className="form-input"
          name="deliveryMode"
          defaultValue="pick-up"
        >
          <option value="pick-up">Pick-up at breeder</option>
          <option value="approved-transporter" disabled={!DELIVERY.enabled}>
            Approved transporter — awaiting administrator approval
          </option>
        </select>
      </label>
      <label className="field-label mt-3">
        Planned pick-up date
        <input
          className="form-input"
          type="date"
          name="pickupDate"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="field-label">
          Approved transporter
          <input
            className="form-input"
            name="deliveryTransporter"
            disabled
            placeholder="Administrator approval required"
          />
        </label>
        <label className="field-label">
          Delivery fee
          <input
            className="form-input"
            name="deliveryFee"
            disabled
            placeholder="Price pending — paid by buyer"
          />
        </label>
        <label className="field-label">
          Delivery date
          <input
            className="form-input"
            name="deliveryDate"
            type="date"
            disabled
          />
        </label>
        <label className="field-label">
          Illustrative escrow release
          <input
            className="form-input"
            name="escrowReleaseAt"
            readOnly
            value={
              release
                ? new Date(release).toISOString()
                : "Awaiting confirmed handover"
            }
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-muted">
        Date preview only. The server starts the hold after confirmed handover
        (photo + buyer signature), never from this planned date. Transport needs
        USDA/DOT licensing, IATA cage, insurance and health documents. A 72-hour
        health claim and one-year genetic claim require evidence. The 48-hour
        release / 72-hour claim overlap still requires operational arbitration.
      </p>
    </fieldset>
  );
}
