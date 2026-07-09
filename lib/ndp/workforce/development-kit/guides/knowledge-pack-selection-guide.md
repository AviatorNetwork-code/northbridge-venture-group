# Knowledge Pack Selection Guide

Digital Employees reference Knowledge Pack IDs — never raw content in manifests.

## Selection principles

1. **Layer correctly** — universal → business → domain → industry → organization
2. **Declare dependencies** — packs inherit upstream context automatically
3. **Stay modular** — one pack per concern (fundamentals, planning, analytics, etc.)
4. **No customer data** — packs are reusable reference material

## Layer reference

| Layer | Examples | When to include |
|-------|----------|-----------------|
| Universal | Professional Communication, Business Writing | Every employee |
| Business | Business Operations Fundamentals | Cross-functional roles |
| Domain | Marketing Fundamentals, Sales Fundamentals | Category-specific employees |
| Role-specific | Campaign Planning, Content Strategy | Specialist-specific employees |
| Industry | Dental Fundamentals, HVAC Fundamentals | Auto-included via team context |
| Organization | Northbridge Communication Standards | Every launch employee |

## Standard bundles

### All launch employees

```
knowledge-pack-professional-communication
knowledge-pack-northbridge-communication-standards
```

### Marketing employees

```
knowledge-pack-marketing-fundamentals
+ role-specific pack (campaign-planning, content-strategy, branding, etc.)
```

### Customer experience employees

```
knowledge-pack-customer-service-fundamentals (when applicable)
knowledge-pack-scheduling-fundamentals (for appointment/reminder roles)
```

### Financial employees

```
knowledge-pack-financial-fundamentals
```

## Selection by specialist type

| Specialist type | Required domain pack | Optional role pack |
|-----------------|---------------------|-------------------|
| Campaign | Marketing Fundamentals | Campaign Planning |
| Content | Marketing Fundamentals + Business Writing | Content Strategy |
| Brand | Marketing Fundamentals + Business Writing | Branding |
| Analytics | Marketing Fundamentals | Marketing Analytics |
| Budget | Marketing Fundamentals + Financial Fundamentals | Budget Optimization |
| Appointment | Scheduling Fundamentals | — |
| Sales | Sales Fundamentals | — |

## Industry layer (automatic)

When building a knowledge resolution plan with `teamId`, industry packs matching `applicableTeams` are included automatically:

```typescript
const plan = buildKnowledgeResolutionPlan({
  manifest,
  registry,
  teamId: "team-dental-office", // adds knowledge-pack-dental-fundamentals
});
```

Do not duplicate industry packs in `knowledgePackIds` unless explicitly required.

## Adding a new pack

1. Add metadata to `lib/ndp/workforce/knowledge/catalog/launch-packs.ts`
2. Set `dependencies` for correct layering
3. Set `applicableTeams` and/or `applicableEmployees` when scoped
4. Update pack count in `knowledge.test.ts`
5. Reference from employee manifest(s)
6. Add production content in `lib/ndp/domain/<domain>/knowledge/` (team phase)

## Validation

```typescript
import { buildKnowledgeResolutionPlan, createKnowledgePackRegistry, NDP_LAUNCH_KNOWLEDGE_PACKS } from "@/lib/ndp/workforce/knowledge";

const registry = createKnowledgePackRegistry(NDP_LAUNCH_KNOWLEDGE_PACKS);
const plan = buildKnowledgeResolutionPlan({ manifest, registry, teamId });

// plan.resolvedPacks — ordered with dependency depth
// plan.totalPackCount — includes transitive dependencies
```

## Production content (team phase)

Metadata packs in `launch-packs.ts` define structure. Production text lives separately:

```
lib/ndp/domain/<domain>/knowledge/content.ts
```

Marketing Team Alpha demonstrates this pattern. Metadata and content are intentionally separated.

## Do not

- Embed knowledge text in manifests
- Create customer-specific packs
- Skip universal or organization layers at launch
- Reference experimental packs (`trustLevel: "experimental"`) for launch-visible employees
