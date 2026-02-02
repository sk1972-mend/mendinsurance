import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Wallet } from 'lucide-react';

interface LedgerEntry {
  amount: number;
  credited_at: string;
}

interface PayoutEntry {
  amount: number;
  paid_at: string;
}

interface MonthlyData {
  month: string;
  commission: number;
  repairs: number;
}

export function RevenueVisualizer() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlyPassive, setMonthlyPassive] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [projectedARR, setProjectedARR] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchRevenueData = async () => {
      try {
        // Get shop ID first
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('id, wallet_balance')
          .eq('user_id', user.id)
          .single();

        if (shopError || !shopData) {
          setLoading(false);
          return;
        }

        setWalletBalance(shopData.wallet_balance || 0);

        // Fetch commission ledger entries (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data: ledgerData } = await supabase
          .from('subscriptions_ledger')
          .select('amount, credited_at')
          .eq('shop_id', shopData.id)
          .gte('credited_at', sixMonthsAgo.toISOString())
          .order('credited_at', { ascending: true });

        // Fetch repair payouts (last 6 months)
        const { data: payoutData } = await supabase
          .from('claims_payout')
          .select('amount, paid_at')
          .eq('shop_id', shopData.id)
          .gte('paid_at', sixMonthsAgo.toISOString())
          .order('paid_at', { ascending: true });

        // Process data into monthly buckets
        const monthlyMap = new Map<string, { commission: number; repairs: number }>();
        
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const key = date.toLocaleString('default', { month: 'short' });
          monthlyMap.set(key, { commission: 0, repairs: 0 });
        }

        // Add ledger entries
        (ledgerData || []).forEach((entry: LedgerEntry) => {
          const month = new Date(entry.credited_at).toLocaleString('default', { month: 'short' });
          const existing = monthlyMap.get(month) || { commission: 0, repairs: 0 };
          monthlyMap.set(month, { ...existing, commission: existing.commission + Number(entry.amount) });
        });

        // Add payout entries
        (payoutData || []).forEach((entry: PayoutEntry) => {
          const month = new Date(entry.paid_at).toLocaleString('default', { month: 'short' });
          const existing = monthlyMap.get(month) || { commission: 0, repairs: 0 };
          monthlyMap.set(month, { ...existing, repairs: existing.repairs + Number(entry.amount) });
        });

        const chartArr: MonthlyData[] = Array.from(monthlyMap.entries()).map(([month, data]) => ({
          month,
          commission: data.commission,
          repairs: data.repairs,
        }));

        setChartData(chartArr);

        // Calculate current month passive income
        const currentMonth = new Date().toLocaleString('default', { month: 'short' });
        const currentMonthData = monthlyMap.get(currentMonth);
        setMonthlyPassive(currentMonthData?.commission || 0);

        // Calculate projected ARR (average monthly × 12)
        const totalCommission = chartArr.reduce((sum, d) => sum + d.commission, 0);
        const avgMonthly = totalCommission / Math.max(chartArr.length, 1);
        setProjectedARR(avgMonthly * 12);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [user]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="py-6">
              <div className="h-20 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="data-card data-card--highlight">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monthly Passive Income
            </CardDescription>
            <CardTitle className="stat-value text-success">
              ${monthlyPassive.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="stat-label">15% commission on active policies</p>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Projected ARR
            </CardDescription>
            <CardTitle className="stat-value">
              ${projectedARR.toFixed(0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="stat-label">Annual recurring revenue</p>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Balance
            </CardDescription>
            <CardTitle className="stat-value">
              ${walletBalance.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="stat-label">Available for payout</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Revenue Trends (6 Months)
          </CardTitle>
          <CardDescription>Commission and repair income over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.some(d => d.commission > 0 || d.repairs > 0) ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(213, 75%, 15%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(213, 75%, 15%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="commission"
                    name="Commission"
                    stroke="hsl(160, 84%, 39%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCommission)"
                  />
                  <Area
                    type="monotone"
                    dataKey="repairs"
                    name="Repairs"
                    stroke="hsl(213, 75%, 15%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRepairs)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No revenue data yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Refer customers to start earning passive income.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
