import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Enable microphone permissions for audio visualizer testing
    permissions: ["microphone"],
    launchOptions: {
      channel: "chrome",
      args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        "--allow-file-access-from-files",
        "--disable-web-security",
      ],
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Run in headed mode for microphone access in development
        headless: process.env.CI ? true : false,
      },
    },
    // Note: Firefox and Safari have limited support for microphone permissions in E2E tests
    // Uncomment these for cross-browser testing when not using microphone features
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     headless: process.env.CI ? true : false,
    //   },
    // },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //     headless: process.env.CI ? true : false,
    //   },
    // },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
