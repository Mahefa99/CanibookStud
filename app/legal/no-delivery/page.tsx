import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "No-delivery policy (draft)",
  description: "Draft no-delivery policy. Pick-up is arranged directly between users.",
};

export default function NoDeliveryPage() {
  return (
    <LegalPage
      title="No-delivery policy"
      description="The platform does not ship, transport or deliver animals. This page records the intended rule and its open operational details."
    >
      <LegalSection title="1. Pick-up only">
        <p>
          CanibookStud does not offer delivery, air shipping, courier transport or a delivery fee.
          Pick-up is arranged directly between the breeder or owner and the buyer or dam owner.
        </p>
      </LegalSection>

      <LegalSection title="2. What the platform does not do">
        <p>
          The platform does not own the animal, does not take possession, does not arrange transport
          and does not guarantee a handover. Any transport arranged by users is outside the platform.
        </p>
      </LegalSection>

      <LegalSection title="3. Before pick-up">
        <p>
          Users should confirm the animal&apos;s identity, health records, handover location and
          contract terms before paying. No delivery fee is legitimate on this platform. Report any
          request for one.
        </p>
      </LegalSection>

      <LegalSection title="4. Open questions">
        <p>
          The exact wording of the no-delivery clause, the pick-up acknowledgement and the treatment
          of a failed handover are still to be reviewed. Nothing on this page is a final policy.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
