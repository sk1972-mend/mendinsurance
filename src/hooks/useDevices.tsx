import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '@/integrations/supabase/types';

type Device = Tables<'devices'>;
type Policy = Tables<'policies'>;

interface DeviceWithPolicy extends Device {
  policy: Policy | null;
}

export function useDevices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<DeviceWithPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    if (!user) {
      setDevices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch devices
      const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (deviceError) throw deviceError;

      // Fetch policies for these devices
      const deviceIds = deviceData.map(d => d.id);
      
      if (deviceIds.length > 0) {
        const { data: policyData, error: policyError } = await supabase
          .from('policies')
          .select('*')
          .in('device_id', deviceIds);

        if (policyError) throw policyError;

        // Combine devices with their policies
        const devicesWithPolicies = deviceData.map(device => ({
          ...device,
          policy: policyData?.find(p => p.device_id === device.id) || null,
        }));

        setDevices(devicesWithPolicies);
      } else {
        setDevices([]);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [user]);

  const refetch = () => {
    fetchDevices();
  };

  return { devices, loading, error, refetch };
}
