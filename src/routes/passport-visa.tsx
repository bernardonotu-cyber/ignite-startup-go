import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { TripBasketProvider } from "@/lib/trip-basket";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { DocumentsLayer } from "@/components/travel/documents-layer";

export const Route = createFileRoute("/passport-visa")({
  head: () => ({
    meta: [
      { title: "Passport & Visa Services — BUBOLI" },
      {
        name: "description",
        content:
          "Sort out your travel documents before you book: passport applications, renewals and express services, plus visa rules, fees and requirements per destination.",
      },
      { property: "og:title", content: "Passport & Visa Services — BUBOLI" },
      {
        property: "og:description",
        content:
          "Compare passport services and per-country visa options, check required documents and fees, and add them straight to your trip basket.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PassportVisaPage,
});

function PassportVisaPage() {
  return (
    <TripBasketProvider>
      <Page />
    </TripBasketProvider>
  );
}

function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 py-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="press flex items-center gap-2 rounded-full px-4 py-2">
            <Logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-[0.14em]">BUBOLI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:block">
              <Button variant="ghost" className="press rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to explore
              </Button>
            </Link>
            <TripBasketSheet />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <Reveal className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-grape/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-grape">
            Travel documents
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.75rem]">
            Passport & visa, sorted before you fly
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Check what your destination needs, compare processing times and fees, and add the right
            service to your trip basket — no surprises at the border.
          </p>
          <span className="mt-6 block h-px w-24 bg-gradient-to-r from-grape via-sunset to-transparent" />
        </Reveal>

        <DocumentsLayer />
      </main>

      <footer className="border-t px-4 py-12 text-center text-sm text-muted-foreground md:px-8">
        © {new Date().getFullYear()} BUBOLI. Built for travelers who like being in control.
      </footer>
    </div>
  );
}
