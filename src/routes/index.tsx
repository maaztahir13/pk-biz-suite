import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Banknote, HandCoins, Package, Receipt, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  dashboardStats,
  formatPKR,
  products,
  recentTransactions,
  salesLast7Days,
  stockStatus,
} from "@/lib/erp-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PK Business ERP Demo" },
      {
        name: "description",
        content:
          "Live demo dashboard of a modern ERP for Pakistani SMEs: sales, receivables, stock value and low stock alerts in PKR.",
      },
      { property: "og:title", content: "Dashboard — PK Business ERP Demo" },
      {
        property: "og:description",
        content: "Modern ERP demo for Pakistani small businesses — billing, inventory, ledger and reports.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const lowStock = products.filter((p) => p.qty <= 10);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Today's Sales" value={formatPKR(dashboardStats.todaysSales)} icon={TrendingUp} tone="success" hint="+12% vs yesterday" />
        <StatCard label="Receivables (Wasooli)" value={formatPKR(dashboardStats.receivables)} icon={HandCoins} tone="warning" hint="From 6 customers" />
        <StatCard label="Total Payables" value={formatPKR(dashboardStats.payables)} icon={Banknote} tone="destructive" hint="4 suppliers pending" />
        <StatCard label="Stock Value" value={formatPKR(dashboardStats.stockValue)} icon={Package} hint={`${products.length} products`} />
        <StatCard label="Low Stock Alerts" value={`${lowStock.length} items`} icon={AlertTriangle} tone="warning" hint="Reorder soon" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sales — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesLast7Days} margin={{ left: 8, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis
                  tickFormatter={(v: number) => `${v / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  formatter={(v) => formatPKR(Number(v))}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="sales" fill="var(--chart-2)" radius={[8, 8, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <Badge variant={item.qty === 0 ? "destructive" : "secondary"} className="shrink-0">
                  {item.qty} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Receipt className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-medium">Invoice #</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 text-right font-medium">Amount</th>
                <th className="pb-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.invoice} className="border-b last:border-0">
                  <td className="py-3 font-medium">{t.invoice}</td>
                  <td className="py-3 text-muted-foreground">{t.customer}</td>
                  <td className="py-3 text-right font-medium">{formatPKR(t.amount)}</td>
                  <td className="py-3 text-right">
                    <Badge
                      variant={t.status === "Paid" ? "default" : t.status === "Udhaar" ? "destructive" : "secondary"}
                    >
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Stock status legend: {stockStatus(0)} / {stockStatus(5)} / {stockStatus(50)}
      </p>
    </div>
  );
}
