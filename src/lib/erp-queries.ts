import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock_qty: number;
  purchase_price: number;
  unit_price: number;
  status: string;
};

export type DbCustomer = {
  id: string;
  name: string;
  phone: string;
  total_purchases: number;
  outstanding_balance: number;
  last_purchase_date: string | null;
};

export type DbInvoice = {
  id: string;
  invoice_number: string;
  customer_id: string | null;
  customer_name: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

export type DbLedgerEntry = {
  id: string;
  description: string;
  type: string;
  category: string;
  amount: number;
  date: string;
};

export type DbEmployee = {
  id: string;
  name: string;
  role: string;
  salary: number;
  attendance_percent: number;
  status: string;
};

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

/* ---------------- Products ---------------- */

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () =>
      unwrap<DbProduct[]>(
        await supabase.from("products").select("*").order("created_at", { ascending: true }),
      ),
  });
}

export function useProductMutations() {
  const qc = useQueryClient();
  const done = () => {
    void qc.invalidateQueries({ queryKey: ["products"] });
    void qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const create = useMutation({
    mutationFn: async (p: Omit<DbProduct, "id" | "status">) => {
      const { error } = await supabase.from("products").insert(p);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...p }: Partial<DbProduct> & { id: string }) => {
      const { error } = await supabase.from("products").update(p).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  return { create, update, remove };
}

/* ---------------- Customers ---------------- */

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () =>
      unwrap<DbCustomer[]>(
        await supabase.from("customers").select("*").order("created_at", { ascending: true }),
      ),
  });
}

export function useCustomerMutations() {
  const qc = useQueryClient();
  const done = () => {
    void qc.invalidateQueries({ queryKey: ["customers"] });
    void qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const create = useMutation({
    mutationFn: async (c: Partial<DbCustomer> & { name: string }) => {
      const { error } = await supabase.from("customers").insert(c);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...c }: Partial<DbCustomer> & { id: string }) => {
      const { error } = await supabase.from("customers").update(c).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  return { create, update, remove };
}

/* ---------------- Invoices ---------------- */

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () =>
      unwrap<DbInvoice[]>(
        await supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      ),
  });
}

export function useCustomerInvoices(customerId: string | null) {
  return useQuery({
    queryKey: ["invoices", "customer", customerId],
    enabled: !!customerId,
    queryFn: async () =>
      unwrap<DbInvoice[]>(
        await supabase
          .from("invoices")
          .select("*")
          .eq("customer_id", customerId!)
          .order("created_at", { ascending: false }),
      ),
  });
}

export type CheckoutLine = { id: string; name: string; price: number; qty: number };

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      lines: CheckoutLine[];
      total: number;
      paymentMethod: string;
      status: string;
      customerId: string | null;
      customerName: string;
    }) => {
      const { count } = await supabase
        .from("invoices")
        .select("id", { count: "exact", head: true });
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String((count ?? 0) + 1).padStart(3, "0")}`;

      const { data: invoice, error: invErr } = await supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          customer_id: input.customerId,
          customer_name: input.customerName,
          total_amount: input.total,
          payment_method: input.paymentMethod,
          status: input.status,
        })
        .select("*")
        .single();
      if (invErr || !invoice) throw new Error(invErr?.message ?? "Invoice failed");

      const { error: itemsErr } = await supabase.from("invoice_items").insert(
        input.lines.map((l) => ({
          invoice_id: invoice.id,
          product_id: l.id,
          product_name: l.name,
          quantity: l.qty,
          price: l.price,
        })),
      );
      if (itemsErr) throw new Error(itemsErr.message);

      // Reduce stock for each sold product
      const { data: prods } = await supabase
        .from("products")
        .select("id, stock_qty")
        .in("id", input.lines.map((l) => l.id));
      for (const line of input.lines) {
        const current = prods?.find((p) => p.id === line.id);
        if (!current) continue;
        await supabase
          .from("products")
          .update({ stock_qty: Math.max(0, current.stock_qty - line.qty) })
          .eq("id", line.id);
      }

      // Update customer totals / udhaar
      if (input.customerId) {
        const { data: cust } = await supabase
          .from("customers")
          .select("total_purchases, outstanding_balance")
          .eq("id", input.customerId)
          .single();
        if (cust) {
          await supabase
            .from("customers")
            .update({
              total_purchases: Number(cust.total_purchases) + input.total,
              outstanding_balance:
                input.status === "Udhaar"
                  ? Number(cust.outstanding_balance) + input.total
                  : Number(cust.outstanding_balance),
              last_purchase_date: new Date().toISOString().slice(0, 10),
            })
            .eq("id", input.customerId);
        }
      }

      return { invoiceNumber } as { invoiceNumber: string };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["products"] });
      void qc.invalidateQueries({ queryKey: ["customers"] });
      void qc.invalidateQueries({ queryKey: ["invoices"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

/* ---------------- Ledger ---------------- */

export function useLedgerEntries() {
  return useQuery({
    queryKey: ["ledger"],
    queryFn: async () =>
      unwrap<DbLedgerEntry[]>(
        await supabase.from("ledger_entries").select("*").order("date", { ascending: false }),
      ),
  });
}

export function useLedgerMutations() {
  const qc = useQueryClient();
  const done = () => void qc.invalidateQueries({ queryKey: ["ledger"] });

  const create = useMutation({
    mutationFn: async (e: Omit<DbLedgerEntry, "id">) => {
      const { error } = await supabase.from("ledger_entries").insert(e);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ledger_entries").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  return { create, remove };
}

/* ---------------- Employees ---------------- */

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () =>
      unwrap<DbEmployee[]>(
        await supabase.from("employees").select("*").order("created_at", { ascending: true }),
      ),
  });
}

export function useEmployeeMutations() {
  const qc = useQueryClient();
  const done = () => void qc.invalidateQueries({ queryKey: ["employees"] });

  const create = useMutation({
    mutationFn: async (e: Omit<DbEmployee, "id" | "status">) => {
      const { error } = await supabase.from("employees").insert(e);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...e }: Partial<DbEmployee> & { id: string }) => {
      const { error } = await supabase.from("employees").update(e).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: done,
  });

  return { create, update, remove };
}
