import { ClubSponsorEmail } from "@/components/forms/club-sponsor-email";
export const metadata = { title: "Club event sponsorship" };
export default function ClubEventSponsorship() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Club event sponsorship</h1>
      <p className="text-sm text-muted">
        Demonstration workspace. No event contacts are loaded and no email is
        sent.
      </p>
      <ClubSponsorEmail />
    </div>
  );
}
