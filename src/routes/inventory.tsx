import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { categories, formatPKR } from "@/lib/erp-data";
import { useProductMutations, useProducts, type DbProduct } from "@/lib/erp-queries";

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

const emptyForm = { name: "", category: categories[0] ?? "Grocery", qty: "", purchasePrice: "", price: "" };

function InventoryPage() {
  const { data: items = [] } = useProducts();
  const { create, update, remove } = useProductMutations();

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = items.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())),
  );

  const addProduct = () => {
    if (!form.name) return;
    create.mutate({
      name: form.name,
      sku: `NEW-${String(items.length + 1).padStart(3, "0")}`,
      category: form.category,
      stock_qty: Number(form.qty) || 0,
      purchase_price: Number(form.purchasePrice) || 0,
      unit_price: Number(form.price) || 0,
    });
    setForm(emptyForm);
    setOpen(false);
  };

  const startEdit = (p: DbProduct) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      qty: String(p.stock_qty),
      purchasePrice: String(p.purchase_price),
      price: String(p.unit_price),
    });
  };

  const saveEdit = () => {
    if (!editing) return;
    update.mutate({
      id: editing.id,
      name: form.name,
      category: form.category,
      stock_qty: Number(form.qty) || 0,
      purchase_price: Number(form.purchasePrice) || 0,
      unit_price: Number(form.price) || 0,
    });
    setEditing(null);
    setForm(emptyForm);
  };

  const deleteProduct = (p: DbProduct) => {
    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) remove.mutate(p.id);
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
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (o) setForm(emptyForm);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <ProductForm form={form} setForm={setForm} />
            <DialogFooter>
              <Button onClick={addProduct} disabled={create.isPending}>
                {create.isPending ? "Saving..." : "Save Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden rounded-2xl">
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Product Name</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Stock Qty</th>
                <th className="px-4 py-3 text-right font-medium">Unit Price</th>
                <th className="px-4 py-3 text-right font-medium">Stock Value</th>
                <th className="px-4 py-3 text-right font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-right">{p.stock_qty}</td>
                  <td className="px-4 py-3 text-right">{formatPKR(Number(p.unit_price))}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatPKR(p.stock_qty * Number(p.unit_price))}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant={p.status === "In Stock" ? "default" : p.status === "Low Stock" ? "secondary" : "destructive"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="outline" className="size-8" onClick={() => startEdit(p)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => deleteProduct(p)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm form={form} setForm={setForm} />
          <DialogFooter>
            <Button onClick={saveEdit} disabled={update.isPending}>
              {update.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type FormState = typeof emptyForm;

function ProductForm({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  return (
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
