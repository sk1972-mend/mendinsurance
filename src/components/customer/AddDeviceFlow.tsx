import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeviceCategory } from '@/lib/deviceTiers';
import { DeviceTypeSelector } from './DeviceTypeSelector';
import { DeviceModelSelector } from './DeviceModelSelector';
import { SerialRegistration } from './SerialRegistration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Step = 'type' | 'model' | 'serial' | 'confirm';

interface DeviceData {
  type: DeviceCategory | null;
  brand: string;
  model: string;
  tier: number;
  monthlyPremium: number;
  deductible: number;
  serialNumber: string;
}

export function AddDeviceFlow({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [deviceData, setDeviceData] = useState<DeviceData>({
    type: null,
    brand: '',
    model: '',
    tier: 0,
    monthlyPremium: 0,
    deductible: 0,
    serialNumber: '',
  });

  const steps: Step[] = ['type', 'model', 'serial', 'confirm'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 'type':
        return deviceData.type !== null;
      case 'model':
        return deviceData.brand && deviceData.model && deviceData.tier > 0;
      case 'serial':
        return deviceData.serialNumber.length >= 8 && /^[A-Za-z0-9-]+$/.test(deviceData.serialNumber);
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleModelSelection = useCallback((brand: string, model: string, tier: number, premium: number, deductible: number) => {
    setDeviceData(prev => ({
      ...prev,
      brand,
      model,
      tier,
      monthlyPremium: premium,
      deductible,
    }));
  }, []);

  const handleSubmit = async () => {
    if (!user || !deviceData.type) return;

    setIsSubmitting(true);
    try {
      // Create the device record
      const { data: device, error: deviceError } = await supabase
        .from('devices')
        .insert({
          user_id: user.id,
          device_type: deviceData.type,
          brand: deviceData.brand,
          model: deviceData.model,
          serial_number: deviceData.serialNumber,
          tier: deviceData.tier,
          health_status: 'good',
        })
        .select()
        .single();

      if (deviceError) throw deviceError;

      // Create the policy record
      const { error: policyError } = await supabase
        .from('policies')
        .insert({
          user_id: user.id,
          device_id: device.id,
          monthly_premium: deviceData.monthlyPremium,
          deductible: deviceData.deductible,
          status: 'pending', // Will be activated after payment
        });

      if (policyError) throw policyError;

      toast.success('Device registered successfully!', {
        description: 'Your protection plan is pending activation.',
      });

      onOpenChange(false);
      // Reset form
      setDeviceData({
        type: null,
        brand: '',
        model: '',
        tier: 0,
        monthlyPremium: 0,
        deductible: 0,
        serialNumber: '',
      });
      setCurrentStep('type');
      
      // Refresh the page to show new device
      navigate(0);
    } catch (error) {
      console.error('Error creating device/policy:', error);
      toast.error('Failed to register device', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'type':
        return 'What type of device?';
      case 'model':
        return 'Select your device';
      case 'serial':
        return 'Register serial number';
      case 'confirm':
        return 'Confirm your protection';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'type':
        return 'Choose the category of device you want to protect';
      case 'model':
        return 'Select the brand and model for accurate pricing';
      case 'serial':
        return 'Enter your device serial for claim verification';
      case 'confirm':
        return 'Review your device protection details';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <DialogDescription>{getStepDescription()}</DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        {/* Step content */}
        <div className="py-4">
          {currentStep === 'type' && (
            <DeviceTypeSelector
              selectedType={deviceData.type}
              onSelect={(type) => setDeviceData(prev => ({ ...prev, type }))}
            />
          )}

          {currentStep === 'model' && deviceData.type && (
            <DeviceModelSelector
              deviceType={deviceData.type}
              onSelectionComplete={handleModelSelection}
            />
          )}

          {currentStep === 'serial' && deviceData.type && (
            <SerialRegistration
              deviceType={deviceData.type}
              brand={deviceData.brand}
              model={deviceData.model}
              serialNumber={deviceData.serialNumber}
              onSerialChange={(serial) => setDeviceData(prev => ({ ...prev, serialNumber: serial }))}
            />
          )}

          {currentStep === 'confirm' && (
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <CardTitle>Ready to Protect</CardTitle>
                    <CardDescription>Review your device details below</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 rounded-lg bg-card p-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Device</span>
                    <span className="font-medium">{deviceData.brand} {deviceData.model}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Serial Number</span>
                    <span className="font-mono text-sm">{deviceData.serialNumber}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Monthly Premium</span>
                    <span className="font-bold text-primary">${deviceData.monthlyPremium}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deductible</span>
                    <span className="font-medium">${deviceData.deductible}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our terms of service. Your protection will be activated 
                  once payment is confirmed via Stripe.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep === 'confirm' ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm & Continue
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
