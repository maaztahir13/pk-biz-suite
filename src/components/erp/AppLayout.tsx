import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BookOpen,
  FileBarChart,
  UserCog,
  Settings,
  Bell,
  Menu,
  X,
  MessageCircle,
  Store,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { BUSINESS_NAME, WHATSAPP_LINK } from "@/lib/erp-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "POS / Billing", icon: ShoppingCart },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/accounts", label: "Accounts / Ledger", icon: BookOpen },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/hr", label: "HR & Staff", icon: UserCog },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = nav.find((n) => n.to === pathname) ?? nav[0];

  const SidebarInner = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Store className="size-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{BUSINESS_NAME}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">ERP Suite</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = item.to === pathname;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
              title={item.label}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 lg:flex"
        >
          <Menu className="size-4" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden transition-all duration-300 lg:block",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        {SidebarInner}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-xl">
            <button
              className="absolute right-3 top-4 z-10 text-sidebar-foreground/70"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-5" />
            </button>
            {SidebarInner}
          </div>
        </div>
      )}

      <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur md:px-6">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold md:text-lg">{current.label}</h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{BUSINESS_NAME}</p>
          </div>
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          </button>
          <Button asChild variant="whatsapp" size="sm">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">Get This For Your Business</span>
              <span className="sm:hidden">Get This</span>
            </a>
          </Button>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-105 lg:hidden"
        aria-label="Get this ERP for your business on WhatsApp"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
}
