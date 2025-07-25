import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/audio visualizer/i);
});

test("audio visualizer is visible", async ({ page }) => {
  await page.goto("/");

  // Expect the audio visualizer component to be visible
  await expect(
    page.getByRole("heading", { name: /audio visualizer/i })
  ).toBeVisible();
});
