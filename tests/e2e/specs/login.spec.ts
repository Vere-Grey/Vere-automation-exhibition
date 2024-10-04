import { expect, test } from '../fixtures/extensions';
import { homePageUrl, loginApiUrl, signupPageUrl } from '../fixtures/urls';
import { authenticateOverAPI } from '../utils/authentication';
import { userPassword, users } from '../utils/data';
import { delayRoute } from '../utils/routes';

const loginCredentialsCombinations = [
  {
    testName: 'Missing username',
    username: '',
    password: userPassword,
  },
  {
    testName: 'Missing password',
    username: users.Heath93.username,
    password: '',
  },
  {
    testName: 'Missing username and password',
    username: '',
    password: '',
  },
];
const displayedName = `${users.Heath93.firstName} ${users.Heath93.lastName[0]}`;

test.beforeEach(async ({ page }) => {
  await page.goto(homePageUrl);
});

test('user can login via UI', async ({ loc }) => {
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(userPassword);
  await loc.loginButton.click();
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
  await loc.loginButton.click();
  await expect(loc.failedLoginMessage).toHaveText('Username or password is invalid');
});

test('shows error when login requests fails', async ({ loc, page }) => {
  await page.route(loginApiUrl, route => route.fulfill({ status: 500 }));
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(userPassword);
  await loc.loginButton.click();
  await expect(loc.failedLoginMessage).toHaveText('Username or password is invalid');
});

test('shows spinner when login requests takes longer', async ({ loc, page }) => {
  await page.route(loginApiUrl, route => delayRoute(route, 2000));
  await loc.usernameField.fill(users.Heath93.username);
  await loc.passwordField.fill(userPassword);
  await loc.loginButton.click();
  //TODO: Verify spinner is visible (products does not have spinner yet)
  // Without the spinner implementation this serves only as a demonstration of how to use delayedRoute
  await page.waitForResponse(loginApiUrl);
  await expect(loc.userBalance).toBeVisible();
  await expect(loc.userFullName).toHaveText(displayedName);
});

test.describe('sign in button is disabled when', () => {
  for (const cred of loginCredentialsCombinations) {
    test(`${cred.testName}`, async ({ loc }) => {
      await loc.usernameField.fill(cred.username);
      await loc.passwordField.fill(cred.password);
      await expect(loc.loginButton).toBeDisabled();
    });
  }
});

test('initially sign in button is enabled but login attempt is rejected', async ({ loc }) => {
  await loc.loginButton.click();
  await expect(loc.usernameHelp).toHaveText('Username is required');
  await expect(loc.loginButton).toBeDisabled();
});

test('user can logout', async ({ page, loc, context }) => {
  await authenticateOverAPI({ page, context });
  await loc.logoutButton.click();
  await expect(loc.loginHeader).toBeVisible();
  await expect(loc.userBalance).not.toBeVisible();
});

test('user can navigate sing up form', async ({ loc, page }) => {
  await loc.signUpLink.click();
  //TODO: Remove redundant second click once bug ABC-123 is fixed
  await loc.signUpLink.click();
  await expect(loc.signupHeader).toBeVisible();
  expect(page.url()).toContain(signupPageUrl);
});
