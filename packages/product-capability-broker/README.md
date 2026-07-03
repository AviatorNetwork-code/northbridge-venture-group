# @neos/product-capability-broker

Federated product intelligence protocol for NEOS consultative assistants.

## Quick start

```typescript
import { createProductCapabilityBroker } from "@neos/product-capability-broker";

const broker = createProductCapabilityBroker();

const result = broker.ask({
  requestId: "req-001",
  requesterId: "website-cat",
  targetProductId: "aviator-network",
  visitorIntent: "flight_school_student_acquisition",
  visitorContext: { industry: "aviation", challenge: "student acquisition" },
  question: "Can Aviator Network help my flight school get students?",
  requiredConfidence: "medium",
  publicFacing: true,
  allowedDisclosureLevel: "sales_safe",
  timestamp: Date.now(),
});

console.log(result.publicAnswer);
```

## Scripts

```bash
npm run build
npm run test
npm run typecheck
```

## Documentation

See [NEO-PRODUCT-CAPABILITY-BROKER-v1.md](../../docs/architecture/NEO-PRODUCT-CAPABILITY-BROKER-v1.md).
