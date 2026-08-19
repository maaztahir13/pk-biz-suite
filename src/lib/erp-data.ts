export const BUSINESS_NAME = "Your Business Name";
export const WHATSAPP_NUMBER = "923001234567";
export const WHATSAPP_MESSAGE = "I want this ERP system for my business";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function formatPKR(amount: number) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}Rs. ${Math.abs(Math.round(amount)).toLocaleString("en-PK")}`;
}

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty: number;
  purchasePrice: number;
  price: number;
};

export const categories = ["Grocery", "Beverages", "Dairy", "Bakery", "Household", "Personal Care"];

export const products: Product[] = [
  { id: "p1", name: "Basmati Rice 5kg (Guard)", sku: "GRC-001", category: "Grocery", qty: 48, purchasePrice: 2100, price: 2450 },
  { id: "p2", name: "Sunridge Chakki Atta 10kg", sku: "GRC-002", category: "Grocery", qty: 12, purchasePrice: 1180, price: 1350 },
  { id: "p3", name: "Dalda Cooking Oil 5L", sku: "GRC-003", category: "Grocery", qty: 6, purchasePrice: 2650, price: 2950 },
  { id: "p4", name: "Tapal Danedar Tea 950g", sku: "BEV-001", category: "Beverages", qty: 27, purchasePrice: 1450, price: 1690 },
  { id: "p5", name: "Coca Cola 1.5L", sku: "BEV-002", category: "Beverages", qty: 64, purchasePrice: 145, price: 180 },
  { id: "p6", name: "Nestle Milkpak 1L", sku: "DRY-001", category: "Dairy", qty: 0, purchasePrice: 250, price: 290 },
  { id: "p7", name: "Olpers Cream 200ml", sku: "DRY-002", category: "Dairy", qty: 33, purchasePrice: 130, price: 165 },
  { id: "p8", name: "Dawn Bread Large", sku: "BKY-001", category: "Bakery", qty: 18, purchasePrice: 130, price: 160 },
  { id: "p9", name: "Peek Freans Sooper Family Pack", sku: "BKY-002", category: "Bakery", qty: 9, purchasePrice: 220, price: 270 },
  { id: "p10", name: "Surf Excel 1kg", sku: "HSD-001", category: "Household", qty: 41, purchasePrice: 520, price: 610 },
  { id: "p11", name: "Harpic Toilet Cleaner 1L", sku: "HSD-002", category: "Household", qty: 15, purchasePrice: 390, price: 465 },
  { id: "p12", name: "Lifebuoy Soap 6-Pack", sku: "PRC-001", category: "Personal Care", qty: 4, purchasePrice: 480, price: 570 },
  { id: "p13", name: "Colgate Toothpaste 150g", sku: "PRC-002", category: "Personal Care", qty: 22, purchasePrice: 290, price: 350 },
];

export function stockStatus(qty: number) {
  if (qty <= 0) return "Out of Stock" as const;
  if (qty <= 10) return "Low Stock" as const;
  return "In Stock" as const;
}

export type Customer = {
  id: string;
  name: string;
  phone: string;
  totalPurchases: number;
  outstanding: number;
  lastPurchase: string;
  history: { date: string; invoice: string; amount: number; status: "Paid" | "Udhaar" | "Partial" }[];
};

export const customers: Customer[] = [
  {
    id: "c1", name: "Muhammad Aslam", phone: "0300-4471290", totalPurchases: 184500, outstanding: 24500, lastPurchase: "2026-08-17",
    history: [
      { date: "2026-08-17", invoice: "INV-2026-018", amount: 12400, status: "Udhaar" },
      { date: "2026-08-09", invoice: "INV-2026-011", amount: 8900, status: "Paid" },
      { date: "2026-07-28", invoice: "INV-2026-004", amount: 15600, status: "Partial" },
    ],
  },
  {
    id: "c2", name: "Fatima Bibi", phone: "0321-8830912", totalPurchases: 96200, outstanding: 0, lastPurchase: "2026-08-18",
    history: [
      { date: "2026-08-18", invoice: "INV-2026-019", amount: 4300, status: "Paid" },
      { date: "2026-08-02", invoice: "INV-2026-008", amount: 7200, status: "Paid" },
    ],
  },
  {
    id: "c3", name: "Bilal Traders", phone: "0333-2210458", totalPurchases: 421000, outstanding: 68000, lastPurchase: "2026-08-16",
    history: [
      { date: "2026-08-16", invoice: "INV-2026-017", amount: 45000, status: "Udhaar" },
      { date: "2026-08-05", invoice: "INV-2026-009", amount: 38000, status: "Paid" },
    ],
  },
  {
    id: "c4", name: "Ayesha Khan", phone: "0345-7719023", totalPurchases: 58900, outstanding: 3200, lastPurchase: "2026-08-14",
    history: [{ date: "2026-08-14", invoice: "INV-2026-015", amount: 3200, status: "Udhaar" }],
  },
  {
    id: "c5", name: "Rana Zubair", phone: "0301-5567781", totalPurchases: 132400, outstanding: 15750, lastPurchase: "2026-08-12",
    history: [{ date: "2026-08-12", invoice: "INV-2026-013", amount: 15750, status: "Udhaar" }],
  },
  {
    id: "c6", name: "Hafiz General Store", phone: "0308-9912344", totalPurchases: 289300, outstanding: 0, lastPurchase: "2026-08-11",
    history: [{ date: "2026-08-11", invoice: "INV-2026-012", amount: 22800, status: "Paid" }],
  },
  {
    id: "c7", name: "Nadia Sheikh", phone: "0322-4478190", totalPurchases: 44100, outstanding: 1800, lastPurchase: "2026-08-08",
    history: [{ date: "2026-08-08", invoice: "INV-2026-010", amount: 1800, status: "Udhaar" }],
  },
  {
    id: "c8", name: "Imran Kiryana Mart", phone: "0311-6650021", totalPurchases: 356700, outstanding: 42300, lastPurchase: "2026-08-07",
    history: [{ date: "2026-08-07", invoice: "INV-2026-007", amount: 42300, status: "Udhaar" }],
  },
  {
    id: "c9", name: "Saima Yousaf", phone: "0334-1129087", totalPurchases: 27600, outstanding: 0, lastPurchase: "2026-08-03",
    history: [{ date: "2026-08-03", invoice: "INV-2026-005", amount: 5400, status: "Paid" }],
  },
  {
    id: "c10", name: "Chaudhry Sons", phone: "0300-7781230", totalPurchases: 512000, outstanding: 91000, lastPurchase: "2026-08-01",
    history: [{ date: "2026-08-01", invoice: "INV-2026-003", amount: 91000, status: "Udhaar" }],
  },
];

export const salesLast7Days = [
  { day: "Thu", sales: 38500 },
  { day: "Fri", sales: 61200 },
  { day: "Sat", sales: 74800 },
  { day: "Sun", sales: 52300 },
  { day: "Mon", sales: 45900 },
  { day: "Tue", sales: 68400 },
  { day: "Wed", sales: 81250 },
];

export const recentTransactions = [
  { invoice: "INV-2026-019", customer: "Fatima Bibi", amount: 4300, status: "Paid" },
  { invoice: "INV-2026-018", customer: "Muhammad Aslam", amount: 12400, status: "Udhaar" },
  { invoice: "INV-2026-017", customer: "Bilal Traders", amount: 45000, status: "Udhaar" },
  { invoice: "INV-2026-016", customer: "Walk-in Customer", amount: 2750, status: "Paid" },
  { invoice: "INV-2026-015", customer: "Ayesha Khan", amount: 3200, status: "Partial" },
  { invoice: "INV-2026-014", customer: "Hafiz General Store", amount: 22800, status: "Paid" },
];

export type LedgerEntry = {
  id: string;
  date: string;
  description: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
};

export const ledgerEntries: LedgerEntry[] = [
  { id: "l1", date: "2026-08-19", description: "Counter Sales", type: "Income", category: "Sales", amount: 81250 },
  { id: "l2", date: "2026-08-18", description: "Bijli Bill (August)", type: "Expense", category: "Bijli Bill", amount: 34500 },
  { id: "l3", date: "2026-08-18", description: "Counter Sales", type: "Income", category: "Sales", amount: 68400 },
  { id: "l4", date: "2026-08-17", description: "Staff Salary - Ali Raza", type: "Expense", category: "Staff Salary", amount: 45000 },
  { id: "l5", date: "2026-08-16", description: "Stock Purchase - Metro Cash & Carry", type: "Expense", category: "Purchases", amount: 210000 },
  { id: "l6", date: "2026-08-15", description: "Dukan Rent (August)", type: "Expense", category: "Dukan Rent", amount: 65000 },
  { id: "l7", date: "2026-08-14", description: "Wholesale Order - Bilal Traders", type: "Income", category: "Sales", amount: 145000 },
  { id: "l8", date: "2026-08-12", description: "Delivery Van Fuel", type: "Expense", category: "Transport", amount: 18500 },
  { id: "l9", date: "2026-08-10", description: "Counter Sales", type: "Income", category: "Sales", amount: 52300 },
  { id: "l10", date: "2026-08-08", description: "Internet & Mobile Load", type: "Expense", category: "Utilities", amount: 7800 },
];

export const expenseBreakdown = [
  { name: "Purchases", value: 210000 },
  { name: "Dukan Rent", value: 65000 },
  { name: "Staff Salary", value: 45000 },
  { name: "Bijli Bill", value: 34500 },
  { name: "Transport", value: 18500 },
  { name: "Utilities", value: 7800 },
];

export type Employee = {
  id: string;
  name: string;
  role: string;
  salary: number;
  attendance: number;
  status: "Active" | "On Leave";
};

export const employees: Employee[] = [
  { id: "e1", name: "Ali Raza", role: "Shop Manager", salary: 65000, attendance: 96, status: "Active" },
  { id: "e2", name: "Usman Ghani", role: "Cashier", salary: 42000, attendance: 92, status: "Active" },
  { id: "e3", name: "Hina Aslam", role: "Accountant", salary: 55000, attendance: 88, status: "Active" },
  { id: "e4", name: "Kashif Mehmood", role: "Salesman", salary: 38000, attendance: 74, status: "On Leave" },
  { id: "e5", name: "Zeeshan Ahmed", role: "Delivery Rider", salary: 35000, attendance: 90, status: "Active" },
  { id: "e6", name: "Sadaf Noor", role: "Store Helper", salary: 28000, attendance: 81, status: "Active" },
  { id: "e7", name: "Tariq Javed", role: "Store Keeper", salary: 40000, attendance: 95, status: "Active" },
  { id: "e8", name: "Rabia Kanwal", role: "Customer Support", salary: 33000, attendance: 68, status: "On Leave" },
];

export const dashboardStats = {
  todaysSales: 81250,
  receivables: 246550,
  payables: 138400,
  stockValue: products.reduce((s, p) => s + p.qty * p.purchasePrice, 0),
};
