import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { HireExplorer } from "@/components/travel/hire-explorer";

export const Route = createFileRoute("/hire")({
  head: () => ({
    meta: [
      { title: "Hire a Pro — Freelancers for Your Trip | World Portal" },
      {
        name: "description",
        content:
          "Hire vetted photographers, videographers, private chefs, barbers, personal shoppers, interpreters, security, babysitters and event planners in your destination.",
      },
      { property: "og:title", content: "Hire a Pro — Freelancers for Your Trip | World Portal" },
      {
        property: "og:description",
        content:
          "Pick a profession, pick a city, see real profiles with rates and packages — then add them straight to your trip basket.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HirePage,
});

function HirePage() {
  return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 py-2 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
            <Link to="/" className="press flex items-center gap-2 rounded-full px-4 py-2">
              <Logo className="h-6 w-6" />
              <span className="text-base font-semibold tracking-[0.14em]">World Portal</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/passport-visa" className="hidden sm:block">
                <Button variant="ghost" className="press rounded-full">
                  Passport &amp; Visa
                </Button>
              </Link>
              <Link to="/" className="hidden sm:block">
                <Button variant="ghost" className="press rounded-full">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to explore
                </Button>
              </Link>
              <ThemeToggle />
              <TripBasketSheet />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <Reveal className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-grape/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-grape">
              <Sparkles className="h-3.5 w-3.5" /> Hire a pro
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.75rem]">
              Bring the right people with you
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Photographers, videographers, private chefs, barbers, personal shoppers, interpreters,
              private security, babysitters, event planners and fixers — all vetted, all with clear
              rates. Pick a profession, see who's available in your city, and add them to your basket.
            </p>
            <span className="mt-6 block h-px w-24 bg-gradient-to-r from-grape via-sunset to-transparent" />
          </Reveal>

          <HireExplorer />
        </main>

        <footer className="border-t px-4 py-12 text-center text-sm text-muted-foreground md:px-8">
          © {new Date().getFullYear()} World Portal. Built for travelers who like being in control.
        </footer>
      </div>
  );
}
