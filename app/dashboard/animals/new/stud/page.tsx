import type { Metadata } from "next";
import { AnimalRegistrationForm } from "@/components/forms/animal-registration-form";
import { RegistrationAside } from "@/components/forms/registration-aside";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Add a male",
  robots: { index: false, follow: false },
};

export default function NewStudPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Animals", href: "/dashboard/animals" },
          { label: "Add a male" },
        ]}
      />

      <header className="mt-4">
        <p className="eyebrow">Stud profile</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Add a male</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Build the public record in four steps. Nothing is published until the profile and its
          documents pass review, and the plan is billed separately.
        </p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <AnimalRegistrationForm mode="stud" referenceDate={DEMO_REFERENCE_DATE} />
        <RegistrationAside mode="stud" />
      </div>
    </div>
  );
}
