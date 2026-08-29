import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { getApplication } from "@/lib/documents.functions";
import { STATUS_FLOW, STATUS_LABEL, formatMoney } from "@/lib/documents-ui";

export const Route = createFileRoute("/_authenticated/documents/$reference")({
  component: TrackApplication,
});

function TrackApplication() {
  const { reference } = Route.useParams();
  const fetchApp = useServerFn(getApplication);
  const { data, isLoading } = useQuery({
    queryKey: ["application", reference],
    queryFn: () => fetchApp({ data: { reference } }),
  });

  const app = data?.application ?? null;
  const events = data?.events ?? [];
  const currentIndex = app ? STATUS_FLOW.indexOf(app.status) : -1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4">
          <Link to="/" className="press flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-[0.14em]">World Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/documents">
              <Button variant="ghost" className="press rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> My documents
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}

        {!isLoading && !app ? (
          <div className="rounded-3xl border bg-card p-8 text-center">
            <p className="font-medium">We couldn't find application {reference}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check the reference code, or open it from My documents.
            </p>
          </div>
        ) : null}

        {app ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Reference {app.reference}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{app.service_name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{STATUS_LABEL[app.status]}</Badge>
              <Badge variant="outline" className="tabular-nums">
                {formatMoney(Number(app.price))}
              </Badge>
              <Badge variant="outline">{app.travelers} traveller(s)</Badge>
              {app.travel_date ? (
                <Badge variant="outline">Travel {new Date(app.travel_date).toLocaleDateString()}</Badge>
              ) : null}
            </div>

            {app.admin_note ? (
              <p className="mt-5 rounded-2xl border bg-muted/40 p-4 text-sm">{app.admin_note}</p>
            ) : null}

            <section className="mt-10 rounded-3xl border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Progress
              </h2>
              <ol className="mt-5 space-y-5">
                {STATUS_FLOW.map((s, i) => {
                  const done = app.status !== "rejected" && i <= currentIndex;
                  const event = [...events].reverse().find((e) => e.status === s);
                  return (
                    <li key={s} className="flex gap-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          done ? "bg-leaf text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2" />}
                      </span>
                      <div>
                        <p className={`font-medium ${done ? "" : "text-muted-foreground"}`}>
                          {STATUS_LABEL[s]}
                        </p>
                        {event ? (
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                            {event.note ? ` · ${event.note}` : ""}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {app.status === "rejected" ? (
                <p className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
                  This application was rejected. Contact support and we'll help you re-apply.
                </p>
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
