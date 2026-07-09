# Operations Intelligence Layer (OIL)

**Migrated to:** `@northbridge/operations-intelligence` in NEOS (`packages/platform/operations-intelligence/`)

This directory is a **compatibility shim**. Import from the platform package:

```typescript
import {
  buildExampleSkywardOrganizationInput,
  buildOrganizationContext,
  assertValidOrganizationIntelligence,
} from "@northbridge/operations-intelligence";
```

The local implementation was extracted to NEO as part of the Phase 13 ownership refactor. See the package README and `docs/platform/OPERATIONS-INTELLIGENCE-LAYER.md` in NEOS.
