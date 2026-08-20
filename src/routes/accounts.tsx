import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Scale } from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ledgerEntries, formatPKR } from "@/lib/erp-data";

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

function AccountsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const income = ledgerEntries
    .filter((e) => e.type === "Income")
    .reduce((s, e) => s + e.amount, 0);
  const expense = ledgerEntries
    .filter((e) => e.type === "Expense")
    .reduce((s, e) => s + e.amount, 0);

  const rows = ledgerEntries.filter((e) => filter === "All" || e.type === filter);

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

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardContent className="space-y-4 p-5">
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
                      {formatPKR(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
