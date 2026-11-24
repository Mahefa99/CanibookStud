import { StudForm } from "@/src/features/studs/components/stud-form";

export const metadata = { title: "Add a male", robots: { index: false } };

export default function Page() {
  return <section><h1 className="mb-5 font-display text-4xl">Add a male</h1><StudForm /></section>;
}
