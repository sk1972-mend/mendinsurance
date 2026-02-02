import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Clock, MapPin, Wrench, Loader2, Phone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ClaimWithPolicy {
  id: string;
  status: string;
  issue_description: string;
  filed_at: string;
  repair_type: string | null;
  policy: {
    device: {
      brand: string;
      model: string;
      device_type: string;
      serial_number: string;
    };
    user_id: string;
  };
}

const statusColors: Record<string, string> = {
  assigned: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  verified_complete: 'bg-success/10 text-success border-success/20',
  flagged: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function ClaimsQueue() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<ClaimWithPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchClaims = async () => {
      try {
        // First get the shop ID
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (shopError) {
          console.error('Error fetching shop:', shopError);
          setLoading(false);
          return;
        }

        setShopId(shopData.id);

        // Get claims assigned to this shop with policy and device info
        const { data: claimsData, error: claimsError } = await supabase
          .from('claims')
          .select(`
            id,
            status,
            issue_description,
            filed_at,
            repair_type,
            policy:policies (
              user_id,
              device:devices (
                brand,
                model,
                device_type,
                serial_number
              )
            )
          `)
          .eq('assigned_shop_id', shopData.id)
          .in('status', ['assigned', 'in_progress'])
          .order('filed_at', { ascending: true });

        if (claimsError) throw claimsError;

        // Transform the data to flatten the nested structure
        const formattedClaims = (claimsData || []).map((claim: any) => ({
          id: claim.id,
          status: claim.status,
          issue_description: claim.issue_description,
          filed_at: claim.filed_at,
          repair_type: claim.repair_type,
          policy: {
            user_id: claim.policy?.user_id,
            device: claim.policy?.device,
          },
        }));

        setClaims(formattedClaims);
      } catch (error) {
        console.error('Error fetching claims:', error);
        toast.error('Failed to load claims queue');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user]);

  const handleStartRepair = async (claimId: string) => {
    try {
      const { error } = await supabase
        .from('claims')
        .update({ status: 'in_progress' })
        .eq('id', claimId);

      if (error) throw error;

      setClaims(prev => 
        prev.map(c => c.id === claimId ? { ...c, status: 'in_progress' } : c)
      );
      toast.success('Repair started');
    } catch (error) {
      console.error('Error starting repair:', error);
      toast.error('Failed to start repair');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Claims Queue</h1>
        <p className="text-muted-foreground">Manage repairs assigned to your shop.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardDescription>Awaiting Action</CardDescription>
            <CardTitle className="stat-value text-warning">
              {claims.filter(c => c.status === 'assigned').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="stat-value text-primary">
              {claims.filter(c => c.status === 'in_progress').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Active</CardDescription>
            <CardTitle className="stat-value">{claims.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Active Claims
          </CardTitle>
          <CardDescription>
            Claims assigned to your shop that need attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No active claims</h3>
              <p className="text-center text-sm text-muted-foreground">
                New claims will appear here when customers file them.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {claims.map((claim) => (
                <div key={claim.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">
                        {claim.policy?.device?.brand} {claim.policy?.device?.model}
                      </h4>
                      <Badge variant="outline" className={statusColors[claim.status]}>
                        {claim.status === 'in_progress' ? 'In Progress' : 'Assigned'}
                      </Badge>
                      {claim.repair_type && (
                        <Badge variant="secondary" className="capitalize">
                          {claim.repair_type === 'local' ? (
                            <><MapPin className="mr-1 h-3 w-3" /> Local</>
                          ) : (
                            <><Phone className="mr-1 h-3 w-3" /> Mail-in</>
                          )}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{claim.issue_description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Filed {new Date(claim.filed_at).toLocaleDateString()}
                      </span>
                      <span className="font-mono">
                        SN: {claim.policy?.device?.serial_number}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {claim.status === 'assigned' && (
                      <Button onClick={() => handleStartRepair(claim.id)}>
                        <Wrench className="mr-2 h-4 w-4" />
                        Start Repair
                      </Button>
                    )}
                    {claim.status === 'in_progress' && (
                      <Button variant="outline">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
