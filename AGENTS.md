# AGENTS.md

> **Instructions for AI Agents**: Read this file completely before generating any code. Reference the linked guidelines and context files for design decisions.

---

## UI Guidelines (MUST READ)

When building this website, follow these three resources:

1. **[Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)** — Comprehensive UI/UX patterns for interactions, animations, layout, forms, performance, and design. Use `/web-interface-guidelines` command to review generated code.

2. **[/rams](https://rams.ai)** — Accessibility (WCAG 2.1) and visual polish audits. Use `/rams <filepath>` to review components for a11y issues, visual inconsistencies, and polish.

3. **[UI Skills](https://ui-skills.com)** — Opinionated constraints for agents:
   - MUST use accessible component primitives (Radix UI, React Aria, or Base UI)
   - MUST use existing components before creating new ones
   - NEVER mix primitive systems within the same interaction surface

---

## About Amp

**One-liner:** Amp is the fastest and most affordable way to get energy data from your building.

**Tagline Options:**
- "The fastest & smartest path to energy data from your buildings"
- "Think Smarter. Get Greener. Save Better."
- "Unlock Smart Energy Decisions"

**Problem We Solve:** Most buildings have almost no real visibility into where their energy is actually going. Waste, faults, and savings opportunities stay hidden in a single monthly utility bill. Amp turns low-resolution, meter-level data into real-time, equipment-level insight—so teams can finally see what each load is doing, quantify waste, and prioritize actions that deliver measurable savings and decarbonization.

**Mission:** The built environment plays a massive role in global GHG emissions, yet has the biggest data blind spot. By scaling energy data access, we empower businesses to tackle the climate challenges of the century and enable the next ecosystem of technology to address these problems through a robust data layer.

**Headquarters:** Floor 8, Tower 4, One Central, DWTC, Dubai, UAE

**Contact:** 
- Email: hello@ampenergy.ae
- Website: www.ampenergy.ae
- LinkedIn: linkedin.com/company/amp-ai/
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
The gateway device connecting all sensors to the cloud.
- Multi-meter gateway for commercial & industrial
- Size: 70×57×35mm, Weight: 165g
- Communications: WiFi, LAN, GSM, Bluetooth, ZigBee, NB-IOT
- Range: ~150m
- Accuracy: Class 0.5

### 2. Hardware: Energy Meters
Circuit-level monitoring devices.
- Up to 50A current, 120V–240V
- 12 CT ports per device
- Sample rate: 8,000 samples/sec
- Size: 10×10×3cm
- Din-rail mounting
- Measures: kWh, current, voltage, power, reactive energy, power factor, frequency

### 3. Integrator App
Mobile app for device activation and management.

### 4. Platform (AmpEnterprise)
Web-based analytics dashboard.
- Real-time data at 1-minute intervals
- Portfolio, building, and equipment-level views
- Building Energy Efficiency Rating (A-F scale with score)
- EUI benchmarking against industry standards
- Unlimited users with role-based access
- Alarms, anomaly detection, trend analysis
- Cross-building and cross-equipment comparison

### 5. Savings Engine
AI-powered recommendations module.
- Identifies savings opportunities (Schedule Change, Temperature Set Back, Power Factor Correction, etc.)
- Shows potential annual savings in $ and kWh
- Categorizes as "No Cost" or "Low Cost" actions

### 6. Monthly Energy Reports
PDF reports delivered via email.
- Equipment breakdown by consumption
- Power factor analysis
- Savings tracker with before/after visualization
- Standardized KPIs for progress tracking

### 7. Full API
- Documented REST API
- Integration with BI tools, CAFM, custom dashboards
- Enables ESG reporting platforms to access Scope 2 data

### Product Tiers
| Tier | Equipment | Scope | Analytics |
|------|-----------|-------|-----------|
| **PowerlinkGO** | Up to 12 | Single location | Premium Analytics, Recommendations |
| **Enterprise** | Unlimited | Portfolio-wide | Advanced Analytics, Project Recommendations |

---

## Key Differentiators

| Traditional Solutions | Amp |
|-----------------------|-----|
| Requires BMS integration | No BMS? No problem. |
| Only works in new/smart buildings | Works in buildings of any age |
| Needs third-party hardware | Our own hardware, fully integrated |
| Requires BMS operator contracts | No third-party dependencies |
| IT department friction | Own comms network, runs parallel |
| Building-level data only | Equipment-level data (breaker/circuit) |
| Data silos | Open API, your data works for you |
| Shutdown during install | Zero disruption installation |
| Long deployment cycles | Data online within 24 hours of integration |

---

## Social Proof

### Trusted By
- Chalhoub Group
- Amazon
- IKEA
- Buro Happold

### Key Stats
- **10–20%+** energy savings identified
- **ROI under 1 year** demonstrated
- **~0.2%** margin of error on data accuracy
- **1-minute** data sampling intervals
- **5+ year** device life expectancy
- **1-year** warranty on all devices

---

## Brand Voice

### Personality
Friendly and incredibly intelligent. Simple and straightforward in a world full of engineering jargon and over-engineered solutions. We're the straightforward, super smart friend you reach out to. Professional (B2B) but approachable.

**Think:** Apple, but for B2B energy.

### Tone Guidelines
- Clear and confident, never arrogant
- Technical accuracy without jargon overload
- Warm but professional
- Direct and actionable

### Words We Love
- Build, Ship, Create
- Visibility, Insight, Actionable
- Equipment-level, Real-time
- "No BMS? No problem."
- "Radically Simple, Astonishingly Powerful"

### Words We Avoid
- Revolutionary, Game-changing, World-class, Cutting-edge
- Any hyperbolic marketing fluff
- Unnecessary technical jargon
- Ambiguous claims without substance

---

## Team

### Tariq — CEO & Founder
Building the data layer for the built environment. Obsessed with making energy visible.

### Darko — CTO & Co-founder
Engineering simplicity into complex systems. Making plug & play actually mean plug & play.

### Ali — Head of IoT
Designing hardware that installs in minutes and runs for years.

---

## Site Structure

### Pages
1. **Home** — Hero, value prop, key differentiators, social proof, CTA
2. **Product** — Hardware + Platform deep dive, tier comparison
3. **About** — Team, mission, origin story
4. **Blog** — Insights, case studies, energy management content
5. **Contact Us** — Demo booking form, contact info

### Primary CTA
**Book a Demo** — Links to: calendly.com/tariq-amp/intro-call

### Secondary CTAs
- Learn More (product details)
- Talk to Us
- Contact

---

## Design System

### Brand Assets Location
```
context/brand/
├── logos/
│   ├── Logo_AMP.png              (full logo, light backgrounds)
│   ├── AMP_LOGO_WHITE.png        (full logo, dark backgrounds)
│   ├── Favicon_*.png             (app icon, light backgrounds)
│   └── Amp_Logo_Favicon_White.png (app icon, dark backgrounds)
└── colors.md                     (color palette reference)
```

### Colors (see context/brand/colors.md)
- **Primary Teal:** `#1DB9A0`
- **Dark Teal:** `#0D5C63`
- **Light Mint:** `#B8E8DC`
- **Bright Blue:** `#0066FF`

### Typography
- Use system font stack or a clean sans-serif (Inter, Geist)
- Headings: Bold/Semibold
- Body: Regular, good line height for readability

### Visual Direction
- Clean, minimal, modern
- High contrast for readability
- Generous whitespace
- Data visualizations: clear, not cluttered
- Photography: real buildings, real hardware (avoid stock when possible)

---

## Technical Requirements

### Accessibility
- WCAG 2.1 AA compliance minimum
- Keyboard navigation throughout
- Proper focus management
- Semantic HTML structure
- Skip links for navigation
- Alt text for all images
- ARIA labels for icon-only buttons

### Components
- Use Radix UI primitives for interactive elements
- Consistent spacing scale (4px base)
- Mobile-first responsive design
- Touch targets ≥44px on mobile

### Performance
- Lazy load images below the fold
- Preload critical fonts
- Optimize images (WebP with fallbacks)
- Minimize JavaScript bundle

---

## Content Guidelines

### Headlines
- Lead with the benefit or outcome
- Keep it short and punchy
- Title Case for headings

### Body Copy
- Short paragraphs (2-3 sentences max)
- Active voice always
- Second person ("you" not "we" when addressing the reader)

### CTAs
- Action-oriented: "Book a Demo" not "Submit"
- Clear outcome: "See Your Building's Data" not "Learn More"

---

## Example Messaging

### Hero Headlines
- "See Where Your Energy Actually Goes"
- "Equipment-Level Energy Data. No BMS Required."
- "The Fastest Path to Energy Visibility"

### Value Props
1. **Plug & Play Hardware** — Install in hours, not months. No shutdown required.
2. **Equipment-Level Insight** — See every load, not just the meter.
3. **No BMS Needed** — Works with buildings of any age or system.
4. **Open Data** — API access for ESG reporting and beyond.

### Objection Handlers
| Objection | Response |
|-----------|----------|
| "Our building is old" | Works with buildings of any age. |
| "We don't have a BMS" | You don't need one. |
| "IT won't approve new network devices" | Runs on our own parallel network. |
| "Installation will disrupt operations" | Zero shutdown required. |

---

## FAQ Content

**How do I know if Amp is for me?**
Every building, irrespective of its age or design, can benefit from smarter energy management. If you're aiming for net-zero, Amp provides intricate insights and actionable steps. Even without net-zero goals, Amp helps optimize utility bills and enhance operational efficiency.

**Do I need BMS or BAS?**
Not at all. Amp was designed with no prerequisite systems or software.

**How much can I expect to save?**
On average, we identify 5% to 20% of energy waste on customers' annual consumption.

**How accurate is the data?**
Incredibly precise, with ~0.2% margin of error.

**How long does installation take?**
Data is available online within 24 hours of integration.

---

## Reference Documents
- `context/product/Amp_-_One_Pager.pdf` — Quick overview
- `context/product/Amp_-_Product_Overview_2_1.pdf` — Detailed product info
- `context/product/Integration_Overview.pptx` — Technical integration details

---

## Current Site Reference
- URL: https://ampenergy.ae (Framer)
- Note: The new site should significantly improve on design quality, accessibility, and visual polish while maintaining the same core messaging.
