"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SPONSOR_PRICING } from "@/lib/config/pricing";
import { formatUsd } from "@/lib/utils";
export function ClubSponsorEmail() {
  const [status, setStatus] = useState("");
  const template = `Subject: Sponsorship Opportunity - [Event name] - [Event date]\n\nHi [Sponsor Name],\n\nI'm [Name], President of [Club]. We are organizing [Event name] in [City, State] on [Date]. Expected attendance: [enter a supported estimate].\n\nOfficial sponsorship: ${formatUsd(SPONSOR_PRICING.event[0]!.amountUsd)} per event. Premium: ${formatUsd(SPONSOR_PRICING.event[1]!.amountUsd)} per event. ${SPONSOR_PRICING.eventSplitLabel}\n\nOfficial includes the approved logo on the event page, tickets and event email. Premium adds the agreed banner and editorial visibility. Visibility is offered; leads are never guaranteed.\n\nPlease submit your proposal at [Event link]. Confirm by [one month before event] so we can print the approved logo on tickets. We are contacting prospective sponsors two months before the event.\n\nThank you for supporting our dog community.\n[Name]\n[Club] | [Email] | [Phone]`;
  return (
    <section className="surface p-5">
      <h2 className="font-display text-2xl">Invite an event sponsor</h2>
      <p className="my-3 text-sm text-muted">
        Copy and personalize this template. Send it from your own email two
        months before the event; seek confirmation one month before printing
        tickets. This platform does not send or store the conversation.
      </p>
      <pre className="whitespace-pre-wrap rounded-xl bg-cream-50 p-4 text-xs leading-relaxed">
        {template}
      </pre>
      <Button
        className="mt-4"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(template);
            setStatus("Template copied.");
          } catch {
            setStatus("Copy unavailable. Select the template text manually.");
          }
        }}
      >
        Copy sponsor invitation email
      </Button>
      <p role="status" className="mt-2 text-sm">
        {status}
      </p>
    </section>
  );
}
