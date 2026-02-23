# SEO Fix Prompt for Claude Code

> **Context:** We just ran a Semrush site audit on ampenergy.ae (Next.js App Router, deployed on Vercel). The audit found several errors and warnings that need fixing. Our site has 4 main pages: `/`, `/product`, `/about`, `/contact`. The product page has a `?tab=hub` query parameter variant that shows hardware content.

---

## TASK 1: Fix Duplicate Title / Meta Description / Content on Product Page

**Problem:** `/product` and `/product?tab=hub` have identical titles, meta descriptions, and content. Semrush flags this as 3 separate errors (duplicate titles, duplicate meta descriptions, duplicate content).

**Fix:** Add a canonical link tag to the product page so all query parameter variants resolve to the base URL.

In `src/app/product/layout.tsx` (or wherever the product page metadata is defined), add:

```typescript
alternates: {
  canonical: 'https://www.ampenergy.ae/product',
},
```

This should be added inside the exported `metadata` object alongside the existing `title`, `description`, `openGraph`, and `twitter` fields.

Also verify: check if there's a global canonical strategy in `src/app/layout.tsx`. If not, add `metadataBase: new URL('https://www.ampenergy.ae')` to the root layout metadata if it's not already there, so all relative canonical URLs resolve correctly.

---

## TASK 2: Fix Long Title Elements

**Problem:** Some page titles exceed Google's ~60 character display limit. The root layout uses `template: "%s | Amp"` which appends "| Amp" to all child page titles. Some child titles already contain "Amp", creating redundancy and extra length.

**Fix:** Update the following page titles (these are the values BEFORE the template appends "| Amp"):

- **About page** (`src/app/about/layout.tsx`):
  - Current: `"About Amp | Dubai-Based Building Energy Intelligence Company"`
  - Change to: `"About Us | Dubai-Based Building Energy Intelligence"`
  - Renders as: "About Us | Dubai-Based Building Energy Intelligence | Amp"

- **Contact page** (`src/app/contact/layout.tsx`):
  - Current: `"Contact Amp | Book a Demo for Building Energy Monitoring in Dubai"`
  - Change to: `"Contact Us | Book a Building Energy Monitoring Demo"`
  - Renders as: "Contact Us | Book a Building Energy Monitoring Demo | Amp"

- **Product page** (`src/app/product/layout.tsx`):
  - Check if the current title is too long after "| Amp" is appended. If it exceeds 60 characters, shorten to:
  - `"Energy Monitoring Platform & Hardware | Circuit-Level Analytics"`
  - Renders as: "Energy Monitoring Platform & Hardware | Circuit-Level Analytics | Amp"

Also update the corresponding `openGraph.title` and `twitter.title` fields to match the new titles (without the "| Amp" suffix — OG/Twitter titles should be standalone).

---

## TASK 3: Fix robots.txt — Unblock Internal Resources

**Problem:** 108 internal resources (CSS, JS, images) are blocked by robots.txt. This prevents search engines from rendering pages properly and hurts indexing.

**Fix:** Find the robots.txt file. It's likely in one of these locations:
- `public/robots.txt`
- `src/app/robots.ts` (Next.js generated)
- `src/app/robots.txt`

**Read the current file first**, then replace it with the following:

```
# robots.txt for ampenergy.ae

User-agent: *
Allow: /

# Block only non-public paths
Disallow: /api/
Disallow: /_next/data/

# Allow all static assets (CSS, JS, images) to be crawled
Allow: /_next/static/
Allow: /images/

# Sitemap
Sitemap: https://www.ampenergy.ae/sitemap.xml
```

**Important:** 
- Do NOT block `/_next/static/` — this contains CSS and JS that crawlers need to render your pages.
- Do NOT use broad `Disallow: /_next/` rules — this blocks critical rendering resources.
- If the current robots.txt has a `Disallow: /_next/` rule, that's almost certainly the cause of the 108 blocked resources. Remove it.

If using a `robots.ts` file (Next.js metadata API), replace with:

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/data/'],
      },
    ],
    sitemap: 'https://www.ampenergy.ae/sitemap.xml',
  }
}
```

---

## TASK 4: Create llms.txt File

**Problem:** Semrush flags "llms.txt not found" as an AI Search issue. This file helps AI search engines (ChatGPT, Google AI Mode, Gemini, Perplexity) understand your site and cite it in AI-generated answers. Your current AI Visibility score is 14/100.

**Fix:** Create a new file at `public/llms.txt` with the following content:

```
# Amp Energy (ampenergy.ae)

## About
Amp is a building energy intelligence platform based in Dubai, UAE. We provide equipment-level energy monitoring for commercial buildings using plug-and-play IoT hardware and an AI-powered analytics platform. No building management system (BMS) is required. Buildings get live energy data within 24 hours of installation.

## Key Facts
- Founded: 2021
- Headquarters: Floor 8, Tower 4, One Central, DWTC, Dubai, UAE
- Industry: Building Energy Management, IoT, Energy Efficiency
- Customers include: Amazon, IKEA, Chalhoub Group, Masdar, Buro Happold, FAM House of Recycling, Musanadah

## What We Do
Amp installs non-invasive hardware on existing electrical panels to monitor energy consumption at the circuit and equipment level. Our cloud platform provides:
- Real-time equipment-level energy monitoring (chillers, pumps, lighting, etc.)
- AI-powered energy savings recommendations
- Building energy efficiency ratings (A-F grade)
- Automated monthly energy reports
- Real-time alerts for abnormal equipment behavior
- Full API access for integration with BI, facilities management, and ESG reporting tools

## Key Differentiators
- No BMS or pre-existing building systems required
- Plug-and-play installation in hours, not weeks
- Live data within 24 hours
- Works with any building regardless of age or infrastructure
- 10-20% energy savings typically identified
- Less than 1 year typical payback period
- 0.2% margin of error on measurements

## Products
- **Amp Platform**: Cloud-based energy analytics dashboard with AI recommendations
- **Amp Hub**: Hardware device that mounts on existing electrical panels

## Pages
- Homepage: https://www.ampenergy.ae/
- Product: https://www.ampenergy.ae/product
- About: https://www.ampenergy.ae/about
- Contact: https://www.ampenergy.ae/contact

## Contact
- Email: hello@ampenergy.ae
- Demo: https://calendly.com/tariq-amp/intro-call
```

---

## TASK 5: Verify Sitemap Exists

**Check** if a sitemap exists at `public/sitemap.xml` or `src/app/sitemap.ts`. 

If no sitemap exists, create one at `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.ampenergy.ae'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/product`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
```

---

## TASK 6: Add Canonical Tags to All Pages

**Problem:** Without canonical tags, query parameter variants and trailing slash variants can create duplicate content.

**Fix:** Add canonical URLs to every page's metadata. Since we should have `metadataBase` set in the root layout (Task 1), add `alternates.canonical` to each page:

- **Root layout** (`src/app/layout.tsx`): Ensure `metadataBase: new URL('https://www.ampenergy.ae')` is set
- **Homepage**: `alternates: { canonical: '/' }`
- **Product**: `alternates: { canonical: '/product' }` (already done in Task 1)
- **About**: `alternates: { canonical: '/about' }`
- **Contact**: `alternates: { canonical: '/contact' }`

---

## VERIFICATION

After making all changes, run:

```bash
npm run build
```

Confirm no build errors. Then verify locally:

```bash
npm run start
# In another terminal:
curl -s http://localhost:3000 | grep -E "<title>|canonical|robots"
curl -s http://localhost:3000/product | grep -E "<title>|canonical|robots"
curl -s http://localhost:3000/about | grep -E "<title>|canonical|robots"
curl -s http://localhost:3000/contact | grep -E "<title>|canonical|robots"
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/llms.txt
curl -s http://localhost:3000/sitemap.xml
```

Confirm:
1. Each page has a unique `<title>` — no two pages share the same title
2. Each page has a `<link rel="canonical" ...>` tag pointing to the correct URL
3. No title exceeds ~60 characters
4. robots.txt does NOT block `/_next/static/` or image paths
5. llms.txt returns the full content
6. sitemap.xml lists all pages

---

## DEPLOY

Once verified:

```bash
git add -A
git commit -m "fix: SEO improvements - canonical tags, unique titles, robots.txt, llms.txt, sitemap"
git push
```

Vercel will auto-deploy from the push. After deploy, verify production:

```bash
curl -s https://www.ampenergy.ae/robots.txt
curl -s https://www.ampenergy.ae/llms.txt
curl -s https://www.ampenergy.ae/sitemap.xml
```
