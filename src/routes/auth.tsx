import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { toast } from "sonner";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect:
      typeof search.redirect === "string" && search.redirect.startsWith("/") && !search.redirect.startsWith("//")
        ? search.redirect
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — E-Embassy" },
      { name: "description", content: "Sign in to E-Embassy to plan and manage your trips." },
      { property: "og:title", content: "Sign in — E-Embassy" },
      { property: "og:description", content: "Sign in to E-Embassy." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const destination = redirect ?? "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgot, setForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: destination });
    });
  }, [navigate, destination]);

  const goToDestination = async () => {
    // Wait until the session is fully established before leaving this page,
    // otherwise the auth gate sees no user and bounces us back here.
    for (let i = 0; i < 10; i++) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        navigate({ to: destination });
        return true;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + destination, data: { full_name: name } },
        });
        if (error) throw error;
        if (!data.session) {
          setError("Check your email to confirm your account, then sign in.");
          return;
        }
        toast.success("Account created");
        await goToDestination();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await goToDestination();
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter your email address first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setForgotSent(true);
      toast.success("Password reset email sent");
    } catch (err: any) {
      setError(err.message ?? "Could not send the reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      sessionStorage.setItem("wp.auth.redirect", destination);
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch (err: any) {
      setError(err.message ?? "Google sign-in failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-foreground">
          <Logo className="h-8" />
        </Link>
        <Card className="p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {forgot ? "Reset your password" : mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {forgot
              ? "We'll email you a link to set a new password."
              : mode === "signin"
                ? "Sign in to continue planning."
                : "Start planning your next trip in minutes."}
          </p>

          {error ? (
            <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {forgot ? (
            forgotSent ? (
              <div className="mt-6 space-y-4">
                <p className="rounded-xl bg-muted px-3 py-2 text-sm">
                  Check your inbox for the reset link — it opens the page where you set a new password.
                </p>
                <Button variant="outline" className="w-full" onClick={() => { setForgot(false); setForgotSent(false); }}>
                  Back to sign in
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setForgot(false)}>
                  Back to sign in
                </Button>
              </form>
            )
          ) : (
            <>
              <Button type="button" variant="outline" className="mt-6 w-full" onClick={handleGoogle}>
                Continue with Google
              </Button>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "signin" ? (
                      <button
                        type="button"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                        onClick={() => { setForgot(true); setError(null); }}
                      >
                        Forgot password?
                      </button>
                    ) : null}
                  </div>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button
                  className="font-medium text-foreground hover:underline"
                  onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
