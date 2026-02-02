import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Smartphone, FileText, Plus, LogOut } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();

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
          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
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
                <CardDescription>View protected devices</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Protected devices section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Protected Devices</h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Smartphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No devices yet</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Add your first device to start protecting it with Mend.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Device
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
