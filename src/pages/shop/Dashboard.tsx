import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, ClipboardList, TrendingUp, ScanLine, Store, Loader2 } from 'lucide-react';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return null;
  }

  const isPending = shop.status === 'pending';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">Shop Dashboard</h1>
            <span className={`tier-badge ${tierConfig[shop.tier].className}`}>
              {tierConfig[shop.tier].label} Partner
            </span>
          </div>
          <p className="text-muted-foreground">Manage claims, view earnings, and grow your portfolio.</p>
        </div>
      </div>

      {/* Pending Banner */}
      {isPending && (
        <div className="rounded-lg bg-warning/10 border border-warning/20 p-4">
          <div className="flex items-center gap-2 text-warning">
            <Store className="h-5 w-5" />
            <p className="font-medium">Your application is pending review. You'll be notified once approved.</p>
          </div>
        </div>
      )}

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/shop/scanner">
          <Card 
            className={`dashboard-card transition-all ${!isPending ? 'cursor-pointer hover:border-primary' : 'opacity-50 pointer-events-none'}`}
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
        </Link>

        <Link to="/shop/queue">
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
        </Link>

        <Link to="/shop/revenue">
          <Card className="dashboard-card cursor-pointer transition-all hover:border-warning">
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
        </Link>
      </div>

      {/* Recent Claims */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Claims</h2>
          <Link to="/shop/queue" className="text-sm font-medium text-primary hover:underline">
            View All
          </Link>
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
    </div>
  );
}
