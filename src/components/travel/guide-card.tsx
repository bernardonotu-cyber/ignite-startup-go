import { useState } from "react";
import {
  Star,
  Languages,
  Users,
  Clock,
  BadgeCheck,
  Globe2,
  CalendarClock,
  Sparkles,
  ListChecks,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TourGuide } from "@/lib/guides-catalog";
import { AddButton } from "@/components/travel/destination-explorer";

function basketItem(guide: TourGuide, city: string) {
  return {
    id: guide.id,
    kind: "guide" as const,
    title: `${guide.name} · ${guide.title}`,
    subtitle: `${guide.feeUnit} · ${guide.groupSize}`,
    price: guide.fee,
    destination: city,
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

export function GuideCard({ guide, city }: { guide: TourGuide; city: string }) {
  const [open, setOpen] = useState(false);
  const item = basketItem(guide, city);

  return (
    <>
      <div className="group overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg">
        <button type="button" onClick={() => setOpen(true)} className="press flex w-full gap-3 p-3 text-left">
          <img
            src={guide.image}
            alt={`${guide.name}, tour guide in ${city}`}
            loading="lazy"
            width={800}
            height={800}
            className="h-20 w-20 flex-none rounded-xl object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-medium tracking-tight">{guide.name}</p>
              <span className="flex flex-none items-center gap-1 text-xs font-medium">
                <Star className="h-3.5 w-3.5 fill-mango text-mango" />
                {guide.rating}
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{guide.title}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {guide.cityWide && (
                <Badge className="bg-grape text-sunset-foreground text-[10px] hover:bg-grape">
                  <Globe2 className="mr-1 h-3 w-3" /> Full city tour
                </Badge>
              )}
              {guide.specialties.slice(0, 2).map((s) => (
                <Badge key={s} variant="outline" className="text-[10px] font-normal">
                  {s}
                </Badge>
              ))}
              <Badge variant="secondary" className="text-[10px]">
                {guide.languages.join(" · ")}
              </Badge>
            </div>
          </div>
        </button>
        <div className="flex items-center justify-between border-t px-3 py-2.5">
          <div>
            <p className="text-base font-semibold tabular-nums">${guide.fee.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{guide.feeUnit}</p>
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
            src={guide.image}
            alt={guide.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-56 w-full object-cover"
          />
          <div className="space-y-5 p-6 pt-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <BadgeCheck className="h-5 w-5 text-sunset" /> {guide.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {guide.title} · {city}
              </p>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 text-[11px]">
                <Star className="h-3 w-3 fill-mango text-mango" /> {guide.rating} · {guide.tours} tours
              </Badge>
              <Badge variant="secondary" className="text-[11px]">{guide.years} years guiding</Badge>
              {guide.cityWide && (
                <Badge className="bg-grape text-sunset-foreground text-[11px] hover:bg-grape">
                  <Globe2 className="mr-1 h-3 w-3" /> Takes you round the whole city
                </Badge>
              )}
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-sunset" /> About {guide.name.split(" ")[0]}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{guide.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon={Languages} label="Languages" value={guide.languages.join(", ")} />
              <Spec icon={Users} label="Group size" value={guide.groupSize} />
              <Spec icon={Clock} label="Experience" value={`${guide.years} years`} />
              <Spec icon={CalendarClock} label="Cancellation" value={guide.cancellation} />
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <ListChecks className="h-4 w-4 text-sunset" /> What the tour covers
              </h4>
              <ol className="mt-2 space-y-1.5">
                {guide.itinerary.map((step, i) => (
                  <li key={step} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-muted text-[11px] font-medium text-foreground">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Included</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {guide.includes.map((inc) => (
                  <Badge key={inc} variant="outline" className="text-[11px] font-normal">
                    {inc}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Specialities</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {guide.specialties.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[11px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-2xl font-semibold tabular-nums">${guide.fee.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">{guide.feeUnit}</p>
              </div>
              <AddButton item={item} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
