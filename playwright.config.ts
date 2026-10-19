import { defineConfig, devices } from "@playwright/test";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

const vars = ["BASE_URL", "TEST_USERNAME", "TEST_PASSWORD"];

vars.forEach((v) => {
  if (!process.env[v]?.trim()) {
    throw new Error(`Variable d'environnement manquante : ${v}`);
  }
});

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL!,

    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    testIdAttribute: "data-test",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
