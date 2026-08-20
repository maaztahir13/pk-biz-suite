import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, UserCog, Wallet } from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { employees, formatPKR } from "@/lib/erp-data";

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [
      { title: "HR & Staff — PK Business ERP Demo" },
      {
        name: "description",
        content:
          "Staff management demo with salaries, attendance percentage and leave status for Pakistani SMEs.",
      },
      { property: "og:title", content: "HR & Staff — PK Business ERP Demo" },
      {
        property: "og:description",
        content: "Employee records, monthly salary payroll and attendance tracking in PKR.",
      },
    ],
  }),
  component: HrPage,
});

function HrPage() {
  const payroll = employees.reduce((s, e) => s + e.salary, 0);
  const avgAttendance = Math.round(
    employees.reduce((s, e) => s + e.attendance, 0) / employees.length,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Staff" value={String(employees.length)} icon={UserCog} />
        <StatCard label="Monthly Payroll" value={formatPKR(payroll)} icon={Wallet} tone="warning" />
        <StatCard
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={CalendarCheck}
          tone="success"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((e) => (
          <Card key={e.id} className="rounded-2xl border-border/70 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {e.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.role}</p>
                  </div>
                </div>
                <Badge variant={e.status === "Active" ? "secondary" : "destructive"}>
                  {e.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Salary</span>
                <span className="font-semibold">{formatPKR(e.salary)}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{e.attendance}%</span>
                </div>
                <Progress value={e.attendance} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
