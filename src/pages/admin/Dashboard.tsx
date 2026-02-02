import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ClaimsOversight } from '@/components/admin/ClaimsOversight';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Store, AlertTriangle, LogOut, Activity, ClipboardList, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShopApplication {
  id: string;
  business_name: string;
  business_email: string;
  tier: 'basic' | 'advanced' | 'expert';
  created_at: string;
  certifications: string[];
}

interface PlatformStats {
  totalCustomers: number;
  totalShops: number;
  activePolicies: number;
  pendingApplications: number;
}

const tierConfig = {
  basic: { label: 'Basic', className: 'tier-badge--basic' },
  advanced: { label: 'Advanced', className: 'tier-badge--advanced' },
  expert: { label: 'Expert', className: 'tier-badge--expert' },
};

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'claims' | 'shops'>('overview');
  const [stats, setStats] = useState<PlatformStats>({ totalCustomers: 0, totalShops: 0, activePolicies: 0, pendingApplications: 0 });
  const [pendingShops, setPendingShops] = useState<ShopApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get pending shop applications
        const { data: shopsData, error: shopsError } = await supabase
          .from('shops')
          .select('id, business_name, business_email, tier, created_at, certifications')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (shopsError) throw shopsError;
        setPendingShops(shopsData || []);

        // Get counts for stats
        const { count: customerCount } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');

        const { count: shopCount } = await supabase
          .from('shops')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        const { count: policyCount } = await supabase
          .from('policies')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        setStats({
          totalCustomers: customerCount || 0,
          totalShops: shopCount || 0,
          activePolicies: policyCount || 0,
          pendingApplications: shopsData?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShopDecision = async (shopId: string, decision: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ status: decision })
        .eq('id', shopId);

      if (error) throw error;

      toast.success(`Shop ${decision === 'approved' ? 'approved' : 'rejected'} successfully`);
      
      // Remove from pending list
      setPendingShops(prev => prev.filter(s => s.id !== shopId));
      setStats(prev => ({
        ...prev,
        pendingApplications: prev.pendingApplications - 1,
        totalShops: decision === 'approved' ? prev.totalShops + 1 : prev.totalShops,
      }));
    } catch (error) {
      console.error('Error updating shop:', error);
      toast.error('Failed to update shop status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <Badge variant="destructive">Admin</Badge>
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

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
          >
            <Activity className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeView === 'claims' ? 'default' : 'outline'}
            onClick={() => setActiveView('claims')}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Claims Oversight
          </Button>
          <Button
            variant={activeView === 'shops' ? 'default' : 'outline'}
            onClick={() => setActiveView('shops')}
          >
            <Store className="mr-2 h-4 w-4" />
            Shop Applications
            {stats.pendingApplications > 0 && (
              <Badge variant="destructive" className="ml-2">{stats.pendingApplications}</Badge>
            )}
          </Button>
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <>
            {/* Platform stats */}
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <Card className="data-card">
                <CardHeader className="pb-2">
                  <CardDescription>Total Customers</CardDescription>
                  <CardTitle className="stat-value">{stats.totalCustomers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Active users
                  </p>
                </CardContent>
              </Card>

              <Card className="data-card">
                <CardHeader className="pb-2">
                  <CardDescription>Partner Shops</CardDescription>
                  <CardTitle className="stat-value">{stats.totalShops}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label">Approved partners</p>
                </CardContent>
              </Card>

              <Card className="data-card data-card--highlight">
                <CardHeader className="pb-2">
                  <CardDescription>Active Policies</CardDescription>
                  <CardTitle className="stat-value text-success">{stats.activePolicies}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label">Devices protected</p>
                </CardContent>
              </Card>

              <Card className={`data-card ${stats.pendingApplications > 0 ? 'data-card--warning' : ''}`}>
                <CardHeader className="pb-2">
                  <CardDescription>Pending Applications</CardDescription>
                  <CardTitle className="stat-value text-warning">{stats.pendingApplications}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label">Shop applications</p>
                </CardContent>
              </Card>
            </div>

            {/* Admin sections */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card 
                className="dashboard-card cursor-pointer transition-all hover:border-primary"
                onClick={() => setActiveView('shops')}
              >
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

              <Card 
                className="dashboard-card cursor-pointer transition-all hover:border-destructive"
                onClick={() => setActiveView('claims')}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Claims Oversight</CardTitle>
                    <CardDescription>Review all claims</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="dashboard-card cursor-pointer transition-all hover:border-accent-foreground">
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
          </>
        )}

        {/* Claims View */}
        {activeView === 'claims' && <ClaimsOversight />}

        {/* Shop Applications View */}
        {activeView === 'shops' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Shop Applications
              </CardTitle>
              <CardDescription>Review and approve partner applications.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingShops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Store className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No pending applications</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    New shop applications will appear here for review.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {pendingShops.map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between py-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">{shop.business_name}</p>
                          <span className={`tier-badge ${tierConfig[shop.tier].className}`}>
                            {tierConfig[shop.tier].label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{shop.business_email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied {new Date(shop.created_at).toLocaleDateString()}
                          {shop.certifications && shop.certifications.length > 0 && (
                            <> • {shop.certifications.length} certifications</>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShopDecision(shop.id, 'rejected')}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleShopDecision(shop.id, 'approved')}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
