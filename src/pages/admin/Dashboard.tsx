import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Store, AlertTriangle, LogOut, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-sidebar text-sidebar-foreground">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Mend</span>
            <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
              Admin
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-sidebar-foreground/70">{user?.email}</span>
            <Button variant="ghost" size="sm" className="text-sidebar-foreground hover:text-sidebar-foreground" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage partners, claims, and platform operations.</p>
        </div>

        {/* Platform stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Customers</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <Activity className="mr-1 inline h-3 w-3" />
                Active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Partner Shops</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Approved partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Policies</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Devices protected</p>
            </CardContent>
          </Card>

          <Card className="border-warning">
            <CardHeader className="pb-2">
              <CardDescription>Pending Applications</CardDescription>
              <CardTitle className="text-2xl text-warning">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Shop applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin sections */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Partner Management</CardTitle>
                <CardDescription>Review and manage shops</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">Flagged Claims</CardTitle>
                <CardDescription>Claims requiring review</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>Manage all users</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Shop applications */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Shop Applications</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Store className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No pending applications</h3>
              <p className="text-center text-sm text-muted-foreground">
                New shop applications will appear here for review.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
