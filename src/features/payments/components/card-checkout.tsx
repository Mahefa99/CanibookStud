"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { getStripeClient } from "@/src/lib/stripe/client";
import { formatUsdCents } from "@/src/lib/money";


type Order = {secret:string; cents:number; fee?:number};
export function CardCheckout({ startOrder,title,label }: {
  startOrder:()=>Promise<{message:string}|Order>; title:string; label:string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const checkout = useRef<{stripe:Stripe; elements:StripeElements} | null>(null);
  const [order,setOrder] = useState<Order | null>(null);
  const [busy,setBusy] = useState(false);
  const [ready,setReady] = useState(false);
  const [message,setMessage] = useState("");
  const [submitted,setSubmitted] = useState(false);

  useEffect(() => {
    if (!order) return;
    let disposed = false;
    let destroy: (()=>void) | undefined;
    async function mount(secret: string) {
      const stripe = await getStripeClient();
      if (disposed) return;
      if (!stripe || !container.current) throw new Error("Stripe unavailable");
      const elements = stripe.elements({clientSecret:secret});
      const payment = elements.create("payment");
      destroy = () => payment.destroy();
      payment.on("ready",()=>setReady(true));
      payment.on("loaderror",()=>setMessage("Unable to load the secure card form. Reload to retry."));
      checkout.current = { stripe,elements };
      payment.mount(container.current);
    }
    void mount(order.secret).catch(()=>{if (!disposed) setMessage("Unable to load the secure card form. Reload to retry.");});
    return ()=>{disposed=true;checkout.current=null;destroy?.();};
  },[order]);

  const router = useRouter();
  useEffect(() => {
    if (!submitted) return;
    // Refresh server-rendered permissions while the signed webhook is delivered.
    const timer = setInterval(() => router.refresh(), 3000);
    const stop = setTimeout(() => clearInterval(timer), 30000);
    return () => { clearTimeout(stop); clearInterval(timer); };
  }, [submitted, router]);

  async function start() {
    setBusy(true);setMessage("");
    try {
      const result = await startOrder();
      if ("message" in result) setMessage(result.message);
      else setOrder(result);
    } catch { setMessage("Unable to open checkout. Try again."); }
    finally { setBusy(false); }
  }

  async function pay() {
    if (!checkout.current) return;
    setBusy(true);setMessage("");
    try {
      const {stripe,elements} = checkout.current;
      const result = await stripe.confirmPayment({ elements, redirect:"if_required",
        confirmParams:{ return_url:window.location.origin + window.location.pathname } });
      if (result.error) setMessage(result.error.message ?? "Payment failed. Check your card details.");
      else { setSubmitted(true);setMessage("Payment submitted. Server confirmation is pending."); }
    } catch { setMessage("Payment status unavailable. Reopen checkout to check before retrying."); }
    finally { setBusy(false); }
  }

  return <section className="surface max-w-xl space-y-3 p-5"><h2 className="font-semibold">{title} · test mode</h2>
    {!order && <button className="underline" disabled={busy} onClick={start}>{label}</button>}
    <p>{order?.fee !== undefined && "Includes a platform fee of " + formatUsdCents(order.fee)}</p>
    <div ref={container} hidden={submitted} />
    {order && !submitted && <button className="rounded-full bg-navy-700 px-5 py-2 text-white" disabled={!ready || busy} onClick={pay}>Pay {formatUsdCents(order.cents)} in test mode</button>}
    <p role="status">{message}</p>
  </section>;
}


