import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Info, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SerialRegistrationProps {
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  onSerialChange: (serial: string) => void;
}

export function SerialRegistration({ 
  deviceType, 
  brand, 
  model, 
  serialNumber, 
  onSerialChange 
}: SerialRegistrationProps) {
  const [touched, setTouched] = useState(false);
  
  // Basic serial number validation
  const isValidFormat = serialNumber.length >= 8 && /^[A-Za-z0-9-]+$/.test(serialNumber);
  const showError = touched && serialNumber.length > 0 && !isValidFormat;
  const showSuccess = isValidFormat;

  const getSerialHint = () => {
    if (brand === 'Apple') {
      return 'Find your serial in Settings > General > About';
    }
    if (brand === 'Samsung') {
      return 'Find your serial in Settings > About Phone > Status';
    }
    return 'Check your device settings or the original packaging';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Serial Number Registration</CardTitle>
            <CardDescription>
              Required for the Digital Handshake verification system
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            Secure
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device summary */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">
            Registering serial for: <span className="font-medium">{brand} {model}</span>
          </p>
        </div>

        {/* Serial input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Device Serial Number / IMEI
          </label>
          <div className="relative">
            <Input
              value={serialNumber}
              onChange={(e) => onSerialChange(e.target.value.toUpperCase())}
              onBlur={() => setTouched(true)}
              placeholder="Enter your device serial number"
              className={cn(
                'pr-10 font-mono uppercase tracking-wider',
                showError && 'border-destructive focus-visible:ring-destructive',
                showSuccess && 'border-success focus-visible:ring-success'
              )}
            />
            {showSuccess && (
              <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />
            )}
          </div>
          
          {showError && (
            <p className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              Serial number must be at least 8 characters (letters, numbers, dashes only)
            </p>
          )}
          
          <p className="text-xs text-muted-foreground">
            {getSerialHint()}
          </p>
        </div>

        {/* Security notice */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-medium text-primary">
            <Lock className="h-4 w-4" />
            Why we need this
          </h4>
          <p className="text-sm text-muted-foreground">
            Your serial number is stored securely and used during the claim process. When you bring your device 
            to a repair shop, they'll verify this number matches your registered device. This prevents fraud 
            and ensures your protection is valid.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
