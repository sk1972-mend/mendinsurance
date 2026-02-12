
-- Enterprise RLS policies for fleet-level read access
CREATE POLICY "Enterprise can view all devices"
ON public.devices
FOR SELECT
USING (public.has_role(auth.uid(), 'enterprise'::app_role));

CREATE POLICY "Enterprise can view all policies"
ON public.policies
FOR SELECT
USING (public.has_role(auth.uid(), 'enterprise'::app_role));

CREATE POLICY "Enterprise can view all claims"
ON public.claims
FOR SELECT
USING (public.has_role(auth.uid(), 'enterprise'::app_role));

CREATE POLICY "Enterprise can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'enterprise'::app_role));
