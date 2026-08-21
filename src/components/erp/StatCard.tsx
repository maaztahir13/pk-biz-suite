import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "destructive" | "warning";
  hint?: string;
}) {
  const toneClass = {
    default: "bg-accent text-accent-foreground",
    success: "bg-success/12 text-success",
    destructive: "bg-destructive/12 text-destructive",
    warning: "bg-warning/15 text-warning",
  }[tone];

  return (
    <Card className="flex items-start gap-4 rounded-2xl border-border/70 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("flex size-11 items-center justify-center rounded-xl", toneClass)}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-lg font-semibold leading-tight break-words md:text-xl">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
