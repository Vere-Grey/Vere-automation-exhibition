import { test, expect } from "../fixtures/extensions";
import { authenticateOverAPI } from "../utils/authentication";
import { users, userPassword } from "../utils/data";

const loginCredentialsCombinations = [
  {
    testName: "empty username",
    username: "",
    password: userPassword,
  },
  {
    testName: "empty password",
    username: users.Heath93.username,
    password: "",
  },
  {
    testName: "empty username and password",
    username: "",
    password: "",
  },
];
const displayedName = `${users.Heath93.firstName} ${users.Heath93.lastName[0]}`;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("user can login via UI", async ({ loc }) => {
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(userPassword);
  await loc.submitButton.click();
  await expect(loc.userBalance).toBeVisible();  
  await expect(loc.userFullName).toHaveText(displayedName);
});

test("user can login via API", async ({ page, loc, context }) => {
  await authenticateOverAPI({ page, context });
  await expect(loc.userBalance).toBeVisible();
  await expect(loc.userFullName).toHaveText(displayedName);
});

test("invalid password is rejected", async ({ loc }) => {
  const invalidPassword = "invalid";
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(invalidPassword);
  await loc.submitButton.click();
  await expect(loc.failedLoginMessage).toHaveText("Username or password is invalid");
});

test.describe("sign in button is disabled when credentials are empty", () => {
  for (const cred of loginCredentialsCombinations) {
    test(`${cred.testName}`, async ({ loc }) => {
      await loc.usernameField.fill(cred.username);
      await loc.passwordField.fill(cred.password);
      await expect(loc.submitButton).toBeDisabled();
    });
  }
});

test("initially sign in button is enabled but login attempt is rejected", async ({ loc }) => {
  await loc.submitButton.click();
  await expect(loc.usernameHelp).toHaveText("Username is required");
  await expect(loc.submitButton).toBeDisabled();
});
