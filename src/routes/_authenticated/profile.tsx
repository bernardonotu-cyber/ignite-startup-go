import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { AccountMenu } from "@/components/account-menu";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — World Portal" },
      { name: "description", content: "Manage your World Portal account details, name and avatar." },
      { property: "og:title", content: "Your Profile — World Portal" },
      { property: "og:description", content: "Manage your World Portal account details." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      setEmail(user.email ?? "");
      const [{ data: profile }, { data: roleRows }] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      setFullName(profile?.full_name ?? (user.user_metadata?.full_name as string) ?? "");
      setAvatarUrl(profile?.avatar_url ?? (user.user_metadata?.avatar_url as string) ?? "");
      setRoles((roleRows ?? []).map((r) => r.role as string));
      setLoading(false);
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email ?? "",
      full_name: fullName || null,
      avatar_url: avatarUrl || null,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <TripBasketSheet />
            <AccountMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account details across World Portal.</p>

        <Card className="mt-6 max-w-xl p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <form onSubmit={save} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} readOnly disabled />
              </div>
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="avatar">Avatar image URL</Label>
                <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
              </div>
              {roles.length ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Roles:</span>
                  {roles.map((r) => <Badge key={r} className="capitalize">{r}</Badge>)}
                </div>
              ) : null}
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}
