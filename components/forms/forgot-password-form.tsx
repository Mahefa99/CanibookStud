"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function requestLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setPending(true);
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(email, {
        redirectTo: new URL("/auth/recover", window.location.origin).href,
      });
      if (error && (error.status === 429 || !error.status || error.status >= 500)) {
        setMessage("Unable to request a link right now. Please try again later.");
      } else {
        setMessage("If your account is eligible, check your inbox and spam folder. Open the latest link in this browser.");
      }
    } catch {
      setMessage("Unable to reach the service. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return <form onSubmit={requestLink} className="space-y-4">
    <label className="field-label">Email<input className="form-input" name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <Button type="submit" disabled={pending} loading={pending}>Send reset link</Button>
    <p role="status">{message}</p>
  </form>;
}
