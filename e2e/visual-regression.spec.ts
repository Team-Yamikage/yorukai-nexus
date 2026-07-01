import { test, expect, type Page, type Route as PlaywrightRoute } from "@playwright/test";

const MANGA_ID = "00000000-0000-0000-0000-0000000000aa";
const EPISODE_ID = "00000000-0000-0000-0000-0000000000ee";
const CONTENT_ID = "00000000-0000-0000-0000-0000000000cc";

async function mockMangaDex(page: Page) {
  await page.route(/api\.mangadex\.org\/manga\/[^/]+\/feed.*/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        total: 2,
        data: [
          { id: "ch1", attributes: { chapter: "1", title: "Beginning", pages: 12, translatedLanguage: "en", publishAt: null }, relationships: [] },
          { id: "ch2", attributes: { chapter: "2", title: "Next", pages: 10, translatedLanguage: "en", publishAt: null }, relationships: [] },
        ],
      }),
    }),
  );
  await page.route(/api\.mangadex\.org\/manga\/[^/]+(\?.*)?$/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          id: MANGA_ID,
          attributes: { title: { en: "Test Manga" }, description: { en: "Desc" }, status: "ongoing", year: 2024, contentRating: "safe", tags: [] },
          relationships: [],
        },
      }),
    }),
  );
}

async function mockPlayerBase(page: Page) {
  await page.route(/\/rest\/v1\/episodes.*/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: EPISODE_ID, content_id: CONTENT_ID, season_number: 1, episode_number: 1, title: "Pilot", thumbnail_url: null, duration_seconds: 1400, description: null }]),
    }),
  );
  await page.route(/\/rest\/v1\/content.*/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: CONTENT_ID, title: "Test Show", type: "series", banner_url: null, poster_url: null }]),
    }),
  );
  await page.route(/probeServers/, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ health: {} }) }),
  );
}

async function fulfillServerFn(route: PlaywrightRoute, result: unknown) {
  const { toCrossJSONAsync } = await import("seroval");
  const body = await toCrossJSONAsync(
    { result, error: null, context: {} },
    { refs: new Map(), plugins: [] },
  );
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: { "x-tss-serialized": "true" },
    body: JSON.stringify(body),
  });
}

test("manga chapters visual state", async ({ page }) => {
  await mockMangaDex(page);
  await page.goto(`/manga/${MANGA_ID}`);
  await expect(page.getByText("Chapter 1")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("section").first()).toHaveScreenshot("manga-chapters.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.03,
  });
});

test("player iframe visual state", async ({ page }) => {
  await mockPlayerBase(page);
  await page.route(/getEpisodeServersGuarded/, (route) =>
    fulfillServerFn(route, { servers: [{ id: "s1", episode_id: EPISODE_ID, server_name: "Vidstream", quality: "1080p", language: "English", embed_url: "https://example.com/embed/s1" }] }),
  );
  await page.goto(`/watch/${EPISODE_ID}`);
  await expect(page.locator("iframe")).toHaveAttribute("src", "https://example.com/embed/s1", { timeout: 15_000 });
  await expect(page.locator(".aspect-video").first()).toHaveScreenshot("player-iframe.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.03,
  });
});

test("player empty visual state", async ({ page }) => {
  await mockPlayerBase(page);
  await page.route(/getEpisodeServersGuarded/, (route) =>
    fulfillServerFn(route, { servers: [] }),
  );
  await page.goto(`/watch/${EPISODE_ID}`);
  await expect(page.getByText("NO SERVERS")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(".aspect-video").first()).toHaveScreenshot("player-empty.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.03,
  });
});
