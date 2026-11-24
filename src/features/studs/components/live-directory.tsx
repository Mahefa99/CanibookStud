import Link from "next/link";
import { listStuds } from "../services/public-catalog";
import { MarketMap } from "@/src/features/maps/components/market-map";
import { formatUsdCents } from "@/src/lib/money";

export async function LiveDirectory({ params }: { params: Record<string, string | string[] | undefined> }) {
  const breed = typeof params.breed === "string" ? params.breed.trim().slice(0,100) : "";
  const number = Number(params.page);
  const page = Number.isSafeInteger(number) && number > 0 && number <= 1000000 ? number : 1;
  const { studs, more } = await listStuds(page, breed);
  const href = (n: number) => "/studs?" + new URLSearchParams({ breed, page: String(n) });
  return <section className="shell space-y-5 py-10">
    <h1 className="font-display text-4xl">Stud directory</h1>
    <form><label className="field-label">Breed<input className="form-input" name="breed" defaultValue={breed} /></label><button className="underline">Filter studs</button></form>
    {studs.length > 0 ? <><MarketMap studs={studs} /><ul className="grid gap-3 sm:grid-cols-2">
      {studs.map(s => <li className="surface p-4" key={s.id}><Link className="font-semibold underline" href={"/studs/"+s.id}>{s.name}</Link><p>{s.breed} · {formatUsdCents(s.price)}</p></li>)}
    </ul></> : <p>No published studs match this page.</p>}
    <nav className="flex gap-4">{page > 1 && <Link href={href(page-1)}>Previous</Link>}{more && <Link href={href(page+1)}>Next</Link>}</nav>
  </section>;
}
