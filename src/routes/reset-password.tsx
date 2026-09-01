import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — World Portal" },
      { name: "description", content: "Choose a new password for your World Portal account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecking(false);
      }
    });
    // If the session was already recovered before this page mounted.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true);
        setChecking(false);
      } else {
        setTimeout(() => setChecking(false), 3000);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message ?? "Could not update your password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-foreground">
          <Logo className="h-8" />
        </Link>
        <Card className="p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
          {checking ? (
            <p className="mt-4 text-sm text-muted-foreground">Checking your reset link…</p>
          ) : !ready ? (
            <div className="mt-4 space-y-4">
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                This reset link is invalid or has expired. Request a fresh one.
              </p>
              <Link to="/auth">
                <Button variant="outline" className="w-full">Back to sign in</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {error ? (
                <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <div>
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating…" : "Update password"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
