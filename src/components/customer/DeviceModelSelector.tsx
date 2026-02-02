import { useState, useEffect } from 'react';
import { DeviceCategory, getBrandsForCategory, getModelsForBrand, getTierForDevice, TIER_PRICING } from '@/lib/deviceTiers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, DollarSign, AlertCircle } from 'lucide-react';

interface DeviceModelSelectorProps {
  deviceType: DeviceCategory;
  onSelectionComplete: (brand: string, model: string, tier: number, premium: number, deductible: number) => void;
}

export function DeviceModelSelector({ deviceType, onSelectionComplete }: DeviceModelSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  
  const brands = getBrandsForCategory(deviceType);
  const models = selectedBrand ? getModelsForBrand(deviceType, selectedBrand) : [];
  const tierInfo = selectedModel ? getTierForDevice(deviceType, selectedBrand, selectedModel) : null;

  // Reset selections when device type changes
  useEffect(() => {
    setSelectedBrand('');
    setSelectedModel('');
  }, [deviceType]);

  // Reset model when brand changes
  useEffect(() => {
    setSelectedModel('');
  }, [selectedBrand]);

  // Notify parent when selection is complete
  useEffect(() => {
    if (selectedBrand && selectedModel && tierInfo) {
      onSelectionComplete(selectedBrand, selectedModel, tierInfo.tier, tierInfo.monthlyPremium, tierInfo.deductible);
    }
  }, [selectedBrand, selectedModel, tierInfo, onSelectionComplete]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Select 
            value={selectedModel} 
            onValueChange={setSelectedModel}
            disabled={!selectedBrand}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedBrand ? 'Select model' : 'Select brand first'} />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pricing display - automatically assigned based on model */}
      {tierInfo ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Protection Plan</CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {tierInfo.label} Tier
              </Badge>
            </div>
            <CardDescription>
              Pricing is automatically determined by your device value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Premium</p>
                  <p className="text-2xl font-bold">${tierInfo.monthlyPremium}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                  <Shield className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deductible</p>
                  <p className="text-2xl font-bold">${tierInfo.deductible}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Your {selectedBrand} {selectedModel} has been automatically assigned to the{' '}
                <span className="font-medium text-foreground">{tierInfo.label}</span> tier based on its market value.
                This ensures fair pricing and proper coverage.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Shield className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-center text-sm text-muted-foreground">
              Select your device brand and model to see pricing
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
