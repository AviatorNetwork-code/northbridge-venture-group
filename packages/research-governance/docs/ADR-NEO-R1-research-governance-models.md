# ADR-NEO-R1: Research Governance Models

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO — `@northbridge/research-governance`

## Decision

Codify research governance as platform schemas:

1. **Trust levels** — disposition of external sources (reference_only, adopt_concepts, avoid, etc.)
2. **Research categories** — taxonomy for docs under `docs/`
3. **Research metadata + document schema** — Zod-validated frontmatter
4. **ADR linkage** — explicit relationships between research and architecture decisions

## Consequences

- **Positive:** Research docs can be validated in CI
- **Positive:** Clear disposition tracking for external pattern studies
- **Negative:** Manual metadata authoring until automation exists

## Out of scope

- UI, research ingestion bots, NEOS write pipeline changes

## References

- `docs/northbridge-workforce-external-patterns-research-v1.md`
