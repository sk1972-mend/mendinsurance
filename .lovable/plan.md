
# Alignment Review: Master Prompt vs Current Implementation

## Executive Summary

The foundation is solid but several key components from the Master Prompt are missing or need refinement. This plan addresses the gaps to bring the codebase into full alignment with the "Rugged Fintech" specifications.

---

## Gap Analysis

### Design System (Priority: High)

**Current State:**
- Uses HSL-based blues and greens
- Clean professional aesthetic

**Required Changes:**
- Update CSS to use exact hex values (#0A2540 Deep Navy, #10B981 Emerald)
- Add "Rugged Fintech" density - more data-rich layouts
- Increase contrast for workshop lighting readability
- Ensure mobile-tablet optimization for shop counter use

### Missing Components (Priority: Critical)

| Component | Purpose | Status |
|-----------|---------|--------|
| `DiagnosticScanner.tsx` | OCR camera-first serial scanner | Not built |
| `ClaimTriage.tsx` | Step wizard with damage routing | Not built |
| `RevenueVisualizer.tsx` | ARR calculator with charts | Not built |
| `ShopAuth.tsx` | Partner certification application | Not built |
| `ClaimsOversight.tsx` | Admin claims data grid | Not built |
| `StripeConnect.tsx` | Split payment handling | Not built |

---

## Implementation Plan

### Phase A: Design System Refinement

**File: `src/index.css`**

Update CSS custom properties to use the "Rugged Fintech" palette:

```text
Changes Required:
├── --primary: Convert to #0A2540 (Deep Navy Blue)
├── --success: Verify #10B981 (Emerald Green)
├── --background: Increase contrast for workshop visibility
├── Add --navy-* gradient scale for dashboard depth
└── Typography: Ensure legibility at arm's length
```

**Rationale:** The Master Prompt specifies exact brand colors for trust (navy) and money/success (emerald). Current implementation uses close approximations but should match precisely.

---

### Phase B: Shop Dashboard - DiagnosticScanner Component

**New File: `src/components/shop/DiagnosticScanner.tsx`**

This is the critical "Digital Handshake" component for shop verification.

**Behavior Flow:**
1. Camera viewfinder opens by default (mobile/tablet first)
2. Technician points camera at device IMEI/serial label
3. OCR library attempts to read the serial number
4. If successful: Auto-populate and validate against policies table
5. Display: Green "Verified Match" badge OR Red "Mismatch Alert"
6. Manual entry: Hidden fallback (link at bottom "Enter manually")

**Technical Approach:**
- Use `tesseract.js` for client-side OCR (no server needed)
- Alternatively: Integrate with device camera via `navigator.mediaDevices`
- Query Supabase `devices` table to match serial against registered devices

**Visual Design:**
```text
┌─────────────────────────────────────┐
│         📷 Camera Viewfinder        │
│    [Point at device serial label]   │
│                                     │
│   ┌───────────────────────────┐    │
│   │                           │    │
│   │     SCANNING...           │    │
│   │                           │    │
│   └───────────────────────────┘    │
│                                     │
│   Detected: ABCD1234567890         │
│   [✓ Verified Match] (green)        │
│                                     │
│   ─────── or ───────               │
│   Can't scan? Enter manually →      │
└─────────────────────────────────────┘
```

---

### Phase C: Customer Claim Flow - ClaimTriage Component

**New File: `src/components/customer/ClaimTriage.tsx`**

**Step-by-Step Wizard:**

1. **Step 1: Select Device** - Choose from user's protected devices
2. **Step 2: Damage Type** - Radio buttons:
   - Screen Damage
   - Battery Issues
   - Water/Liquid Damage
   - Logic Board / Internal Failure
   - Physical Damage (other)
   - Not Working (unknown cause)

3. **Step 3: Routing Decision** (automatic based on damage type):

```text
IF damage_type IN ('screen', 'battery', 'physical'):
    → Show "Local Shop" route
    → Display map with nearest certified shops
    → "Find Nearest Shop" button

IF damage_type IN ('water', 'logic_board'):
    → Show "Mail-In Repair" route
    → Display Hub address
    → "Generate Shipping Label" button (UPS/FedEx)
```

4. **Step 4: Confirm & Submit** - Create claim record in Supabase

**Database Integration:**
- Insert into `claims` table with `repair_type` = 'local' or 'mail_in'
- Set `status` = 'filed'
- Link to `policy_id` and device

---

### Phase D: Shop Revenue Dashboard - RevenueVisualizer Component

**New File: `src/components/shop/RevenueVisualizer.tsx`**

**Displays:**
1. **Monthly Passive Income Card**
   - Calculated: 15% × SUM(active_policy_premiums)
   - Real data from `subscriptions_ledger` table

2. **Projected ARR Calculator**
   - Formula: Monthly Passive × 12
   - Plus average repair revenue estimation

3. **Visual Chart** (using Recharts - already installed)
   - Line chart showing income trend over past 6 months
   - Bar chart showing repair payouts

**Data Query:**
```sql
SELECT 
  SUM(amount) as total_commission,
  DATE_TRUNC('month', credited_at) as month
FROM subscriptions_ledger
WHERE shop_id = [current_shop_id]
GROUP BY month
ORDER BY month DESC
LIMIT 6
```

---

### Phase E: Shop Onboarding - ShopAuth Component

**New File: `src/components/shop/ShopApplication.tsx`**

**Application Form Fields:**
- Business Name (required)
- Business Address (required)
- Business Phone (required)
- Business Email (required)
- Years in Business (number input)
- Certifications (multi-select checkboxes):
  - Apple Certified
  - Samsung Authorized
  - Google Authorized
  - CompTIA A+
  - iFixit Certified
- Equipment List (multi-select):
  - Micro-soldering Station
  - Ultrasonic Cleaner
  - Screen Separator Machine
  - Battery Calibration Tools
- Specializations (multi-select from device types)

**Tier Logic:**
- Basic: < 2 certifications
- Advanced: 2-3 certifications + soldering equipment
- Expert: 4+ certifications + full equipment list

**Database:**
- Insert into `shops` table with `status = 'pending'`
- Admin approves via Admin Dashboard

---

### Phase F: Admin Claims Oversight - ClaimsOversight Component

**New File: `src/components/admin/ClaimsOversight.tsx`**

**Data Grid Columns:**
- Claim ID
- Customer Name
- Shop Name (if assigned)
- Device (Brand + Model)
- Device Serial
- Status (filed / in_progress / verified / completed / flagged)
- Filed Date
- Actions (View Details, Assign Shop, Flag, Approve)

**Filtering:**
- Status filter dropdown
- Date range picker
- Search by serial number

**Fraud Flags:**
- Highlight rows where `serial_match = false`
- Show warning icon for escalated claims

---

### Phase G: Stripe Integration

**New Files:**
- `supabase/functions/create-checkout-session/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `src/components/customer/CheckoutButton.tsx`

**Webhook Handler Logic:**
```text
ON invoice.payment_succeeded:
  1. Get policy_id from subscription metadata
  2. Calculate shop_commission = amount × 0.15
  3. Find referring_shop_id from policy
  4. INSERT into subscriptions_ledger (shop_id, policy_id, amount)
  5. UPDATE shops SET wallet_balance += shop_commission
```

This requires enabling Stripe via the Lovable Stripe integration first.

---

## File Structure After Implementation

```text
src/
├── components/
│   ├── customer/
│   │   ├── AddDeviceFlow.tsx (exists)
│   │   ├── ClaimTriage.tsx (NEW)
│   │   ├── DeviceModelSelector.tsx (exists)
│   │   ├── DeviceTypeSelector.tsx (exists)
│   │   ├── SerialRegistration.tsx (exists)
│   │   └── CheckoutButton.tsx (NEW)
│   ├── shop/
│   │   ├── DiagnosticScanner.tsx (NEW - OCR camera)
│   │   ├── RevenueVisualizer.tsx (NEW)
│   │   ├── ShopApplication.tsx (NEW)
│   │   └── ClaimsQueue.tsx (NEW)
│   ├── admin/
│   │   ├── ClaimsOversight.tsx (NEW)
│   │   ├── ShopApplicationReview.tsx (NEW)
│   │   └── PartnerManagement.tsx (NEW)
│   └── ui/ (existing shadcn components)
├── pages/
│   ├── customer/
│   │   └── Dashboard.tsx (update to integrate ClaimTriage)
│   ├── shop/
│   │   └── Dashboard.tsx (update with real components)
│   └── admin/
│       └── Dashboard.tsx (update with real components)
└── lib/
    └── deviceTiers.ts (exists)

supabase/
└── functions/
    ├── create-checkout-session/
    │   └── index.ts (NEW)
    └── stripe-webhook/
        └── index.ts (NEW)
```

---

## Implementation Priority

1. **Design System Update** - Update colors to match exact spec (quick win)
2. **ClaimTriage.tsx** - Customer claim filing flow (enables core user journey)
3. **ShopApplication.tsx** - Shop onboarding (enables partner acquisition)
4. **DiagnosticScanner.tsx** - OCR verification (core differentiator)
5. **ClaimsOversight.tsx** - Admin oversight (completes the loop)
6. **RevenueVisualizer.tsx** - Shop motivation (polish)
7. **Stripe Integration** - Payment processing (monetization)

---

## Technical Notes

### OCR Implementation Options

**Option A: Tesseract.js (Recommended)**
- Client-side OCR, no server required
- Works offline after initial load
- Install: `npm install tesseract.js`

**Option B: Google Cloud Vision**
- More accurate but requires API key
- Server-side via Edge Function
- Adds latency and cost

**Recommendation:** Start with Tesseract.js for MVP, upgrade to Cloud Vision if accuracy is insufficient.

### Map Integration for Shop Finder

For showing "Nearest Local Shop" in ClaimTriage:
- Can use simple distance calculation if shops have lat/lng
- Or integrate with Google Maps API / Mapbox for visual map
- MVP: Show list of shops sorted by distance (no map initially)

---

## Questions Addressed

All original Master Prompt requirements are now mapped to specific implementation tasks. The plan preserves existing working code while adding the missing components.

**Ready to implement on approval.**
