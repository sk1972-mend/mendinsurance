import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticScanner } from '@/components/shop/DiagnosticScanner';
import { RevenueVisualizer } from '@/components/shop/RevenueVisualizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Wrench, ClipboardList, LogOut, TrendingUp, ScanLine, Store, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShopData {
  id: string;
  business_name: string;
  tier: 'basic' | 'advanced' | 'expert';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  wallet_balance: number;
}

interface ClaimData {
  id: string;
  status: string;
  issue_description: string;
  filed_at: string;
}

const tierConfig = {
  basic: { label: 'Basic', className: 'tier-badge--basic' },
  advanced: { label: 'Advanced', className: 'tier-badge--advanced' },
  expert: { label: 'Expert', className: 'tier-badge--expert' },
};

export default function ShopDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'scanner' | 'revenue'>('overview');

  useEffect(() => {
    if (!user) return;

    const fetchShopData = async () => {
      try {
        // Get shop data
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (shopError) {
          if (shopError.code === 'PGRST116') {
            // No shop found - redirect to apply
            toast.info('Please complete your shop application.');
            navigate('/shop/apply');
            return;
          }
          throw shopError;
        }

        setShop(shopData);

        // Get assigned claims
        if (shopData.status === 'approved') {
          const { data: claimsData } = await supabase
            .from('claims')
            .select('id, status, issue_description, filed_at')
            .eq('assigned_shop_id', shopData.id)
            .order('filed_at', { ascending: false })
            .limit(5);

          setClaims(claimsData || []);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast.error('Failed to load shop data');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return null;
  }

  const isPending = shop.status === 'pending';

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
            <span className={`tier-badge ${tierConfig[shop.tier].className}`}>
              {tierConfig[shop.tier].label} Partner
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-sidebar-foreground/70">{shop.business_name}</span>
            <Button variant="ghost" size="sm" className="text-sidebar-foreground hover:text-sidebar-foreground" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Pending Banner */}
      {isPending && (
        <div className="bg-warning/10 border-b border-warning/20 py-3">
          <div className="container flex items-center gap-2 text-warning">
            <Store className="h-5 w-5" />
            <p className="font-medium">Your application is pending review. You'll be notified once approved.</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shop Dashboard</h1>
          <p className="text-muted-foreground">Manage claims, view earnings, and grow your portfolio.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeView === 'scanner' ? 'default' : 'outline'}
            onClick={() => setActiveView('scanner')}
            disabled={isPending}
          >
            <ScanLine className="mr-2 h-4 w-4" />
            Device Scanner
          </Button>
          <Button
            variant={activeView === 'revenue' ? 'default' : 'outline'}
            onClick={() => setActiveView('revenue')}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Revenue
          </Button>
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <>
            {/* Stats overview */}
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <Card className="data-card data-card--highlight">
                <CardHeader className="pb-2">
                  <CardDescription>Wallet Balance</CardDescription>
                  <CardTitle className="stat-value text-success">${shop.wallet_balance.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label">Available for payout</p>
                </CardContent>
              </Card>

              <Card className="data-card">
                <CardHeader className="pb-2">
                  <CardDescription>Active Policies</CardDescription>
                  <CardTitle className="stat-value">0</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label">Devices you referred</p>
                </CardContent>
              </Card>

              <Card className="data-card">
                <CardHeader className="pb-2">
                  <CardDescription>Pending Claims</CardDescription>
                  <CardTitle className="stat-value">{claims.filter(c => c.status === 'assigned').length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label">Awaiting your action</p>
                </CardContent>
              </Card>

              <Card className="data-card">
                <CardHeader className="pb-2">
                  <CardDescription>Shop Status</CardDescription>
                  <CardTitle className="text-lg">
                    <Badge variant="outline" className={isPending ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}>
                      {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="stat-label">{isPending ? 'Under review' : 'Ready for claims'}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card 
                className={`dashboard-card transition-all ${!isPending ? 'cursor-pointer hover:border-primary' : 'opacity-50'}`}
                onClick={() => !isPending && setActiveView('scanner')}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ScanLine className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Verify Device</CardTitle>
                    <CardDescription>Scan serial for claim</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="dashboard-card cursor-pointer transition-all hover:border-success">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <Wrench className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Claims Queue</CardTitle>
                    <CardDescription>{claims.length} assigned</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card 
                className="dashboard-card cursor-pointer transition-all hover:border-warning"
                onClick={() => setActiveView('revenue')}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                    <TrendingUp className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Revenue</CardTitle>
                    <CardDescription>View earnings & ARR</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Claims */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Claims</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              <Card>
                {claims.length === 0 ? (
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <ClipboardList className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No claims yet</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      {isPending 
                        ? 'Claims will be assigned once your application is approved.'
                        : 'Claims assigned to your shop will appear here.'}
                    </p>
                  </CardContent>
                ) : (
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {claims.map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">{claim.issue_description}</p>
                            <p className="text-sm text-muted-foreground">
                              Filed {new Date(claim.filed_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">{claim.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </section>
          </>
        )}

        {/* Scanner View */}
        {activeView === 'scanner' && !isPending && (
          <DiagnosticScanner 
            onVerified={(deviceId, serial) => {
              toast.success('Device verified!', {
                description: `Serial ${serial} matched successfully.`,
              });
            }}
          />
        )}

        {/* Revenue View */}
        {activeView === 'revenue' && <RevenueVisualizer />}
      </main>
    </div>
  );
}
