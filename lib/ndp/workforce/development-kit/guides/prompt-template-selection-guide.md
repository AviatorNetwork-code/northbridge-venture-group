# Prompt Template Selection Guide

Prompt templates define how runtime prompts are **assembled** — not production wording.

## Template catalog

Launch templates in `lib/ndp/workforce/prompts/catalog/launch-templates.ts`:

| Category | Template ID | Output style | Applicable teams |
|----------|-------------|--------------|------------------|
| Marketing | `prompt-template-marketing-specialist` | `specialist` | `team-marketing` |
| Sales | `prompt-template-sales-specialist` | `advisor` | `team-sales` |
| Customer experience | `prompt-template-customer-service-specialist` | `specialist` | `team-customer-service`, `team-general-service` |
| Financial | `prompt-template-financial-specialist` | `structured_report` | `team-financial` |
| Team Lead | `prompt-template-team-lead` | `team_lead` | All teams (orchestration) |

## Selection rule

Map manifest `category` to template:

```typescript
const CATEGORY_PROMPT_TEMPLATE = {
  marketing: "prompt-template-marketing-specialist",
  sales: "prompt-template-sales-specialist",
  "customer-experience": "prompt-template-customer-service-specialist",
  financial: "prompt-template-financial-specialist",
};
```

Team Lead uses `prompt-template-team-lead` regardless of team category.

## Required knowledge layers per template

| Template | Required layers |
|----------|----------------|
| Marketing Specialist | universal, business, domain, organization |
| Sales Specialist | universal, business, domain, organization |
| Customer Service Specialist | universal, organization |
| Financial Specialist | universal, business, domain, organization |
| Team Lead | universal, organization |

Ensure manifest knowledge packs satisfy required layers before selecting a template.

## Assembly flow

```typescript
import {
  buildKnowledgeResolutionPlan,
  createKnowledgePackRegistry,
  NDP_LAUNCH_KNOWLEDGE_PACKS,
} from "@/lib/ndp/workforce/knowledge";
import {
  buildPromptAssemblyPlan,
  getPromptTemplate,
} from "@/lib/ndp/workforce/prompts";

const knowledgePlan = buildKnowledgeResolutionPlan({ manifest, registry });
const template = getPromptTemplate("prompt-template-marketing-specialist")!;

const plan = buildPromptAssemblyPlan({ manifest, knowledgePlan, template });
```

Output is a **Prompt Assembly Plan** — section order with source references. No LLM text.

## Production prompt content (team phase)

Template metadata lives in the framework. Production wording lives in domain layer:

```
lib/ndp/domain/<domain>/prompts/production-templates.ts
```

Marketing Team Alpha maps production sections to template `sectionId` values (identity, responsibilities, constraints, output_instructions).

## Section reference

Templates assemble 16 sections including:

- Identity, Responsibilities, Objectives
- Knowledge Packs, Available Capabilities, Connector Capabilities
- KPIs, Escalation Rules, Constraints, Output Instructions

See `lib/ndp/workforce/prompts/types/section.ts` for full definitions.

## Validation

```typescript
import {
  validateTemplateManifestCompatibility,
  validateTemplateKnowledgeCompatibility,
} from "@/lib/ndp/workforce/prompts";

const manifestIssues = validateTemplateManifestCompatibility(template, manifest);
const knowledgeIssues = validateTemplateKnowledgeCompatibility(template, knowledgePlan, manifest.employeeId);
```

Or use the DEDK helper:

```typescript
import { validateEmployeeReadiness } from "@/lib/ndp/workforce/development-kit";

validateEmployeeReadiness({ employeeId: "employee-marketing-campaign" });
```

## Adding a new template

1. Add section definition if needed (`types/section.ts`)
2. Add template metadata to `launch-templates.ts`
3. Update `prompts.test.ts` count if launch-visible
4. Map category in `CATEGORY_PROMPT_TEMPLATE` (development-kit validation)
5. Add production content in domain layer (team phase)

## Do not

- Add production prompt text to `launch-templates.ts`
- Concatenate prompts in manifests
- Bypass `buildPromptAssemblyPlan()` in team runtime
- Create per-customer templates
