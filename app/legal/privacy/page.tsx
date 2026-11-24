import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Privacy (draft)",
  description: "Draft privacy notice for review. Not a final legal document.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      description="Draft privacy notice describing the intended data rules. The preview has no backend and stores very little."
    >
      <LegalSection title="1. What the public sees">
        <p>
          Public animal profiles contain a city and state, approximate map coordinates, registration
          number in masked form, document status, and owner-written descriptions. They do not contain
          a street address, ZIP code, phone number, email address or a public document URL.
        </p>
        <p>
          Female profiles and heat calendars are private by default. Contact details remain hidden
          until a request is confirmed by the server.
        </p>
      </LegalSection>

      <LegalSection title="2. What the preview stores">
        <p>
          This preview stores non-file form drafts and favorites in your browser&apos;s local storage.
          It does not send them to a server. Uploaded files remain in browser memory for the session
          and disappear when the page is refreshed.
        </p>
        <p>
          A demo cookie is used to open the administration preview. It contains no personal data and
          is not a security control.
        </p>
      </LegalSection>

      <LegalSection title="3. Documents and sensitive data">
        <p>
          In production, identity, licence and health documents would be stored privately with
          short-lived access links and an audit trail. They would not be publicly linkable. The
          preview does not store real documents and asks visitors not to upload them.
        </p>
      </LegalSection>

      <LegalSection title="4. Payment data">
        <p>
          No payment provider is connected. No card number, bank account or payout identity is
          collected. A production payment flow must be handled by a compliant provider; the platform
          should store references and states, not card data.
        </p>
      </LegalSection>

      <LegalSection title="5. Retention, access and deletion">
        <p>
          Retention periods, export rights, correction and deletion are not final. The settings page
          exposes a disabled deletion action until the backend and legal requirements are defined.
        </p>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p>
          A final privacy notice must identify the data controller, a contact channel and the
          applicable jurisdiction. Those details are still to be confirmed; the placeholder address
          on the site is not a legal contact.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
