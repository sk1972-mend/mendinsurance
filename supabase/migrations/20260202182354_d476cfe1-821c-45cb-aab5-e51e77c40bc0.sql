-- Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('customer', 'shop', 'admin');

-- Create device_type enum
CREATE TYPE public.device_type AS ENUM ('smartphone', 'tablet', 'laptop', 'console', 'wearable', 'drone', 'audio');

-- Create shop_tier enum
CREATE TYPE public.shop_tier AS ENUM ('basic', 'advanced', 'expert');

-- Create shop_status enum
CREATE TYPE public.shop_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Create policy_status enum
CREATE TYPE public.policy_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

-- Create claim_status enum
CREATE TYPE public.claim_status AS ENUM ('filed', 'assigned', 'in_progress', 'verified_complete', 'flagged', 'closed');

-- Create repair_type enum
CREATE TYPE public.repair_type AS ENUM ('local', 'mail_in');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create shops table
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  tier shop_tier NOT NULL DEFAULT 'basic',
  status shop_status NOT NULL DEFAULT 'pending',
  stripe_connect_id TEXT,
  wallet_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  specializations TEXT[], -- Array of device types they can repair
  certifications TEXT[],
  equipment_list TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create devices table
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_type device_type NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier >= 1 AND tier <= 4),
  photo_url TEXT,
  health_status TEXT DEFAULT 'good',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create policies table (insurance policies, not RLS)
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  referring_shop_id UUID REFERENCES public.shops(id),
  status policy_status NOT NULL DEFAULT 'pending',
  monthly_premium DECIMAL(10, 2) NOT NULL,
  deductible DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE NOT NULL,
  assigned_shop_id UUID REFERENCES public.shops(id),
  status claim_status NOT NULL DEFAULT 'filed',
  repair_type repair_type,
  issue_description TEXT NOT NULL,
  customer_photos TEXT[], -- Array of photo URLs from customer
  shop_verification_serial TEXT, -- Serial entered by shop during handshake
  shop_verification_photo TEXT, -- Photo uploaded by shop
  serial_match BOOLEAN,
  repair_cost_agreed DECIMAL(10, 2),
  repair_notes TEXT,
  post_repair_photos TEXT[], -- Array of photo URLs after repair
  filed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscriptions_ledger table (passive income tracking)
CREATE TABLE public.subscriptions_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL, -- 15% commission amount
  stripe_invoice_id TEXT,
  credited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create claims_payout table (repair payouts)
CREATE TABLE public.claims_payout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_transfer_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create device_health_history table
CREATE TABLE public.device_health_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  diagnostic_type TEXT NOT NULL, -- 'initial', 'claim', 'repair_complete'
  diagnostic_data JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims_payout ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_health_history ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Default new users to customer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for shops
CREATE POLICY "Anyone can view approved shops" ON public.shops FOR SELECT USING (status = 'approved');
CREATE POLICY "Shop owners can view own shop" ON public.shops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Shop owners can update own shop" ON public.shops FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create shop application" ON public.shops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all shops" ON public.shops FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for devices
CREATE POLICY "Users can manage own devices" ON public.devices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all devices" ON public.devices FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for policies (insurance)
CREATE POLICY "Users can view own policies" ON public.policies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own policies" ON public.policies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Shops can view referred policies" ON public.policies FOR SELECT USING (
  referring_shop_id IN (SELECT id FROM public.shops WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all policies" ON public.policies FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for claims
CREATE POLICY "Users can view own claims" ON public.claims FOR SELECT USING (
  policy_id IN (SELECT id FROM public.policies WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create claims for own policies" ON public.claims FOR INSERT WITH CHECK (
  policy_id IN (SELECT id FROM public.policies WHERE user_id = auth.uid())
);
CREATE POLICY "Assigned shops can view and update claims" ON public.claims FOR ALL USING (
  assigned_shop_id IN (SELECT id FROM public.shops WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all claims" ON public.claims FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for subscriptions_ledger
CREATE POLICY "Shops can view own ledger entries" ON public.subscriptions_ledger FOR SELECT USING (
  shop_id IN (SELECT id FROM public.shops WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all ledger entries" ON public.subscriptions_ledger FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for claims_payout
CREATE POLICY "Shops can view own payouts" ON public.claims_payout FOR SELECT USING (
  shop_id IN (SELECT id FROM public.shops WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all payouts" ON public.claims_payout FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for device_health_history
CREATE POLICY "Device owners can view history" ON public.device_health_history FOR SELECT USING (
  device_id IN (SELECT id FROM public.devices WHERE user_id = auth.uid())
);
CREATE POLICY "Shops and admins can create history" ON public.device_health_history FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'shop') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can view all history" ON public.device_health_history FOR SELECT USING (public.has_role(auth.uid(), 'admin'));