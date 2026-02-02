import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Shield,
  Building,
  Phone,
  Mail,
  MapPin,
  Award,
  Wrench,
  Loader2,
  CheckCircle,
  Star,
} from 'lucide-react';

const CERTIFICATIONS = [
  { id: 'apple', label: 'Apple Certified' },
  { id: 'samsung', label: 'Samsung Authorized' },
  { id: 'google', label: 'Google Authorized' },
  { id: 'comptia', label: 'CompTIA A+' },
  { id: 'ifixit', label: 'iFixit Certified' },
];

const EQUIPMENT = [
  { id: 'soldering', label: 'Micro-soldering Station' },
  { id: 'ultrasonic', label: 'Ultrasonic Cleaner' },
  { id: 'separator', label: 'Screen Separator Machine' },
  { id: 'battery_calibration', label: 'Battery Calibration Tools' },
  { id: 'diagnostic', label: 'Professional Diagnostic Tools' },
];

const SPECIALIZATIONS = [
  { id: 'smartphone', label: 'Smartphones' },
  { id: 'tablet', label: 'Tablets' },
  { id: 'laptop', label: 'Laptops' },
  { id: 'console', label: 'Gaming Consoles' },
  { id: 'wearable', label: 'Wearables' },
  { id: 'drone', label: 'Drones' },
  { id: 'audio', label: 'Audio Equipment' },
];

// Calculate tier based on certifications and equipment
const calculateTier = (certifications: string[], equipment: string[]): 'basic' | 'advanced' | 'expert' => {
  const hasSoldering = equipment.includes('soldering');
  const hasFullEquipment = equipment.length >= 4;
  
  if (certifications.length >= 4 && hasFullEquipment) {
    return 'expert';
  }
  if (certifications.length >= 2 && hasSoldering) {
    return 'advanced';
  }
  return 'basic';
};

const tierInfo = {
  basic: { label: 'Basic', color: 'tier-badge--basic', description: 'Standard repairs' },
  advanced: { label: 'Advanced', color: 'tier-badge--advanced', description: 'Complex repairs' },
  expert: { label: 'Expert', color: 'tier-badge--expert', description: 'All repair types' },
};

interface ShopApplicationProps {
  onSuccess?: () => void;
}

export function ShopApplication({ onSuccess }: ShopApplicationProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    yearsInBusiness: '',
  });
  const [certifications, setCertifications] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);

  const calculatedTier = calculateTier(certifications, equipment);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleItem = (
    list: string[],
    setList: (items: string[]) => void,
    item: string
  ) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const isFormValid = () => {
    return (
      formData.businessName.trim() &&
      formData.businessAddress.trim() &&
      formData.businessPhone.trim() &&
      formData.businessEmail.trim() &&
      specializations.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isFormValid()) return;

    setSubmitting(true);
    try {
      // First update the user's role to shop
      const { error: roleError } = await supabase.from('user_roles').upsert({
        user_id: user.id,
        role: 'shop' as const,
      });

      if (roleError) throw roleError;

      // Create the shop application
      const { error: shopError } = await supabase.from('shops').insert({
        user_id: user.id,
        business_name: formData.businessName,
        business_address: formData.businessAddress,
        business_phone: formData.businessPhone,
        business_email: formData.businessEmail,
        certifications: certifications,
        equipment_list: equipment,
        specializations: specializations,
        tier: calculatedTier,
        status: 'pending',
      });

      if (shopError) throw shopError;

      toast.success('Application submitted!', {
        description: 'We\'ll review your application and get back to you within 2-3 business days.',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Partner Certification Application</h1>
        <p className="text-muted-foreground">
          Join the Mend network and earn passive income on every device you refer.
        </p>
      </div>

      {/* Tier Preview */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-warning" />
              <div>
                <p className="font-semibold">Your Projected Tier</p>
                <p className="text-sm text-muted-foreground">Based on certifications & equipment</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`tier-badge ${tierInfo[calculatedTier].color}`}>
                {tierInfo[calculatedTier].label}
              </span>
              <p className="text-xs text-muted-foreground mt-1">{tierInfo[calculatedTier].description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>Tell us about your repair shop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="ABC Repair Shop"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  placeholder="5"
                  min="0"
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address *
              </Label>
              <Input
                id="businessAddress"
                placeholder="123 Main St, City, State 12345"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.businessPhone}
                  onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Business Email *
                </Label>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="contact@abcrepair.com"
                  value={formData.businessEmail}
                  onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
            <CardDescription>Select all certifications your technicians hold.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {CERTIFICATIONS.map((cert) => (
                <Label
                  key={cert.id}
                  htmlFor={`cert-${cert.id}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    certifications.includes(cert.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <Checkbox
                    id={`cert-${cert.id}`}
                    checked={certifications.includes(cert.id)}
                    onCheckedChange={() => toggleItem(certifications, setCertifications, cert.id)}
                  />
                  <span className="font-medium">{cert.label}</span>
                </Label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Equipment
            </CardTitle>
            <CardDescription>What professional equipment do you have?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {EQUIPMENT.map((eq) => (
                <Label
                  key={eq.id}
                  htmlFor={`eq-${eq.id}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    equipment.includes(eq.id)
                      ? 'border-success bg-success/5'
                      : 'border-border hover:border-success/30'
                  }`}
                >
                  <Checkbox
                    id={`eq-${eq.id}`}
                    checked={equipment.includes(eq.id)}
                    onCheckedChange={() => toggleItem(equipment, setEquipment, eq.id)}
                  />
                  <span className="font-medium">{eq.label}</span>
                </Label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Device Specializations *</CardTitle>
            <CardDescription>What types of devices can you repair?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <Badge
                  key={spec.id}
                  variant="outline"
                  className={`cursor-pointer text-sm py-2 px-4 transition-all ${
                    specializations.includes(spec.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:border-primary'
                  }`}
                  onClick={() => toggleItem(specializations, setSpecializations, spec.id)}
                >
                  {spec.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full btn-workshop"
          disabled={submitting || !isFormValid()}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Submit Application
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          By submitting, you agree to our Partner Terms and Conditions.
        </p>
      </form>
    </div>
  );
}
