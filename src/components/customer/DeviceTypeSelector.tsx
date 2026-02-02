import { DEVICE_CATEGORIES, DeviceCategory } from '@/lib/deviceTiers';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Smartphone, Tablet, Laptop, Gamepad2, Watch, Plane, Headphones } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Tablet,
  Laptop,
  Gamepad2,
  Watch,
  Plane,
  Headphones,
};

interface DeviceTypeSelectorProps {
  selectedType: DeviceCategory | null;
  onSelect: (type: DeviceCategory) => void;
}

export function DeviceTypeSelector({ selectedType, onSelect }: DeviceTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {DEVICE_CATEGORIES.map((category) => {
        const Icon = iconMap[category.icon];
        const isSelected = selectedType === category.id;
        
        return (
          <Card
            key={category.id}
            className={cn(
              'cursor-pointer transition-all hover:border-primary hover:shadow-md',
              isSelected && 'border-primary bg-primary/5 ring-2 ring-primary'
            )}
            onClick={() => onSelect(category.id)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div
                className={cn(
                  'mb-3 flex h-14 w-14 items-center justify-center rounded-xl transition-colors',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <span className={cn('font-medium', isSelected && 'text-primary')}>
                {category.label}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
