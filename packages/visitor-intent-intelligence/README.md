# @neos/visitor-intent-intelligence

Visitor Intent Intelligence (VII) v1 for NEOS — Northbridge Engineering Operating System.

VII infers **why** visitors come to Northbridge products, whether they achieved their goals, and how CAT should improve the customer journey.

## Scope

- Product-agnostic core engine
- Adapter-only product integration
- Read-only governance (recommendations only)
- No automatic website, CAT, commit, or PR changes

## Usage

```typescript
import {
  VisitorIntentIntelligence,
  type VisitorIntentAdapter,
} from "@neos/visitor-intent-intelligence";

const vii = new VisitorIntentIntelligence(myProductAdapter);

vii.ingestEvent({ type: "page_view", path: "/services", timestamp: Date.now() });
vii.ingestEvent({ type: "cat_message_sent", message: "I run a flight school", timestamp: Date.now() });

const session = vii.analyzeSession();
const report = vii.generateExecutiveReport([session]);
```

## Documentation

See `docs/architecture/NEO-VISITOR-INTENT-INTELLIGENCE-v1.md` at the repository root.

## Development

```bash
npm run build --workspace=@neos/visitor-intent-intelligence
npm run test --workspace=@neos/visitor-intent-intelligence
```
