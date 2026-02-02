// Device tier pricing configuration
// Tiers are automatically assigned based on device brand/model
// Users CANNOT manually select a cheaper tier

export type DeviceCategory = 'smartphone' | 'tablet' | 'laptop' | 'console' | 'wearable' | 'drone' | 'audio';

export interface DeviceTier {
  tier: 1 | 2 | 3 | 4;
  monthlyPremium: number;
  deductible: number;
  label: string;
}

export const TIER_PRICING: Record<number, DeviceTier> = {
  1: { tier: 1, monthlyPremium: 6, deductible: 25, label: 'Basic' },
  2: { tier: 2, monthlyPremium: 9, deductible: 50, label: 'Standard' },
  3: { tier: 3, monthlyPremium: 12, deductible: 75, label: 'Premium' },
  4: { tier: 4, monthlyPremium: 14, deductible: 100, label: 'Elite' },
};

export const DEVICE_CATEGORIES: { id: DeviceCategory; label: string; icon: string }[] = [
  { id: 'smartphone', label: 'Smartphone', icon: 'Smartphone' },
  { id: 'tablet', label: 'Tablet', icon: 'Tablet' },
  { id: 'laptop', label: 'Laptop', icon: 'Laptop' },
  { id: 'console', label: 'Console', icon: 'Gamepad2' },
  { id: 'wearable', label: 'Wearable', icon: 'Watch' },
  { id: 'drone', label: 'Drone', icon: 'Plane' },
  { id: 'audio', label: 'Audio', icon: 'Headphones' },
];

// Brand-model to tier mapping
// This ensures users get the correct pricing based on device value
export const DEVICE_MODELS: Record<DeviceCategory, { brand: string; models: { name: string; tier: 1 | 2 | 3 | 4 }[] }[]> = {
  smartphone: [
    {
      brand: 'Apple',
      models: [
        { name: 'iPhone 15 Pro Max', tier: 4 },
        { name: 'iPhone 15 Pro', tier: 4 },
        { name: 'iPhone 15 Plus', tier: 3 },
        { name: 'iPhone 15', tier: 3 },
        { name: 'iPhone 14 Pro Max', tier: 4 },
        { name: 'iPhone 14 Pro', tier: 3 },
        { name: 'iPhone 14', tier: 3 },
        { name: 'iPhone 13', tier: 2 },
        { name: 'iPhone 12', tier: 2 },
        { name: 'iPhone SE', tier: 1 },
      ],
    },
    {
      brand: 'Samsung',
      models: [
        { name: 'Galaxy S24 Ultra', tier: 4 },
        { name: 'Galaxy S24+', tier: 4 },
        { name: 'Galaxy S24', tier: 3 },
        { name: 'Galaxy S23 Ultra', tier: 4 },
        { name: 'Galaxy S23', tier: 3 },
        { name: 'Galaxy Z Fold 5', tier: 4 },
        { name: 'Galaxy Z Flip 5', tier: 3 },
        { name: 'Galaxy A54', tier: 2 },
        { name: 'Galaxy A34', tier: 1 },
      ],
    },
    {
      brand: 'Google',
      models: [
        { name: 'Pixel 8 Pro', tier: 3 },
        { name: 'Pixel 8', tier: 3 },
        { name: 'Pixel 7a', tier: 2 },
        { name: 'Pixel 7', tier: 2 },
        { name: 'Pixel 6a', tier: 1 },
      ],
    },
    {
      brand: 'OnePlus',
      models: [
        { name: 'OnePlus 12', tier: 3 },
        { name: 'OnePlus 11', tier: 3 },
        { name: 'OnePlus Nord 3', tier: 2 },
        { name: 'OnePlus Nord CE 3', tier: 1 },
      ],
    },
  ],
  tablet: [
    {
      brand: 'Apple',
      models: [
        { name: 'iPad Pro 12.9"', tier: 4 },
        { name: 'iPad Pro 11"', tier: 4 },
        { name: 'iPad Air', tier: 3 },
        { name: 'iPad 10th Gen', tier: 2 },
        { name: 'iPad Mini', tier: 2 },
      ],
    },
    {
      brand: 'Samsung',
      models: [
        { name: 'Galaxy Tab S9 Ultra', tier: 4 },
        { name: 'Galaxy Tab S9+', tier: 4 },
        { name: 'Galaxy Tab S9', tier: 3 },
        { name: 'Galaxy Tab A9+', tier: 2 },
        { name: 'Galaxy Tab A9', tier: 1 },
      ],
    },
    {
      brand: 'Microsoft',
      models: [
        { name: 'Surface Pro 9', tier: 4 },
        { name: 'Surface Go 3', tier: 2 },
      ],
    },
  ],
  laptop: [
    {
      brand: 'Apple',
      models: [
        { name: 'MacBook Pro 16"', tier: 4 },
        { name: 'MacBook Pro 14"', tier: 4 },
        { name: 'MacBook Air 15"', tier: 3 },
        { name: 'MacBook Air 13"', tier: 3 },
      ],
    },
    {
      brand: 'Dell',
      models: [
        { name: 'XPS 15', tier: 4 },
        { name: 'XPS 13', tier: 3 },
        { name: 'Inspiron 15', tier: 2 },
        { name: 'Inspiron 14', tier: 1 },
      ],
    },
    {
      brand: 'HP',
      models: [
        { name: 'Spectre x360', tier: 4 },
        { name: 'Envy x360', tier: 3 },
        { name: 'Pavilion 15', tier: 2 },
        { name: 'Pavilion 14', tier: 1 },
      ],
    },
    {
      brand: 'Lenovo',
      models: [
        { name: 'ThinkPad X1 Carbon', tier: 4 },
        { name: 'ThinkPad T14', tier: 3 },
        { name: 'IdeaPad 5', tier: 2 },
        { name: 'IdeaPad 3', tier: 1 },
      ],
    },
  ],
  console: [
    {
      brand: 'Sony',
      models: [
        { name: 'PlayStation 5', tier: 3 },
        { name: 'PlayStation 5 Digital', tier: 2 },
        { name: 'PlayStation 4 Pro', tier: 2 },
        { name: 'PlayStation 4', tier: 1 },
      ],
    },
    {
      brand: 'Microsoft',
      models: [
        { name: 'Xbox Series X', tier: 3 },
        { name: 'Xbox Series S', tier: 2 },
        { name: 'Xbox One X', tier: 2 },
        { name: 'Xbox One S', tier: 1 },
      ],
    },
    {
      brand: 'Nintendo',
      models: [
        { name: 'Switch OLED', tier: 2 },
        { name: 'Switch', tier: 2 },
        { name: 'Switch Lite', tier: 1 },
      ],
    },
    {
      brand: 'Valve',
      models: [
        { name: 'Steam Deck OLED', tier: 3 },
        { name: 'Steam Deck', tier: 2 },
      ],
    },
  ],
  wearable: [
    {
      brand: 'Apple',
      models: [
        { name: 'Apple Watch Ultra 2', tier: 4 },
        { name: 'Apple Watch Series 9', tier: 3 },
        { name: 'Apple Watch SE', tier: 2 },
      ],
    },
    {
      brand: 'Samsung',
      models: [
        { name: 'Galaxy Watch 6 Classic', tier: 3 },
        { name: 'Galaxy Watch 6', tier: 2 },
        { name: 'Galaxy Fit 3', tier: 1 },
      ],
    },
    {
      brand: 'Garmin',
      models: [
        { name: 'Fenix 7X', tier: 4 },
        { name: 'Fenix 7', tier: 3 },
        { name: 'Forerunner 965', tier: 3 },
        { name: 'Forerunner 265', tier: 2 },
        { name: 'Venu 3', tier: 2 },
      ],
    },
  ],
  drone: [
    {
      brand: 'DJI',
      models: [
        { name: 'Mavic 3 Pro', tier: 4 },
        { name: 'Mavic 3 Classic', tier: 4 },
        { name: 'Air 3', tier: 3 },
        { name: 'Mini 4 Pro', tier: 3 },
        { name: 'Mini 3', tier: 2 },
        { name: 'Mini 2 SE', tier: 1 },
      ],
    },
    {
      brand: 'Autel',
      models: [
        { name: 'EVO II Pro', tier: 4 },
        { name: 'EVO Nano+', tier: 2 },
        { name: 'EVO Nano', tier: 2 },
      ],
    },
  ],
  audio: [
    {
      brand: 'Apple',
      models: [
        { name: 'AirPods Max', tier: 3 },
        { name: 'AirPods Pro 2', tier: 2 },
        { name: 'AirPods 3rd Gen', tier: 1 },
      ],
    },
    {
      brand: 'Sony',
      models: [
        { name: 'WH-1000XM5', tier: 3 },
        { name: 'WH-1000XM4', tier: 2 },
        { name: 'WF-1000XM5', tier: 2 },
        { name: 'LinkBuds S', tier: 1 },
      ],
    },
    {
      brand: 'Bose',
      models: [
        { name: 'QuietComfort Ultra', tier: 3 },
        { name: 'QuietComfort 45', tier: 2 },
        { name: 'QuietComfort Earbuds II', tier: 2 },
      ],
    },
    {
      brand: 'Sennheiser',
      models: [
        { name: 'Momentum 4', tier: 3 },
        { name: 'Momentum True Wireless 3', tier: 2 },
      ],
    },
  ],
};

export function getTierForDevice(category: DeviceCategory, brand: string, model: string): DeviceTier | null {
  const categoryDevices = DEVICE_MODELS[category];
  const brandData = categoryDevices?.find(b => b.brand === brand);
  const modelData = brandData?.models.find(m => m.name === model);
  
  if (modelData) {
    return TIER_PRICING[modelData.tier];
  }
  
  return null;
}

export function getBrandsForCategory(category: DeviceCategory): string[] {
  return DEVICE_MODELS[category]?.map(b => b.brand) || [];
}

export function getModelsForBrand(category: DeviceCategory, brand: string): { name: string; tier: 1 | 2 | 3 | 4 }[] {
  const categoryDevices = DEVICE_MODELS[category];
  const brandData = categoryDevices?.find(b => b.brand === brand);
  return brandData?.models || [];
}
