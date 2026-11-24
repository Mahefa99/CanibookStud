import { DocumentSignals } from "@/src/features/stud-documents/views";
import { PaidThreads } from "@/src/features/messaging/components/paid-threads";
import { DepositCheckout } from "@/src/features/payments/components/deposit-checkout";
import { notFound } from "next/navigation";
import { getStud } from "../services/public-catalog";
import { MarketMap } from "@/src/features/maps/components/market-map";
import { formatUsdCents } from "@/src/lib/money";

export async function LiveProfile({ id }: { id: string }) {
  const stud = await getStud(id);
  if (!stud) notFound();
  return <article className="shell space-y-5 py-10"><h1 className="font-display text-4xl">{stud.name}</h1>
    <p>{stud.breed} · {formatUsdCents(stud.price)}</p><DocumentSignals id={stud.id}/><DepositCheckout key={stud.id} studId={stud.id} /><PaidThreads animal={{kind:"stud_id",id:stud.id}} /><MarketMap studs={[stud]} /></article>;
}


