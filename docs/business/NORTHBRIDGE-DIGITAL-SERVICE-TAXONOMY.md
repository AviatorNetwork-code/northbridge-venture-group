# Northbridge Digital — Service Taxonomy

**Status:** Active  
**Source of truth:** `lib/digital-solutions.ts`, `lib/digital-assessment.ts` (`getRecommendedSolution`)

---

## Positioning

**Customer-facing core message:**

> Northbridge Digital helps businesses replace operational complexity with intelligent systems.

Northbridge Digital is the **client services division** of Northbridge Venture Group. It is **not** a venture. It appears under **Services** (`/services`) and the Digital microsite (`/digital`), never under Ventures.

---

## Information Architecture

| Nav label | Meaning | Routes |
|-----------|---------|--------|
| Ventures | Owned products (Aviator Network, Quadrix, AirTax Financial, Future Ventures) | `/ventures` |
| Services | Northbridge Digital offerings | `/services` → `/digital`, `/digital/assessment` |
| Clients | Organizations served | `/clients` |
| Contact | Inquiries and strategy calls | `/contact` |

**Ventures data:** `lib/ventures.ts`  
**Service categories:** `lib/digital-solutions.ts`

---

## Customer Entry Categories

These are the six solution categories shown on `/services` and `/digital`. Each maps to a `need` query param for the assessment.

| Customer language (`digitalSolutions.title`) | `need` value | Assessment label (`MAIN_NEED_OPTIONS`) |
|---------------------------------------------|--------------|----------------------------------------|
| I need more customers | `more-customers` | I need more customers |
| I need to improve operations | `improve-operations` | I need to improve operations |
| I need better visibility | `better-visibility` | I need better visibility |
| I need custom software | `custom-software` | I need custom software |
| I'm starting my business | `starting-business` | I'm starting my business |
| I'm not sure | `not-sure` | I'm not sure |

---

## Recommended Solutions (Internal / Post-Assessment)

After assessment submission, `getRecommendedSolution()` returns exactly one of:

| `mainNeed` value | Recommended solution |
|------------------|----------------------|
| `starting-business` | Launch System |
| `more-customers` | Customer Acquisition System |
| `improve-operations` | Operations & Automation |
| `better-visibility` | Business Intelligence |
| `custom-software` | Custom Software |
| `not-sure` (default) | Business Systems Review |

Recommendation is driven **only** by `mainNeed`, not by score. Score affects lead category and follow-up priority, not solution taxonomy.

---

## Solution Definitions

### Launch System
For pre-launch and early-stage businesses needing positioning, lead infrastructure, and foundational digital systems.

### Customer Acquisition System
Lead capture, conversion paths, SEO/local growth architecture, and pipeline systems for organizations that need more customers.

### Operations & Automation
Workflow design, integrations, and automation to reduce repetitive manual work and operational friction.

### Business Intelligence
Reporting, dashboards, and visibility into performance, bottlenecks, and financial/operational clarity.

### Custom Software
Purpose-built web platforms and internal tools when off-the-shelf products do not fit how the business operates.

### Business Systems Review
Structured diagnostic when the prospect is unsure of priority — reviews stack, gaps, and next-step options before scoping a specific system.

---

## Customer-Facing vs Internal Language

| Context | Use | Avoid |
|---------|-----|-------|
| Website, assessment UI, success state | Solution category names (e.g. "Customer Acquisition System"), "recommended focus", "review your responses" | Lead score, Hot/Qualified/Nurture/Low Fit labels, dollar quotes, proposal language |
| Slack, CRM, internal playbooks | Lead category, numeric score, pain/system diagnostics, suggested call opening | Promising specific pricing or delivery dates without human review |
| Ventures pages | Owned product names only | Northbridge Digital as a venture |

### Diagnostic fields (internal tone)

These fields support qualification and call prep; they are not marketed as product SKUs on the public site:

- **Business stage** — idea, launching, growing, established
- **Current systems** — CRM gaps, spreadsheets, disconnected tools, etc.
- **Pain points** — lead follow-up, manual work, visibility, tool sprawl, etc.
- **Budget / timeline / authority** — qualification signals, not customer-facing offers

---

## Primary CTAs

| CTA | Target | Used on |
|-----|--------|---------|
| Start Business Assessment | `/digital/assessment` | `/services`, `/digital`, home services section |
| Explore Northbridge Digital | `/digital` | `/services` |
| Book Strategy Call | `/contact` | `/digital`, assessment success (qualified leads) |

---

## Related Documents

- `NBS-201-DIGITAL-ASSESSMENT-STANDARD.md`
- `LEAD-QUALIFICATION-RULES.md`
- `CALL-OPENING-PLAYBOOK.md`
