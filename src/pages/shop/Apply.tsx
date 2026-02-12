import { useNavigate } from 'react-router-dom';
import { ShopApplication } from '@/components/shop/ShopApplication';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import mendLogo from '@/assets/mend-logo.png';

export default function ShopApply() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = () => {
    navigate('/shop');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={mendLogo} alt="Mend" className="h-9 w-auto" />
            <span className="text-xl font-semibold">Mend</span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <ShopApplication onSuccess={handleSuccess} />
      </main>
    </div>
  );
}
