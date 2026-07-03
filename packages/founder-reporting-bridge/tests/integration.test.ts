import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createFounderReportingBridge, FRB_GOVERNANCE } from "../src/core/founderReportingBridge.js";
import { loadSlackConfig } from "../src/config/slackConfig.js";
import { classifyPriority, shouldSendImmediately } from "../src/engines/priorityClassifier.js";
import { generateDailyFounderBrief } from "../src/engines/dailyBriefGenerator.js";
import { generateCriticalAlert } from "../src/engines/criticalAlertGenerator.js";
import { formatFounderReportForSlack } from "../src/formatters/slackMessageFormatter.js";
import { createSampleReportSources } from "../src/adapters/reportSourceAdapters.js";
import {
  assertReadOnlyOperation,
  sanitizeReportContent,
  validateNoSensitiveContent,
} from "../src/governance/readOnlyPolicy.js";
import { registerFRBCapability, FRB_CAPABILITY } from "../src/registration/capabilityRegistration.js";

describe("priorityClassifier", () => {
  it("classifies critical alerts as immediate", () => {
    const priority = classifyPriority("critical_alert", [], "Aviator build failed");
    assert.equal(priority, "critical");
    assert.equal(shouldSendImmediately(priority), true);
  });

  it("classifies weekly reports as low priority", () => {
    const priority = classifyPriority("weekly_northbridge_report", createSampleReportSources());
    assert.equal(priority, "low");
  });
});

describe("dailyBriefGenerator", () => {
  it("includes all required daily brief sections", () => {
    const report = generateDailyFounderBrief(createSampleReportSources());
    const headings = report.sections.map((s) => s.heading);
    assert.ok(headings.includes("What changed today"));
    assert.ok(headings.includes("Highest-value recommendation"));
    assert.ok(headings.includes("Pending decisions"));
    assert.ok(headings.includes("Risks"));
    assert.ok(report.nextSuggestedAction.length > 0);
  });
});

describe("criticalAlertGenerator", () => {
  it("generates critical alert for build failure", () => {
    const report = generateCriticalAlert("Aviator build failed");
    assert.equal(report.reportType, "critical_alert");
    assert.equal(report.priority, "critical");
    assert.match(report.sections[0]!.items[0]!, /Aviator build failed/);
  });
});

describe("slackMessageFormatter", () => {
  it("produces markdown-safe Slack payload", () => {
    const report = generateDailyFounderBrief(createSampleReportSources());
    const payload = formatFounderReportForSlack(report);
    assert.ok(payload.text.includes("Daily Founder Brief"));
    assert.ok(payload.blocks && payload.blocks.length > 0);
    assert.doesNotMatch(payload.text, /sk-[a-z0-9]{10,}/i);
  });

  it("sanitizes sensitive patterns", () => {
    const sanitized = sanitizeReportContent("api_key=secret123 password=abc");
    assert.match(sanitized, /\[redacted\]/);
  });

  it("rejects content with secrets", () => {
    assert.throws(() => validateNoSensitiveContent("token sk-1234567890abcdef"));
  });
});

describe("slackConfig", () => {
  it("allows dry-run without webhook URL", () => {
    const config = loadSlackConfig({ FOUNDER_REPORTING_DRY_RUN: "true" });
    assert.equal(config.dryRun, true);
  });

  it("requires credentials when not dry-run", () => {
    assert.throws(() => loadSlackConfig({ FOUNDER_REPORTING_DRY_RUN: "false" }));
  });
});

describe("FounderReportingBridge integration", () => {
  it("generates and previews daily brief without sending", async () => {
    const bridge = createFounderReportingBridge({
      slackConfig: { dryRun: true, preview: true },
    });
    const report = bridge.generateDailyBrief();
    const preview = bridge.previewReport(report);
    assert.ok(preview.includes("Daily Founder Brief"));

    const result = await bridge.sendReport(report);
    assert.equal(result.sent, false);
    assert.equal(result.dryRun, true);
  });

  it("enforces read-only governance", () => {
    assert.equal(FRB_GOVERNANCE.allowsTaskExecution, false);
    assert.throws(() => assertReadOnlyOperation("execute_task"));
  });

  it("registers FRB capability in NEOS registry", () => {
    const ids: string[] = [];
    registerFRBCapability({ register(c) { ids.push(c.id); } });
    assert.deepEqual(ids, [FRB_CAPABILITY.id]);
  });
});
