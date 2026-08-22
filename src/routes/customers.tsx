import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Phone, Plus, Search, Trash2, Users, Wallet } from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPKR } from "@/lib/erp-data";
import {
  useCustomerInvoices,
  useCustomerMutations,
  useCustomers,
  type DbCustomer,
} from "@/lib/erp-queries";

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

const emptyForm = { name: "", phone: "", outstanding: "", totalPurchases: "" };

function CustomersPage() {
  const { data: customers = [] } = useCustomers();
  const { create, update, remove } = useCustomerMutations();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DbCustomer | null>(null);
  const [editing, setEditing] = useState<DbCustomer | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { data: history = [] } = useCustomerInvoices(selected?.id ?? null);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query),
  );

  const totalOutstanding = customers.reduce((s, c) => s + Number(c.outstanding_balance), 0);
  const udhaarCount = customers.filter((c) => Number(c.outstanding_balance) > 0).length;

  const saveNew = () => {
    if (!form.name) return;
    create.mutate({
      name: form.name,
      phone: form.phone,
      outstanding_balance: Number(form.outstanding) || 0,
      total_purchases: Number(form.totalPurchases) || 0,
    });
    setForm(emptyForm);
    setAddOpen(false);
  };

  const saveEdit = () => {
    if (!editing) return;
    update.mutate({
      id: editing.id,
      name: form.name,
      phone: form.phone,
      outstanding_balance: Number(form.outstanding) || 0,
      total_purchases: Number(form.totalPurchases) || 0,
    });
    setEditing(null);
    setForm(emptyForm);
  };

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
          value={formatPKR(customers.reduce((s, c) => s + Number(c.total_purchases), 0))}
          icon={Phone}
          tone="success"
        />
      </div>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              onClick={() => {
                setForm(emptyForm);
                setAddOpen(true);
              }}
            >
              <Plus className="size-4" /> Add Customer
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
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
                    <td className="py-3 pr-4 text-right">{formatPKR(Number(c.total_purchases))}</td>
                    <td className="py-3 pr-4 text-right">
                      {Number(c.outstanding_balance) > 0 ? (
                        <Badge variant="destructive">{formatPKR(Number(c.outstanding_balance))}</Badge>
                      ) : (
                        <Badge variant="secondary">Clear</Badge>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.last_purchase_date ?? "—"}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                          View
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8"
                          onClick={() => {
                            setEditing(c);
                            setForm({
                              name: c.name,
                              phone: c.phone,
                              outstanding: String(c.outstanding_balance),
                              totalPurchases: String(c.total_purchases),
                            });
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive"
                          onClick={() => {
                            if (window.confirm(`Delete customer "${c.name}"?`)) remove.mutate(c.id);
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
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
                  <p className="font-medium">{formatPKR(Number(selected.outstanding_balance))}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Purchase History</p>
                <div className="space-y-2">
                  {history.length === 0 && (
                    <p className="text-sm text-muted-foreground">No invoices yet.</p>
                  )}
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{h.invoice_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(h.created_at).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPKR(Number(h.total_amount))}</p>
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

      <Dialog
        open={addOpen || !!editing}
        onOpenChange={(o) => {
          if (!o) {
            setAddOpen(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Customer" : "Add Customer"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Muhammad Aslam" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0300-1234567" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Outstanding (Rs.)</Label>
                <Input type="number" value={form.outstanding} onChange={(e) => setForm({ ...form, outstanding: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Total Purchases (Rs.)</Label>
                <Input type="number" value={form.totalPurchases} onChange={(e) => setForm({ ...form, totalPurchases: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editing ? saveEdit : saveNew} disabled={create.isPending || update.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
