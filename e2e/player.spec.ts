import { test, expect, type Page } from "@playwright/test";

/**
 * Player E2E: iframe loading, source cycling, and the final stream error.
 * Supabase REST and the guarded server functions are mocked so the player
 * renders deterministically without real episodes or live embed hosts.
 */
const EPISODE_ID = "00000000-0000-0000-0000-0000000000ee";
const CONTENT_ID = "00000000-0000-0000-0000-0000000000cc";

const EPISODE = {
  id: EPISODE_ID,
  content_id: CONTENT_ID,
  season_number: 1,
  episode_number: 1,
  title: "Pilot",
  thumbnail_url: null,
  duration_seconds: 1400,
  description: null,
};
const CONTENT = { id: CONTENT_ID, title: "Test Show", type: "series", banner_url: null, poster_url: null };

async function mockSupabase(page: Page) {
  await page.route(/\/rest\/v1\/episodes.*/, async (route) => {
    const url = route.request().url();
    // Single episode lookup vs siblings list both return an array.
    const body = url.includes(EPISODE_ID) ? [EPISODE] : [EPISODE];
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.route(/\/rest\/v1\/content.*/, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([CONTENT]) });
  });
}

// Mock the probeServers server fn so health probing never marks sources dead.
async function mockProbe(page: Page) {
  await page.route(/probeServers/, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ health: {} }) });
  });
}

async function mockServers(page: Page, servers: any[], blocked?: string) {
  await page.route(/getEpisodeServersGuarded/, async (route) => {
    const { toCrossJSONAsync } = await import("seroval");
    const body = await toCrossJSONAsync(
      { result: { servers, blocked }, error: null, context: {} },
      { refs: new Map(), plugins: [] },
    );
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "x-tss-serialized": "true" },
      body: JSON.stringify(body),
    });
  });
}

test("player loads an embed iframe for a playable server", async ({ page }) => {
  await mockSupabase(page);
  await mockProbe(page);
  await mockServers(page, [
    { id: "s1", episode_id: EPISODE_ID, server_name: "Vidstream", quality: "1080p", language: "English", embed_url: "https://example.com/embed/s1" },
  ]);
  await page.goto(`/watch/${EPISODE_ID}`);
  const frame = page.locator("iframe");
  await expect(frame).toHaveAttribute("src", "https://example.com/embed/s1", { timeout: 15_000 });
});

test("server cycling switches to another source", async ({ page }) => {
  await mockSupabase(page);
  await mockProbe(page);
  await mockServers(page, [
    { id: "s1", episode_id: EPISODE_ID, server_name: "A", quality: "1080p", language: "English", embed_url: "https://example.com/embed/s1" },
    { id: "s2", episode_id: EPISODE_ID, server_name: "B", quality: "720p", language: "English", embed_url: "https://example.com/embed/s2" },
  ]);
  await page.goto(`/watch/${EPISODE_ID}`);
  const frame = page.locator("iframe");
  await expect(frame).toHaveAttribute("src", "https://example.com/embed/s1", { timeout: 15_000 });
  await page.getByRole("button", { name: /try another/i }).first().click();
  await expect(frame).toHaveAttribute("src", "https://example.com/embed/s2");
});

test("shows a final stream error only after no playable sources exist", async ({ page }) => {
  await mockSupabase(page);
  await mockProbe(page);
  await mockServers(page, []);
  await page.goto(`/watch/${EPISODE_ID}`);
  await expect(page.getByText("LOADING STREAM")).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText("STREAM SIGNAL LOST")).toBeVisible({ timeout: 15_000 });
});
