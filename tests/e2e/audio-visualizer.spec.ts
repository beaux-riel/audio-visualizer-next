import { test, expect, type Page } from "@playwright/test";

// Configure tests to run in headed mode for microphone access
test.use({
  headless: false,
  permissions: ["microphone"],
  launchOptions: {
    args: [
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--allow-file-access-from-files",
      "--disable-web-security",
    ],
  },
});

test.describe("Audio Visualizer E2E Tests", () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant microphone permissions
    await context.grantPermissions(["microphone"]);
    await page.goto("/");
  });

  test("should display audio visualizer interface", async ({ page }) => {
    // Verify the main interface elements are visible
    await expect(
      page.getByRole("heading", { name: "Audio Visualizer" })
    ).toBeVisible();
    await expect(
      page.getByText("Experience your voice through dynamic visualizations")
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /microphone/i })
    ).toBeVisible();
  });

  test("should allow microphone access and show listening state", async ({
    page,
  }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Click the microphone button
    await micButton.click();

    // Wait for the listening state to appear
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Verify the button state changed
    await expect(
      page.getByRole("button", { name: /stop microphone listening/i })
    ).toBeVisible();
  });

  test("should display visualization components when listening", async ({
    page,
  }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Verify all visualization components are visible
    await expect(page.getByText("Volume Level")).toBeVisible();
    await expect(page.getByText("Frequency Spectrum")).toBeVisible();
    await expect(page.getByText("Circular Waveform")).toBeVisible();
    await expect(page.getByText("Particle Field")).toBeVisible();

    // Verify volume meter is displayed
    await expect(
      page.locator(".bg-gradient-to-r.from-green-400")
    ).toBeVisible();
  });

  test("should render visual elements with audio data", async ({ page }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Wait for visualizations to render
    await page.waitForTimeout(2000);

    // Verify frequency bars are rendered
    const frequencyBars = page.locator(
      ".bg-gradient-to-t.from-cyan-500.to-purple-500"
    );
    await expect(frequencyBars.first()).toBeVisible();

    // Verify particles are rendered
    const particles = page.locator(".absolute.rounded-full");
    await expect(particles.first()).toBeVisible();

    // Verify SVG waveform is rendered
    const svgWaveform = page.locator("svg line");
    await expect(svgWaveform.first()).toBeVisible();
  });

  test("should display volume percentage", async ({ page }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Wait for audio processing
    await page.waitForTimeout(1000);

    // Verify volume percentage is displayed (should be a number followed by %)
    await expect(page.locator("text=/\\d+%/")).toBeVisible();
  });

  test("should stop listening when button is clicked again", async ({
    page,
  }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Stop listening
    const stopButton = page.getByRole("button", {
      name: /stop microphone listening/i,
    });
    await stopButton.click();

    // Verify returned to initial state
    await expect(page.getByText("Microphone Off")).toBeVisible();
    await expect(
      page.getByText("Click the button to enable microphone")
    ).toBeVisible();

    // Verify visualizations are hidden
    await expect(page.getByText("Volume Level")).not.toBeVisible();
  });

  test("should handle keyboard navigation", async ({ page }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Focus the button and use keyboard
    await micButton.focus();
    await page.keyboard.press("Space");

    // Verify listening started
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Use Enter key to stop
    await page.keyboard.press("Enter");

    // Verify stopped
    await expect(page.getByText("Microphone Off")).toBeVisible();
  });

  test("should have proper accessibility attributes", async ({ page }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Check initial ARIA attributes
    await expect(micButton).toHaveAttribute("aria-pressed", "false");
    await expect(micButton).toHaveAttribute(
      "aria-label",
      "Start microphone listening"
    );

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Check updated ARIA attributes
    const stopButton = page.getByRole("button", {
      name: /stop microphone listening/i,
    });
    await expect(stopButton).toHaveAttribute("aria-pressed", "true");
    await expect(stopButton).toHaveAttribute(
      "aria-label",
      "Stop microphone listening"
    );
  });

  test("should handle rapid button clicks gracefully", async ({ page }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Rapidly click the button multiple times
    for (let i = 0; i < 5; i++) {
      await micButton.click();
      await page.waitForTimeout(100);
    }

    // Should eventually settle in a stable state
    await page.waitForTimeout(2000);

    // Check that we're in either listening or not listening state (not in an error state)
    const isListening = await page.getByText("Listening...").isVisible();
    const isOff = await page.getByText("Microphone Off").isVisible();

    expect(isListening || isOff).toBe(true);
  });

  test("should display visual feedback for audio levels", async ({ page }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Wait for audio processing
    await page.waitForTimeout(2000);

    // Verify that visual elements have dynamic styles (height, opacity, etc.)
    const volumeBar = page.locator(".bg-gradient-to-r.from-green-400");
    await expect(volumeBar).toHaveAttribute("style", /width:/);

    // Check that frequency bars have varying heights
    const frequencyBars = page.locator(
      ".bg-gradient-to-t.from-cyan-500.to-purple-500"
    );
    const firstBar = frequencyBars.first();
    await expect(firstBar).toHaveAttribute("style", /height:/);
  });

  test("should maintain consistent performance during extended use", async ({
    page,
  }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Let it run for several seconds to test performance
    await page.waitForTimeout(5000);

    // Verify it's still responsive
    await expect(page.getByText("Listening...")).toBeVisible();

    // Verify visualizations are still updating (check for dynamic styles)
    const particles = page.locator(".absolute.rounded-full").first();
    await expect(particles).toHaveAttribute("style", /transform:/);

    // Stop listening
    const stopButton = page.getByRole("button", {
      name: /stop microphone listening/i,
    });
    await stopButton.click();
    await expect(page.getByText("Microphone Off")).toBeVisible();
  });

  test("should work across different viewport sizes", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });
    await expect(micButton).toBeVisible();

    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Verify visualizations are visible on mobile
    await expect(page.getByText("Volume Level")).toBeVisible();

    // Test on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Verify everything still works
    await expect(page.getByText("Listening...")).toBeVisible();
    await expect(page.getByText("Volume Level")).toBeVisible();
  });

  test("should clean up resources when navigating away", async ({ page }) => {
    const micButton = page.getByRole("button", {
      name: /start microphone listening/i,
    });

    // Start listening
    await micButton.click();
    await expect(page.getByText("Listening...")).toBeVisible({
      timeout: 10000,
    });

    // Navigate away (simulate page change)
    await page.evaluate(() => {
      window.location.hash = "#test";
    });

    // Navigate back
    await page.evaluate(() => {
      window.location.hash = "";
    });

    // The component should handle cleanup gracefully
    // We verify this by checking that we can still interact with the page
    await expect(micButton).toBeVisible();
  });
});

test.describe("Audio Visualizer Error Handling E2E", () => {
  test("should handle browser without microphone support gracefully", async ({
    browser,
  }) => {
    // Create a context without microphone permission
    const context = await browser.newContext({
      permissions: [],
    });

    const page = await context.newPage();
    await page.goto("/");

    // The interface should still be visible but with limitations
    await expect(
      page.getByRole("heading", { name: "Audio Visualizer" })
    ).toBeVisible();

    const micButton = page.getByRole("button");

    // Click the button - should show error or be disabled
    await micButton.click();

    // Should not show listening state
    await expect(page.getByText("Listening...")).not.toBeVisible({
      timeout: 2000,
    });

    await context.close();
  });
});
