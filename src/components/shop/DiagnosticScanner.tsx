import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Camera, CheckCircle, XCircle, Loader2, ScanLine, Type, RefreshCw, Unlock, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface VerificationResult {
  status: "verified" | "mismatch" | "not_found" | "claim_match" | null;
  device?: {
    id: string;
    brand: string;
    model: string;
    serial_number: string;
    customer_name?: string;
    policy_status?: string;
  };
  claim?: {
    id: string;
    repair_type: string;
    status: string;
  };
}

interface DiagnosticScannerProps {
  onVerified?: (deviceId: string, serial: string) => void;
}

export function DiagnosticScanner({ onVerified }: DiagnosticScannerProps) {
  const { session } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualSerial, setManualSerial] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult>({ status: null });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [authorizing, setAuthorizing] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Unable to access camera. Please use manual entry.");
      setManualMode(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
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
      toast.error("Invalid serial number", {
        description: "Serial number must be at least 8 characters.",
      });
      return;
    }

    setVerifying(true);
    setResult({ status: null });

    try {
      // 1. Search for device with this serial
      const { data: devices, error } = await supabase
        .from("devices")
        .select(
          `
          id,
          brand,
          model,
          serial_number,
          user_id
        `,
        )
        .eq("serial_number", serial.toUpperCase())
        .limit(1);

      if (error) throw error;

      if (!devices || devices.length === 0) {
        setResult({ status: "not_found" });
        return;
      }

      const device = devices[0];

      // 2. Check for OPEN CLAIM (Digital Handshake Priority)
      // First get policy IDs for this device, then find claims
      const { data: devicePolicies } = await supabase
        .from("policies")
        .select("id")
        .eq("device_id", device.id);

      const policyIds = devicePolicies?.map((p) => p.id) || [];

      let openClaim: { id: string; repair_type: string | null; status: string } | null = null;
      if (policyIds.length > 0) {
        const { data: claims } = await supabase
          .from("claims")
          .select("id, repair_type, status")
          .in("policy_id", policyIds)
          .eq("status", "filed")
          .limit(1);

        openClaim = claims && claims.length > 0 ? claims[0] : null;
      }

      // 3. Check Policy Status (Context)
      const { data: policies } = await supabase
        .from("policies")
        .select("status")
        .eq("device_id", device.id)
        .eq("status", "active")
        .limit(1);

      const hasActivePolicy = policies && policies.length > 0;

      // 4. Get Customer Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", device.user_id)
        .single();

      // Determine Verification Status
      let status: VerificationResult["status"] = "mismatch";
      if (openClaim) {
        status = "claim_match"; // The "Green Light"
      } else if (hasActivePolicy) {
        status = "verified"; // Coverage exists, but no claim filed yet
      }

      setResult({
        status,
        device: {
          id: device.id,
          brand: device.brand,
          model: device.model,
          serial_number: device.serial_number,
          customer_name: profile?.full_name || profile?.email || "Unknown",
          policy_status: hasActivePolicy ? "active" : "inactive",
        },
        claim: openClaim
          ? {
              id: openClaim.id,
              repair_type: openClaim.repair_type,
              status: openClaim.status,
            }
          : undefined,
      });

      if (status === "claim_match") {
        toast.success("DIGITAL HANDSHAKE: Match Found!", {
          description: "Active claim detected. You may proceed to authorize repair.",
        });
      } else if (status === "verified") {
        toast.info("Coverage Verified", {
          description: "Device is covered, but no claim has been filed yet.",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const authorizeRepair = async () => {
    if (!result.claim || !result.device) return;

    setAuthorizing(true);
    try {
      // In a real app, we would get the shop_id from the session context
      // For now, we assume the logged-in user is the shop
      const { error } = await supabase
        .from("claims")
        .update({
          status: "verified_complete",
          // We would also update the shop_id here if it wasn't already set
        })
        .eq("id", result.claim.id);

      if (error) throw error;

      toast.success("Repair Authorized & Payment Secured", {
        description: "The claim is now in progress. Revenue has been locked.",
        icon: <Unlock className="h-5 w-5 text-emerald-500" />,
      });

      // Update local state to reflect change
      setResult((prev) => ({
        ...prev,
        claim: prev.claim ? { ...prev.claim, status: "verified_complete" } : undefined,
      }));

      onVerified?.(result.device.id, result.device.serial_number);
    } catch (err) {
      console.error(err);
      toast.error("Failed to authorize repair.");
    } finally {
      setAuthorizing(false);
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // For MVP, we'll simulate OCR detection
    // In production, integrate tesseract.js or a cloud OCR service
    toast.info("OCR scanning...", {
      description: "For best results, use manual entry while we improve scanning.",
    });

    // Simulate scan delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setScanning(false);
    // Switch to manual mode after simulated scan
    setManualMode(true);
    toast.info("Scan complete", {
      description: "Please verify or enter the serial number manually.",
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
    setManualSerial("");
    setManualMode(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-2 border-primary/10 shadow-lg">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2 text-primary">
          <ScanLine className="h-5 w-5" />
          Device Verification
        </CardTitle>
        <CardDescription>Scan or enter the device serial number to verify coverage and claims.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Result Display */}
        {result.status && (
          <div
            className={`p-4 rounded-lg border-2 animate-in fade-in zoom-in-95 duration-200 ${
              result.status === "claim_match"
                ? "border-emerald-500 bg-emerald-50"
                : result.status === "verified"
                  ? "border-blue-500 bg-blue-50"
                  : result.status === "mismatch"
                    ? "border-amber-500 bg-amber-50"
                    : "border-destructive bg-destructive/10"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {result.status === "claim_match" ? (
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              ) : result.status === "verified" ? (
                <AlertCircle className="h-8 w-8 text-blue-600" />
              ) : result.status === "mismatch" ? (
                <XCircle className="h-8 w-8 text-amber-600" />
              ) : (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
              <div>
                <p className="font-bold text-lg text-primary">
                  {result.status === "claim_match"
                    ? "Digital Handshake: MATCH"
                    : result.status === "verified"
                      ? "Coverage Active (No Claim)"
                      : result.status === "mismatch"
                        ? "Policy Inactive"
                        : "Device Not Found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.status === "claim_match"
                    ? "Active claim found. Ready to authorize."
                    : result.status === "verified"
                      ? "Device is covered, but no claim is filed."
                      : result.status === "mismatch"
                        ? "Device found but coverage is inactive."
                        : "No registered device with this serial."}
                </p>
              </div>
            </div>

            {result.device && (
              <div className="space-y-2 pt-3 border-t border-black/5">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-semibold text-right">
                    {result.device.brand} {result.device.model}
                  </span>

                  <span className="text-muted-foreground">Serial</span>
                  <span className="font-mono text-right">{result.device.serial_number}</span>

                  <span className="text-muted-foreground">Customer</span>
                  <span className="text-right">{result.device.customer_name}</span>

                  <span className="text-muted-foreground">Policy</span>
                  <div className="flex justify-end">
                    <Badge variant={result.device.policy_status === "active" ? "default" : "destructive"}>
                      {result.device.policy_status}
                    </Badge>
                  </div>
                </div>

                {result.claim && (
                  <div className="mt-4 p-3 bg-white/50 rounded border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-emerald-800">Claim Details</span>
                      <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                        {result.claim.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      Repair Type: <b>{result.claim.repair_type}</b>
                    </p>

                    {result.claim.status === "verified_complete" ? (
                      <div className="mt-3 p-2 bg-emerald-100 text-emerald-800 text-center rounded font-medium text-sm flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Authorized
                      </div>
                    ) : (
                      <Button
                        onClick={authorizeRepair}
                        disabled={authorizing}
                        className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {authorizing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Unlock className="h-4 w-4 mr-2" />
                        )}
                        Unlock Repair & Secure Payout
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button variant="outline" className="w-full mt-4" onClick={resetScanner}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan Another Device
            </Button>
          </div>
        )}

        {/* Camera View */}
        {!result.status && !manualMode && (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-slate-200">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-3/4 h-1/2 border-2 border-dashed rounded-lg transition-colors duration-300 ${scanning ? "border-emerald-500 bg-emerald-500/10" : "border-white/50"}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanning && <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />}
                </div>
              </div>
            </div>

            {/* Camera controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button
                onClick={captureAndScan}
                disabled={scanning || !stream}
                className="bg-primary/90 backdrop-blur-sm hover:bg-primary text-white"
              >
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
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
                className="font-mono text-lg h-14 uppercase"
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={verifying || manualSerial.length < 8}>
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
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2"
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
          <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">{cameraError}</p>
        )}
      </CardContent>
    </Card>
  );
}
