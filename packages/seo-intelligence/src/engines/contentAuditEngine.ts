import type { ExistingContentRecord } from "../types/opportunity.js";
import type { ContentAuditResult } from "../types/opportunity.js";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function overlapScore(keywordTokens: string[], pageTokens: string[]): number {
  if (keywordTokens.length === 0) return 0;
  const pageSet = new Set(pageTokens);
  const matches = keywordTokens.filter((t) => pageSet.has(t)).length;
  return matches / keywordTokens.length;
}

export function auditExistingContent(
  keyword: string,
  existingContent: ExistingContentRecord[],
): ContentAuditResult {
  const keywordTokens = tokenize(keyword);
  const matchingPages = existingContent
    .map((page) => {
      const pageTokens = [
        ...tokenize(page.title),
        ...tokenize(page.slug),
        ...page.topics.flatMap(tokenize),
      ];
      const score = overlapScore(keywordTokens, pageTokens);
      return { page, score };
    })
    .filter(({ score }) => score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .map(({ page }) => page);

  const exists = matchingPages.length > 0;
  const duplicateRisk = matchingPages.length > 1;
  const improvementCandidate = matchingPages.find((p) => p.needsImprovement);

  let recommendation: ContentAuditResult["recommendation"] = "create_new";
  if (duplicateRisk && !improvementCandidate) {
    recommendation = "skip_duplicate";
  } else if (improvementCandidate) {
    recommendation = "improve_existing";
  } else if (exists && matchingPages[0]!.qualityScore >= 75) {
    recommendation = "skip_duplicate";
  }

  return {
    keyword,
    exists,
    matchingPages,
    duplicateRisk,
    improvementCandidate,
    recommendation,
  };
}
