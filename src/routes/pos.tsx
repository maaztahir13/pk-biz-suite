import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, Printer, Search, Store, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BUSINESS_NAME, formatPKR } from "@/lib/erp-data";
import { useCheckout, useCustomers, useProducts } from "@/lib/erp-queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "POS & Billing — PK Business ERP Demo" },
      { name: "description", content: "Fast point-of-sale billing with sales tax, discounts and Cash / Bank / EasyPaisa / JazzCash payments in PKR." },
      { property: "og:title", content: "POS & Billing — PK Business ERP Demo" },
      { property: "og:description", content: "Create invoices in seconds with an easy point-of-sale screen built for Pakistani shops." },
    ],
  }),
  component: PosPage,
});

const paymentMethods = ["Cash", "Bank Transfer", "EasyPaisa", "JazzCash"] as const;
const saleStatuses = ["Paid", "Udhaar", "Partial"] as const;

type CartLine = { id: string; name: string; price: number; qty: number };

function PosPage() {
  const { data: products = [] } = useProducts();
  const { data: customers = [] } = useCustomers();
  const checkout = useCheckout();

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5);
  const [customer, setCustomer] = useState("Walk-in Customer");
  const [payment, setPayment] = useState<(typeof paymentMethods)[number]>("Cash");
  const [status, setStatus] = useState<(typeof saleStatuses)[number]>("Paid");
  const [showInvoice, setShowInvoice] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState<{
    number: string;
    lines: CartLine[];
    subtotal: number;
    tax: number;
    total: number;
    discount: number;
    taxRate: number;
    customer: string;
    payment: string;
  } | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()),
  );

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
    const taxable = Math.max(subtotal - discount, 0);
    const tax = (taxable * taxRate) / 100;
    return { subtotal, tax, total: taxable + tax };
  }, [cart, discount, taxRate]);

  const addItem = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setCart((c) =>
      c.some((l) => l.id === id)
        ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { id: p.id, name: p.name, price: Number(p.unit_price), qty: 1 }],
    );
  };
  const changeQty = (id: string, delta: number) =>
    setCart((c) =>
      c.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l)),
    );

  const generateInvoice = async () => {
    if (cart.length === 0) return;
    const match = customers.find((c) => c.name === customer);
    const result = await checkout.mutateAsync({
      lines: cart,
      total: totals.total,
      paymentMethod: payment,
      status,
      customerId: match?.id ?? null,
      customerName: customer,
    });
    setSavedInvoice({
      number: result.invoiceNumber,
      lines: cart,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      discount,
      taxRate,
      customer,
      payment,
    });
    setShowInvoice(true);
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="rounded-2xl lg:col-span-3">
        <CardHeader className="space-y-3">
          <CardTitle className="text-base">Select Products</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product name or SKU..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="grid max-h-[560px] gap-3 overflow-y-auto sm:grid-cols-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => addItem(p.id)}
              disabled={p.stock_qty === 0}
              className="rounded-xl border bg-card p-3 text-left transition-all hover:border-primary/50 hover:shadow-md disabled:opacity-50"
            >
              <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.sku} · {p.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold text-primary">{formatPKR(Number(p.unit_price))}</span>
                <Badge variant={p.stock_qty === 0 ? "destructive" : p.stock_qty <= 10 ? "secondary" : "outline"}>
                  {p.stock_qty} in stock
                </Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="h-fit rounded-2xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Current Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Customer</Label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {cart.map((l) => (
              <div key={l.id} className="flex items-center gap-2 rounded-xl border p-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPKR(l.price)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="size-7" onClick={() => changeQty(l.id, -1)}>
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{l.qty}</span>
                  <Button size="icon" variant="outline" className="size-7" onClick={() => changeQty(l.id, 1)}>
                    <Plus className="size-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-destructive"
                    onClick={() => setCart((c) => c.filter((x) => x.id !== l.id))}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {cart.length === 0 && <p className="text-sm text-muted-foreground">Cart is empty — tap a product to add.</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Discount (Rs.)</Label>
              <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label>Sales Tax (%)</Label>
              <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value) || 0)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((m) => (
                <button
                  key={m}
                  onClick={() => setPayment(m)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    payment === m ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Payment Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof saleStatuses)[number])}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {saleStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 rounded-xl bg-muted/60 p-3 text-sm">
            <Row label="Subtotal" value={formatPKR(totals.subtotal)} />
            <Row label="Discount" value={`- ${formatPKR(discount)}`} />
            <Row label={`Sales Tax (${taxRate}%)`} value={formatPKR(totals.tax)} />
            <div className="mt-2 flex items-center justify-between border-t pt-2 text-base font-semibold">
              <span>Grand Total</span>
              <span className="text-primary">{formatPKR(totals.total)}</span>
            </div>
          </div>

          <Button className="w-full" onClick={generateInvoice} disabled={cart.length === 0 || checkout.isPending}>
            {checkout.isPending ? "Saving..." : "Generate Invoice"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          {savedInvoice && (
            <div className="space-y-5 rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Store className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{BUSINESS_NAME}</p>
                    <p className="text-xs text-muted-foreground">Main Bazaar, Lahore · 0300-1234567</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">{savedInvoice.number}</p>
                  <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-GB")}</p>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Billed To</p>
                <p className="font-medium">{savedInvoice.customer}</p>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Rate</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {savedInvoice.lines.map((l) => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="py-2">{l.name}</td>
                      <td className="py-2 text-center">{l.qty}</td>
                      <td className="py-2 text-right">{formatPKR(l.price)}</td>
                      <td className="py-2 text-right">{formatPKR(l.price * l.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ml-auto max-w-xs space-y-1 text-sm">
                <Row label="Subtotal" value={formatPKR(savedInvoice.subtotal)} />
                <Row label="Discount" value={`- ${formatPKR(savedInvoice.discount)}`} />
                <Row label={`Sales Tax (${savedInvoice.taxRate}%)`} value={formatPKR(savedInvoice.tax)} />
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span>{formatPKR(savedInvoice.total)}</span>
                </div>
                <p className="pt-1 text-xs text-muted-foreground">Paid via {savedInvoice.payment}</p>
              </div>

              <p className="text-center text-xs text-muted-foreground">Shukriya! Aap ka karobar hamare liye ahem hai.</p>
            </div>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" /> Print Invoice
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
