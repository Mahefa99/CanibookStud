import { LitterCheckout } from "@/src/features/payments/components/litter-checkout";
import { PaidThreads } from "@/src/features/messaging/components/paid-threads";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLitter } from "@/src/features/litters/services/public-catalog";
import { formatCivilDate } from "@/src/lib/dates";
import { formatUsdCents } from "@/src/lib/money";

export default async function LitterDetail({ params }: { params: { slug: string } }) {
  const litter = await getLitter(params.slug);
  if (!litter) notFound();
  return <article className="shell space-y-4 py-10"><Link href="/puppies" className="underline">All litters</Link>
    <h1 className="font-display text-4xl">{litter.breed} litter</h1>
    <p>Born {formatCivilDate(litter.birth_date)} · {litter.puppy_count} puppies</p>
    <p>{formatUsdCents(litter.puppy_price)} per puppy</p>
    <div className="grid gap-4 sm:grid-cols-2">{litter.urls.map((url,i)=><img key={url} src={url} alt={litter.breed+" litter, photo "+(i+1)} className="w-full rounded-xl" />)}</div>
    <LitterCheckout listing={litter.id} count={litter.puppy_count} />
    <PaidThreads animal={{kind:"litter_id",id:litter.id}} />
  </article>;
}

