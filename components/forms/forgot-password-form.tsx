"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/forms/fields";
import { Icon } from "@/components/ui/icon";

/**
 * Password-reset request preview. The form validates locally and always shows
 * the same neutral response; it makes no request and sends no email.
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border border-info-600/20 bg-info-50 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-info-700">
          <Icon name="check" className="h-4 w-4" />
          Check your email
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-info-700">
          If an account exists for {email}, a reset link would be sent. No email was sent in this
          preview, and this response does not confirm that an account exists.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        id="reset-email"
        name="email"
        type="email"
        label="Email"
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setError(undefined);
        }}
        error={error}
        hint="No address is stored or sent in this preview."
        autoComplete="email"
      />
      <Button type="submit" fullWidth iconRight={<Icon name="arrow-right" className="h-4 w-4" />}>
        Request a reset link
      </Button>
      <p className="text-center text-[10px] text-muted">
        The response is identical whether or not an account exists.
      </p>
    </form>
  );
}
