import { test, expect } from "@playwright/test";

/**
 * The watch page must never expose server-selection UI to users: no "Servers"
 * heading, no visible source/embed URLs, no server picker buttons.
 */
test("watch page shows no server picker UI or source URLs", async ({ page }) => {
  await page.goto("/");

  // Navigate to any content → episode if possible; otherwise hit a watch route.
  const firstCard = page.locator('a[href*="/detail/"]').first();
  if ((await firstCard.count()) > 0) {
    await firstCard.click();
    const play = page.locator('a[href*="/watch/"]').first();
    if ((await play.count()) > 0) await play.click();
  }

  if (!/\/watch\//.test(page.url())) test.skip(true, "no watch route reachable from home");

  await page.waitForLoadState("networkidle");

  // No "Servers" section / heading.
  await expect(page.getByRole("heading", { name: /^servers$/i })).toHaveCount(0);
  await expect(page.getByText(/^servers$/i)).toHaveCount(0);

  // No raw embed/source URLs rendered as text.
  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(/https?:\/\/\S+\.(m3u8|mp4)\b/i);

  // No obvious server-picker controls.
  await expect(page.locator('[data-testid="server-picker"]')).toHaveCount(0);
});
