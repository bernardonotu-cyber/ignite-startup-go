import { useMemo, useState } from "react";
import { Search, Stamp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/reveal";
import { VisaCard } from "@/components/travel/documents-layer";
import { TRAVEL_PURPOSES } from "@/lib/documents-ui";
import type { VisaRuleRow } from "@/lib/documents.functions";

export function VisaTypesGrid({ rules }: { rules: VisaRuleRow[] }) {
  const [purpose, setPurpose] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [q, setQ] = useState("");

  const countries = useMemo(
    () => Array.from(new Set(rules.map((r) => r.destination_country))).sort(),
    [rules],
  );

  const visible = useMemo(() => {
    const seen = new Set<string>();
    const query = q.trim().toLowerCase();
    return rules
      .filter((r) => (purpose ? r.purpose === purpose : true))
      .filter((r) => (country ? r.destination_country === country : true))
      .filter((r) =>
        query
          ? `${r.type_label} ${r.destination_country} ${r.purpose_label} ${r.note}`
              .toLowerCase()
              .includes(query)
          : true,
      )
      .filter((r) => {
        // one card per visa type + purpose + country, so the grid stays readable
        const key = `${r.destination_country}|${r.purpose}|${r.type_label}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [rules, purpose, country, q]);

  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`press rounded-full border px-3.5 py-1.5 text-xs transition ${
        active
          ? "border-transparent bg-foreground text-background"
          : "bg-card hover:border-foreground/20 hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sunset/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sunset">
            <Stamp className="h-3.5 w-3.5" /> All visa types
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Know what you need? Go straight to it
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every visa we handle — tourist, business, student, work, family, medical and transit —
            with fees, processing times and a direct apply button.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search visa or country"
            className="h-11 rounded-2xl pl-9"
          />
        </div>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Purpose of travel
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Pill active={purpose === ""} onClick={() => setPurpose("")}>
          All purposes
        </Pill>
        {TRAVEL_PURPOSES.map((p) => (
          <Pill key={p.value} active={purpose === p.value} onClick={() => setPurpose(p.value)}>
            {p.label}
          </Pill>
        ))}
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Destination
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Pill active={country === ""} onClick={() => setCountry("")}>
          All countries
        </Pill>
        {countries.map((c) => (
          <Pill key={c} active={country === c} onClick={() => setCountry(c)}>
            {c}
          </Pill>
        ))}
      </div>

      <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((v, i) => (
          <Reveal key={v.id} delay={Math.min(i, 6) * 60}>
            <VisaCard v={v} />
          </Reveal>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Nothing matches those filters yet — try another purpose or country.
        </p>
      ) : null}
    </section>
  );
}
