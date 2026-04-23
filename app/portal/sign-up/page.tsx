"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { Brand } from "@/components/site/Brand";
import { Button } from "@/components/ui/Button";
import { Field, Input, Checkbox } from "@/components/ui/Field";
import { useAuth } from "@/lib/firebase/auth";

function mapSignUpError(code: string | null | undefined) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Use at least 8 characters for your password.";
    case "auth/network-request-failed":
      return "Network error — check your connection.";
    case "firestore/permission-denied":
      return "Account created but profile write was blocked by Firestore rules. Deploy/update Firestore rules and try again.";
    default:
      return "We couldn't create your account. Please try again.";
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signingIn } = useAuth();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms before continuing.");
      return;
    }
    setError(null);
    try {
      await signUp({
        email,
        password,
        fullName: `${first.trim()} ${last.trim()}`.trim(),
        role: "participant",
      });
      setSubmitted(true);
    } catch (err) {
      const code = (err as { code?: string } | null)?.code;
      setError(mapSignUpError(code));
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 h-14 flex items-center justify-between">
          <Brand size="sm" />
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
                  You can now view your pathway, message your advisor, and
                  upload documents.
                </p>
                <div className="mt-6 grid gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/portal/participant")}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-primary text-white font-medium text-[14px] hover:bg-primary-700"
                  >
                    Continue to your portal{" "}
                    <ArrowRight size={14} className="ml-2" />
                  </button>
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
                  This is the same account you'll use to view your pathway,
                  message your advisor, and upload documents.
                </p>

                <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name" required htmlFor="su-first">
                      <Input
                        id="su-first"
                        required
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        autoComplete="given-name"
                      />
                    </Field>
                    <Field label="Last name" required htmlFor="su-last">
                      <Input
                        id="su-last"
                        required
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>
                  <Field label="Email address" required htmlFor="su-email">
                    <Input
                      id="su-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="you@example.com"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Field>

                  <Checkbox
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    label="I agree to the Terms and Privacy Policy"
                    description="We never sell your information. Your data is used only to deliver Career Access Hub services."
                  />

                  {error ? (
                    <p
                      role="alert"
                      className="rounded-md border border-danger/30 bg-danger-50 px-3 py-2 text-[13px] text-[#991B1B]"
                    >
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={signingIn}
                  >
                    {signingIn ? "Creating account…" : "Create account"}{" "}
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
