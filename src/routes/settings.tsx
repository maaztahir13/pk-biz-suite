import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BUSINESS_NAME, WHATSAPP_LINK } from "@/lib/erp-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PK Business ERP Demo" },
      {
        name: "description",
        content:
          "Configure business profile, invoice details, tax and printing preferences in this ERP demo for Pakistani SMEs.",
      },
      { property: "og:title", content: "Settings — PK Business ERP Demo" },
      {
        property: "og:description",
        content: "Business profile, GST number, currency and receipt printing settings.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState(BUSINESS_NAME);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="size-4" /> Business Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biz">Business Name</Label>
              <Input id="biz" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr">Address</Label>
              <Input id="addr" defaultValue="Shop 12, Main Bazaar, Lahore" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ph">Phone</Label>
                <Input id="ph" defaultValue="0300-1234567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ntn">NTN / GST No.</Label>
                <Input id="ntn" defaultValue="1234567-8" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Billing & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cur">Currency</Label>
                <Input id="cur" defaultValue="PKR (Rs.)" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Sales Tax (%)</Label>
                <Input id="tax" defaultValue="0" />
              </div>
            </div>
            <Separator />
            <SettingToggle label="Print receipt after sale" defaultOn />
            <SettingToggle label="Low stock alerts" defaultOn />
            <SettingToggle label="Allow udhaar (credit) sales" defaultOn />
            <SettingToggle label="Daily WhatsApp sales summary" />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/70 bg-accent/40 shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-base font-semibold">Want this ERP customised for your business?</p>
            <p className="text-sm text-muted-foreground">
              Custom modules, your branding, and full setup support.
            </p>
          </div>
          <Button asChild variant="whatsapp">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingToggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}
