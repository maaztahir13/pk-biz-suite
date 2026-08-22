import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Pencil, Plus, Trash2, UserCog, Wallet } from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPKR } from "@/lib/erp-data";
import { useEmployeeMutations, useEmployees, type DbEmployee } from "@/lib/erp-queries";

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

const emptyForm = { name: "", role: "", salary: "", attendance: "" };

function HrPage() {
  const { data: employees = [] } = useEmployees();
  const { create, update, remove } = useEmployeeMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DbEmployee | null>(null);
  const [form, setForm] = useState(emptyForm);

  const payroll = employees.reduce((s, e) => s + Number(e.salary), 0);
  const avgAttendance = employees.length
    ? Math.round(employees.reduce((s, e) => s + e.attendance_percent, 0) / employees.length)
    : 0;

  const save = () => {
    if (!form.name) return;
    const payload = {
      name: form.name,
      role: form.role || "Staff",
      salary: Number(form.salary) || 0,
      attendance_percent: Number(form.attendance) || 0,
    };
    if (editing) update.mutate({ id: editing.id, ...payload });
    else create.mutate(payload);
    setForm(emptyForm);
    setEditing(null);
    setOpen(false);
  };

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

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add Employee
        </Button>
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
                <span className="font-semibold">{formatPKR(Number(e.salary))}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{e.attendance_percent}%</span>
                </div>
                <Progress value={e.attendance_percent} className="h-2" />
              </div>

              <div className="flex justify-end gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(e);
                    setForm({
                      name: e.name,
                      role: e.role,
                      salary: String(e.salary),
                      attendance: String(e.attendance_percent),
                    });
                    setOpen(true);
                  }}
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (window.confirm(`Remove ${e.name} from staff?`)) remove.mutate(e.id);
                  }}
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(ev) => setForm({ ...form, name: ev.target.value })} placeholder="e.g. Ali Raza" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input value={form.role} onChange={(ev) => setForm({ ...form, role: ev.target.value })} placeholder="e.g. Cashier" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Salary (Rs.)</Label>
                <Input type="number" value={form.salary} onChange={(ev) => setForm({ ...form, salary: ev.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Attendance %</Label>
                <Input type="number" value={form.attendance} onChange={(ev) => setForm({ ...form, attendance: ev.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={save} disabled={create.isPending || update.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
