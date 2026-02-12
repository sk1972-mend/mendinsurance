import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import mendLogo from '@/assets/mend-logo.png';
import {
  Shield,
  Smartphone,
  Store,
  Building2,
  ArrowRight,
  CheckCircle,
  Zap,
  DollarSign,
  Clock,
  ScanLine,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function Index() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user && role) {
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'shop':
          navigate('/shop');
          break;
        case 'enterprise':
          navigate('/enterprise');
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
      {/* ─── Navigation ─── */}
      <nav className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
           <img src={mendLogo} alt="Mend" className="h-9 w-auto" />
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/partners" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/auth"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/auth"><Button>Get Started</Button></Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-card p-4 md:hidden space-y-3 animate-fade-in">
            <Link to="/about" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/partners" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Partners</Link>
            <Link to="/contact" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <div className="flex gap-2 pt-2">
              <Link to="/auth" className="flex-1"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link to="/auth" className="flex-1"><Button className="w-full">Get Started</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero: Split-Screen ─── */}
      <section className="relative overflow-hidden">
        {/* Navy background accent */}
        <div className="absolute inset-0 bg-sidebar" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sidebar-primary/30 bg-sidebar-primary/10 px-4 py-1.5 text-sm font-medium text-sidebar-primary-foreground">
              <Zap className="h-4 w-4 text-success" />
              Trust-Verified Device Protection
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-sidebar-primary-foreground md:text-6xl lg:text-7xl">
              The Operating System for{' '}
              <span className="text-success">Device Protection.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-sidebar-primary-foreground/70 md:text-xl">
              Connecting customers, repair shops, and carriers in one trust-verified network.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="gap-2 bg-success text-success-foreground hover:bg-success/90 btn-workshop">
                  File a Claim
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-sidebar-primary-foreground/30 text-sidebar-primary-foreground hover:bg-sidebar-accent/20 btn-workshop"
                >
                  Partner Login
                  <Store className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Choose Your Portal ─── */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Choose Your Portal</h2>
          <p className="text-lg text-muted-foreground">One platform, three powerful experiences.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card A: Personal Protection */}
          <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Smartphone className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Personal Protection</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Register devices, get instant coverage, and file claims in seconds. We match you with the nearest certified shop.
            </p>
            <ul className="mb-6 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                Coverage for all device types
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                <span>Plans from <span className="font-mono font-semibold text-success">$6/mo</span></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                Instant claim processing
              </li>
            </ul>
            <Link to="/auth">
              <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Get Protected <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Card B: Repair Shop Portal */}
          <div className="group relative overflow-hidden rounded-xl border-2 border-success/30 bg-card p-8 shadow-md transition-all hover:border-success/60 hover:shadow-lg">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-success/5" />
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
              <Store className="h-7 w-7 text-success" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Repair Shop Portal</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Join the partner network and transform your business with recurring revenue and instant payouts.
            </p>

            {/* Data-dense stats */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-success/5 p-3 text-center">
                <p className="font-mono text-lg font-bold text-success">15%</p>
                <p className="text-xs text-muted-foreground">Commission</p>
              </div>
              <div className="rounded-lg border bg-success/5 p-3 text-center">
                <p className="font-mono text-lg font-bold text-success">24h</p>
                <p className="text-xs text-muted-foreground">Payout</p>
              </div>
            </div>

            <Link to="/partners">
              <Button className="w-full gap-2 bg-success text-white hover:bg-success/90 border-none">
                Become a Partner <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Card C: Enterprise / Fleet */}
          <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-sidebar p-8 transition-all hover:shadow-lg">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-sidebar-primary/20">
              <Building2 className="h-7 w-7 text-sidebar-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-sidebar-primary-foreground">Enterprise & Fleet</h3>
            <p className="mb-4 text-sm text-sidebar-primary-foreground/60">
              Carrier integrations, fleet device management, and bulk underwriting for organizations.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-sidebar-primary-foreground/70">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-sidebar-primary" />
                Fleet device management
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-sidebar-primary" />
                Volume pricing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-sidebar-primary" />
                Dedicated account manager
              </li>
            </ul>
            <Link to="/contact">
              <Button variant="outline" className="w-full gap-2 border-2 border-sidebar-primary-foreground/60 text-sidebar-primary-foreground hover:bg-sidebar-primary-foreground hover:text-sidebar transition-colors">
                Contact Sales <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works (Trust Strip) ─── */}
      <section className="border-y bg-muted/20 py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-3xl font-bold">The Digital Handshake</h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <ScanLine className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">1. Verify</h3>
              <p className="text-sm text-muted-foreground">
                OCR serial scanning confirms device identity in seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="mb-1 font-semibold">2. Protect</h3>
              <p className="text-sm text-muted-foreground">
                Smart underwriting matches device tier to the right plan.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10">
                <DollarSign className="h-8 w-8 text-warning" />
              </div>
              <h3 className="mb-1 font-semibold">3. Resolve</h3>
              <p className="text-sm text-muted-foreground">
                Instant payouts to shops. Zero paperwork for customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Data Strip (Social Proof) ─── */}
      <section className="bg-sidebar py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: '7', label: 'Device Types Covered' },
              { value: '$6–$14', label: 'Monthly Plans' },
              { value: '24h', label: 'Average Payout' },
              { value: '15%', label: 'Shop Commission' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-3xl font-bold text-success md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-sidebar-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-primary/20 bg-card p-10 shadow-lg md:p-14">
          <img src={mendLogo} alt="Mend" className="mx-auto mb-4 h-12 w-auto" />
          <h2 className="mb-3 text-3xl font-bold">Ready to join the network?</h2>
          <p className="mb-8 text-muted-foreground">
            Whether you're protecting a device or fixing one, Mend has you covered.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="gap-2 bg-success text-success-foreground hover:bg-success/90">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/partners">
              <Button size="lg" variant="outline" className="gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                Shop Owner? Apply Here <Store className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t bg-sidebar py-10">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <img src={mendLogo} alt="Mend" className="h-6 w-auto brightness-0 invert" />
              <span className="font-semibold text-sidebar-primary-foreground">Men<span className="text-success">d</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm text-sidebar-primary-foreground/60">
              <Link to="/about" className="hover:text-sidebar-primary-foreground transition-colors">About</Link>
              <Link to="/partners" className="hover:text-sidebar-primary-foreground transition-colors">Partners</Link>
              <Link to="/contact" className="hover:text-sidebar-primary-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-sidebar-primary-foreground/40">
              © {new Date().getFullYear()} Mend. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
