import { expect, test } from '../fixtures/extensions';
import { authenticateOverAPI } from '../utils/authentication';
import { userPassword, users } from '../utils/data';

const loginCredentialsCombinations = [
  {
    testName: 'empty username',
    username: '',
    password: userPassword,
  },
  {
    testName: 'empty password',
    username: users.Heath93.username,
    password: '',
  },
  {
    testName: 'empty username and password',
    username: '',
    password: '',
  },
];
const displayedName = `${users.Heath93.firstName} ${users.Heath93.lastName[0]}`;
const loginApiUrl = '**/login';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('user can login via UI', async ({ loc }) => {
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(userPassword);
  await loc.submitButton.click();
  await expect(loc.userBalance).toBeVisible();
  await expect(loc.userFullName).toHaveText(displayedName);
});

test('user can login via API', async ({ page, loc, context }) => {
  await authenticateOverAPI({ page, context });
  await expect(loc.userBalance).toBeVisible();
  await expect(loc.userFullName).toHaveText(displayedName);
});

test('invalid password is rejected', async ({ loc }) => {
  const invalidPassword = 'invalid';
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(invalidPassword);
  await loc.submitButton.click();
  await expect(loc.failedLoginMessage).toHaveText('Username or password is invalid');
});

test('shows error when login requests fails', async ({ loc, page }) => {
  await page.route(loginApiUrl, route => route.fulfill({ status: 500 }));
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(userPassword);
  await loc.submitButton.click();
  await expect(loc.failedLoginMessage).toHaveText('Username or password is invalid');
});

test('shows spinner when login requests takes longer', async ({ loc, page }) => {
  await page.delayedRoute(loginApiUrl, 2000);
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(userPassword);
  await loc.submitButton.click();
  //TODO: Verify spinner is visible (products does not have spinner yet)
  await page.waitForResponse(loginApiUrl);
  await expect(loc.userBalance).toBeVisible();
  await expect(loc.userFullName).toHaveText(displayedName);
});

test.describe('sign in button is disabled when credentials are empty', () => {
  for (const cred of loginCredentialsCombinations) {
    test(`${cred.testName}`, async ({ loc }) => {
      await loc.usernameField.fill(cred.username);
      await loc.passwordField.fill(cred.password);
      await expect(loc.submitButton).toBeDisabled();
    });
  }
});

test('initially sign in button is enabled but login attempt is rejected', async ({ loc }) => {
  await loc.submitButton.click();
  await expect(loc.usernameHelp).toHaveText('Username is required');
  await expect(loc.submitButton).toBeDisabled();
});
