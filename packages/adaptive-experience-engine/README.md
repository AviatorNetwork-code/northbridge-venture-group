# @neos/adaptive-experience-engine

Adaptive Experience Engine (AEE) v1 for NEOS — recommends how products should adapt to different users without modifying products autonomously.

## Usage

```typescript
import { AdaptiveExperienceEngine } from "@neos/adaptive-experience-engine";

const aee = new AdaptiveExperienceEngine(myProductAdapter);
const plan = aee.generatePlan(inputBundle);
```

See `docs/architecture/NEO-ADAPTIVE-EXPERIENCE-v1.md`.
