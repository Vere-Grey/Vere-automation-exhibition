import { test, expect } from "@playwright/test";
import { Locators } from "../utils/locators";

const userPassword = process.env.SEED_DEFAULT_USER_PASSWORD;
let loc: Locators;

test.beforeEach(async ({ page }) => {
  loc = new Locators(page);
});

test("user can login", async ({ page }) => {
  await page.goto("/");
  await loc.usernameField.fill("Heath93");
  await loc.passwordField.fill(userPassword as string);
  await loc.submitButton.click();
  await expect(loc.userBalance).toBeVisible();
  await expect(loc.userFullName).toHaveText('Ted P');
});
