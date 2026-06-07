import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config. Runs browser tests that verify the player (iframe
 * loading, server cycling, NO SERVERS fallback) and the manga chapter list.
 * Network responses are mocked via route interception so tests are
 * deterministic and never depend on live MangaDex/embed hosts.
 *
 * Set E2E_BASE_URL to point at a running dev/preview server. When unset, the
 * config boots `bun run dev` on the configured port.
 */
const PORT = process.env.E2E_PORT || "8080";
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "bun run dev",
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
