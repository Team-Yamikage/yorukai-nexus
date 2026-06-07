import { test, expect, type Page } from "@playwright/test";

/**
 * Mock the MangaDex API so the manga detail + chapter list render
 * deterministically without hitting the live (rate-limited) service.
 */
const MANGA_ID = "00000000-0000-0000-0000-0000000000aa";

async function mockMangaDex(page: Page, opts: { feedStatus?: number } = {}) {
  await page.route(/api\.mangadex\.org\/manga\/[^/]+\/feed.*/, async (route) => {
    if (opts.feedStatus && opts.feedStatus !== 200) {
      return route.fulfill({ status: opts.feedStatus, body: "{}" });
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        total: 2,
        data: [
          { id: "ch1", attributes: { chapter: "1", title: "Beginning", pages: 12, translatedLanguage: "en", publishAt: null }, relationships: [] },
          { id: "ch2", attributes: { chapter: "2", title: "Next", pages: 10, translatedLanguage: "en", publishAt: null }, relationships: [] },
        ],
      }),
    });
  });
  await page.route(/api\.mangadex\.org\/manga\/[^/]+(\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          id: MANGA_ID,
          attributes: { title: { en: "Test Manga" }, description: { en: "Desc" }, status: "ongoing", year: 2024, contentRating: "safe", tags: [] },
          relationships: [],
        },
      }),
    });
  });
}

test("manga chapter list renders chapters", async ({ page }) => {
  await mockMangaDex(page);
  await page.goto(`/manga/${MANGA_ID}`);
  await expect(page.getByText("Chapter 1")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Chapter 2")).toBeVisible();
});

test("manga chapter list shows retry state when the feed fails", async ({ page }) => {
  await mockMangaDex(page, { feedStatus: 429 });
  await page.goto(`/manga/${MANGA_ID}`);
  // Should surface a distinct error/retry affordance, not a silent empty state.
  await expect(page.getByRole("button", { name: /retry/i })).toBeVisible({ timeout: 20_000 });
});
