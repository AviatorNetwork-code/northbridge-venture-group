#!/usr/bin/env npx tsx
/**
 * @northbridge/neo-bridge — send Session Reports to NEO for organizational learning.
 *
 * Usage:
 *   northbridge-send-neo
 *   northbridge-send-neo --level 3
 *   northbridge-send-neo --report .northbridge/session-reports/2026-07-05.md
 *   northbridge-send-neo --dry-run
 */
import { main } from "../src/cli.js";

const exitCode = await main(process.argv.slice(2));
process.exit(exitCode);
