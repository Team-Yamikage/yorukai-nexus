import { test, expect, type Page } from "@playwright/test";

/**
 * Player E2E: iframe loading, source cycling, and retry diagnostics.
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
  await mockServers(page, [
    { id: "s1", episode_id: EPISODE_ID, server_name: "Vidstream", quality: "1080p", language: "English", embed_url: "https://example.com/embed/s1" },
  ]);
  await page.goto(`/watch/${EPISODE_ID}`);
  const frame = page.locator("iframe");
  await expect(frame).toHaveAttribute("src", "https://example.com/embed/s1", { timeout: 15_000 });
});

test("server cycling switches to another source", async ({ page }) => {
  await mockSupabase(page);
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

test("polls until an episode link appears instead of getting stuck in loading", async ({ page }) => {
  let calls = 0;
  await mockSupabase(page);
  await page.addInitScript(() => {
    (window as any).__YORUKAI_STREAM_POLL_MS = 500;
  });
  await page.route(/getEpisodeServersGuarded/, async (route) => {
    calls += 1;
    const servers = calls < 3 ? [] : [
      { id: "s1", episode_id: EPISODE_ID, server_name: "Late", quality: "1080p", language: "English", embed_url: "https://example.com/embed/late" },
    ];
    const { toCrossJSONAsync } = await import("seroval");
    const body = await toCrossJSONAsync({ result: { servers }, error: null, context: {} }, { refs: new Map(), plugins: [] });
    await route.fulfill({ status: 200, contentType: "application/json", headers: { "x-tss-serialized": "true" }, body: JSON.stringify(body) });
  });
  await page.goto(`/watch/${EPISODE_ID}`);
  await expect(page.getByText("LOADING STREAM")).toBeVisible({ timeout: 5_000 });
  await expect(page.locator("iframe")).toHaveAttribute("src", "https://example.com/embed/late", { timeout: 8_000 });
  await expect(page.getByText("STREAM SIGNAL LOST")).toHaveCount(0);
  await expect(page.getByLabel("Playback diagnostics")).toContainText("Episode link: available");
});

test("failing stream sources cycle and show diagnostics without stream-lost fallback", async ({ page }) => {
  await mockSupabase(page);
  await page.addInitScript(() => {
    (window as any).__YORUKAI_SOURCE_TIMEOUT_MS = 700;
  });
  await page.route(/bad-stream-.*\.mp4/, async (route) => {
    await route.fulfill({ status: 404, contentType: "video/mp4", body: "" });
  });
  await mockServers(page, [
    { id: "s1", episode_id: EPISODE_ID, server_name: "A", quality: "1080p", language: "English", embed_url: "http://localhost:8080/bad-stream-1.mp4" },
    { id: "s2", episode_id: EPISODE_ID, server_name: "B", quality: "720p", language: "English", embed_url: "http://localhost:8080/bad-stream-2.mp4" },
  ]);
  await page.goto(`/watch/${EPISODE_ID}`);
  await expect(page.getByLabel("Playback diagnostics")).toContainText("Retry attempts", { timeout: 5_000 });
  await expect(page.getByText("STREAM SIGNAL LOST")).toHaveCount(0);
});
