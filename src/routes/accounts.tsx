import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDownCircle, ArrowUpCircle, Plus, Scale } from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPKR } from "@/lib/erp-data";
import { useLedgerEntries, useLedgerMutations } from "@/lib/erp-queries";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts & Ledger — PK Business ERP Demo" },
      {
        name: "description",
        content:
          "Income and expense ledger demo with dukan rent, bijli bill, salaries and purchases tracked in PKR.",
      },
      { property: "og:title", content: "Accounts & Ledger — PK Business ERP Demo" },
      {
        property: "og:description",
        content: "Daily cash book for Pakistani businesses — income, expenses and net profit.",
      },
    ],
  }),
  component: AccountsPage,
});

const filters = ["All", "Income", "Expense"] as const;
const expenseCategories = [
  "Purchases",
  "Dukan Rent",
  "Staff Salary",
  "Bijli Bill",
  "Transport",
  "Utilities",
  "Sales",
  "Other",
];
const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)"];

const emptyForm = {
  description: "",
  type: "Expense",
  category: "Purchases",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
};

function AccountsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { data: ledgerEntries = [] } = useLedgerEntries();
  const { create } = useLedgerMutations();

  const income = ledgerEntries.filter((e) => e.type === "Income").reduce((s, e) => s + Number(e.amount), 0);
  const expense = ledgerEntries.filter((e) => e.type === "Expense").reduce((s, e) => s + Number(e.amount), 0);

  const rows = ledgerEntries.filter((e) => filter === "All" || e.type === filter);

  const breakdown = Object.entries(
    ledgerEntries
      .filter((e) => e.type === "Expense")
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
        return acc;
      }, {}),
  ).map(([name, value]) => ({ name, value }));

  const save = () => {
    if (!form.description) return;
    create.mutate({
      description: form.description,
      type: form.type,
      category: form.category,
      amount: Number(form.amount) || 0,
      date: form.date,
    });
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Income" value={formatPKR(income)} icon={ArrowUpCircle} tone="success" />
        <StatCard label="Total Expense" value={formatPKR(expense)} icon={ArrowDownCircle} tone="destructive" />
        <StatCard
          label="Net Balance"
          value={formatPKR(income - expense)}
          icon={Scale}
          tone={income - expense >= 0 ? "success" : "destructive"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 shadow-sm lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                {filters.map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setForm(emptyForm);
                  setOpen(true);
                }}
              >
                <Plus className="size-4" /> Add Entry
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Description</th>
                    <th className="py-3 pr-4 font-medium">Category</th>
                    <th className="py-3 pr-4 font-medium">Type</th>
                    <th className="py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => (
                    <tr key={e.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-4 text-muted-foreground">{e.date}</td>
                      <td className="py-3 pr-4 font-medium">{e.description}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{e.category}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={e.type === "Income" ? "secondary" : "destructive"}>
                          {e.type}
                        </Badge>
                      </td>
                      <td
                        className={
                          e.type === "Income"
                            ? "py-3 text-right font-semibold text-success"
                            : "py-3 text-right font-semibold text-destructive"
                        }
                      >
                        {e.type === "Income" ? "+" : "-"}
                        {formatPKR(Number(e.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [formatPKR(Number(v)), String(n)]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--card-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Ledger Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Bijli Bill (September)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {expenseCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Amount (Rs.)</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={save} disabled={create.isPending}>
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
