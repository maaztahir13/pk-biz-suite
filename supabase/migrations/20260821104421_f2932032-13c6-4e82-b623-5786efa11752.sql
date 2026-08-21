CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text NOT NULL,
  category text NOT NULL DEFAULT 'Grocery',
  stock_qty integer NOT NULL DEFAULT 0,
  purchase_price numeric NOT NULL DEFAULT 0,
  unit_price numeric NOT NULL DEFAULT 0,
  status text GENERATED ALWAYS AS (CASE WHEN stock_qty <= 0 THEN 'Out of Stock' WHEN stock_qty <= 10 THEN 'Low Stock' ELSE 'In Stock' END) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  total_purchases numeric NOT NULL DEFAULT 0,
  outstanding_balance numeric NOT NULL DEFAULT 0,
  last_purchase_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO anon, authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo access to customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name text NOT NULL DEFAULT 'Walk-in Customer',
  total_amount numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'Cash',
  status text NOT NULL DEFAULT 'Paid',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO anon, authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo access to invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO anon, authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo access to invoice items" ON public.invoice_items FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  type text NOT NULL DEFAULT 'Expense',
  category text NOT NULL DEFAULT 'Other',
  amount numeric NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ledger_entries TO anon, authenticated;
GRANT ALL ON public.ledger_entries TO service_role;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo access to ledger entries" ON public.ledger_entries FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Staff',
  salary numeric NOT NULL DEFAULT 0,
  attendance_percent integer NOT NULL DEFAULT 100,
  status text GENERATED ALWAYS AS (CASE WHEN attendance_percent < 75 THEN 'On Leave' ELSE 'Active' END) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO anon, authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public demo access to employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.products (name, sku, category, stock_qty, purchase_price, unit_price) VALUES
('Basmati Rice 5kg (Guard)', 'GRC-001', 'Grocery', 48, 2100, 2450),
('Sunridge Chakki Atta 10kg', 'GRC-002', 'Grocery', 12, 1180, 1350),
('Dalda Cooking Oil 5L', 'GRC-003', 'Grocery', 6, 2650, 2950),
('Tapal Danedar Tea 950g', 'BEV-001', 'Beverages', 27, 1450, 1690),
('Coca Cola 1.5L', 'BEV-002', 'Beverages', 64, 145, 180),
('Nestle Milkpak 1L', 'DRY-001', 'Dairy', 0, 250, 290),
('Olpers Cream 200ml', 'DRY-002', 'Dairy', 33, 130, 165),
('Dawn Bread Large', 'BKY-001', 'Bakery', 18, 130, 160),
('Peek Freans Sooper Family Pack', 'BKY-002', 'Bakery', 9, 220, 270),
('Surf Excel 1kg', 'HSD-001', 'Household', 41, 520, 610),
('Harpic Toilet Cleaner 1L', 'HSD-002', 'Household', 15, 390, 465),
('Lifebuoy Soap 6-Pack', 'PRC-001', 'Personal Care', 4, 480, 570),
('Colgate Toothpaste 150g', 'PRC-002', 'Personal Care', 22, 290, 350);

INSERT INTO public.customers (name, phone, total_purchases, outstanding_balance, last_purchase_date) VALUES
('Muhammad Aslam', '0300-4471290', 184500, 24500, current_date - 4),
('Fatima Bibi', '0321-8830912', 96200, 0, current_date - 3),
('Bilal Traders', '0333-2210458', 421000, 68000, current_date - 5),
('Ayesha Khan', '0345-7719023', 58900, 3200, current_date - 7),
('Rana Zubair', '0301-5567781', 132400, 15750, current_date - 9),
('Hafiz General Store', '0308-9912344', 289300, 0, current_date - 10),
('Nadia Sheikh', '0322-4478190', 44100, 1800, current_date - 13),
('Imran Kiryana Mart', '0311-6650021', 356700, 42300, current_date - 14),
('Saima Yousaf', '0334-1129087', 27600, 0, current_date - 18),
('Chaudhry Sons', '0300-7781230', 512000, 91000, current_date - 20);

INSERT INTO public.invoices (invoice_number, customer_id, customer_name, total_amount, payment_method, status, created_at)
SELECT v.num, c.id, v.cname, v.amt, v.pm, v.st, now() - (v.days || ' days')::interval
FROM (VALUES
  ('INV-2026-014', 'Hafiz General Store', 22800, 'Cash', 'Paid', 6),
  ('INV-2026-015', 'Ayesha Khan', 3200, 'Cash', 'Partial', 5),
  ('INV-2026-016', 'Walk-in Customer', 2750, 'Cash', 'Paid', 4),
  ('INV-2026-017', 'Bilal Traders', 45000, 'Bank Transfer', 'Udhaar', 3),
  ('INV-2026-018', 'Muhammad Aslam', 12400, 'EasyPaisa', 'Udhaar', 2),
  ('INV-2026-019', 'Fatima Bibi', 4300, 'JazzCash', 'Paid', 1),
  ('INV-2026-012', 'Rana Zubair', 15750, 'Cash', 'Udhaar', 6),
  ('INV-2026-013', 'Imran Kiryana Mart', 42300, 'Cash', 'Udhaar', 5),
  ('INV-2026-020', 'Walk-in Customer', 18900, 'Cash', 'Paid', 0),
  ('INV-2026-021', 'Nadia Sheikh', 26400, 'Cash', 'Paid', 0)
) AS v(num, cname, amt, pm, st, days)
LEFT JOIN public.customers c ON c.name = v.cname;

INSERT INTO public.ledger_entries (description, type, category, amount, date) VALUES
('Counter Sales', 'Income', 'Sales', 81250, current_date - 2),
('Bijli Bill (August)', 'Expense', 'Bijli Bill', 34500, current_date - 3),
('Counter Sales', 'Income', 'Sales', 68400, current_date - 3),
('Staff Salary - Ali Raza', 'Expense', 'Staff Salary', 45000, current_date - 4),
('Stock Purchase - Metro Cash & Carry', 'Expense', 'Purchases', 210000, current_date - 5),
('Dukan Rent (August)', 'Expense', 'Dukan Rent', 65000, current_date - 6),
('Wholesale Order - Bilal Traders', 'Income', 'Sales', 145000, current_date - 7),
('Delivery Van Fuel', 'Expense', 'Transport', 18500, current_date - 9),
('Counter Sales', 'Income', 'Sales', 52300, current_date - 11),
('Internet & Mobile Load', 'Expense', 'Utilities', 7800, current_date - 13);

INSERT INTO public.employees (name, role, salary, attendance_percent) VALUES
('Ali Raza', 'Shop Manager', 65000, 96),
('Usman Ghani', 'Cashier', 42000, 92),
('Hina Aslam', 'Accountant', 55000, 88),
('Kashif Mehmood', 'Salesman', 38000, 74),
('Zeeshan Ahmed', 'Delivery Rider', 35000, 90),
('Sadaf Noor', 'Store Helper', 28000, 81),
('Tariq Javed', 'Store Keeper', 40000, 95),
('Rabia Kanwal', 'Customer Support', 33000, 68);