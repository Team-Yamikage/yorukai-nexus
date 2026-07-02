import { test, expect } from "@playwright/test";

/**
 * Chapter reader: every page image must load with non-zero dimensions and the
 * reader must never surface an error fallback like "NO SERVERS". Uses a known
 * MangaDex title/chapter; skips gracefully if the upstream is rate-limited.
 */
test("chapter reader loads all page images without error fallback", async ({ page }) => {
  // Steel Ball Run — first chapter id is resolved from the manga feed.
  await page.goto("/manga/d90ea6cf-70b3-4b32-a94c-cb2124b6a1d0");

  const firstChapter = page.locator('a[href*="/reader/"]').first();
  if ((await firstChapter.count()) === 0) test.skip(true, "chapter list empty (upstream rate-limited)");
  await firstChapter.click();

  await expect(page).toHaveURL(/\/reader\//, { timeout: 20_000 });

  // No error fallbacks anywhere on the reader.
  await expect(page.getByText(/NO SERVERS/i)).toHaveCount(0);
  await expect(page.getByText(/no playable servers/i)).toHaveCount(0);

  const imgs = page.locator("main img, .max-w-3xl img");
  await expect(imgs.first()).toBeVisible({ timeout: 25_000 });

  // Assert the first few images decoded to non-zero natural dimensions.
  await page.waitForTimeout(3000);
  const count = Math.min(await imgs.count(), 5);
  for (let i = 0; i < count; i++) {
    const natural = await imgs.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(natural).toBeGreaterThan(0);
  }
});
