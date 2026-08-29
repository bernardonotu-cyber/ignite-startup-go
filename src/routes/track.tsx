import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Passport or Visa Application — BUBOLI" },
      {
        name: "description",
        content:
          "Enter your BUBOLI reference code to see exactly where your passport or visa application is, from submission to delivery.",
      },
      { property: "og:title", content: "Track Your Passport or Visa Application — BUBOLI" },
      {
        property: "og:description",
        content: "Live status updates for your travel document application, step by step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackLookup,
});

function TrackLookup() {
  const navigate = useNavigate();
  const [ref, setRef] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4">
          <Link to="/" className="press flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-[0.14em]">BUBOLI</span>
          </Link>
          <Link to="/passport-visa">
            <Button variant="ghost" className="press rounded-full">
              Passport & Visa
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col px-4 py-24">
        <h1 className="text-3xl font-semibold tracking-tight">Track your application</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the reference code we gave you when you submitted (it looks like BUB-4F2A9K). You'll
          be asked to sign in so only you can see your details.
        </p>
        <div className="mt-6 flex gap-2">
          <Input
            placeholder="BUB-XXXXXX"
            maxLength={20}
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
          />
          <Button
            className="press rounded-full px-6"
            disabled={ref.trim().length < 4}
            onClick={() =>
              navigate({ to: "/documents/$reference", params: { reference: ref.trim() } })
            }
          >
            Track
          </Button>
        </div>
      </main>
    </div>
  );
}
