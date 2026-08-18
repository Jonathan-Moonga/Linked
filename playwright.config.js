const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: ".audit/redesign",
  use: { browserName: "chromium" },
  webServer: {
    command: "npm.cmd run dev -- -p 3014",
    url: "http://localhost:3014/login",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
