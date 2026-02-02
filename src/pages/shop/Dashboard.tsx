import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Wrench, DollarSign, ClipboardList, LogOut, TrendingUp } from 'lucide-react';

export default function ShopDashboard() {
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
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              Partner Portal
            </span>
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
          <h1 className="text-3xl font-bold">Shop Dashboard</h1>
          <p className="text-muted-foreground">Manage claims, view earnings, and grow your portfolio.</p>
        </div>

        {/* Stats overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Monthly Earnings</CardDescription>
              <CardTitle className="text-2xl text-success">$0.00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3" />
                Commission + Repairs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Policies</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Devices you referred</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Claims</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Awaiting your action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Projected ARR</CardDescription>
              <CardTitle className="text-2xl">$0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Annual recurring revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Claims Queue</CardTitle>
                <CardDescription>View assigned claims</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Wrench className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg">Start Diagnostic</CardTitle>
                <CardDescription>Run device health check</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="dashboard-card cursor-pointer transition-all hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <CardTitle className="text-lg">Earnings</CardTitle>
                <CardDescription>View payout history</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Claims section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Claims</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No claims yet</h3>
              <p className="text-center text-sm text-muted-foreground">
                Claims assigned to your shop will appear here.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
