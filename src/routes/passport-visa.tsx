import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CheckCircle2, AlertTriangle, BookUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { DocumentsLayer, VisaCard } from "@/components/travel/documents-layer";
import { RequirementWizard } from "@/components/travel/requirement-wizard";
import { VisaTypesGrid } from "@/components/travel/visa-types-grid";
import { getDocumentsCatalog } from "@/lib/documents.functions";
import {
  DEFAULT_ORIGIN,
  DEFAULT_PURPOSE,
  ORIGIN_COUNTRIES,
  PURPOSE_LABEL,
} from "@/lib/documents-ui";

type Search = { from?: string; to?: string; purpose?: string };

export const Route = createFileRoute("/passport-visa")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    from: typeof search.from === "string" ? search.from.slice(0, 60) : undefined,
    to: typeof search.to === "string" ? search.to.slice(0, 60) : undefined,
    purpose: typeof search.purpose === "string" ? search.purpose.slice(0, 30) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Passport & Visa Services — E-Embassy" },
      {
        name: "description",
        content:
          "Tell us where you're travelling from and to, and see instantly whether you need a visa or a passport — then apply and track it in one place.",
      },
      { property: "og:title", content: "Passport & Visa Services — E-Embassy" },
      {
        property: "og:description",
        content:
          "Check visa requirements by country pair, compare passport services and fees, apply online and track your application.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PassportVisaPage,
});

function PassportVisaPage() {
  return (
      <Page />
  );
}

function Page() {
  const { from, to, purpose } = Route.useSearch();
  const fetchCatalog = useServerFn(getDocumentsCatalog);
  const { data, isLoading } = useQuery({
    queryKey: ["documents-catalog"],
    queryFn: () => fetchCatalog(),
  });

  const services = data?.services ?? [];
  const rules = data?.rules ?? [];

  const origin = from && ORIGIN_COUNTRIES.includes(from) ? from : DEFAULT_ORIGIN;
  const activePurpose = purpose && PURPOSE_LABEL[purpose] ? purpose : DEFAULT_PURPOSE;

  const pool =
    from && to
      ? rules.filter(
          (r) =>
            r.destination_country.startsWith(to) &&
            (r.origin_country === origin || r.origin_country === DEFAULT_ORIGIN),
        )
      : [];

  const pick = (p: string) => {
    const all = pool.filter((r) => r.purpose === p);
    const specific = all.filter((r) => r.origin_country === origin);
    return specific.length ? specific : all;
  };

  const purposeMatches = pick(activePurpose);
  const fellBack = purposeMatches.length === 0 && activePurpose !== DEFAULT_PURPOSE;
  const matches = purposeMatches.length ? purposeMatches : pick(DEFAULT_PURPOSE);
  const visaFree = matches.length > 0 && matches.every((r) => r.requirement === "visa_free");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 py-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="press flex items-center gap-2 rounded-full px-4 py-2">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/hire" className="hidden sm:block">
              <Button variant="ghost" className="press rounded-full">
                Hire a Pro
              </Button>
            </Link>
            <Link to="/track" className="hidden sm:block">
              <Button variant="ghost" className="press rounded-full">
                Track application
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
            Travel documents
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.75rem]">
            Passport & visa, sorted before you fly
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Answer two questions and we'll tell you exactly what your trip needs, what it costs and
            how long it takes.
          </p>
          <span className="mt-6 block h-px w-24 bg-gradient-to-r from-grape via-sunset to-transparent" />
        </Reveal>

        <RequirementWizard compact />

        {from && to ? (
          <section className="mt-12">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Checking the rules…</p>
            ) : matches.length === 0 ? (
              <div className="rounded-3xl border bg-card p-6">
                <p className="font-medium">
                  We don't have a saved rule for {from} → {to} yet.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse the options below, or apply for a passport service in the meantime.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`rounded-3xl border p-6 ${
                    visaFree ? "border-leaf/40 bg-leaf/5" : "border-sunset/40 bg-sunset/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {visaFree ? (
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-leaf" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-sunset" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight">
                        {visaFree
                          ? `Good news — you don't need a visa for ${to}`
                          : `You'll need a visa for ${to}`}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Travelling from {from} for {PURPOSE_LABEL[activePurpose].toLowerCase()}.{" "}
                        {visaFree
                          ? "Just make sure your passport is valid — most countries want at least six months left."
                          : "Here are the options that apply to you, with fees and processing times."}
                      </p>
                      {fellBack ? (
                        <p className="mt-2 rounded-xl bg-background/60 p-3 text-xs text-muted-foreground">
                          We don't have a dedicated {PURPOSE_LABEL[activePurpose].toLowerCase()}{" "}
                          rule for {to} yet, so these are the closest options. Browse all visa types
                          below for more.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {matches.map((v) => (
                      <VisaCard key={v.id} v={v} />
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <BookUser className="mt-0.5 h-5 w-5 shrink-0 text-lagoon" />
                    <div>
                      <p className="font-medium">No passport, or expiring within 6 months?</p>
                      <p className="text-sm text-muted-foreground">
                        Start a passport application — new, renewal or express.
                      </p>
                    </div>
                  </div>
                  <Link to="/documents/apply" search={{ kind: "passport" }}>
                    <Button className="press rounded-full">Apply for a passport</Button>
                  </Link>
                </div>
              </>
            )}
          </section>
        ) : null}

        <div className="mt-16">
          <VisaTypesGrid rules={rules} />
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Browse all services</h2>
          <DocumentsLayer services={services} rules={rules} />
        </div>
      </main>

      <footer className="border-t px-4 py-12 text-center text-sm text-muted-foreground md:px-8">
        © {new Date().getFullYear()} E-Embassy. Built for travelers who like being in control.
      </footer>
    </div>
  );
}
