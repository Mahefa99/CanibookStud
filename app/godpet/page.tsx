import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { GodpetForm } from "@/components/forms/godpet-form";

export const metadata: Metadata = {
  title: "GODPET — free dog name generator",
  description:
    "Generate six personalized dog names with meanings, pronunciation and match scores. Free, with a pay-what-you-want tip. Demo tool.",
};

export default function GodpetPage() {
  return (
    <>
      <PageHeader
        eyebrow="GODPET · name search"
        title="Six names, matched to your dog."
        description="Answer a few questions and GODPET returns six names with pronunciation, meaning and a match score. Free — tip only if you want to. Demo: names are generated locally, no AI call."
      />
      <div className="shell py-8 lg:py-10">
        <div className="mx-auto max-w-3xl">
          <GodpetForm />
        </div>
      </div>
    </>
  );
}
