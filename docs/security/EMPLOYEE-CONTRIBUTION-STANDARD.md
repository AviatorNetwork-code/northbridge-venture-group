# Employee Contribution Standard

**Status:** Active (Stack 6)  
**Owner:** Northbridge Venture Group

---

## Purpose

Clarify expectations for employees and W-2 contributors who work on Northbridge repositories, documentation, and systems.

> **Note:** This document is operational guidance. Binding employment IP terms are defined in offer letters, employment agreements, and company policy. Where conflict exists, signed agreements prevail.

---

## Work product ownership

- Work performed within scope of employment for Northbridge Venture Group is **company work product**.
- This includes code, documentation (NBS, NKS, security standards), designs, assessment logic, internal tools, and derivative works.
- Contributions to this repository are made on behalf of the company, not as personal open-source projects.

---

## Repository contributions

| Expectation | Detail |
|-------------|--------|
| Use company GitHub org | Commits under org-authorized identity |
| Branch + PR workflow | No direct push to `main` — see [ACCESS-CONTROL-STANDARD.md](./ACCESS-CONTROL-STANDARD.md) |
| No secrets in commits | Pre-commit review; never commit `.env` with real values |
| Proprietary docs | Do not copy NBS/NKS to personal repos or external wikis |
| Client data | Access only as needed; no personal storage of lead exports |

---

## Confidentiality

Employees must not disclose:

- Unpublished NBS, NKS, or security documentation
- Client/lead PII or assessment internals
- Credentials, admin tokens, or infrastructure details
- Unreleased product or venture plans

Public communication about client work requires approval per case study / marketing process.

---

## Use of AI tools

- May use approved AI assistants for development with **no secrets or client PII** in prompts.
- Do not upload full proprietary doc corpora to unapproved external services.
- Follow `AGENTS.md` Stack 5 and Stack 6 AI rules when using coding agents.

---

## Lessons learned and NKS

After client engagements, employees should contribute lessons to NKS using approved templates — content remains company IP. See `docs/templates/LESSON-LEARNED-TEMPLATE.md`.

---

## Offboarding

Departing employees must complete [OFFBOARDING-CHECKLIST.md](./OFFBOARDING-CHECKLIST.md). Access removal is mandatory before last day where possible.

---

## Related documents

- [IP-PROTECTION-STANDARD.md](./IP-PROTECTION-STANDARD.md)
- [ROLE-MATRIX.md](./ROLE-MATRIX.md)
