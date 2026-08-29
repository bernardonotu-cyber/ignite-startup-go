import { useMemo, useState } from "react";
import { Search, Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProCard } from "@/components/travel/pro-card";
import { Reveal } from "@/components/reveal";
import { PROFESSIONS, PRO_CITIES, countFor, prosFor } from "@/lib/pros-catalog";

export function HireExplorer() {
  const [profession, setProfession] = useState("all");
  const [city, setCity] = useState("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => prosFor(profession, city, query), [profession, city, query]);
  const active = PROFESSIONS.find((p) => p.id === profession);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-3xl border bg-card/95 p-5 shadow-xl backdrop-blur md:grid-cols-[1.1fr_1fr_1.2fr] md:p-6">
        <Select value={profession} onValueChange={setProfession}>
          <SelectTrigger className="h-12 rounded-2xl">
            <SelectValue placeholder="What do you need?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All professionals</SelectItem>
            {PROFESSIONS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex flex-col text-left">
                  <span>
                    {p.label} ({countFor(p.id)})
                  </span>
                  <span className="text-[11px] text-muted-foreground">{p.blurb}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-12 rounded-2xl">
            <SelectValue placeholder="Where?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any city</SelectItem>
            {PRO_CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search names, skills, cities…"
            className="h-12 rounded-2xl pl-11"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setProfession("all")}
          className={`press rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
            profession === "all" ? "bg-foreground text-background" : "hover:bg-muted"
          }`}
        >
          All
        </button>
        {PROFESSIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setProfession(p.id)}
            className={`press rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              profession === p.id ? "bg-foreground text-background" : "hover:bg-muted"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <Users2 className="mr-1.5 inline h-4 w-4" />
          {results.length} {results.length === 1 ? "professional" : "professionals"} available
          {city !== "all" ? ` in ${city}` : ""}
        </p>
        {active ? (
          <Badge variant="secondary" className="text-[11px]">
            {active.blurb}
          </Badge>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No one matches that yet. Try another city or clear the search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((pro, i) => (
            <Reveal key={pro.id} delay={i * 50}>
              <ProCard pro={pro} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
