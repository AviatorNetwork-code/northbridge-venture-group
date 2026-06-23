# NKS-001 — Northbridge Knowledge System

**Status:** Active (Stack 5 — documentation infrastructure)  
**Owner:** Northbridge Digital  
**Applies to:** `docs/knowledge/`, `docs/templates/`

---

## Purpose

The Northbridge Knowledge System (NKS) is the **curated body of what Northbridge knows** — industry context, constraints, solutions, KPIs, software patterns, and lessons learned — separate from **how Northbridge operates** (NBS) and separate from **runtime application code**.

Stack 5 establishes folder structure, standards, and templates only. It does **not** enable AI, MCP, RAG, vector search, or automatic document ingestion.

---

## Three-layer model

| Layer | Code | Meaning | Location |
|-------|------|---------|----------|
| **NBS** | Northbridge Business Standards | How Northbridge works — process, taxonomy, assessment rules, deployment | `docs/business/`, `docs/infrastructure/`, `AGENTS.md` |
| **NKS** | Northbridge Knowledge System | What Northbridge knows — verified or explicitly TODO knowledge | `docs/knowledge/` |
| **CAT** | Contextual Advisory Tool (future) | How Northbridge reasons with NBS + NKS — not implemented in Stack 5 | Future stack; requires separate approval |

**Read order for AI agents:** NBS first, then NKS. Never invert this hierarchy.

---

## Source-of-truth hierarchy

1. **Runtime code** — assessment scoring, API behavior, public UI (`lib/assessment/`, `app/`)
2. **NBS documents** — operating standards that code and humans must follow
3. **NKS documents** — knowledge that informs discovery, call prep, and future CAT
4. **TODO / Research Required** — placeholders; not facts

When NKS conflicts with NBS or code, **code and NBS win**. Update NKS or mark as deprecated.

---

## Verification states

Every knowledge entry should declare verification:

| State | Meaning | CAT may treat as fact? |
|-------|---------|------------------------|
| **Verified** | Confirmed by engagement, approved case study, or cited source | Yes (within scope) |
| **TODO — Research Required** | Structure only; content not validated | No |
| **TODO — Client engagement required** | Awaiting real project data | No |

Agents **must not invent industry facts**. Unverified content stays tagged TODO.

---

## Folder structure

```
docs/knowledge/
  README.md
  NKS-001-NORTHBRIDGE-KNOWLEDGE-SYSTEM.md
  universal/          # Cross-industry business domains
  industries/         # Industry playbooks (HVAC scaffolded first)
  constraints/        # Diagnostic constraint library
  solutions/          # Northbridge solution categories (maps to assessment)
  kpis/               # Metric definitions by domain
  software/           # Tool categories (not vendor endorsements unless verified)
  patterns/           # Recurring situation patterns
  case-studies/       # Verified engagement stories
  research/           # Research backlog and sources
  glossary/           # Shared terms
```

Templates live in `docs/templates/`.

---

## Relationship to assessment

Assessment **recommendations** are deterministic in code (`lib/assessment/recommend.ts`). NKS **enriches** internal understanding; it does not change scores or public recommendation labels without an approved NBS + code change.

| Assessment output | NKS role |
|-------------------|----------|
| Recommended solution | Link to `docs/knowledge/solutions/` |
| Pain points / systems gaps | Link to `docs/knowledge/constraints/` |
| Industry (free text) | Link to `docs/knowledge/industries/` when playbook exists |

---

## Lessons learned workflow

After client work:

1. Capture lesson using `docs/templates/LESSON-LEARNED-TEMPLATE.md`
2. Update relevant NKS entries (industry, constraint, pattern, or case study)
3. Update NBS only if operating rules changed
4. Do **not** expose internal lessons on public site without approval

---

## What Stack 5 does not include

- AI, MCP, OpenAI Agents, or LLM reasoning
- RAG, embeddings, vector DB, or document ingestion pipelines
- Runtime app consumption of NKS (requires separate approval)
- Client-facing quotes or pricing derived from NKS

---

## Change control

| Change type | Requires |
|-------------|----------|
| New NKS scaffold (TODO content) | PR with template sections |
| Verified knowledge | Source/provenance table filled |
| NKS → runtime behavior | Separate stack approval + NBS update |
| Deprecating entry | Status → Deprecated; link replacement |

---

## Related documents

- `docs/knowledge/README.md`
- `docs/business/NORTHBRIDGE-DIGITAL-SERVICE-TAXONOMY.md`
- `docs/business/NBS-201-DIGITAL-ASSESSMENT-STANDARD.md`
- `AGENTS.md`
