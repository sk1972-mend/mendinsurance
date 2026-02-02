Here is the fully updated Master Plan. I have merged the original Navigation Plan with the new "Trust Pages" requirements and applied the "Real Routes" correction (replacing the query parameters with actual file paths) to ensure the architecture is scalable.Copy and paste this entire block into Lovable to execute the full build.Navigation, Layout & Brand Trust Implementation PlanOverviewThis plan implements a unified navigation structure using the Shadcn Sidebar component with a "Rugged Fintech" top bar. It also establishes the "Trust Architecture" of the platform by building out public-facing informational pages (About, Partners, Contact) to legitimize the brand before shop onboarding.Current State AnalysisDashboard Pages: Standalone headers with duplicate logic; no unified shell.Brand Presence: Missing critical trust pages (About, Contact) that convince shops to sign up.Navigation: No shared layout for protected routes.UI Components: Shadcn sidebar.tsx is ready; branding colors (Navy/Emerald) are defined but need consistent application.ArchitecturePlaintext                    App.tsx
                       |
          +------------+------------------------+
          |            |                        |
      Public           |                    Protected
      Routes           |                     Routes
          |            |                        |
     Index.tsx         |                 DashboardLayout.tsx
     Auth.tsx          |                        |
     About.tsx (NEW)   |              +---------+---------+
     Partners.tsx (NEW)|              |         |         |
     Contact.tsx (NEW) |          Customer    Shop      Admin
                       |          Dashboard  Dashboard  Dashboard
Implementation Details1. Create AppSidebar.tsxFile: src/components/AppSidebar.tsxPurpose: Role-aware navigation sidebar.Features:Deep Navy (#0A2540) header with "Mend OS" branding.Real Route Navigation: Use actual paths (e.g., /shop/scanner) instead of query params.Dev Override: Show ALL links when role is loading/undefined.Menu Structure:CustomerShopAdminMy Devices (/dashboard)Overview (/shop)Overview (/admin)File Claim (/dashboard/claims/new)Scanner (/shop/scanner)Claims Oversight (/admin/claims)Account (/dashboard/account)Claims Queue (/shop/queue)Partner Network (/admin/partners)Revenue (/shop/revenue)Settings (/admin/settings)2. Create DashboardLayout.tsxFile: src/components/DashboardLayout.tsxPurpose: Shared layout wrapper with sticky top bar.Structure:Sticky Top Bar: bg-white/90 backdrop-blur-md border-b border-primary/10.Breadcrumbs: Dynamic path mapping (e.g., "Mend > Shop > Scanner").User Actions: Notification Bell + Avatar Dropdown (Sign Out).3. Build "Trust & Brand" Pages (NEW)A. src/pages/About.tsx (The Mission)Hero: "Born Behind the Bench" - Founder's story (split layout).The Problem Grid:"The Adjuster Bottleneck""The Part Roulette""The Revenue Trap"The Solution: Visual representation of the "Hybrid Engine."B. src/pages/Partners.tsx (The Shop Pitch)Audience: "Average Joe" Shop Owners.Value Props:15% Passive Revenue: Visual breakdown of recurring commissions.Instant Payouts: Stripe Connect badge.The Moat: Explanation of the OCR Scanner fraud protection.CTA: "Apply for Certification" -> Links to /shop/apply.C. src/pages/Contact.tsx (Support & HQ)Style: "Command Center" feel (Data-dense, not just a form).Components:Technician Priority Line: Phone/Email for partners.HQ Map: New Brunswick, NJ placeholder.4. Update App.tsx RouterFile: src/App.tsxChanges:Register new public routes (/about, /partners, /contact).Wrap protected routes in DashboardLayout.Define child routes for the Shop Dashboard to support specific views.Router Structure:PlaintextRoutes:
├── Public
│   ├── "/" → Index
│   ├── "/auth" → Auth
│   ├── "/about" → About
│   ├── "/partners" → Partners
│   └── "/contact" → Contact
│
└── Protected (DashboardLayout)
    ├── "/dashboard" → CustomerDashboard
    ├── "/shop" → ShopDashboard (Overview)
    │   ├── "scanner" → DiagnosticScanner
    │   ├── "queue" → ClaimsQueue
    │   └── "revenue" → RevenueVisualizer
    └── "/admin" → AdminDashboard
Technical Specifications & StylingNavigation Links (Real Routes)TypeScriptconst shopLinks = [
  { title: "Overview", url: "/shop", icon: LayoutDashboard },
  { title: "Scanner", url: "/shop/scanner", icon: ScanLine },
  { title: "Claims Queue", url: "/shop/queue", icon: ClipboardList },
  { title: "Revenue", url: "/shop/revenue", icon: TrendingUp },
];
Design System (Rugged Fintech)Colors: Strict adherence to Deep Navy (#0A2540) and Emerald (#10B981).Typography: Inter (sans-serif), high legibility.Top Bar: Ensure backdrop-blur-md is sufficient for text readability over scrolling content.Implementation OrderTrust Pages: Build About.tsx, Partners.tsx, Contact.tsx.Navigation Core: Build AppSidebar.tsx and DashboardLayout.tsx.Router Refactor: Update App.tsx with the new public and protected nested routes.Landing Page Update: Add links to the new pages in the Index.tsx Navbar and Footer.Testing NotesVerify that /shop/scanner loads the Scanner component directly (not just the dashboard).Check that "Partners" page CTA correctly redirects to /shop/apply.Ensure the Sidebar collapses correctly on mobile.Verify the "Rugged Fintech" color palette is consistent across the new Trust Pages.