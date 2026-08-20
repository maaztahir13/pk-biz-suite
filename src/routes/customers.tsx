import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Users, Wallet, Phone } from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { customers, formatPKR, type Customer } from "@/lib/erp-data";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers & Udhaar — PK Business ERP Demo" },
      {
        name: "description",
        content:
          "Customer ledger demo with udhaar (credit) balances, purchase history and quick contact for Pakistani SMEs.",
      },
      { property: "og:title", content: "Customers & Udhaar — PK Business ERP Demo" },
      {
        property: "og:description",
        content: "Track customer purchases and outstanding udhaar balances in PKR.",
      },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query),
  );

  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0);
  const udhaarCount = customers.filter((c) => c.outstanding > 0).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Customers" value={String(customers.length)} icon={Users} />
        <StatCard
          label="Total Udhaar"
          value={formatPKR(totalOutstanding)}
          icon={Wallet}
          tone="destructive"
          hint={`${udhaarCount} customers pending`}
        />
        <StatCard
          label="Lifetime Sales"
          value={formatPKR(customers.reduce((s, c) => s + c.totalPurchases, 0))}
          icon={Phone}
          tone="success"
        />
      </div>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Phone</th>
                  <th className="py-3 pr-4 text-right font-medium">Total Purchases</th>
                  <th className="py-3 pr-4 text-right font-medium">Outstanding</th>
                  <th className="py-3 pr-4 font-medium">Last Purchase</th>
                  <th className="py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 font-medium">{c.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.phone}</td>
                    <td className="py-3 pr-4 text-right">{formatPKR(c.totalPurchases)}</td>
                    <td className="py-3 pr-4 text-right">
                      {c.outstanding > 0 ? (
                        <Badge variant="destructive">{formatPKR(c.outstanding)}</Badge>
                      ) : (
                        <Badge variant="secondary">Clear</Badge>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.lastPurchase}</td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selected.phone}</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                  <p className="font-medium">{formatPKR(selected.outstanding)}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Purchase History</p>
                <div className="space-y-2">
                  {selected.history.map((h) => (
                    <div
                      key={h.invoice}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{h.invoice}</p>
                        <p className="text-xs text-muted-foreground">{h.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPKR(h.amount)}</p>
                        <Badge
                          variant={h.status === "Paid" ? "secondary" : "destructive"}
                          className="mt-1"
                        >
                          {h.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
