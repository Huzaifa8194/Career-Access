"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "@/components/icons";
import { Brand } from "@/components/site/Brand";
import { Button } from "@/components/ui/Button";
import { Field, Input, Checkbox } from "@/components/ui/Field";
import { friendlyAuthError, useAuth } from "@/lib/firebase/auth";
import { fetchParticipantByEmail } from "@/lib/services/participants";

export default function SignUpPage() {
  const router = useRouter();
  const { user, signUp } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user && !submitted) {
      router.replace("/portal/participant");
    }
  }, [user, submitted, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      let participantId: string | undefined;
      try {
        const existing = await fetchParticipantByEmail(email);
        if (existing) participantId = existing.id;
      } catch {}
      await signUp(
        email,
        password,
        `${firstName} ${lastName}`.trim(),
        "participant",
        {
          phone: phone || undefined,
          participantId,
        }
      );
      setSubmitted(true);
    } catch (err) {
      setError(friendlyAuthError(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 h-14 flex items-center justify-between">
          <Brand markOnly size="sm" className="shrink-0" />
          <Link
            href="/portal"
            className="text-[13px] font-medium text-ink-muted hover:text-ink"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-line rounded-lg p-7 sm:p-9 shadow-[var(--shadow-card)]">
            {submitted ? (
              <div className="text-center py-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-action-50 text-action">
                  <Check size={20} />
                </span>
                <h2 className="mt-4 text-[22px] font-semibold tracking-tight">
                  Account created
                </h2>
                <p className="mt-2 text-[14px] text-ink-muted leading-6">
                  You&apos;re signed in. Continue to your portal.
                </p>
                <div className="mt-6 grid gap-3">
                  <Link
                    href="/portal/participant"
                    className="inline-flex h-11 items-center justify-center rounded-md bg-primary text-white font-medium text-[14px] hover:bg-primary-700"
                  >
                    Continue to your portal{" "}
                    <ArrowRight size={14} className="ml-2" />
                  </Link>
                  <Link
                    href="/apply"
                    className="text-[13px] font-medium text-primary hover:underline"
                  >
                    Or start your application now
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-ink-subtle">
                  <span className="h-1.5 w-1.5 rounded-full bg-action" />
                  Create account
                </div>
                <h1 className="mt-3 text-[28px] font-semibold tracking-tight leading-[1.1]">
                  Set up your account
                </h1>
                <p className="mt-2 text-[14px] text-ink-muted leading-6">
                  This is the same account you&apos;ll use to view your pathway,
                  message your advisor, and upload documents.
                </p>

                <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name" required htmlFor="su-first">
                      <Input
                        id="su-first"
                        required
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Field>
                    <Field label="Last name" required htmlFor="su-last">
                      <Input
                        id="su-last"
                        required
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Email address" required htmlFor="su-email">
                    <Input
                      id="su-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Mobile phone"
                    htmlFor="su-phone"
                    hint="So your advisor can reach you. Optional but recommended."
                  >
                    <Input
                      id="su-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(617) 555-0123"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Create a password"
                    required
                    htmlFor="su-pw"
                    hint="At least 8 characters."
                  >
                    <Input
                      id="su-pw"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>

                  <Checkbox
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    label="I agree to the Terms and Privacy Policy"
                    description="We never sell your information. Your data is used only to deliver Career Access Hub services."
                  />

                  {error && (
                    <div className="rounded-md border border-danger/30 bg-danger-50 p-3 text-[13px] text-danger">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Creating account…" : "Create account"}{" "}
                    <ArrowRight size={16} />
                  </Button>
                </form>

                <div className="mt-6 pt-5 border-t border-line text-[13px] text-ink-muted text-center">
                  Already applied or have an account?{" "}
                  <Link
                    href="/portal"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
