import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  adminListApplications,
  adminListRules,
  adminUpdatePassportService,
  adminUpdateStatus,
  adminUpdateVisaRule,
  getMyRoles,
  type PassportServiceRow,
  type VisaRuleRow,
  type ApplicationStatus,
} from "@/lib/documents.functions";
import { STATUS_FLOW, STATUS_LABEL, TRAVEL_PURPOSES, formatMoney } from "@/lib/documents-ui";

export const Route = createFileRoute("/_authenticated/admin/documents")({
  component: AdminDocuments,
});

function AdminDocuments() {
  const fetchRoles = useServerFn(getMyRoles);
  const { data: roleData, isLoading: rolesLoading } = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => fetchRoles(),
  });
  const isAdmin = roleData?.roles.includes("admin") ?? false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <Link to="/" className="press flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-[0.14em]">World Portal admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button variant="ghost" className="press rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {rolesLoading ? <p className="text-sm text-muted-foreground">Checking access…</p> : null}

        {!rolesLoading && !isAdmin ? (
          <div className="rounded-3xl border bg-card p-8 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">This area is for administrators</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask for the admin role to be added to your account.
            </p>
          </div>
        ) : null}

        {isAdmin ? <AdminPanels /> : null}
      </main>
    </div>
  );
}

function AdminPanels() {
  return (
    <Tabs defaultValue="applications">
      <TabsList>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="passport">Passport pricing</TabsTrigger>
        <TabsTrigger value="visa">Visa rules</TabsTrigger>
      </TabsList>
      <TabsContent value="applications">
        <ApplicationsPanel />
      </TabsContent>
      <TabsContent value="passport">
        <PassportPricingPanel />
      </TabsContent>
      <TabsContent value="visa">
        <VisaRulesPanel />
      </TabsContent>
    </Tabs>
  );
}

function ApplicationsPanel() {
  const qc = useQueryClient();
  const fetchApps = useServerFn(adminListApplications);
  const update = useServerFn(adminUpdateStatus);
  const { data } = useQuery({ queryKey: ["admin-applications"], queryFn: () => fetchApps() });
  const [notes, setNotes] = useState<Record<string, string>>({});

  const save = async (id: string, status: ApplicationStatus) => {
    try {
      await update({ data: { id, status, note: notes[id] ?? "" } });
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {data?.applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications yet.</p>
      ) : null}
      {data?.applications.map((a) => (
        <div key={a.id} className="rounded-2xl border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">
                {a.service_name} <span className="text-muted-foreground">· {a.reference}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {a.full_name} · {a.email} · {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tabular-nums">{formatMoney(Number(a.price))}</span>
              <Badge variant="secondary">{STATUS_LABEL[a.status]}</Badge>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Input
              placeholder="Note for the traveller (optional)"
              maxLength={500}
              value={notes[a.id] ?? ""}
              onChange={(e) => setNotes((n) => ({ ...n, [a.id]: e.target.value }))}
              className="max-w-sm"
            />
            <Select onValueChange={(v) => save(a.id, v as ApplicationStatus)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Move to status…" />
              </SelectTrigger>
              <SelectContent>
                {[...STATUS_FLOW, "rejected" as ApplicationStatus].map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}

function PassportPricingPanel() {
  const qc = useQueryClient();
  const fetchRules = useServerFn(adminListRules);
  const update = useServerFn(adminUpdatePassportService);
  const { data } = useQuery({ queryKey: ["admin-rules"], queryFn: () => fetchRules() });

  return (
    <div className="mt-6 space-y-4">
      {data?.services.map((s) => (
        <PassportRow key={s.id} s={s} onSave={update} onDone={() => qc.invalidateQueries()} />
      ))}
    </div>
  );
}

function PassportRow({
  s,
  onSave,
  onDone,
}: {
  s: PassportServiceRow;
  onSave: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    name: s.name,
    blurb: s.blurb,
    processing: s.processing,
    validity: s.validity,
    price: String(s.price),
    documents: s.documents.join("\n"),
    active: s.active,
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await onSave({
        data: {
          id: s.id,
          name: form.name.trim(),
          blurb: form.blurb.trim(),
          processing: form.processing.trim(),
          validity: form.validity.trim(),
          price: Number(form.price) || 0,
          documents: form.documents.split("\n").map((d) => d.trim()).filter(Boolean),
          active: form.active,
        },
      });
      toast.success("Saved");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Price (USD)</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div className="flex items-end gap-2">
          <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
          <span className="text-sm text-muted-foreground">Visible</span>
        </div>
        <div>
          <Label>Processing</Label>
          <Input
            value={form.processing}
            onChange={(e) => setForm({ ...form, processing: e.target.value })}
          />
        </div>
        <div>
          <Label>Validity</Label>
          <Input
            value={form.validity}
            onChange={(e) => setForm({ ...form, validity: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Blurb</Label>
          <Input value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
        </div>
        <div className="md:col-span-4">
          <Label>Required documents (one per line)</Label>
          <textarea
            className="mt-1 w-full rounded-md border bg-background p-3 text-sm"
            rows={4}
            value={form.documents}
            onChange={(e) => setForm({ ...form, documents: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={save} disabled={busy} className="press mt-4 rounded-full">
        {busy ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

function VisaRulesPanel() {
  const qc = useQueryClient();
  const fetchRules = useServerFn(adminListRules);
  const update = useServerFn(adminUpdateVisaRule);
  const { data } = useQuery({ queryKey: ["admin-rules"], queryFn: () => fetchRules() });
  const [destFilter, setDestFilter] = useState<string>("");

  const destinations = Array.from(new Set((data?.rules ?? []).map((r) => r.destination_country)));
  const rules = (data?.rules ?? []).filter(
    (r) => !destFilter || r.destination_country === destFilter,
  );

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setDestFilter("")}
          className={`press rounded-full border px-4 py-1.5 text-sm ${
            destFilter === "" ? "bg-foreground text-background" : "bg-card"
          }`}
        >
          All
        </button>
        {destinations.map((d) => (
          <button
            key={d}
            onClick={() => setDestFilter(d)}
            className={`press rounded-full border px-4 py-1.5 text-sm ${
              destFilter === d ? "bg-foreground text-background" : "bg-card"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {rules.map((r) => (
          <VisaRow key={r.id} r={r} onSave={update} onDone={() => qc.invalidateQueries()} />
        ))}
      </div>
    </div>
  );
}

function VisaRow({
  r,
  onSave,
  onDone,
}: {
  r: VisaRuleRow;
  onSave: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    purpose: r.purpose,
    type_label: r.type_label,
    requirement: r.requirement,
    stay: r.stay,
    processing: r.processing,
    fee: String(r.fee),
    entries: r.entries,
    documents: r.documents.join("\n"),
    note: r.note,
    active: r.active,
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await onSave({
        data: {
          id: r.id,
          purpose: form.purpose,
          type_label: form.type_label.trim(),
          requirement: form.requirement,
          stay: form.stay.trim(),
          processing: form.processing.trim(),
          fee: Number(form.fee) || 0,
          entries: form.entries.trim(),
          documents: form.documents.split("\n").map((d) => d.trim()).filter(Boolean),
          note: form.note.trim(),
          active: form.active,
        },
      });
      toast.success("Saved");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm font-medium">
        {r.origin_country} → {r.destination_country}
        <Badge variant="secondary" className="ml-2 text-[11px] font-normal">
          {r.purpose_label}
        </Badge>
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <div>
          <Label>Purpose of travel</Label>
          <Select
            value={form.purpose}
            onValueChange={(v) => setForm({ ...form, purpose: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRAVEL_PURPOSES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Label</Label>
          <Input
            value={form.type_label}
            onChange={(e) => setForm({ ...form, type_label: e.target.value })}
          />
        </div>
        <div>
          <Label>Requirement</Label>
          <Select
            value={form.requirement}
            onValueChange={(v) => setForm({ ...form, requirement: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["visa_free", "e_visa", "on_arrival", "sticker"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Fee (USD)</Label>
          <Input
            type="number"
            value={form.fee}
            onChange={(e) => setForm({ ...form, fee: e.target.value })}
          />
        </div>
        <div className="flex items-end gap-2">
          <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
          <span className="text-sm text-muted-foreground">Visible</span>
        </div>
        <div>
          <Label>Stay</Label>
          <Input value={form.stay} onChange={(e) => setForm({ ...form, stay: e.target.value })} />
        </div>
        <div>
          <Label>Processing</Label>
          <Input
            value={form.processing}
            onChange={(e) => setForm({ ...form, processing: e.target.value })}
          />
        </div>
        <div>
          <Label>Entries</Label>
          <Input
            value={form.entries}
            onChange={(e) => setForm({ ...form, entries: e.target.value })}
          />
        </div>
        <div>
          <Label>Note</Label>
          <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        <div className="md:col-span-4">
          <Label>Required documents (one per line)</Label>
          <textarea
            className="mt-1 w-full rounded-md border bg-background p-3 text-sm"
            rows={4}
            value={form.documents}
            onChange={(e) => setForm({ ...form, documents: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={save} disabled={busy} className="press mt-4 rounded-full">
        {busy ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
