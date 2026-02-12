import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDevices } from '@/hooks/useDevices';
import { AddDeviceFlow } from '@/components/customer/AddDeviceFlow';
import { ClaimTriage } from '@/components/customer/ClaimTriage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Smartphone, Tablet, Laptop, Gamepad2, Watch, Plane, Headphones, FileText, Plus, Loader2, AlertTriangle, Shield, CreditCard, MessageCircle, Phone } from 'lucide-react';
import { TIER_PRICING } from '@/lib/deviceTiers';

const deviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone, tablet: Tablet, laptop: Laptop, console: Gamepad2,
  wearable: Watch, drone: Plane, audio: Headphones,
};

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-muted text-muted-foreground border-muted',
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { devices, loading } = useDevices();
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [claimTriageOpen, setClaimTriageOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);

  const activeDevices = devices.filter(d => d.policy?.status === 'active');
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-xl border-2 border-success/20 bg-success/5 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-6 w-6 text-success" />
          <Badge variant="outline" className="border-success/30 bg-success/10 text-success font-semibold">
            Protected
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}.</h1>
        <p className="text-muted-foreground mt-1">
          {activeDevices.length} device{activeDevices.length !== 1 ? 's' : ''} under active protection.
        </p>
      </div>

      {/* Primary Action: File a Claim — Big Red Button */}
      <Card
        className="cursor-pointer border-2 border-warning/40 bg-warning/5 transition-all hover:border-warning hover:shadow-lg"
        onClick={() => setClaimTriageOpen(true)}
      >
        <CardHeader className="flex flex-row items-center gap-5 p-6 md:p-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-warning/20">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl">File a Claim</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Device damaged? Start your repair request now. We'll match you with the nearest certified shop.
            </CardDescription>
          </div>
          <FileText className="hidden h-6 w-6 text-warning md:block" />
        </CardHeader>
      </Card>

      {/* Secondary Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className="cursor-pointer transition-all hover:border-primary/40 hover:shadow-md"
          onClick={() => setAddDeviceOpen(true)}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">My Coverage</CardTitle>
              <CardDescription>{activeDevices.length} active · {devices.length} total devices</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="transition-all hover:border-primary/40 hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Billing</CardTitle>
              <CardDescription>View payment history & invoices</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Protected devices section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Protected Devices</h2>
          <Button variant="outline" size="sm" onClick={() => setAddDeviceOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : devices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Smartphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No devices yet</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Add your first device to start protecting it with Mend.
              </p>
              <Button onClick={() => setAddDeviceOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Device
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => {
              const DeviceIcon = deviceIcons[device.device_type] || Smartphone;
              const tierInfo = TIER_PRICING[device.tier];
              const status = device.policy?.status || 'pending';
              return (
                <Card key={device.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <DeviceIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{device.brand} {device.model}</CardTitle>
                          <CardDescription className="text-xs font-mono">{device.serial_number}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColors[status]}>{status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">Premium</p>
                        <p className="font-semibold font-mono">${tierInfo?.monthlyPremium || device.policy?.monthly_premium}/mo</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Deductible</p>
                        <p className="font-semibold font-mono">${tierInfo?.deductible || device.policy?.deductible}</p>
                      </div>
                    </div>
                    {device.health_status && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
                        <div className="h-2 w-2 rounded-full bg-success" />
                        <span className="text-xs font-medium text-success">Health: {device.health_status}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <AddDeviceFlow open={addDeviceOpen} onOpenChange={setAddDeviceOpen} />
      <ClaimTriage open={claimTriageOpen} onOpenChange={setClaimTriageOpen} />

      {/* Concierge Dialog */}
      <Dialog open={conciergeOpen} onOpenChange={setConciergeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Concierge</DialogTitle>
            <DialogDescription>Get help from our dedicated support team.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Button variant="outline" className="h-14 justify-start gap-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Chat with Support</p>
                <p className="text-xs opacity-70">Average response: 2 min</p>
              </div>
            </Button>
            <Button variant="outline" className="h-14 justify-start gap-3 border-2 border-success text-success hover:bg-success hover:text-white">
              <Phone className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Call 24/7 Line</p>
                <p className="text-xs opacity-70">1-800-MEND-NOW</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Concierge Button */}
      <button
        onClick={() => setConciergeOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
        aria-label="Contact Concierge"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
