**Mend Platform - Development Plan**

**Vision**
A unified device insurance platform that empowers local repair shops ("Average Joes") to act as instant claims centers, transforming them from "waiting for a break" into portfolio builders with recurring passive income.

**Phase 1: Foundation - Database & Authentication**

**1.1 Multi-Role Authentication System**

* **User Registration & Login:** Professional-styled auth pages with email/password.
* **Role-Based Access:** Three distinct portals (Customer, Shop, Admin).
* **Shop Onboarding Flow:** Tiered certification application (Basic → Advanced → Expert) with admin approval workflow.

**1.2 Core Database Schema**

* **Profiles:** User identity linked to their role.
* **Shops:** Partner details, certification tier, Stripe Connect ID, wallet balance.
* **Devices:** Serial ID, device type (7 categories: Smartphone, Tablet, Laptop, Console, Wearable, Drone, Audio), tier (1-4), health history.
* **Policies:** Status tracking, linked device(s), referral source per device, monthly premium.
* **Claims:** Triage status, repair type, photo evidence, Digital Handshake verification.
* **Financial Ledgers:**
* *Subscriptions ledger* for recurring 15% commissions.
* *Claims payout ledger* for instant repair payments.



**Phase 2: Customer Experience**

**2.1 Policy Purchase Flow**

* **Device Selector:** Visual grid for choosing device type (Phone, Laptop, Console, etc.) and specific Model (e.g., "iPhone 14 Pro").
* **Automated Tier Assignment:** System automatically maps the selected Model to the correct Price Tier (1-4) and Deductible. **Crucial:** Users cannot manually select a cheaper tier; pricing is hard-coded to the device value.
* **Serial Registration:** Enter device serial number during signup.
* **Bundle Support:** Add multiple devices to a single account.

**2.2 Policy Portal Dashboard**

* **Active Coverage View:** See all protected devices with their health status.
* **Device Health History:** Timeline of diagnostics and repairs.
* **Claim Filing:** Initiate new claims with issue description.

**2.3 Claim Triage Flow**

* **Step-by-Step Questionnaire:** Guide customer through damage assessment.
* **Automatic Routing:** Determine if repair is Local (nearby shop) or Mail-In (Hub).
* **Shop Finder:** Show nearest certified shop based on repair type needed.

**Phase 3: Shop Partner Dashboard**

**3.1 Onboarding & Certification**

* **Application Form:** Shop details, capabilities, repair specializations.
* **Tier Assignment:** Based on certifications and equipment (Basic/Advanced/Expert).
* **Stripe Connect Setup:** Link bank account for receiving payouts.

**3.2 Diagnostic Tools**

* **10-Point Health Check Form:** Standardized diagnostic workflow.
* **Photo Evidence Capture:** Upload images of device condition.
* **OCR Serial Scanner:** Camera-first component to auto-capture IMEI/Serial numbers to prevent "fat finger" typos. Manual entry available only as a fallback.

**3.3 Claims Workstation**

* **Incoming Claims Queue:** View claims routed to the shop.
* **Claim Handshake Process:**
* Customer presents device.
* Shop **scans** serial number via OCR/Camera.
* System matches against original underwriting serial.
* Photo proof uploaded.
* Repair authorization granted.


* **Post-Repair Diagnostic:** Submit completion proof to trigger instant payout.

**3.4 Revenue & Portfolio View**

* **Passive Income Dashboard:** Track monthly recurring commission (15% of premiums).
* **Projected ARR Calculator:** Annual revenue based on active policies.
* **Payout History:** View all Stripe transfers received.
* **Active Policies Count:** Real-time portfolio size.

**Phase 4: Mend Admin Operations**

**4.1 Partner Management**

* **Shop Application Queue:** Review and approve new shop applications.
* **Tier Management:** Upgrade/downgrade shop certifications.
* **Commission Rate Controls:** Set percentage splits by tier.
* **Performance Metrics:** Track shop claim completion rates.

**4.2 Claims Oversight**

* **Global Claims Dashboard:** View all active claims across network.
* **Fraud Detection Flags:** Highlight serial mismatches or suspicious patterns.
* **Escalation Queue:** Claims requiring manual review.

**4.3 Financial Operations**

* **Webhook Integration:** Handle Stripe payment events for automated commission crediting.
* **Batch Payout Processing:** Trigger monthly commission distributions.
* **Revenue Analytics:** Platform-wide financial reporting.

**4.4 Hub Logistics (Phase 4+)**

* **Mail-In Label Generation:** UPS/FedEx API integration for complex repairs.
* **Hub Tracking Dashboard:** Track devices in transit to repair hub.

**The "Digital Handshake" Security Flow**
This is the core fraud prevention mechanism:

1. **At Policy Creation:** Device serial is captured and linked to policy record.
2. **At Claim Filing:** Customer describes issue, system generates claim ticket.
3. **At Shop Verification:**
* Shop scans device serial (OCR Priority).
* Shop uploads photo of device/serial label.
* System compares entered serial against original policy serial.
* *Match* = Claim Authorized → Repair can proceed.
* *Mismatch* = Claim Flagged → Escalated to Admin for review.


4. **At Claim Completion:** Post-repair diagnostic + photo submitted → Triggers instant Stripe payout.

**Design Approach**

* **Professional & Trustworthy Aesthetic:** Clean, minimal layouts with strategic use of blues and neutral tones.
* **Trust signals throughout:** Security badges, verification confirmations.
* **Data-focused dashboards:** Clear typography.
* **Mobile-responsive:** Optimized for shops using tablets at the counter.
* **Consistent visual language:** Across all three portals.

**Technical Architecture**

* **Frontend:** React with TypeScript, Tailwind CSS, Shadcn/UI components.
* **Backend:** Supabase (Database, Auth, Edge Functions, Storage for photos).
* **Payments:** Stripe Connect for shop payouts, Stripe Billing for customer subscriptions.
* **File Storage:** Supabase Storage for device photos and documentation.

**MVP Delivery Sequence**
Since we're building a "Full Thin Slice" - here's the order of implementation:

1. **Database & Auth** → Core schema + multi-role login.
2. **Customer Policy Purchase** → Device selection (auto-tiering) + serial registration + checkout.
3. **Shop Claim Workstation** → Digital Handshake (OCR) + diagnostic form.
4. **Admin Approval Flow** → Shop onboarding + claim oversight.
5. **Stripe Integration** → Subscription billing + Connect payouts.
6. **Dashboard Polish** → Revenue tracking + portfolio views.

This gives us a complete circuit: Customer buys protection → Files claim → Shop verifies & repairs → Gets paid → Admin oversees everything.