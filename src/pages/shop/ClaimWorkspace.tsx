import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DiagnosticScanner } from '@/components/shop/DiagnosticScanner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Shield,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Cpu,
  Hash,
  FileText,
  DollarSign,
  ClipboardCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface ClaimDetail {
  id: string;
  status: string;
  issue_description: string;
  repair_type: string | null;
  serial_match: boolean | null;
  filed_at: string;
  device: {
    brand: string;
    model: string;
    device_type: string;
    serial_number: string;
  };
  deductible: number;
}

const REPAIR_CHECKLIST = [
  { id: 'screen', label: 'Screen & Display Inspection' },
  { id: 'battery', label: 'Battery Health Check' },
  { id: 'ports', label: 'Ports & Connectivity Test' },
  { id: 'housing', label: 'Housing & Frame Integrity' },
  { id: 'software', label: 'Software / Firmware Reset' },
];

const statusBadgeClass: Record<string, string> = {
  assigned: 'border-warning/30 bg-warning/10 text-warning',
  in_progress: 'border-primary/30 bg-primary/10 text-primary',
  verified_complete: 'border-success/30 bg-success/10 text-success',
  flagged: 'border-destructive/30 bg-destructive/10 text-destructive',
};

const statusLabel: Record<string, string> = {
  assigned: 'Assigned',
  in_progress: 'In Progress',
  verified_complete: 'Complete',
  flagged: 'Flagged',
};

export default function ClaimWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [finalizing, setFinalizing] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const fetchClaim = async () => {
      try {
        const { data, error } = await supabase
          .from('claims')
          .select(`
            id, status, issue_description, repair_type, serial_match, filed_at,
            policy:policies (
              deductible,
              device:devices (
                brand, model, device_type, serial_number
              )
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setClaim(null);
          setLoading(false);
          return;
        }

        const policyData = data.policy as any;
        setClaim({
          id: data.id,
          status: data.status,
          issue_description: data.issue_description,
          repair_type: data.repair_type,
          serial_match: data.serial_match,
          filed_at: data.filed_at,
          device: policyData?.device || { brand: '', model: '', device_type: '', serial_number: '' },
          deductible: policyData?.deductible || 75,
        });
      } catch (err) {
        console.error('Error fetching claim:', err);
        toast.error('Failed to load claim');
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id, user]);

  const isVerified = claim?.status === 'in_progress' || claim?.status === 'verified_complete';
  const isComplete = claim?.status === 'verified_complete';
  const estimatedPayout = claim ? (claim.deductible * 0.15).toFixed(2) : '0.00';
  const allChecked = REPAIR_CHECKLIST.every((item) => checkedItems[item.id]);

  const handleVerified = async () => {
    if (!claim) return;
    // Update local state to unlock workbench
    const { error } = await supabase
      .from('claims')
      .update({ status: 'in_progress', serial_match: true })
      .eq('id', claim.id);

    if (error) {
      console.error(error);
      toast.error('Failed to update claim status');
      return;
    }

    setClaim((prev) => (prev ? { ...prev, status: 'in_progress', serial_match: true } : prev));
    toast.success('Verification complete — Workbench unlocked');
  };

  const handleFinalize = async () => {
    if (!claim) return;
    setFinalizing(true);

    try {
      const { error } = await supabase
        .from('claims')
        .update({ status: 'verified_complete', completed_at: new Date().toISOString() })
        .eq('id', claim.id);

      if (error) throw error;

      setClaim((prev) => (prev ? { ...prev, status: 'verified_complete' } : prev));
      toast.success(`Repair Closed. Payment of $${estimatedPayout} queued.`, {
        description: `Claim ${claim.id.slice(0, 8).toUpperCase()} finalized.`,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to finalize repair');
    } finally {
      setFinalizing(false);
    }
  };

  // --- Loading / Not Found ---
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-muted-foreground">Claim not found.</p>
        <Button variant="outline" onClick={() => navigate('/shop/queue')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Phase 1: Ticket Stub Header ─── */}
      <div className="rounded-lg bg-sidebar px-6 py-5 shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Back + Branding */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-primary-foreground/70 hover:text-sidebar-primary-foreground hover:bg-sidebar-accent/20"
              onClick={() => navigate('/shop/queue')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-primary-foreground">
                Mend OS
              </span>
              <span className="text-sidebar-primary-foreground/40 font-mono text-sm">
                // Active Repair
              </span>
            </div>
          </div>

          {/* Right: Claim ID + Status */}
          <div className="flex items-center gap-3 pl-14 sm:pl-0">
            <span className="font-mono text-xs text-sidebar-primary-foreground/60">
              <Hash className="mr-1 inline h-3 w-3" />
              {claim.id.slice(0, 8).toUpperCase()}
            </span>
            <Badge variant="outline" className={statusBadgeClass[claim.status] || ''}>
              {statusLabel[claim.status] || claim.status}
            </Badge>
          </div>
        </div>

        {/* Device + Issue */}
        <div className="mt-3 flex flex-wrap items-center gap-3 pl-14">
          <span className="font-semibold text-sidebar-primary-foreground">
            {claim.device.brand} {claim.device.model}
          </span>
          <Badge variant="secondary" className="font-mono text-xs">
            <Cpu className="mr-1 h-3 w-3" />
            {claim.device.device_type}
          </Badge>
        </div>
      </div>

      {/* ─── Phase 2: Verification Gate ─── */}
      {!isVerified && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            Phase 1 — Device Verification
          </h3>
          <p className="text-sm text-muted-foreground">
            Scan or enter the device serial number to verify coverage and unlock the workbench.
          </p>
          <DiagnosticScanner onVerified={() => handleVerified()} />
        </div>
      )}

      {/* ─── Phase 3: Workbench ─── */}
      {isVerified && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Phase 2 — Repair Workbench
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Col: Device DNA */}
            <Card className="border-2">
              <CardContent className="space-y-4 pt-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Cpu className="h-4 w-4" /> Device DNA
                </h4>

                <div className="space-y-3 rounded-lg border bg-muted/10 p-4">
                  <Row label="Model" value={`${claim.device.brand} ${claim.device.model}`} />
                  <Row label="Serial" value={claim.device.serial_number} mono />
                  <Row label="Type" value={claim.device.device_type} />
                  <Row label="Filed" value={new Date(claim.filed_at).toLocaleDateString()} mono />
                </div>

                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4" /> Reported Issue
                  </h4>
                  <p className="rounded-lg border bg-muted/10 p-4 text-sm leading-relaxed">
                    {claim.issue_description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right Col: Action Center */}
            <Card className="border-2">
              <CardContent className="space-y-6 pt-6">
                {/* Repair Checklist */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <ClipboardCheck className="h-4 w-4" /> Repair Checklist
                  </h4>
                  {REPAIR_CHECKLIST.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-md border p-3">
                      <Checkbox
                        id={item.id}
                        checked={!!checkedItems[item.id]}
                        onCheckedChange={(checked) =>
                          setCheckedItems((prev) => ({ ...prev, [item.id]: !!checked }))
                        }
                        disabled={isComplete}
                      />
                      <Label
                        htmlFor={item.id}
                        className={`text-sm font-medium ${
                          checkedItems[item.id] ? 'text-success line-through' : ''
                        }`}
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Financials */}
                <div className="rounded-lg border-2 border-success/30 bg-success/5 p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Estimated Payout
                  </p>
                  <p className="mt-1 font-mono text-3xl font-bold text-success">
                    <DollarSign className="mr-0.5 inline h-7 w-7" />
                    {estimatedPayout}
                  </p>
                </div>

                {/* Finalize */}
                {isComplete ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-success bg-success/10 p-4 text-success">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-lg font-semibold">Repair Finalized</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleFinalize}
                    disabled={!allChecked || finalizing}
                    className="btn-workshop w-full bg-success text-success-foreground hover:bg-success/90"
                  >
                    {finalizing ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-5 w-5" />
                    )}
                    Finalize Repair
                  </Button>
                )}
                {!allChecked && !isComplete && (
                  <p className="text-center text-xs text-muted-foreground">
                    Complete all checklist items to enable finalization
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

/* Utility row component for Device DNA */
function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
