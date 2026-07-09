# @northbridge/research-governance

NEO research governance models — platform only, no UI.

## Models

- **ResearchMetadata** — id, title, version, trust level, category, sources, ADR links
- **ResearchDocument** — metadata + sections + disposition notes
- **ResearchTrustLevel** — unverified → avoid disposition scale
- **ResearchCategory** — architecture, security, connectors, mobile, etc.
- **AdrLinkage** — links research to accepted ADRs

## Out of scope

- Research dashboard
- Automatic doc ingestion from GitHub

## References

- NEO Research & Knowledge Doctrine v1.0 (conceptual alignment)
- ADR-NEO-R1
