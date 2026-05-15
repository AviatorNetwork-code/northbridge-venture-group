# Northbridge Venture Group — Launch Checklist

Use this checklist before going live at **northbridgeventuregroup.com**.

---

## 1. Branding

| Item | Check |
|------|-------|
| Final logo and wordmark installed | ☐ |
| Color palette applied (Black / White / #B11226) | ☐ |
| Typography consistent across pages | ☐ |
| Spacing and layout verified on desktop | ☐ |
| Spacing and layout verified on mobile | ☐ |

**Note:** The site is built with Tailwind using `northbridge-black`, `northbridge-white`, and `northbridge-red` (#B11226). Logo/wordmark go in the Header and optionally the footer.

---

## 2. Metadata

Global metadata is in **`app/layout.tsx`**. Per-page metadata is exported from each page under `app/`.

| Page | Check |
|------|-------|
| Home | ☐ |
| About | ☐ |
| Ventures | ☐ |
| Services | ☐ |
| Partner With Us | ☐ |
| Clients | ☐ |
| Contact | ☐ |

### Open Graph

| Item | Check |
|------|-------|
| OG preview works (dynamic image from `app/opengraph-image.tsx`) | ☐ |
| Optional: Replace with static **`/public/og-image.png`** (1200×630) when final asset is ready | ☐ |
| Social share preview tested (e.g. Facebook, LinkedIn, Twitter) | ☐ |

---

## 3. Portfolio Links

| Item | Check |
|------|-------|
| Aviator Network → https://aviatornetwork.com | ☐ |
| AirTax Financial → https://airtaxfinancial.com | ☐ |

### Client vs Venture Separation

| Company | Placement |
|---------|-----------|
| Aviator Network | **Venture** (listed on Home + Ventures only) |
| AirTax Financial | **Venture** (listed on Home + Ventures only) |
| Royal International Flight School | **Client only** (listed on Clients page only) |

**Confirm:** Royal International Flight School does **not** appear under **Ventures**.

---

## 4. Contact Information

| Item | Check |
|------|-------|
| Email visible: **contact@northbridgeventuregroup.com** | ☐ |
| Email link opens mail client | ☐ |
| Additional contact emails verified (if any) | ☐ |
| Contact form submits successfully | ☐ |
| Form submission arrives in inbox | ☐ |

**Form delivery:** The contact form POSTs to **`/api/contact`**. To have submissions arrive in your inbox, wire that route to an email provider (e.g. Resend, SendGrid). See `app/api/contact/route.ts` for the TODO.

---

## 5. Domain & Hosting Readiness

| Item | Check |
|------|-------|
| Domain connected in Vercel | ☐ |
| DNS records configured correctly | ☐ |
| HTTPS certificate active | ☐ |
| Root domain loads | ☐ |
| www redirects properly | ☐ |

**Test:**

- **northbridgeventuregroup.com** — loads
- **www.northbridgeventuregroup.com** — redirects or loads as expected

---

## 6. Placeholder Assets

Replace temporary assets before launch.

| Asset | Status |
|-------|--------|
| **favicon.ico** replaced with branded favicon | ☐ |
| **og-image** — dynamic OG from code; optionally replace with final **`/public/og-image.png`** | ☐ |
| Placeholder text removed | ☐ |
| "Coming soon" placeholders removed | ☐ |

---

## 7. Final Pre-Launch Test

Run through the full user path:

1. Visit homepage  
2. Navigate to **Ventures**  
3. Open **Aviator Network** (external link)  
4. Return to site  
5. Navigate to **Services**  
6. Navigate to **Partner With Us**  
7. Navigate to **Clients**  
8. Navigate to **Contact**  
9. Send a contact message  

All pages must load without layout breaks.

---

## Launch Criteria

Site is ready to launch when:

- Branding is consistent  
- Metadata and OG previews work  
- Portfolio links are correct (Aviator Network, AirTax Financial; Royal only on Clients)  
- Contact method works (email + form)  
- Domain and HTTPS are verified  
- Placeholder assets removed or finalized  
