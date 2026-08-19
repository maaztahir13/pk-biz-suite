import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { categories, formatPKR, products as seedProducts, stockStatus, type Product } from "@/lib/erp-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — PK Business ERP Demo" },
      { name: "description", content: "Track stock quantity, SKUs, categories and stock value with low-stock alerts for your dukan." },
      { property: "og:title", content: "Inventory — PK Business ERP Demo" },
      { property: "og:description", content: "Product-wise stock tracking with live stock value in PKR." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const [items, setItems] = useState<Product[]>(seedProducts);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: categories[0], qty: "", purchasePrice: "", price: "" });

  const filtered = items.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())),
  );

  const addProduct = () => {
    if (!form.name) return;
    setItems((prev) => [
      {
        id: `p${prev.length + 1}-${Date.now()}`,
        name: form.name,
        sku: `NEW-${String(prev.length + 1).padStart(3, "0")}`,
        category: form.category,
        qty: Number(form.qty) || 0,
        purchasePrice: Number(form.purchasePrice) || 0,
        price: Number(form.price) || 0,
      },
      ...prev,
    ]);
    setForm({ name: "", category: categories[0], qty: "", purchasePrice: "", price: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="pl-9" />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <Field label="Product Name">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Shan Masala Box" />
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Quantity">
                  <Input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
                </Field>
                <Field label="Purchase Rs.">
                  <Input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} />
                </Field>
                <Field label="Sale Rs.">
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </Field>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addProduct}>Save Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden rounded-2xl">
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Product Name</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Stock Qty</th>
                <th className="px-4 py-3 text-right font-medium">Unit Price</th>
                <th className="px-4 py-3 text-right font-medium">Stock Value</th>
                <th className="px-4 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const status = stockStatus(p.qty);
                return (
                  <tr key={p.id} className="border-t transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right">{p.qty}</td>
                    <td className="px-4 py-3 text-right">{formatPKR(p.price)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPKR(p.qty * p.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={status === "In Stock" ? "default" : status === "Low Stock" ? "secondary" : "destructive"}>
                        {status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
