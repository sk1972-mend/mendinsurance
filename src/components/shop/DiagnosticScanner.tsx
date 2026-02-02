import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
  ScanLine,
  Type,
  RefreshCw,
} from 'lucide-react';

interface VerificationResult {
  status: 'verified' | 'mismatch' | 'not_found' | null;
  device?: {
    id: string;
    brand: string;
    model: string;
    serial_number: string;
    customer_name?: string;
    policy_status?: string;
  };
}

interface DiagnosticScannerProps {
  onVerified?: (deviceId: string, serial: string) => void;
}

export function DiagnosticScanner({ onVerified }: DiagnosticScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualSerial, setManualSerial] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult>({ status: null });
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please use manual entry.');
      setManualMode(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (!manualMode) {
      startCamera();
    }
    return () => stopCamera();
  }, [manualMode, startCamera, stopCamera]);

  const verifySerial = async (serial: string) => {
    if (!serial || serial.length < 8) {
      toast.error('Invalid serial number', {
        description: 'Serial number must be at least 8 characters.',
      });
      return;
    }

    setVerifying(true);
    setResult({ status: null });

    try {
      // Search for device with this serial
      const { data: devices, error } = await supabase
        .from('devices')
        .select(`
          id,
          brand,
          model,
          serial_number,
          user_id
        `)
        .eq('serial_number', serial.toUpperCase())
        .limit(1);

      if (error) throw error;

      if (!devices || devices.length === 0) {
        setResult({ status: 'not_found' });
        return;
      }

      const device = devices[0];

      // Check if device has an active policy
      const { data: policies } = await supabase
        .from('policies')
        .select('status')
        .eq('device_id', device.id)
        .eq('status', 'active')
        .limit(1);

      const hasActivePolicy = policies && policies.length > 0;

      // Get customer profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', device.user_id)
        .single();

      setResult({
        status: hasActivePolicy ? 'verified' : 'mismatch',
        device: {
          id: device.id,
          brand: device.brand,
          model: device.model,
          serial_number: device.serial_number,
          customer_name: profile?.full_name || profile?.email || 'Unknown',
          policy_status: hasActivePolicy ? 'active' : 'inactive',
        },
      });

      if (hasActivePolicy) {
        onVerified?.(device.id, serial);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // For MVP, we'll simulate OCR detection
    // In production, integrate tesseract.js or a cloud OCR service
    toast.info('OCR scanning...', {
      description: 'For best results, use manual entry while we improve scanning.',
    });

    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setScanning(false);
    // Switch to manual mode after simulated scan
    setManualMode(true);
    toast.info('Scan complete', {
      description: 'Please verify or enter the serial number manually.',
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSerial.trim()) {
      verifySerial(manualSerial.trim().toUpperCase());
    }
  };

  const resetScanner = () => {
    setResult({ status: null });
    setManualSerial('');
    setManualMode(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanLine className="h-5 w-5" />
          Device Verification
        </CardTitle>
        <CardDescription>
          Scan or enter the device serial number to verify coverage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Result Display */}
        {result.status && (
          <div
            className={`p-4 rounded-lg border-2 ${
              result.status === 'verified'
                ? 'border-success bg-success/10'
                : result.status === 'mismatch'
                ? 'border-warning bg-warning/10'
                : 'border-destructive bg-destructive/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {result.status === 'verified' ? (
                <CheckCircle className="h-8 w-8 text-success" />
              ) : result.status === 'mismatch' ? (
                <XCircle className="h-8 w-8 text-warning" />
              ) : (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
              <div>
                <p className="font-bold text-lg">
                  {result.status === 'verified'
                    ? 'Verified Match'
                    : result.status === 'mismatch'
                    ? 'Policy Inactive'
                    : 'Device Not Found'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.status === 'verified'
                    ? 'This device has active coverage.'
                    : result.status === 'mismatch'
                    ? 'Device found but policy is not active.'
                    : 'No registered device with this serial.'}
                </p>
              </div>
            </div>

            {result.device && (
              <div className="space-y-2 pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-semibold">{result.device.brand} {result.device.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Serial</span>
                  <span className="font-mono text-sm">{result.device.serial_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span>{result.device.customer_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Policy</span>
                  <Badge
                    variant="outline"
                    className={
                      result.device.policy_status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }
                  >
                    {result.device.policy_status}
                  </Badge>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={resetScanner}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan Another Device
            </Button>
          </div>
        )}

        {/* Camera View */}
        {!result.status && !manualMode && (
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-3/4 h-1/2 border-2 border-dashed rounded-lg ${scanning ? 'border-success animate-pulse' : 'border-primary/50'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanning && <Loader2 className="h-8 w-8 animate-spin text-success" />}
                </div>
              </div>
            </div>

            {/* Camera controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button
                onClick={captureAndScan}
                disabled={scanning || !stream}
                className="btn-workshop"
              >
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Capture & Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Manual Entry */}
        {!result.status && manualMode && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serial" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Enter Serial Number
              </Label>
              <Input
                id="serial"
                placeholder="ABCD1234567890"
                value={manualSerial}
                onChange={(e) => setManualSerial(e.target.value.toUpperCase())}
                className="font-mono text-lg h-14"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-workshop"
              disabled={verifying || manualSerial.length < 8}
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Verify Serial
                </>
              )}
            </Button>
          </form>
        )}

        {/* Toggle manual/camera mode */}
        {!result.status && (
          <button
            type="button"
            onClick={() => setManualMode(!manualMode)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {manualMode ? (
              <>
                <Camera className="inline mr-1 h-4 w-4" />
                Switch to camera scan
              </>
            ) : (
              <>
                <Type className="inline mr-1 h-4 w-4" />
                Can't scan? Enter manually
              </>
            )}
          </button>
        )}

        {cameraError && !manualMode && (
          <p className="text-sm text-destructive text-center">{cameraError}</p>
        )}
      </CardContent>
    </Card>
  );
}
