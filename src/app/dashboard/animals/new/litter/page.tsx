import { LitterForm } from "@/src/features/litters/components/litter-form";
export const metadata = { title: "List a litter", robots: { index: false } };
export default function Page() {
  return <section><h1 className="mb-5 font-display text-4xl">List a litter</h1><LitterForm /></section>;
}
