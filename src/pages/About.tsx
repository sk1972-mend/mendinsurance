import { Link } from 'react-router-dom';
import { Shield, Wrench, Clock, DollarSign, ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
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
            <Link to="/about" className="text-sm font-medium text-primary">About</Link>
            <Link to="/partners" className="text-sm font-medium text-muted-foreground hover:text-foreground">Partners</Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">Contact</Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Born Behind the Bench */}
      <section className="container py-20">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
              <Users className="h-4 w-4" />
              Our Story
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Born Behind
              <span className="block text-primary">the Bench</span>
            </h1>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              Mend was founded by technicians who spent years watching the same broken system 
              fail customers and shops alike. Slow adjusters, unreliable parts, and razor-thin 
              margins weren't just frustrations—they were the industry standard.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We built Mend to fix it. A platform where protection is instant, verification 
              is automated, and repair shops finally get the recognition—and revenue—they deserve.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/10 to-success/10 blur-2xl" />
            <div className="relative rounded-2xl border-2 border-primary/20 bg-card p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                  <Wrench className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10+ Years</p>
                  <p className="text-muted-foreground">Combined Repair Experience</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-3xl font-bold text-primary">$0</p>
                  <p className="text-sm text-muted-foreground">Claim Processing Fee</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-3xl font-bold text-success">15%</p>
                  <p className="text-sm text-muted-foreground">Partner Commission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Grid */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">The Industry's Broken System</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We identified three critical failures that plagued device protection for years.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* The Adjuster Bottleneck */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-xl">The Adjuster Bottleneck</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Traditional warranty claims require human adjusters to review every case. 
                  Customers wait days or weeks while their devices sit broken. Shops lose 
                  business to the delay.
                </p>
              </CardContent>
            </Card>

            {/* The Part Roulette */}
            <Card className="border-warning/20 bg-warning/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Zap className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-xl">The Part Roulette</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mail-in repair programs ship devices to distant facilities, using 
                  inconsistent parts and untested technicians. Customers get their 
                  phones back—sometimes fixed, sometimes worse.
                </p>
              </CardContent>
            </Card>

            {/* The Revenue Trap */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">The Revenue Trap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Local repair shops work on razor-thin margins. Every fix is a one-time 
                  transaction with no recurring revenue. There's no incentive structure 
                  to reward quality or build customer relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Solution - Hybrid Engine */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">The Mend Hybrid Engine</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combined the best of insurance automation with the trust of local repair networks.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="mb-2 font-semibold">Instant Verification</h3>
            <p className="text-sm text-muted-foreground">
              OCR-powered serial matching confirms device ownership in seconds, not days.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Local Network</h3>
            <p className="text-sm text-muted-foreground">
              Certified neighborhood shops you can visit, not anonymous mail-in facilities.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-warning/10">
              <DollarSign className="h-8 w-8 text-warning" />
            </div>
            <h3 className="mb-2 font-semibold">Split Revenue</h3>
            <p className="text-sm text-muted-foreground">
              15% recurring commission turns one-time customers into passive income.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent">
              <Shield className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">Digital Trust</h3>
            <p className="text-sm text-muted-foreground">
              Photo proof and serial verification protect everyone from fraud.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold">Ready to join the future of device protection?</h2>
          <p className="mb-8 text-primary-foreground/80 max-w-xl mx-auto">
            Whether you're protecting your devices or growing your repair business, Mend has you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Protecting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/partners">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Become a Partner
              </Button>
            </Link>
          </div>
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
