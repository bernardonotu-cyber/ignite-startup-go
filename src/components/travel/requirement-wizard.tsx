import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, ArrowRight } from "lucide-react";
import { DESTINATIONS } from "@/lib/travel-catalog";
import { ORIGIN_COUNTRIES } from "@/lib/documents-ui";

const DESTINATION_COUNTRIES = Array.from(
  new Map(DESTINATIONS.map((d) => [d.country, d.city])).entries(),
);

export function RequirementWizard({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const go = () => {
    if (!from || !to) return;
    navigate({ to: "/passport-visa", search: { from, to } });
  };

  return (
    <div
      className={`rounded-3xl border bg-card/95 p-5 shadow-xl backdrop-blur md:p-6 ${
        compact ? "" : "mx-auto max-w-4xl"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-grape">
        <Compass className="h-4 w-4" /> Step 1 — check your documents
      </div>
      <p className="mt-2 text-lg font-semibold tracking-tight">
        Tell us where you're going from, and where to.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        We'll tell you in plain English whether you need a visa or a new passport — then help you apply.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger className="h-12 rounded-2xl">
            <SelectValue placeholder="Travelling from" />
          </SelectTrigger>
          <SelectContent>
            {ORIGIN_COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={to} onValueChange={setTo}>
          <SelectTrigger className="h-12 rounded-2xl">
            <SelectValue placeholder="Travelling to" />
          </SelectTrigger>
          <SelectContent>
            {DESTINATION_COUNTRIES.map(([country, city]) => (
              <SelectItem key={country} value={country}>
                {country} · {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={go}
          disabled={!from || !to}
          className="press h-12 rounded-2xl bg-foreground px-6 text-background hover:bg-foreground/90"
        >
          Check my requirements <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
