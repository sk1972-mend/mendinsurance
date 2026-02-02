# Mend Platform - Implementation Plan

## Status: Phase A-F Complete ✅

This document tracks the implementation progress against the "Rugged Fintech" Master Prompt specifications.

---

## Completed Components

### Phase A: Design System ✅
- **File:** `src/index.css`
- Updated CSS variables to exact hex values:
  - Primary (Deep Navy): `#0A2540` → HSL `213 75% 15%`
  - Success (Emerald): `#10B981` → HSL `160 84% 39%`
- Added navy gradient scale for dashboard depth
- Added high-contrast utility classes for workshop visibility
- Added `.data-card`, `.stat-value`, `.btn-workshop` components

### Phase B: DiagnosticScanner Component ✅
- **File:** `src/components/shop/DiagnosticScanner.tsx`
- Camera-first OCR interface (MVP with manual fallback)
- Serial number verification against policies database
- Visual feedback: Green "Verified Match" / Red "Mismatch Alert"
- Integrated with Shop Dashboard

### Phase C: ClaimTriage Component ✅
- **File:** `src/components/customer/ClaimTriage.tsx`
- 4-step wizard: Select Device → Damage Type → Details → Confirm
- Damage type routing logic:
  - Local Shop: Screen, Battery, Physical damage
  - Mail-In Hub: Water damage, Logic board issues
- Integrated with Customer Dashboard

### Phase D: RevenueVisualizer Component ✅
- **File:** `src/components/shop/RevenueVisualizer.tsx`
- Monthly Passive Income card (15% commission calculation)
- Projected ARR calculator
- Wallet balance display
- 6-month revenue trend chart (Recharts)

### Phase E: ShopApplication Component ✅
- **File:** `src/components/shop/ShopApplication.tsx`
- Partner certification application form with:
  - Business information (name, address, phone, email)
  - Certifications multi-select (Apple, Samsung, Google, CompTIA, iFixit)
  - Equipment checklist (soldering, ultrasonic, separator, etc.)
  - Specializations (device types)
- Automatic tier calculation:
  - Basic: < 2 certifications
  - Advanced: 2-3 certs + soldering
  - Expert: 4+ certs + full equipment

### Phase F: ClaimsOversight Component ✅
- **File:** `src/components/admin/ClaimsOversight.tsx`
- Data grid with columns: Customer, Device, Serial, Shop, Status, Filed Date
- Filtering by status and search by serial/customer
- Fraud flags for serial mismatches
- Claim detail modal with approve/flag/close actions

---

## Dashboard Updates ✅

### Customer Dashboard
- Added ClaimTriage dialog trigger
- Displays active device count

### Shop Dashboard
- Navigation tabs: Overview, Device Scanner, Revenue
- Pending status banner for unapproved shops
- Integrated DiagnosticScanner and RevenueVisualizer
- Claims queue display

### Admin Dashboard
- Navigation tabs: Overview, Claims Oversight, Shop Applications
- Shop application review with approve/reject actions
- Platform stats (customers, shops, policies, pending apps)
- Integrated ClaimsOversight component

---

## Remaining Tasks

### Phase G: Stripe Integration 🔲
- [ ] Enable Stripe via Lovable integration
- [ ] Create `supabase/functions/create-checkout-session/index.ts`
- [ ] Create `supabase/functions/stripe-webhook/index.ts`
- [ ] Implement split payment logic (15% shop / 85% platform)
- [ ] Add `CheckoutButton.tsx` to customer device flow

### Additional Enhancements 🔲
- [ ] Shop location storage (lat/lng) for "Find Nearest Shop" feature
- [ ] Tesseract.js integration for real OCR scanning
- [ ] Mail-in shipping label generation (UPS/FedEx API)
- [ ] Real-time claim status updates (Supabase Realtime)
- [ ] Shop claims queue management interface

---

## File Structure

```
src/
├── components/
│   ├── customer/
│   │   ├── AddDeviceFlow.tsx ✅
│   │   ├── ClaimTriage.tsx ✅
│   │   ├── DeviceModelSelector.tsx ✅
│   │   ├── DeviceTypeSelector.tsx ✅
│   │   └── SerialRegistration.tsx ✅
│   ├── shop/
│   │   ├── DiagnosticScanner.tsx ✅
│   │   ├── RevenueVisualizer.tsx ✅
│   │   └── ShopApplication.tsx ✅
│   ├── admin/
│   │   └── ClaimsOversight.tsx ✅
│   └── ui/ (shadcn components)
├── pages/
│   ├── customer/Dashboard.tsx ✅
│   ├── shop/Dashboard.tsx ✅
│   ├── shop/Apply.tsx ✅
│   └── admin/Dashboard.tsx ✅
├── hooks/
│   ├── useAuth.tsx ✅
│   └── useDevices.tsx ✅
└── lib/
    └── deviceTiers.ts ✅
```

---

## Design Tokens (Rugged Fintech)

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| --primary | 213 75% 15% | 160 84% 45% |
| --success | 160 84% 39% | 160 84% 45% |
| --warning | 38 92% 50% | 38 92% 50% |
| --destructive | 0 84% 55% | 0 62% 50% |
| --sidebar-background | 213 75% 15% | 213 80% 5% |

---

## Next Steps

1. **Stripe Integration** - Enable payments for policy subscriptions
2. **OCR Enhancement** - Integrate tesseract.js for real serial scanning
3. **Shop Finder** - Add geolocation for local shop discovery
