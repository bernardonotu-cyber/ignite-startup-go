import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/logo";
import { getDocumentsCatalog, submitApplication } from "@/lib/documents.functions";
import { formatMoney } from "@/lib/documents-ui";

type Search = { kind: "passport" | "visa"; id?: string };

export const Route = createFileRoute("/_authenticated/documents/apply")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    kind: search.kind === "visa" ? "visa" : "passport",
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { kind, id } = Route.useSearch();
  const navigate = useNavigate();
  const fetchCatalog = useServerFn(getDocumentsCatalog);
  const submit = useServerFn(submitApplication);

  const { data } = useQuery({ queryKey: ["documents-catalog"], queryFn: () => fetchCatalog() });

  const [selected, setSelected] = useState<string | undefined>(id);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    passportNumber: "",
    nationality: "",
    travelDate: "",
    travelers: 1,
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  const options = useMemo(() => {
    if (!data) return [] as { id: string; label: string; price: number; meta: string }[];
    if (kind === "passport")
      return data.services.map((s) => ({
        id: s.id,
        label: s.name,
        price: Number(s.price),
        meta: `${s.processing} · valid ${s.validity}`,
      }));
    return data.rules
      .filter((r) => r.requirement !== "visa_free")
      .map((r) => ({
        id: r.id,
        label: `${r.destination_country} — ${r.type_label} (from ${r.origin_country})`,
        price: Number(r.fee),
        meta: `${r.processing} · stay ${r.stay}`,
      }));
  }, [data, kind]);

  const chosen = options.find((o) => o.id === selected);
  const total = chosen ? chosen.price * form.travelers : 0;

  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async () => {
    if (!selected) return toast.error("Choose a service first");
    if (form.fullName.trim().length < 2) return toast.error("Enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return toast.error("Enter a valid email");
    setBusy(true);
    try {
      const res = await submit({
        data: {
          kind,
          passportServiceId: kind === "passport" ? selected : null,
          visaRuleId: kind === "visa" ? selected : null,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          passportNumber: form.passportNumber.trim(),
          nationality: form.nationality.trim(),
          travelDate: form.travelDate,
          travelers: Number(form.travelers) || 1,
          notes: form.notes.trim(),
        },
      });
      toast.success(`Application submitted — reference ${res.reference}`);
      navigate({ to: "/documents/$reference", params: { reference: res.reference } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not submit your application");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4">
          <Link to="/" className="press flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-[0.14em]">World Portal</span>
          </Link>
          <Link to="/passport-visa">
            <Button variant="ghost" className="press rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          {kind === "passport" ? "Apply for a passport" : "Apply for a visa"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Three short steps. You'll get a reference code to track everything.
        </p>

        <section className="mt-8 rounded-3xl border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Step 1 — choose your service
          </p>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="mt-3 h-12 rounded-2xl">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label} — {formatMoney(o.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {chosen ? <p className="mt-2 text-sm text-muted-foreground">{chosen.meta}</p> : null}
        </section>

        <section className="mt-6 rounded-3xl border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Step 2 — your details
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full name (as on ID)</Label>
              <Input id="fullName" maxLength={120} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" maxLength={40} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" maxLength={80} value={form.nationality} onChange={(e) => set("nationality", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="passportNumber">Passport number (if you have one)</Label>
              <Input id="passportNumber" maxLength={40} value={form.passportNumber} onChange={(e) => set("passportNumber", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="travelDate">Travel date</Label>
              <Input id="travelDate" type="date" value={form.travelDate} onChange={(e) => set("travelDate", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="travelers">Travellers</Label>
              <Input
                id="travelers"
                type="number"
                min={1}
                max={20}
                value={form.travelers}
                onChange={(e) => set("travelers", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="notes">Anything we should know?</Label>
            <Textarea id="notes" maxLength={1000} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Step 3 — confirm
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{formatMoney(total)}</p>
            <p className="text-xs text-muted-foreground">
              {chosen ? `${chosen.label} × ${form.travelers}` : "Choose a service to see the price"}
            </p>
          </div>
          <Button onClick={onSubmit} disabled={busy} className="press h-12 rounded-2xl px-8">
            {busy ? "Submitting…" : "Submit application"}
          </Button>
        </section>
      </main>
    </div>
  );
}
