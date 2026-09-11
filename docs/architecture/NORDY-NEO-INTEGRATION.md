# Nordy ↔ NEO Integration

Nordy (public product name: **Nordi**) is the Northbridge-facing conversational intake agent on the website.

## Path

```
USER → NORDY → VERIFIED COMPANY KNOWLEDGE → STRUCTURED CAPABILITY DATA
     → CONVERSATION CONTEXT → NEO RETRIEVAL → NEO AI FALLBACK → SAFE RESPONSE
     → GOVERNED LEARNING EVIDENCE (CAP-LEARN-001)
```

## Answer priority

1. Verified company knowledge (`lib/nordy/company-knowledge.ts`)
2. Capability registry (`lib/nordy/capability-registry.ts`)
3. Current conversation facts (`lib/nordy/conversation-continuity.ts`)
4. NEO retrieval adapter (`lib/nordy/neo-retrieval.ts`)
5. NEO AI via `@northbridge/platform-ai` (`lib/nordy/ai-adapter.ts`)
6. Explicit uncertainty / human escalation

## Boundaries (hard)

- No second AI gateway — use `@northbridge/platform-ai`
- No second memory database — reuse conversation facts + existing Nordi storage for relationship UX
- No second learning pipeline — CAP-LEARN-001 emitter only
- No model training / fine-tuning / dataset export (`TRAINING_AUTHORIZED = false`)
- INTERNAL_ONLY knowledge never exposed publicly
- Production learning emit gated via `NORDY_PRODUCTION_LEARNING_EMIT` (default OFF)

## Live connectivity status

GitHub App secrets may be present in cloud agent environments. Nordy chat retrieval still requires `NEXT_PUBLIC_NEO_PROVIDER` (non-mock) + `NEXT_PUBLIC_NEO_BASE_URL`.

**Status:** `NEO_LIVE_CROSS_REPO_VERIFICATION_PENDING` / `EXTERNAL_CONFIGURATION` when base URL unset.

Inspect with `inspectNeoConnection()` in `lib/nordy/neo-retrieval.ts`. Local/mock adapters keep the integration boundary correct. Do **not** claim `NORDY_NEO_E2E_PRODUCTION_VERIFIED` until live cross-repo retrieve is proven.

## Environment awareness

`lib/nordy/environment.ts` resolves `LOCAL | TEST | DEVELOPMENT | PREVIEW | STAGING | PRODUCTION | UNKNOWN` using Northbridge/Vercel deployment metadata first, not `NODE_ENV` alone.

## Entry paths

| Path | Meaning |
| --- | --- |
| `HOME` | Homepage entry |
| `EXPLORE` | Company Q&A, no forced qualification |
| `ENGINEERING_AI` | Operational / AI intake |
| `DIGITAL` | Fast Digital product intake |
| `MOBILE_APPS` | Mobile App Launch intake |
| `CAPABILITIES` | Capability discovery / light routing |
| `VENTURES` | Portfolio / ventures exploration |
| `GENERAL` | Default launcher fallback |

Opened via `/?nordy=open&entry=<PATH>`.
