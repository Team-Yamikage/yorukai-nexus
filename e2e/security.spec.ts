import { test, expect } from "@playwright/test";

test("auth UI surfaces leaked-password protection responses", async ({ page }) => {
  await page.route(/\/auth\/v1\/signup.*/, (route) =>
    route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({ message: "Password has been found in a data breach and cannot be used" }),
    }),
  );
  await page.goto("/auth");
  await page.getByRole("button", { name: /sign up/i }).click();
  await page.getByLabel(/display name/i).fill("Security Test");
  await page.getByLabel(/email/i).fill("security@example.com");
  await page.getByLabel(/password/i).fill("password123");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page.getByText(/data breach/i)).toBeVisible({ timeout: 10_000 });
});

test("premium escalation is not trusted from client updates", async ({ page }) => {
  const profileUpdates: unknown[] = [];
  await page.route(/\/rest\/v1\/profiles.*/, async (route) => {
    if (route.request().method() === "PATCH") {
      profileUpdates.push(route.request().postDataJSON());
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ user_id: "user-1", is_premium: false, xp: 0, level: 1 }]),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  });

  await page.goto("/");
  const result = await page.evaluate(async () => {
    const mod = await import("/src/integrations/supabase/client.ts");
    const res = await mod.supabase
      .from("profiles")
      .update({ is_premium: true, xp: 999999, level: 99 })
      .eq("user_id", "user-1")
      .select("is_premium,xp,level,user_id");
    return res.data?.[0] ?? null;
  });

  expect(profileUpdates).toHaveLength(1);
  expect(result).toEqual({ user_id: "user-1", is_premium: false, xp: 0, level: 1 });
});
