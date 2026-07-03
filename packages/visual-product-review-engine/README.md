# @neos/visual-product-review-engine

Executive UX evaluation from rendered interfaces and screenshots — customer-perspective product review for NEOS.

## Quick start

```typescript
import { createVisualProductReviewEngine } from "@neos/visual-product-review-engine";

const engine = createVisualProductReviewEngine();
const report = engine.reviewScreens({
  reviewId: "review-001",
  requesterId: "neos-executive",
  productId: "northbridge-website",
  productName: "Northbridge Website",
  screens: [{
    captureId: "cap-1",
    screenId: "home",
    screenName: "Home",
    sourceType: "browser_screenshot",
    viewport: "desktop",
    capturedAt: Date.now(),
    signals: { /* RenderedUISignals */ },
  }],
  timestamp: Date.now(),
});
```

## Scripts

```bash
npm run build
npm run test
npm run typecheck
```

## Documentation

See [NEO-VISUAL-PRODUCT-REVIEW-v1.md](../../docs/architecture/NEO-VISUAL-PRODUCT-REVIEW-v1.md).
