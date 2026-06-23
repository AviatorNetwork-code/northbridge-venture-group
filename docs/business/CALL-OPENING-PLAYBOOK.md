# Call Opening Playbook

**Status:** Active  
**Audience:** Northbridge Digital sales and delivery — internal use only  
**Source of truth:** `buildSuggestedCallOpening()` in `lib/digital-assessment.ts`

Suggested openings are included in Slack assessment notifications. They are **starting points for humans**, not scripts to send automatically. AI may rephrase for tone; a human must review before any client-facing message.

---

## Default Template (Code-Generated)

`buildSuggestedCallOpening(payload)` produces:

> Hi **[Name]**, I reviewed your assessment. It looks like **[Company]** is mainly dealing with **[primary pain or main need]**. I'd like to understand how that currently works and where the biggest delay or lost opportunity happens.

**Primary pain priority:** First selected pain point label (lowercased). If no pain points, falls back to main need label (lowercased).

---

## Rules by Lead Category

### Hot Lead (80+)

**Goal:** Book a strategy call within 24–48 hours.

**Tone:** Direct, confident, time-aware. Acknowledge urgency signals (ASAP timeline, owner/founder, strong budget).

**Opening example:**

> Hi [Name], I reviewed your assessment for [Company]. You're looking at [recommended solution] with a [timeline] timeline — that lines up with what we're seeing on [primary pain]. I'd like 20 minutes to map how leads and operations flow today and where the biggest gap is. Does [day] or [day] work?

**Do:** Reference recommended solution and one concrete pain. Propose specific times.  
**Don't:** Quote price, promise delivery dates, or send a proposal before the call.

---

### Qualified Lead (55–79)

**Goal:** Schedule discovery call; confirm authority and budget in conversation.

**Tone:** Professional, consultative. Validate fit without overselling.

**Opening example:**

> Hi [Name], thanks for completing the Northbridge assessment. Based on your responses, [Company] would likely benefit from a [recommended solution] focus — especially around [primary pain]. I'd like to understand your current setup and whether this is the right priority for you right now. Are you open to a short strategy call this week?

**Do:** Use recommended solution as a hypothesis, not a commitment.  
**Don't:** Share lead score or internal category labels with the prospect.

---

### Nurture Lead (30–54)

**Goal:** Educate, clarify scope, or re-engage when timing/budget improves.

**Tone:** Helpful, patient. No pressure for immediate call unless they re-engage.

**Opening example:**

> Hi [Name], I reviewed your assessment for [Company]. It sounds like you're still shaping priorities around [primary pain or main need]. When you're ready to dig into systems and next steps, we're happy to walk through a structured review — no obligation. I'll follow up with a brief summary of what stood out from your responses.

**Do:** Offer value (summary, resource, case study link). Leave door open.  
**Don't:** Push strategy call aggressively; don't mention low fit or budget penalties.

---

### Low Fit (under 30)

**Goal:** Polite closure or long-term nurture; protect team capacity.

**Tone:** Respectful, brief. No hard sell.

**Opening example:**

> Hi [Name], thank you for sharing context about [Company]. Based on what you described, a full Northbridge Digital engagement may not be the best match right now — but I've noted your interest in [main need]. If your timeline or budget changes, feel free to reach out or retake the assessment. Wishing you a strong [quarter/season].

**Do:** Be honest without citing score or "low fit" label. Point to `/digital` or assessment if situation changes.  
**Don't:** Send proposals, discounts to force fit, or CC multiple stakeholders without consent.

---

## Openings by Recommended Solution

Use after category-appropriate intro. Tie discovery questions to the solution hypothesis.

| Recommended solution | Discovery angle |
|---------------------|-----------------|
| **Launch System** | "What does launch look like in the next 90 days, and what must be in place on day one?" |
| **Customer Acquisition System** | "Walk me through how a lead finds you today and what happens before they become a customer." |
| **Operations & Automation** | "Which tasks does your team repeat every week that feel like they should be automatic?" |
| **Business Intelligence** | "What numbers do you wish you had every Monday morning that you don't have today?" |
| **Custom Software** | "What does your team do in spreadsheets or workarounds that software should handle?" |
| **Business Systems Review** | "If you could fix one system first, which would remove the most friction?" |

---

## Language Guidelines

### Use (customer-facing)

- "Reviewed your assessment"
- "Recommended focus" / solution category name
- "Understand how things work today"
- "Biggest delay or lost opportunity"
- "Strategy call" / "structured review"

### Avoid (customer-facing)

- Lead score, Hot/Qualified/Nurture/Low Fit
- "You qualified" / "You didn't qualify"
- Dollar amounts, line-item pricing, "proposal attached"
- Guarantees on ROI, timeline, or deliverables

### Internal (Slack / CRM only)

- Full score and category
- Budget, timeline, authority selections
- All pain points and systems gaps
- Code-generated `suggestedCallOpening` string

---

## AI Usage Boundary

| Permitted | Not permitted |
|-----------|---------------|
| Rephrase opening for tone/clarity | Change lead category or score |
| Summarize multi-field assessment for rep prep | Auto-send email/SMS to prospect |
| Draft follow-up bullets for human approval | Generate or attach pricing quotes |

**All quotes and proposals require human review before client delivery.**

---

## Related Documents

- `NBS-201-DIGITAL-ASSESSMENT-STANDARD.md`
- `LEAD-QUALIFICATION-RULES.md`
- `NORTHBRIDGE-DIGITAL-SERVICE-TAXONOMY.md`
- `AGENTS.md`
