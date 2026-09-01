import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { listMyApplications } from "@/lib/documents.functions";
import { STATUS_LABEL, formatMoney } from "@/lib/documents-ui";

export const Route = createFileRoute("/_authenticated/documents/")({
  component: MyDocuments,
});

function MyDocuments() {
  const navigate = useNavigate();
  const fetchList = useServerFn(listMyApplications);
  const { data, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => fetchList(),
  });
  const [ref, setRef] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
          <Link to="/" className="press flex items-center gap-2">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/passport-visa">
              <Button variant="ghost" className="press rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Documents home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">My documents</h1>
        <p className="mt-2 text-muted-foreground">
          Every passport and visa application you've submitted, with its live status.
        </p>

        <div className="mt-6 flex gap-2">
          <Input
            placeholder="Enter a reference (BUB-XXXXXX)"
            value={ref}
            maxLength={20}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            className="max-w-xs"
          />
          <Button
            variant="outline"
            className="press rounded-full"
            onClick={() =>
              ref.trim() && navigate({ to: "/documents/$reference", params: { reference: ref.trim() } })
            }
          >
            Track
          </Button>
        </div>

        <div className="mt-8 space-y-3">
          {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
          {data?.applications.length === 0 ? (
            <div className="rounded-3xl border bg-card p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No applications yet</p>
              <Link to="/passport-visa">
                <Button className="press mt-4 rounded-full">Check my requirements</Button>
              </Link>
            </div>
          ) : null}
          {data?.applications.map((a) => (
            <Link
              key={a.id}
              to="/documents/$reference"
              params={{ reference: a.reference }}
              className="press block rounded-2xl border bg-card p-5 transition hover:border-foreground/20 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{a.service_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.reference} · {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums font-semibold">{formatMoney(Number(a.price))}</span>
                  <Badge variant="secondary">{STATUS_LABEL[a.status]}</Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
