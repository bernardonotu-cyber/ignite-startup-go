import { useState } from "react";
import { BookUser, Stamp, Clock, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/reveal";
import { AddButton } from "@/components/travel/destination-explorer";
import { DESTINATIONS } from "@/lib/travel-catalog";
import { PASSPORT_SERVICES, VISA_OPTIONS, VISA_STEPS } from "@/lib/documents-catalog";

const ACCENT_BG: Record<string, string> = {
  sunset: "bg-sunset/10 text-sunset",
  lagoon: "bg-lagoon/10 text-lagoon",
  grape: "bg-grape/10 text-grape",
  mango: "bg-mango/10 text-mango",
  leaf: "bg-leaf/10 text-leaf",
};

function DocList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-1.5">
      {items.map((d) => (
        <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" />
          {d}
        </li>
      ))}
    </ul>
  );
}

function PassportPanel() {
  return (
    <div className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
      {PASSPORT_SERVICES.map((s, i) => (
        <Reveal key={s.id} delay={i * 70}>
          <article className="shine flex h-full flex-col rounded-3xl border bg-card p-6 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-foreground/15 hover:shadow-2xl">
            <span className={`w-fit rounded-2xl p-3 ${ACCENT_BG[s.accent]}`}>
              <BookUser className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[11px] font-normal">
                <Clock className="mr-1 h-3 w-3" /> {s.processing}
              </Badge>
              <Badge variant="outline" className="text-[11px] font-normal">
                <ShieldCheck className="mr-1 h-3 w-3" /> Valid {s.validity}
              </Badge>
            </div>

            <p className="mt-5 text-[11px] uppercase tracking-wide text-muted-foreground">You'll need</p>
            <DocList items={s.documents} />

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-xl font-semibold tabular-nums">${s.price.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">service + government fee</p>
              </div>
              <AddButton
                item={{
                  id: s.id,
                  kind: "document",
                  title: s.name,
                  subtitle: `${s.processing} · valid ${s.validity}`,
                  price: s.price,
                  destination: "Passport",
                }}
              />
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

function VisaPanel() {
  const [dest, setDest] = useState(DESTINATIONS[0]?.id ?? "santorini");
  const options = VISA_OPTIONS.filter((v) => v.destinationId === dest);
  const city = DESTINATIONS.find((d) => d.id === dest);

  return (
    <div className="pt-6">
      <div className="flex flex-wrap gap-2">
        {DESTINATIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDest(d.id)}
            className={`press rounded-full border px-4 py-2 text-sm transition ${
              dest === d.id
                ? "border-transparent bg-foreground text-background"
                : "bg-card hover:border-foreground/20 hover:bg-muted"
            }`}
          >
            {d.country}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {options.map((v, i) => (
          <Reveal key={v.id} delay={i * 70}>
            <article className="shine flex h-full flex-col rounded-3xl border bg-card p-6 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-foreground/15 hover:shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{v.country}</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{v.type}</h3>
                </div>
                {v.fee === 0 ? (
                  <Badge className="bg-leaf/15 text-leaf hover:bg-leaf/20">No fee</Badge>
                ) : (
                  <Badge variant="secondary" className="tabular-nums">${v.fee}</Badge>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-[11px] font-normal">
                  <Clock className="mr-1 h-3 w-3" /> {v.processing}
                </Badge>
                <Badge variant="outline" className="text-[11px] font-normal">
                  Stay: {v.stay}
                </Badge>
                <Badge variant="outline" className="text-[11px] font-normal">
                  {v.entries}
                </Badge>
              </div>

              <p className="mt-5 text-[11px] uppercase tracking-wide text-muted-foreground">Required documents</p>
              <DocList items={v.documents} />

              <p className="mt-4 flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {v.note}
              </p>

              <div className="mt-auto flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-xl font-semibold tabular-nums">
                    {v.fee === 0 ? "Free" : `$${v.fee.toLocaleString()}`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {v.fee === 0 ? "no visa required" : "per traveler"}
                  </p>
                </div>
                <AddButton
                  item={{
                    id: v.id,
                    kind: "document",
                    title: `${v.type} · ${v.country}`,
                    subtitle: `${v.stay} · ${v.processing}`,
                    price: v.fee,
                    destination: city ? city.city : v.country,
                  }}
                />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function DocumentsLayer() {
  return (
    <div>
      <Tabs defaultValue="passport" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="passport">
            <BookUser className="mr-1.5 h-4 w-4" /> Passport
          </TabsTrigger>
          <TabsTrigger value="visa">
            <Stamp className="mr-1.5 h-4 w-4" /> Visa
          </TabsTrigger>
        </TabsList>
        <TabsContent value="passport">
          <PassportPanel />
        </TabsContent>
        <TabsContent value="visa">
          <VisaPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VISA_STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 70}>
            <div className="h-full rounded-2xl border bg-card p-5">
              <span className="text-xs font-semibold tabular-nums text-sunset">0{i + 1}</span>
              <p className="mt-2 font-medium tracking-tight">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
