#!/usr/bin/env node

/**
 * Public taxonomy smoke checks for Northbridge Venture Group.
 * Requires a running server: npm run build && npm run start
 * Usage: npm run smoke:public
 *        SMOKE_BASE_URL=https://northbridgeventuregroup.com npm run smoke:public
 */

const BASE_URL = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const ROUTES = [
  "/",
  "/about",
  "/solutions",
  "/solutions/customer-acquisition",
  "/northbridge-digital",
  "/insights",
  "/services",
  "/services/industries",
  "/services/expertise",
  "/services/industries/aviation",
  "/services/industries/hvac",
  "/services/expertise/customer-acquisition",
  "/digital",
  "/digital/assessment",
  "/contact",
  "/case-studies",
];

const PLATFORM_CARD_NAMES = [
  "Aviator Network",
  "Workforce Operations Platform",
  "Trucker Network",
  "Quadrix",
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

async function fetchText(path) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { Accept: "text/html" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }

  return { path, html: await response.text() };
}

function assertPlatformsTaxonomy(html) {
  for (const name of PLATFORM_CARD_NAMES) {
    if (!html.includes(name)) {
      fail(`/about missing platform card: ${name}`);
      return;
    }
  }

  const platformCardPattern = /<h2[^>]*>\s*Northbridge Digital\s*<\/h2>/i;
  if (platformCardPattern.test(html)) {
    fail("/about lists Northbridge Digital as a platform card");
    return;
  }

  pass("/about shows owned platforms (no Northbridge Digital platform card)");
}

function assertServicesTaxonomy(html) {
  if (!html.includes("Northbridge Digital")) {
    fail("/services missing Northbridge Digital positioning");
    return;
  }

  pass("/services contains Northbridge Digital");
}

function assertSolutionsHub(html) {
  if (!html.includes("Business Solutions") || !html.includes("Workforce Operations")) {
    fail("/solutions missing business solution content");
    return;
  }

  pass("/solutions hub loads with solution categories");
}

function assertAssessmentLoads(html) {
  if (
    !html.includes("Business Diagnostic") &&
    !html.includes("Map your business")
  ) {
    fail("/digital/assessment missing Business Diagnostic funnel content");
    return;
  }

  if (html.includes("Scoring evidence") || html.includes("Hot Lead")) {
    fail("/digital/assessment exposes internal lead diagnostics");
    return;
  }

  pass("/digital/assessment loads without internal diagnostics");
}

async function main() {
  console.log(`Smoke base URL: ${BASE_URL}`);

  try {
    for (const path of ROUTES) {
      const { html } = await fetchText(path);
      pass(`${path} returned HTTP 200`);
      if (path === "/about") assertPlatformsTaxonomy(html);
      if (path === "/services") assertServicesTaxonomy(html);
      if (path === "/solutions") assertSolutionsHub(html);
      if (path === "/digital/assessment") assertAssessmentLoads(html);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(message);
    console.error("Hint: run `npm run build && npm run start` in another terminal.");
  }

  if (process.exitCode && process.exitCode !== 0) {
    console.error("\nSmoke checks failed.");
    process.exit(process.exitCode);
  }

  console.log("\nAll public smoke checks passed.");
}

main();
