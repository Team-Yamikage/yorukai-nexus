import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config. Boots the Vite dev server and runs browser tests that
 * verify the player (iframe loading, server cycling, NO SERVERS fallback) and
 * the manga chapter list. Server responses are mocked via route interception
 * so tests are deterministic and never depend on live MangaDex/embed hosts.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
