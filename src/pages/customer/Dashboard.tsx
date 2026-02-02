import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDevices } from '@/hooks/useDevices';
import { AddDeviceFlow } from '@/components/customer/AddDeviceFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, Tablet, Laptop, Gamepad2, Watch, Plane, Headphones, FileText, Plus, LogOut, Loader2 } from 'lucide-react';
import { TIER_PRICING } from '@/lib/deviceTiers';

const deviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  console: Gamepad2,
  wearable: Watch,
  drone: Plane,
  audio: Headphones,
};

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-muted text-muted-foreground border-muted',
};

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const { devices, loading } = useDevices();
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Mend</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Manage your device protection and claims.</p>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card 
            className="dashboard-card cursor-pointer transition-all hover:border-primary"
            onClick={() => setAddDeviceOpen(true)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Add Device</CardTitle>
                <CardDescription>Protect a new device</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <FileText className="h-6 w-6 text-warning" />
              </div>
              <div>
                <CardTitle className="text-lg">File a Claim</CardTitle>
                <CardDescription>Report damage or issues</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Smartphone className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">My Devices</CardTitle>
                <CardDescription>{devices.length} protected</CardDescription>
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
                            <CardDescription className="text-xs font-mono">
                              {device.serial_number}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className={statusColors[status]}>
                          {status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-muted-foreground">Premium</p>
                          <p className="font-semibold">${tierInfo?.monthlyPremium || device.policy?.monthly_premium}/mo</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Deductible</p>
                          <p className="font-semibold">${tierInfo?.deductible || device.policy?.deductible}</p>
                        </div>
                      </div>
                      
                      {device.health_status && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
                          <div className="h-2 w-2 rounded-full bg-success" />
                          <span className="text-xs font-medium text-success">
                            Health: {device.health_status}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Add Device Flow Dialog */}
      <AddDeviceFlow open={addDeviceOpen} onOpenChange={setAddDeviceOpen} />
    </div>
  );
}
