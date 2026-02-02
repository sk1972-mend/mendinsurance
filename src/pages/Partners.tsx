import { Link } from 'react-router-dom';
import { Shield, DollarSign, Zap, ScanLine, ArrowRight, CheckCircle, TrendingUp, Store, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Partners() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Mend</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/partners" className="text-sm font-medium text-primary">Partners</Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">Contact</Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
            <Store className="h-4 w-4" />
            For Repair Shops
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Turn One-Time Fixes Into
            <span className="block text-success">Recurring Revenue</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Join the Mend Partner Network and earn 15% commission on every policy 
            from customers you refer—month after month, year after year.
          </p>
          <Link to="/shop/apply">
            <Button size="lg" className="gap-2 bg-success hover:bg-success/90">
              Apply for Certification
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Value Props Grid */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Shops Partner With Mend</h2>
            <p className="text-lg text-muted-foreground">
              We built the program that repair shops actually asked for.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* 15% Passive Revenue */}
            <Card className="border-2 border-success/20 bg-success/5">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-success">
                  <DollarSign className="h-7 w-7 text-success-foreground" />
                </div>
                <CardTitle className="text-2xl">15% Passive Revenue</CardTitle>
                <CardDescription className="text-base">
                  Recurring commission that grows while you sleep
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg bg-card p-4 border">
                  <p className="text-sm text-muted-foreground mb-2">Example: Customer pays $12/month</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-success">$1.80</span>
                    <span className="text-muted-foreground">/month to you</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    × 100 customers = <strong className="text-foreground">$180/month passive income</strong>
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Commission paid monthly
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Lifetime of the policy
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    No caps or limits
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Instant Payouts */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                  <Zap className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Instant Payouts</CardTitle>
                <CardDescription className="text-base">
                  Repair payments hit your account the same day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg bg-card p-4 border">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Powered by Stripe Connect</p>
                      <p className="text-sm text-muted-foreground">Enterprise-grade payments</p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    No invoice chasing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Same-day direct deposit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Real-time revenue tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* The Moat - OCR Scanner */}
            <Card className="border-2 border-warning/20 bg-warning/5">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-warning">
                  <ScanLine className="h-7 w-7 text-warning-foreground" />
                </div>
                <CardTitle className="text-2xl">Fraud Protection Built-In</CardTitle>
                <CardDescription className="text-base">
                  Our OCR scanner is your proof of work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg bg-card p-4 border">
                  <p className="text-sm text-muted-foreground mb-2">The "Digital Handshake"</p>
                  <p className="text-sm">
                    Scan the device serial → system matches it to the policy → 
                    <strong className="text-foreground"> you're protected from chargebacks.</strong>
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Automatic verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Photo proof system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Dispute protection
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Calculator Preview */}
      <section className="container py-20">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold">
              See Your Potential
              <span className="block text-success">ARR Growth</span>
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Every customer you protect becomes a monthly revenue stream. 
              Our Revenue Visualizer shows you exactly how your referral network 
              compounds over time.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Real-time earnings dashboard</p>
                  <p className="text-sm text-muted-foreground">Track commissions, repairs, and payouts</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Build your portfolio</p>
                  <p className="text-sm text-muted-foreground">Your customer network is an asset</p>
                </div>
              </div>
            </div>
            <Link to="/shop/apply">
              <Button size="lg" className="gap-2">
                Start Your Application
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mock Revenue Preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-success/20 to-primary/10 blur-2xl" />
            <Card className="relative border-2">
              <CardHeader className="pb-2">
                <CardDescription>Projected Annual Revenue</CardDescription>
                <CardTitle className="text-4xl text-success">$21,600</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Referral Commission</span>
                    <span className="font-semibold">$12,960/yr</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Repair Payouts</span>
                    <span className="font-semibold">$8,640/yr</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">Active Policies</span>
                    <span className="font-semibold">60 devices</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  *Based on average partner with 60 referred customers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tiers Overview */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Partner Tiers</h2>
            <p className="text-lg text-muted-foreground">
              Grow your certification, unlock more opportunities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2">
                  <span className="tier-badge tier-badge--basic">Basic</span>
                </div>
                <CardTitle>Starting Partner</CardTitle>
                <CardDescription>For new applicants</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    15% referral commission
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Standard repair payouts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Access to claim queue
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30">
              <CardHeader>
                <div className="mb-2">
                  <span className="tier-badge tier-badge--advanced">Advanced</span>
                </div>
                <CardTitle>Established Partner</CardTitle>
                <CardDescription>20+ repairs completed</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Everything in Basic
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Priority claim routing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Featured in local search
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/30">
              <CardHeader>
                <div className="mb-2">
                  <span className="tier-badge tier-badge--expert">Expert</span>
                </div>
                <CardTitle>Elite Partner</CardTitle>
                <CardDescription>50+ repairs, certified</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Everything in Advanced
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Exclusive high-value claims
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Direct support line
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold">Ready to grow your business?</h2>
          <p className="mb-8 text-primary-foreground/80 max-w-xl mx-auto">
            The application takes 5 minutes. We review every shop within 48 hours.
          </p>
          <Link to="/shop/apply">
            <Button size="lg" variant="secondary" className="gap-2">
              Apply for Certification
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
