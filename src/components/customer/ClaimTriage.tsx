import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDevices } from '@/hooks/useDevices';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Smartphone,
  Tablet,
  Laptop,
  Gamepad2,
  Watch,
  Plane,
  Headphones,
  MonitorX,
  Battery,
  Droplets,
  Cpu,
  Hammer,
  HelpCircle,
  MapPin,
  Truck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';

const deviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  console: Gamepad2,
  wearable: Watch,
  drone: Plane,
  audio: Headphones,
};

type DamageType = 'screen' | 'battery' | 'water' | 'logic_board' | 'physical' | 'unknown';

const damageTypes: { value: DamageType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'screen', label: 'Screen Damage', description: 'Cracked, broken, or unresponsive display', icon: MonitorX },
  { value: 'battery', label: 'Battery Issues', description: 'Won\'t charge, drains fast, or swollen', icon: Battery },
  { value: 'water', label: 'Water/Liquid Damage', description: 'Exposed to water or other liquids', icon: Droplets },
  { value: 'logic_board', label: 'Logic Board / Internal', description: 'Internal components not working', icon: Cpu },
  { value: 'physical', label: 'Physical Damage', description: 'Dents, bends, or broken parts', icon: Hammer },
  { value: 'unknown', label: 'Not Sure', description: 'Device not working, cause unknown', icon: HelpCircle },
];

// Routing logic: Local shop vs Mail-in hub
const getRepairRoute = (damageType: DamageType): 'local' | 'mail_in' => {
  if (['screen', 'battery', 'physical'].includes(damageType)) {
    return 'local';
  }
  return 'mail_in';
};

interface ClaimTriageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimTriage({ open, onOpenChange }: ClaimTriageProps) {
  const { user } = useAuth();
  const { devices, refetch } = useDevices();
  const [step, setStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [damageType, setDamageType] = useState<DamageType | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const activeDevices = devices.filter(d => d.policy?.status === 'active');
  const selectedDeviceData = devices.find(d => d.id === selectedDevice);
  const repairRoute = damageType ? getRepairRoute(damageType) : null;

  const resetForm = () => {
    setStep(1);
    setSelectedDevice(null);
    setDamageType(null);
    setDescription('');
    setSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!selectedDeviceData?.policy?.id || !damageType || !user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('claims').insert({
        policy_id: selectedDeviceData.policy.id,
        issue_description: description || damageTypes.find(d => d.value === damageType)?.label || 'Device issue',
        repair_type: repairRoute,
        status: 'filed',
      });

      if (error) throw error;

      toast.success('Claim filed successfully!', {
        description: repairRoute === 'local' 
          ? 'Find a local shop to get your device repaired.'
          : 'A shipping label will be sent to your email.',
      });

      refetch();
      handleClose();
    } catch (error) {
      console.error('Error filing claim:', error);
      toast.error('Failed to file claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedDevice !== null;
      case 2: return damageType !== null;
      case 3: return true; // Description is optional
      case 4: return true;
      default: return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">File a Claim</DialogTitle>
          <DialogDescription>
            Step {step} of 4 — {step === 1 ? 'Select Device' : step === 2 ? 'Damage Type' : step === 3 ? 'Details' : 'Confirm & Submit'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Select Device */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the device you need to file a claim for.
            </p>

            {activeDevices.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No active policies found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You need an active protection plan to file a claim.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <RadioGroup value={selectedDevice || ''} onValueChange={setSelectedDevice}>
                <div className="grid gap-3">
                  {activeDevices.map((device) => {
                    const DeviceIcon = deviceIcons[device.device_type] || Smartphone;
                    return (
                      <Label
                        key={device.id}
                        htmlFor={device.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedDevice === device.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <RadioGroupItem value={device.id} id={device.id} className="sr-only" />
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <DeviceIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{device.brand} {device.model}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {device.serial_number}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Active
                        </Badge>
                      </Label>
                    );
                  })}
                </div>
              </RadioGroup>
            )}
          </div>
        )}

        {/* Step 2: Damage Type */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              What type of damage or issue are you experiencing?
            </p>

            <RadioGroup value={damageType || ''} onValueChange={(v) => setDamageType(v as DamageType)}>
              <div className="grid gap-3 md:grid-cols-2">
                {damageTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Label
                      key={type.value}
                      htmlFor={type.value}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        damageType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{type.label}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Additional Details */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tell us more about what happened (optional but helpful).
            </p>

            <Textarea
              placeholder="Describe the issue in detail... When did it happen? What were you doing?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />

            {/* Repair route preview */}
            {repairRoute && (
              <Card className={repairRoute === 'local' ? 'border-success' : 'border-primary'}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    {repairRoute === 'local' ? (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <MapPin className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-semibold">Local Shop Repair</p>
                          <p className="text-sm text-muted-foreground">
                            Visit a certified Mend partner near you for fast repair.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Mail-In Repair</p>
                          <p className="text-sm text-muted-foreground">
                            We'll send a prepaid shipping label to your email.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 4: Confirm & Submit */}
        {step === 4 && selectedDeviceData && damageType && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review your claim details before submitting.
            </p>

            <Card>
              <CardContent className="py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-semibold">{selectedDeviceData.brand} {selectedDeviceData.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Serial Number</span>
                  <span className="font-mono text-sm">{selectedDeviceData.serial_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Damage Type</span>
                  <span className="font-semibold">{damageTypes.find(d => d.value === damageType)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Repair Route</span>
                  <Badge variant="outline" className={repairRoute === 'local' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}>
                    {repairRoute === 'local' ? 'Local Shop' : 'Mail-In'}
                  </Badge>
                </div>
                {description && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Additional Details</span>
                    <p className="mt-1 text-sm">{description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 text-success">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Your deductible of ${selectedDeviceData.policy?.deductible} will apply when the repair is completed.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-success hover:bg-success/90">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Claim
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
