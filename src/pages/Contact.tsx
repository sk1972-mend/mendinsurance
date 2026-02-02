import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, Clock, MessageSquare, Headphones, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Contact() {
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
            <Link to="/partners" className="text-sm font-medium text-muted-foreground hover:text-foreground">Partners</Link>
            <Link to="/contact" className="text-sm font-medium text-primary">Contact</Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Command Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Our support team operates like a well-oiled machine. 
            Reach us through the channel that works best for you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {/* Partner Priority Line */}
          <Card className="border-2 border-success/20 bg-success/5">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success">
                <Headphones className="h-6 w-6 text-success-foreground" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Partner Priority Line
              </CardTitle>
              <CardDescription>For certified repair partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">1-888-MEND-PRO</p>
                  <p className="text-sm text-muted-foreground">(1-888-636-3776)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">partners@mend.insurance</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Mon-Sat, 8AM-8PM EST</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Average response: <strong className="text-success">Under 2 hours</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Support */}
          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Customer Support</CardTitle>
              <CardDescription>For policyholders and claims</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">1-800-MEND-NOW</p>
                  <p className="text-sm text-muted-foreground">(1-800-636-3669)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">support@mend.insurance</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">24/7 for emergencies</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Average response: <strong className="text-foreground">Under 4 hours</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Headquarters */}
          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <MapPin className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Headquarters</CardTitle>
              <CardDescription>Corporate & Press inquiries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Mend Insurance Inc.</p>
                  <p className="text-sm text-muted-foreground">
                    120 Albany Street, Suite 400<br />
                    New Brunswick, NJ 08901
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">hello@mend.insurance</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  For media: <strong className="text-foreground">press@mend.insurance</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="mb-2 text-2xl font-bold">Send us a message</h2>
              <p className="mb-8 text-muted-foreground">
                Have a question that doesn't fit the channels above? We'll get back to you within 24 hours.
              </p>

              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="mb-2 text-2xl font-bold">Visit our HQ</h2>
              <p className="mb-8 text-muted-foreground">
                Located in the heart of New Brunswick's tech corridor.
              </p>

              <Card className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
                  {/* Placeholder for map - in production, integrate Google Maps or Mapbox */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5" />
                  <div className="relative text-center p-8">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="font-semibold text-lg">New Brunswick, NJ</p>
                    <p className="text-muted-foreground">
                      120 Albany Street, Suite 400
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a 
                        href="https://maps.google.com/?q=120+Albany+Street+New+Brunswick+NJ" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Open in Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Office Hours */}
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Monday - Friday</p>
                      <p className="text-muted-foreground">9:00 AM - 6:00 PM EST</p>
                    </div>
                    <div>
                      <p className="font-medium">Saturday</p>
                      <p className="text-muted-foreground">10:00 AM - 2:00 PM EST</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Sunday</p>
                      <p className="text-muted-foreground">Closed (Emergency line available)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
