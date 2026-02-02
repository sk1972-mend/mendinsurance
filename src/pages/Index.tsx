import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Store, CheckCircle, ArrowRight, Zap } from 'lucide-react';

export default function Index() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && role) {
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'shop':
          navigate('/shop');
          break;
        case 'customer':
        default:
          navigate('/dashboard');
          break;
      }
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Mend</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/partners" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Partners
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Zap className="h-4 w-4" />
            Device protection, reimagined
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Protect your devices.
            <span className="block text-primary">Get repairs fast.</span>
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground">
            Mend connects you with certified local repair shops for instant claims processing. 
            No waiting, no hassle—just protection that works.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Start Protecting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">How Mend Works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Customer feature */}
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">For Customers</h3>
              <p className="mb-4 text-muted-foreground">
                Register your devices, get instant coverage, and file claims in seconds. 
                We'll connect you with the nearest certified shop.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Coverage for all device types
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Instant claim processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Local shop network
                </li>
              </ul>
            </div>

            {/* Shop feature */}
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Store className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">For Repair Shops</h3>
              <p className="mb-4 text-muted-foreground">
                Join our partner network and transform your business. 
                Earn passive income from referrals plus instant payouts for repairs.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  15% recurring commission
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Instant repair payouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Build your portfolio
                </li>
              </ul>
            </div>

            {/* Trust feature */}
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Built on Trust</h3>
              <p className="mb-4 text-muted-foreground">
                Our Digital Handshake system ensures every claim is verified, 
                protecting both customers and shops from fraud.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Serial number verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Photo proof system
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Certified shop network
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-12 text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Join thousands of customers and shop partners already using Mend.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="gap-2">
              Create Your Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Mend</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/partners" className="hover:text-foreground">Partners</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Mend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
