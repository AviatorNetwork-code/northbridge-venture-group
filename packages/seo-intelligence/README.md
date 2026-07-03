# @neos/seo-intelligence

Evidence-based SEO opportunity detection and content recommendations for NEOS — strategist-first, not article-writer-first.

## Quick start

```typescript
import { createSEOIntelligenceEngine } from "@neos/seo-intelligence";

const engine = createSEOIntelligenceEngine();
const report = await engine.analyze({
  analysisId: "analysis-001",
  requesterId: "neos-strategist",
  productScope: "Northbridge aviation",
  keywords: ["how to start a flight school", "best pilot logbook app"],
  existingContent: [],
  timestamp: Date.now(),
});

console.log(report.executiveSummary);
console.log(report.recommendations[0]?.draft?.seoTitle);
```

## Scripts

```bash
npm run build
npm run test
npm run typecheck
```

## Documentation

See [NEO-SEO-INTELLIGENCE-v1.md](../../docs/architecture/NEO-SEO-INTELLIGENCE-v1.md).
