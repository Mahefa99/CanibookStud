import Link from "next/link";
import { listLitters } from "@/src/features/litters/services/public-catalog";
import { formatUsdCents } from "@/src/lib/money";
import { formatCivilDate } from "@/src/lib/dates";
export const metadata = { title: "Puppies & litters" };
export default async function Puppies({ searchParams }: { searchParams: { breed?: string; page?: string } }) {
  const breed = typeof searchParams.breed === "string" ? searchParams.breed.trim().slice(0,100) : "";
  const n = Number(searchParams.page);
  const page = Number.isSafeInteger(n) && n>0 && n<=1000000 ? n : 1;
  const {litters,more} = await listLitters(page,breed);
  const href = (p: number) => "/puppies?" + new URLSearchParams({breed,page:String(p)});
  return <section className="shell space-y-5 py-10"><h1 className="font-display text-4xl">Puppies &amp; litters</h1>
    <Link className="underline" href="/dashboard/animals/new/litter">List a litter</Link>
    <form><label className="field-label">Breed<input className="form-input" name="breed" defaultValue={breed} /></label><button className="underline">Filter litters</button></form>
    {litters.length ? <ul className="grid gap-4 sm:grid-cols-2">{litters.map(litter=><li key={litter.id}>
      <Link href={`/puppies/${litter.id}`} className="surface block h-full p-4 hover:underline focus-visible:outline">
        <h2 className="font-semibold">{litter.breed} litter</h2>
        <p>Born {formatCivilDate(litter.birth_date)} · {litter.puppy_count} puppies</p>
        <p>{formatUsdCents(litter.puppy_price)} per puppy</p>
        <span className="underline">View litter</span>
      </Link>
    </li>)}</ul> : <p>{breed || page > 1
      ? <>No litters match this search. <Link className="underline" href="/puppies">Show all litters</Link></>
      : "No published litters are currently available."}</p>}
    <nav className="flex gap-4">{page>1 && <Link href={href(page-1)}>Previous</Link>}{more && <Link href={href(page+1)}>Next</Link>}</nav>
  </section>;
}
