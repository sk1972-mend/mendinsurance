import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield,
  CheckCircle,
  XCircle,
  Wrench,
  PackageCheck,
  Loader2,
  ArrowLeft,
  Hash,
  Cpu,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

interface ClaimData {
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

export function ClaimWorkspace() {
  const { claimId } = useParams<{ claimId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [claim, setClaim] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [serialInput, setSerialInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [selectedRepairType, setSelectedRepairType] = useState<'local' | 'mail_in' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!claimId || !user) return;

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
          .eq('id', claimId)
          .single();

        if (error) throw error;

        const policyData = data.policy as any;
        setClaim({
          id: data.id,
          status: data.status,
          issue_description: data.issue_description,
          repair_type: data.repair_type,
          serial_match: data.serial_match,
          filed_at: data.filed_at,
          device: policyData?.device || { brand: '', model: '', device_type: '', serial_number: '' },
          deductible: policyData?.deductible || 0,
        });

        if (data.serial_match) {
          setVerified(true);
        }
        if (data.repair_type) {
          setSelectedRepairType(data.repair_type as 'local' | 'mail_in');
        }
      } catch (err) {
        console.error('Error fetching claim:', err);
        toast.error('Failed to load claim');
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [claimId, user]);

  const handleVerify = async () => {
    if (!claim) return;
    setVerifying(true);
    setVerificationFailed(false);

    // Simulate slight delay for UX feel
    await new Promise((r) => setTimeout(r, 600));

    const match = serialInput.trim().toUpperCase() === claim.device.serial_number.toUpperCase();

    if (match) {
      setVerified(true);
      await supabase
        .from('claims')
        .update({ serial_match: true, status: 'in_progress' })
        .eq('id', claim.id);
      setClaim((prev) => prev ? { ...prev, serial_match: true, status: 'in_progress' } : prev);
      toast.success('Serial number verified');
    } else {
      setVerificationFailed(true);
      toast.error('Serial number does not match');
    }

    setVerifying(false);
  };

  const handleGenerateLabel = () => {
    toast.success('Shipping label generated — check your email', {
      description: `Claim ${claim?.id.slice(0, 8).toUpperCase()}`,
    });
  };

  const handleSubmitTriage = async () => {
    if (!claim || !selectedRepairType) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('claims')
        .update({
          repair_type: selectedRepairType,
          status: 'in_progress',
        })
        .eq('id', claim.id);

      if (error) throw error;

      toast.success('Triage submitted successfully');
      navigate('/shop/queue');
    } catch (err) {
      console.error('Error submitting triage:', err);
      toast.error('Failed to submit triage');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-muted-foreground">Claim not found.</p>
        <Button variant="outline" onClick={() => navigate('/shop/queue')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Queue
        </Button>
      </div>
    );
  }

  const earningEstimate = (claim.deductible * 0.15).toFixed(2);

  return (
    <div className="space-y-0">
      {/* Header — "Ticket Stub" */}
      <div className="rounded-t-lg bg-sidebar px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-primary-foreground/70 hover:text-sidebar-primary-foreground hover:bg-sidebar-accent/20"
              onClick={() => navigate('/shop/queue')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-sidebar-primary-foreground/50" />
                <span className="font-mono text-sm text-sidebar-primary-foreground/70">
                  {claim.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-sidebar-primary-foreground">
                {claim.device.brand} {claim.device.model}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={
                claim.status === 'in_progress'
                  ? 'border-primary/30 bg-primary/10 text-primary-foreground'
                  : 'border-warning/30 bg-warning/10 text-warning'
              }
            >
              {claim.status === 'in_progress' ? 'In Progress' : 'Assigned'}
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              <Cpu className="mr-1 h-3 w-3" />
              {claim.device.device_type}
            </Badge>
          </div>
        </div>
        <p className="mt-3 pl-14 text-sm text-sidebar-primary-foreground/60">
          {claim.issue_description}
        </p>
      </div>

      {/* Split-screen workspace */}
      <div className="grid gap-0 border border-t-0 rounded-b-lg md:grid-cols-2">
        {/* Zone A: Verification */}
        <div className="border-b p-6 md:border-b-0 md:border-r">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Serial Verification</h3>
          </div>

          {verified ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-success bg-success/5 py-12">
              <CheckCircle className="h-16 w-16 text-success" />
              <p className="text-lg font-semibold text-success">Device Verified</p>
              <p className="font-mono text-sm text-muted-foreground">
                SN: {claim.device.serial_number}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="serial" className="text-sm font-medium">
                  Enter Device Serial Number
                </Label>
                <Input
                  id="serial"
                  placeholder="e.g. SN-XXXXXXXX"
                  value={serialInput}
                  onChange={(e) => {
                    setSerialInput(e.target.value);
                    setVerificationFailed(false);
                  }}
                  className={`mt-1.5 font-mono ${
                    verificationFailed ? 'border-destructive focus-visible:ring-destructive' : ''
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
                {verificationFailed && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
                    <XCircle className="h-4 w-4" />
                    Serial does not match records
                  </div>
                )}
              </div>
              <Button
                onClick={handleVerify}
                disabled={!serialInput.trim() || verifying}
                className="btn-workshop w-full bg-primary text-primary-foreground"
              >
                {verifying ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Shield className="mr-2 h-5 w-5" />
                )}
                Verify Match
              </Button>
            </div>
          )}
        </div>

        {/* Zone B: Decision Engine */}
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Decision Engine</h3>
            {!verified && (
              <Lock className="ml-auto h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {!verified ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-16 text-muted-foreground">
              <Lock className="h-10 w-10" />
              <p className="text-sm font-medium">Verify serial number to unlock</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Card 1: Local Repair */}
              <button
                type="button"
                onClick={() => setSelectedRepairType('local')}
                className={`w-full rounded-lg border-2 p-5 text-left transition-all ${
                  selectedRepairType === 'local'
                    ? 'border-success bg-success/5 shadow-md'
                    : 'border-border hover:border-success/40 hover:bg-card'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                      selectedRepairType === 'local'
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold">I Can Fix This</p>
                    <p className="text-sm text-muted-foreground">Repair In-House</p>
                    <p className="mt-2 font-mono text-lg font-bold text-success">
                      Earn ${earningEstimate}
                    </p>
                  </div>
                  {selectedRepairType === 'local' && (
                    <CheckCircle className="h-6 w-6 shrink-0 text-success" />
                  )}
                </div>
              </button>

              {/* Card 2: Mail-In */}
              <button
                type="button"
                onClick={() => setSelectedRepairType('mail_in')}
                className={`w-full rounded-lg border-2 p-5 text-left transition-all ${
                  selectedRepairType === 'mail_in'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/40 hover:bg-card'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                      selectedRepairType === 'mail_in'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    <PackageCheck className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold">Too Complex</p>
                    <p className="text-sm text-muted-foreground">Send to Depot</p>
                    <p className="mt-2 text-sm text-muted-foreground">Earn Referral Fee</p>
                  </div>
                  {selectedRepairType === 'mail_in' && (
                    <CheckCircle className="h-6 w-6 shrink-0 text-primary" />
                  )}
                </div>
              </button>

              {selectedRepairType === 'mail_in' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGenerateLabel}
                >
                  <PackageCheck className="mr-2 h-4 w-4" />
                  Generate Shipping Label
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {verified && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmitTriage}
            disabled={!selectedRepairType || submitting}
            className="btn-workshop bg-success text-success-foreground hover:bg-success/90"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5" />
            )}
            Submit Triage
          </Button>
        </div>
      )}
    </div>
  );
}
