import { useState } from "react";
import {
  Star,
  Languages,
  Clock,
  BadgeCheck,
  CalendarClock,
  Sparkles,
  ListChecks,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TravelPro } from "@/lib/pros-catalog";
import { PROFESSIONS } from "@/lib/pros-catalog";
import { AddButton } from "@/components/travel/destination-explorer";

function professionLabel(id: string) {
  return PROFESSIONS.find((p) => p.id === id)?.label ?? "Professional";
}

function basketItem(pro: TravelPro) {
  return {
    id: pro.id,
    kind: "pro" as const,
    title: `${pro.name} · ${professionLabel(pro.professionId)}`,
    subtitle: `${pro.rateUnit} · ${pro.city}`,
    price: pro.rate,
    destination: pro.city,
  };
}

function Spec({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium leading-tight">{value}</p>
    </div>
  );
}

export function ProCard({ pro }: { pro: TravelPro }) {
  const [open, setOpen] = useState(false);
  const item = basketItem(pro);

  return (
    <>
      <div className="group overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg">
        <button type="button" onClick={() => setOpen(true)} className="press flex w-full gap-3 p-3 text-left">
          <img
            src={pro.image}
            alt={`${pro.name}, ${professionLabel(pro.professionId)} in ${pro.city}`}
            loading="lazy"
            width={800}
            height={800}
            className="h-20 w-20 flex-none rounded-xl object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-medium tracking-tight">{pro.name}</p>
              <span className="flex flex-none items-center gap-1 text-xs font-medium">
                <Star className="h-3.5 w-3.5 fill-mango text-mango" />
                {pro.rating}
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{pro.headline}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <Badge className="bg-grape text-sunset-foreground text-[10px] hover:bg-grape">
                {professionLabel(pro.professionId)}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-normal">
                <MapPin className="mr-1 h-3 w-3" /> {pro.city}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {pro.languages.join(" · ")}
              </Badge>
            </div>
          </div>
        </button>
        <div className="flex items-center justify-between border-t px-3 py-2.5">
          <div>
            <p className="text-base font-semibold tabular-nums">${pro.rate.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{pro.rateUnit}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="press text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Profile
            </button>
            <AddButton item={item} />
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto p-0">
          <img
            src={pro.image}
            alt={pro.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-56 w-full object-cover"
          />
          <div className="space-y-5 p-6 pt-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <BadgeCheck className="h-5 w-5 text-sunset" /> {pro.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {pro.headline} · {pro.city}
              </p>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 text-[11px]">
                <Star className="h-3 w-3 fill-mango text-mango" /> {pro.rating} · {pro.jobs} jobs
              </Badge>
              <Badge variant="secondary" className="text-[11px]">{pro.years} years experience</Badge>
              <Badge className="bg-grape text-sunset-foreground text-[11px] hover:bg-grape">
                {professionLabel(pro.professionId)}
              </Badge>
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-sunset" /> About {pro.name.split(" ")[0]}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pro.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon={Languages} label="Languages" value={pro.languages.join(", ")} />
              <Spec icon={Clock} label="Experience" value={`${pro.years} years`} />
              <Spec icon={CalendarClock} label="Availability" value={pro.availability} />
              <Spec icon={MapPin} label="Based in" value={pro.city} />
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <ListChecks className="h-4 w-4 text-sunset" /> Packages
              </h4>
              <div className="mt-2 space-y-2">
                {pro.packages.map((pk) => (
                  <div key={pk.name} className="flex items-center justify-between rounded-xl border bg-muted/30 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{pk.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{pk.detail}</p>
                    </div>
                    <p className="ml-3 flex-none text-sm font-semibold tabular-nums">
                      ${pk.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Included</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pro.includes.map((inc) => (
                  <Badge key={inc} variant="outline" className="text-[11px] font-normal">
                    {inc}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Skills</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pro.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[11px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">Cancellation: {pro.cancellation}</p>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-2xl font-semibold tabular-nums">${pro.rate.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">{pro.rateUnit}</p>
              </div>
              <AddButton item={item} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
