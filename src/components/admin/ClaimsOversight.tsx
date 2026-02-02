import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  Store,
} from 'lucide-react';

type ClaimStatus = 'filed' | 'assigned' | 'in_progress' | 'verified_complete' | 'flagged' | 'closed';

interface Claim {
  id: string;
  status: ClaimStatus;
  issue_description: string;
  repair_type: 'local' | 'mail_in' | null;
  serial_match: boolean | null;
  filed_at: string;
  device_brand?: string;
  device_model?: string;
  device_serial?: string;
  customer_name?: string;
  shop_name?: string;
}

const statusConfig: Record<ClaimStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  filed: { label: 'Filed', color: 'bg-warning/10 text-warning', icon: Clock },
  assigned: { label: 'Assigned', color: 'bg-primary/10 text-primary', icon: Store },
  in_progress: { label: 'In Progress', color: 'bg-primary/10 text-primary', icon: Loader2 },
  verified_complete: { label: 'Verified', color: 'bg-success/10 text-success', icon: CheckCircle },
  flagged: { label: 'Flagged', color: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground', icon: CheckCircle },
};

export function ClaimsOversight() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchClaims = async () => {
    try {
      setLoading(true);

      // Fetch claims with related data
      const { data: claimsData, error } = await supabase
        .from('claims')
        .select(`
          id,
          status,
          issue_description,
          repair_type,
          serial_match,
          filed_at,
          policy_id,
          assigned_shop_id
        `)
        .order('filed_at', { ascending: false });

      if (error) throw error;

      // Enrich claims with device and customer data
      const enrichedClaims = await Promise.all(
        (claimsData || []).map(async (claim) => {
          // Get policy and device info
          const { data: policy } = await supabase
            .from('policies')
            .select('device_id, user_id')
            .eq('id', claim.policy_id)
            .single();

          let deviceInfo = { brand: '', model: '', serial: '' };
          let customerName = '';
          let shopName = '';

          if (policy) {
            const { data: device } = await supabase
              .from('devices')
              .select('brand, model, serial_number')
              .eq('id', policy.device_id)
              .single();

            if (device) {
              deviceInfo = {
                brand: device.brand,
                model: device.model,
                serial: device.serial_number,
              };
            }

            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('user_id', policy.user_id)
              .single();

            if (profile) {
              customerName = profile.full_name || profile.email || '';
            }
          }

          if (claim.assigned_shop_id) {
            const { data: shop } = await supabase
              .from('shops')
              .select('business_name')
              .eq('id', claim.assigned_shop_id)
              .single();

            if (shop) {
              shopName = shop.business_name;
            }
          }

          return {
            ...claim,
            device_brand: deviceInfo.brand,
            device_model: deviceInfo.model,
            device_serial: deviceInfo.serial,
            customer_name: customerName,
            shop_name: shopName,
          } as Claim;
        })
      );

      setClaims(enrichedClaims);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesSearch = 
      searchQuery === '' ||
      claim.device_serial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.issue_description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (claimId: string, newStatus: ClaimStatus) => {
    try {
      const { error } = await supabase
        .from('claims')
        .update({ status: newStatus })
        .eq('id', claimId);

      if (error) throw error;

      toast.success(`Claim status updated to ${statusConfig[newStatus].label}`);
      fetchClaims();
      setDetailsOpen(false);
    } catch (error) {
      console.error('Error updating claim:', error);
      toast.error('Failed to update claim status');
    }
  };

  const viewClaimDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Claims Oversight
          </CardTitle>
          <CardDescription>
            Review and manage all claims across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by serial, customer, or issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Claims Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No claims found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Serial</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => {
                    const StatusIcon = statusConfig[claim.status].icon;
                    const isFlagged = claim.serial_match === false;
                    
                    return (
                      <TableRow 
                        key={claim.id} 
                        className={isFlagged ? 'bg-destructive/5' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isFlagged && (
                              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                            )}
                            <span className="font-medium">{claim.customer_name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {claim.device_brand} {claim.device_model}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{claim.device_serial}</span>
                        </TableCell>
                        <TableCell>
                          {claim.shop_name || (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig[claim.status].color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[claim.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(claim.filed_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewClaimDetails(claim)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
            <DialogDescription>
              Review and manage this claim.
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4">
              {selectedClaim.serial_match === false && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Serial Mismatch Detected</p>
                    <p className="text-sm">The shop-verified serial doesn't match the registered device.</p>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-semibold">{selectedClaim.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device</span>
                  <span>{selectedClaim.device_brand} {selectedClaim.device_model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Serial</span>
                  <span className="font-mono text-sm">{selectedClaim.device_serial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue</span>
                  <span>{selectedClaim.issue_description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Repair Type</span>
                  <Badge variant="outline">
                    {selectedClaim.repair_type === 'local' ? 'Local Shop' : 'Mail-In'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className={statusConfig[selectedClaim.status].color}>
                    {statusConfig[selectedClaim.status].label}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {selectedClaim.status !== 'flagged' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedClaim.id, 'flagged')}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Flag
                  </Button>
                )}
                {selectedClaim.status !== 'closed' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedClaim.id, 'closed')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Close
                  </Button>
                )}
                {selectedClaim.status === 'filed' && (
                  <Button
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedClaim.id, 'in_progress')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
