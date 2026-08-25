# BizFlow Pro

Build a modern, professional ERP web application demo for Pakistani small and medium businesses (SMEs). This is a DEMO/PORTFOLIO version to show potential clients — use realistic sample/dummy data throughout so every screen looks fully populated and real, not empty. No backend, no authentication, no real database needed — everything can run on local/mock state (use static JS arrays/objects for data). Focus entirely on clean, professional, trustworthy UI/UX.

BRANDING (must be easy to customize later):

- Top-left sidebar should show a placeholder logo box and a "Business Name" text (default: "Your Business Name") so it can be swapped later with a client's actual logo/name

- Use a clean, modern color scheme (deep blue/teal primary, white/light gray background, green for positive numbers, red for negative/dues) — professional SaaS look, not childish

LAYOUT:

- Left sidebar navigation (collapsible) with icons: Dashboard, POS / Billing, Inventory, Customers (CRM), Accounts / Ledger, Reports, HR & Staff, Settings

- Top bar with business name, notification bell icon, and a "Get This For Your Business" WhatsApp button (green, floating or top-right) — this button should open a WhatsApp chat link (wa.me) with a pre-filled message like "I want this ERP system for my business"

- Currency everywhere should be in PKR (Rs.) format, e.g. "Rs. 45,000"

PAGES TO BUILD:

1. DASHBOARD (home page)

- Summary cards: Today's Sales, Total Receivables (paisay wasooli), Total Payables, Stock Value, Low Stock Alerts count

- A simple sales chart (last 7 days, bar or line chart) with sample data

- Recent transactions list (5-6 dummy entries: invoice #, customer, amount, status)

- Low stock items widget (3-4 sample items in red/orange warning)

2. POS / BILLING PAGE

- Simple point-of-sale style invoice creation screen

- Product search/select on left, cart/invoice summary on right

- Auto-calculate subtotal, discount, tax (show as "Sales Tax" field, editable %), grand total

- "Generate Invoice" button that shows a clean printable invoice preview with invoice number (format like INV-2026-001), date, business name/logo placeholder, customer name, itemized table, totals

- Payment method selector: Cash, Bank Transfer, EasyPaisa/JazzCash (show these as real payment options since common in Pakistan)

3. INVENTORY PAGE

- Table of products with columns: Product Name, SKU, Category, Stock Qty, Unit Price, Stock Value, Status (In Stock/Low Stock/Out of Stock badge)

- Preload with 10-12 realistic sample products (mix of general retail items)

- "Add Product" button opens a modal form (Product name, category, quantity, purchase price, sale price)

- Search and category filter at top

4. CUSTOMERS (CRM) PAGE

- Table of customers: Name, Phone, Total Purchases, Outstanding Balance (udhaar), Last Purchase Date

- Preload 8-10 sample Pakistani-style customer names

- Click a customer to see a simple detail view with purchase history and balance

- "Add Customer" button with modal form

5. ACCOUNTS / LEDGER PAGE

- Simple ledger table: Date, Description, Type (Income/Expense), Amount, Balance running total

- Summary cards at top: Total Income, Total Expense, Net Profit (all with sample numbers)

- "Add Entry" button for income/expense with modal form

- A simple pie chart showing expense breakdown by category (rent, salaries, utilities, purchases etc.)

6. REPORTS PAGE

- Simple report cards/buttons: Sales Report, Inventory Report, Profit & Loss, Customer Ledger — each shows a preview table with sample data when clicked

- Date range filter (just UI, doesn't need to be functional with real logic)

- "Export as PDF" and "Export as Excel" buttons (UI only, can be non-functional for demo)

7. HR & STAFF PAGE

- Simple employee table: Name, Role, Salary, Attendance % this month, Status

- Preload 6-8 sample employees

- "Add Employee" button with modal form

8. SETTINGS PAGE

- Business Profile section: Business Name, Logo upload placeholder, Address, Phone, Business Type dropdown

- Tax settings: Sales Tax %, Currency (locked to PKR)

- Language toggle UI: English / Urdu (just a toggle switch, doesn't need full translation to work for demo)

GENERAL REQUIREMENTS:

- Fully responsive (should look great on both desktop and mobile browser since business owners will view the demo link on their phone)

- Use realistic Pakistani business context in all sample data (product names, customer names, expense categories like "Dukan Rent", "Staff Salary", "Bijli Bill")

- Keep the whole app feeling like a real, ready-to-use professional product — since this is being shown to potential clients as a live demo to convince them to buy a custom version

- Smooth transitions, modern card-based UI, rounded corners, subtle shadows, no clutter

- Make sure every page loads with data already visible — no empty states in the demo

Build this as a single cohesive app with working navigation between all pages using the sample/mock data described above.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf7f21e0-99e4-48e0-bff0-c8997f35b9a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
