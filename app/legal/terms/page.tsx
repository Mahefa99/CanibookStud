import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Terms (draft)",
  description: "Draft marketplace terms for review. Not a final legal document.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      description="Draft terms for the CanibookStud marketplace. Written to be reviewed, not published as final."
    >
      <LegalSection title="1. The platform's role">
        <p>
          CanibookStud is a marketplace that connects independent breeders, owners, clubs and pet
          professionals. The platform does not own, breed, sell or take possession of animals. It is
          not a party to a stud or puppy agreement between users.
        </p>
        <p>
          Platform fees are for connection, document-review assistance, technology and contract
          tooling. They are not payment for an animal or semen.
        </p>
      </LegalSection>

      <LegalSection title="2. Accounts and activities">
        <p>
          One account may hold several activities (stud owner, dam owner, breeder, buyer,
          professional, club manager and sponsor). Access to a section depends on the activity granted
          by the platform. Hiding a link in the interface does not grant or deny access — permissions
          must be enforced by the server.
        </p>
        <p>Accounts must be old enough to enter a binding agreement in their jurisdiction.</p>
      </LegalSection>

      <LegalSection title="3. Profiles and records">
        <p>
          Owners are responsible for the accuracy of their profiles. A registration-number format
          check is not an AKC registration confirmation. A document-review state is not a health
          guarantee, a licence verification or an endorsement. Club recommendations are opinions.
        </p>
        <p>
          Do not upload identity documents, medical records or other sensitive files to this preview.
          Production storage rules, retention and access are still to be defined.
        </p>
      </LegalSection>

      <LegalSection title="4. Payments and contracts">
        <p>
          Payment, owner acceptance, contract signature and payout are separate states. A deposit is applied toward the stud fee; a separate platform service fee is recorded. A puppy reservation is for the identified puppy, not the whole litter.
          The platform does not deliver animals.
        </p>
        <p>
          Refund, payout and refusal-after-payment policies are not final. No amount is collected in
          the preview, and no success page unlocks contact details.
        </p>
      </LegalSection>

      <LegalSection title="5. Prohibited content">
        <p>
          Illegal listings, misrepresentation, harassment, hate, sexual content involving animals,
          and attempts to bypass verification or payment are prohibited. Reports can be raised to
          administration; a report is not a finding.
        </p>
      </LegalSection>

      <LegalSection title="6. Advertising and sponsorship">
        <p>
          Paid placement must be labelled. Advertising is not allowed on animal profiles, galleries,
          contracts, checkout or personal spaces. Sponsorship is subject to creative review and a
          separate agreement.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes and contact">
        <p>
          These terms are a draft. A final version must state the legal entity, governing law,
          dispute route, liability limits and contact details. No final policy is presented on this
          page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
