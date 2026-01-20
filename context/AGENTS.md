# AGENTS.md

> **Instructions for AI Agents**: Read this file completely before generating any code. Reference the linked context files for design decisions.

---

## UI Guidelines (MUST FOLLOW)

When building this website, follow these three resources:

1. **[Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)** — Comprehensive UI/UX patterns for interactions, animations, layout, forms, performance, and design.

2. **[/rams](https://rams.ai)** — Accessibility (WCAG 2.1) and visual polish audits. Use `/rams <filepath>` to review components.

3. **[UI Skills](https://ui-skills.com)** — Opinionated constraints:
   - MUST use accessible component primitives (Radix UI, React Aria, or Base UI)
   - MUST use existing components before creating new ones
   - NEVER mix primitive systems within the same interaction surface

---

## About Amp

**One-liner:** Amp is the fastest and most affordable way to get energy data from your building.

**Problem We Solve:** Most buildings have almost no real visibility into where their energy is actually going. Waste, faults, and savings opportunities stay hidden in a single monthly utility bill. Amp turns low-resolution, meter-level data into real-time, equipment-level insight—so teams can finally see what each load is doing, quantify waste, and prioritize actions that deliver measurable savings and decarbonization.

**Mission:** The built environment plays a massive role in global GHG emissions, yet has the biggest data blind spot. By scaling energy data access, we empower businesses to tackle the climate challenges of the century.

**Headquarters:** Floor 8, Tower 4, One Central, DWTC, Dubai, UAE

**Contact:** 
- Email: hello@ampenergy.ae
- Website: www.ampenergy.ae
- Demo booking: calendly.com/tariq-amp/intro-call

---

## Target Audience

### Industries
- Commercial real estate
- Hospitality (hotels, resorts)
- Retail (stores, malls)
- Office buildings
- Supermarkets & hypermarkets
- Education (schools, universities)

### Users
- **Primary:** Facility management teams, energy managers
- **Secondary:** Sustainability teams, third-party ESCOs

---

## Products & Features

### 1. Hardware: Amp Hub
Gateway device connecting all sensors to the cloud.
- Communications: WiFi, LAN, GSM, Bluetooth, ZigBee, NB-IOT
- Range: ~150m
- Accuracy: Class 0.5

### 2. Hardware: Energy Meters
Circuit-level monitoring devices.
- 12 CT ports per device
- Sample rate: 8,000 samples/sec
- Measures: kWh, current, voltage, power, power factor, frequency

### 3. Platform (AmpEnterprise)
Web-based analytics dashboard.
- Real-time data at 1-minute intervals
- Portfolio, building, and equipment-level views
- Building Energy Efficiency Rating (A-F scale)
- Alarms, anomaly detection, trend analysis

### 4. Savings Engine
AI-powered recommendations showing potential savings in $ and kWh.

### 5. Monthly Energy Reports
PDF reports with equipment breakdowns and savings tracking.

### 6. Full API
Open data access for BI tools, CAFM, ESG platforms.

---

## Key Differentiators

| Traditional Solutions | Amp |
|-----------------------|-----|
| Requires BMS integration | No BMS? No problem. |
| Only works in new buildings | Works in buildings of any age |
| Needs third-party hardware | Fully integrated solution |
| IT department friction | Own comms network |
| Building-level data only | Equipment-level data |
| Data silos | Open API |
| Shutdown during install | Zero disruption |

---

## Social Proof

**Trusted By:** Chalhoub Group, Amazon, IKEA, Buro Happold

**Key Stats:**
- 10–20%+ energy savings identified
- ROI under 1 year
- ~0.2% margin of error
- 1-minute data sampling
- 5+ year device lifespan

---

## Brand Voice

### Personality
Friendly and incredibly intelligent. Simple and straightforward in a world full of engineering jargon. Professional (B2B) but approachable. **Think:** Apple, but for B2B energy.

### Words We Love
- Build, Ship, Create
- Visibility, Insight, Actionable
- "No BMS? No problem."
- "Radically Simple, Astonishingly Powerful"

### Words We Avoid
- Revolutionary, Game-changing, World-class, Cutting-edge
- Marketing fluff, unnecessary jargon

---

## Team

**Tariq — CEO & Founder**
Building the data layer for the built environment.

**Darko — CTO & Co-founder**
Engineering simplicity into complex systems.

**Ali — Head of IoT**
Designing hardware that installs in minutes and runs for years.

---

## Site Structure

### Pages
1. **Home** — Hero, value props, differentiators, social proof, CTA
2. **Product** — Hardware + Platform deep dive, pricing tiers
3. **About** — Team, mission, origin story
4. **Blog** — Insights and case studies
5. **Contact** — Demo booking (Calendly), contact form

### Primary CTA
**Book a Demo** → calendly.com/tariq-amp/intro-call

---

## Design System

### Colors (see context/brand/colors.md)
- Primary Teal: `#1DB9A0`
- Dark Teal: `#0D5C63`
- Light Mint: `#B8E8DC`
- Bright Blue: `#0066FF`

### Typography (see context/brand/typography.md)
- Font: Inter or Geist
- Display: 64px/700
- H1: 48px/700
- Body: 16px/400

### Components
- Use Radix UI for interactive elements
- 4px spacing base
- Mobile-first responsive design
- Touch targets ≥44px

---

## Technical Requirements

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation throughout
- Semantic HTML
- ARIA labels for icon-only buttons

### Performance
- Lazy load below-fold images
- Optimize images (WebP)
- Preload critical fonts

---

## Content Reference

See `context/messaging/boilerplate.md` for:
- Hero copy options
- Feature descriptions
- Value propositions
- Social proof statements
- FAQ content
- CTA copy
