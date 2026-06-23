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
  "/ventures",
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

const VENTURE_CARD_NAMES = [
  "Aviator Network",
  "Quadrix",
  "AirTax Financial",
  "Future Ventures",
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

function assertVenturesTaxonomy(html) {
  for (const name of VENTURE_CARD_NAMES) {
    if (!html.includes(name)) {
      fail(`/ventures missing venture card: ${name}`);
      return;
    }
  }

  const ventureCardPattern = /<h2[^>]*>\s*Northbridge Digital\s*<\/h2>/i;
  if (ventureCardPattern.test(html)) {
    fail("/ventures lists Northbridge Digital as a venture card");
    return;
  }

  pass("/ventures shows owned ventures only (no Northbridge Digital venture card)");
}

function assertServicesTaxonomy(html) {
  if (!html.includes("Northbridge Digital")) {
    fail("/services missing Northbridge Digital positioning");
    return;
  }

  pass("/services contains Northbridge Digital");
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
      if (path === "/ventures") assertVenturesTaxonomy(html);
      if (path === "/services") assertServicesTaxonomy(html);
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
