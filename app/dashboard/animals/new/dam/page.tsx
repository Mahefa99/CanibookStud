import type { Metadata } from "next";
import { AnimalRegistrationForm } from "@/components/forms/animal-registration-form";
import { RegistrationAside } from "@/components/forms/registration-aside";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Add a female",
  robots: { index: false, follow: false },
};

export default function NewDamPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Animals", href: "/dashboard/animals" },
          { label: "Add a female" },
        ]}
      />

      <header className="mt-4">
        <p className="eyebrow">Dam profile · free</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Add a female</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Keep a private record and a heat history. Female profiles and their calendars are not
          public; you choose what to share with a stud owner.
        </p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <AnimalRegistrationForm mode="dam" referenceDate={DEMO_REFERENCE_DATE} />
        <RegistrationAside mode="dam" />
      </div>
    </div>
  );
}
