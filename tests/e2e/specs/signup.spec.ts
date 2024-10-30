import { expect, test } from '../fixtures/extensions';
import { Locators } from '../fixtures/locators';
import { signinPageUrl, signupPageUrl, usersApiUrl } from '../fixtures/urls';
import { randomUserInput } from '../utils/data';
import { delayRoute, expectPayloadToBe } from '../utils/routes';

// Reset storage state for this file to avoid start authenticated
test.use({ storageState: { cookies: [], origins: [] } });

async function fillSignupForm(
  loc: Locators,
  data: { firstName: string; lastName: string; username: string; password: string; confirmPassword: string },
) {
  await loc.signupFirstNameField.fill(data.firstName);
  await loc.signupLastNameField.fill(data.lastName);
  await loc.signupUsernameField.fill(data.username);
  await loc.signupPasswordField.fill(data.password);
  await loc.signupConfirmPasswordField.fill(data.confirmPassword);
}
const invalidInputCases = [
  {
    description: 'All fields empty',
    data: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    expectedError: 'First Name is required',
  },
  {
    description: 'Missing First Name',
    data: {
      firstName: '',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'password123',
    },
    expectedError: 'First Name is required',
  },
  {
    description: 'Missing Last Name',
    data: {
      firstName: 'John',
      lastName: '',
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'password123',
    },
    expectedError: 'Last Name is required',
  },
  {
    description: 'Missing Username',
    data: {
      firstName: 'John',
      lastName: 'Doe',
      username: '',
      password: 'password123',
      confirmPassword: 'password123',
    },
    expectedError: 'Username is required',
  },
  {
    description: 'Missing Password',
    data: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: '',
      confirmPassword: '',
    },
    expectedError: 'Enter your password',
  },
  {
    description: 'Missing Confirm Password',
    data: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      confirmPassword: '',
    },
    expectedError: 'Confirm your password',
  },
  {
    description: 'Password Mismatch',
    data: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'password456',
    },
    expectedError: 'Password does not match',
  },
  //TODO: Uncomment once bug ABC-124 is fixed and move to separate test case
  // There will be probably need to click button to trigger validation., ergo its own tests case
  // {
  //   description: 'Existing Username',
  //   data: {
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     username: users.Heath93.username,
  //     password: 'password123',
  //     confirmPassword: 'password123'
  //   },
  //   expectedError: 'Username taken'
  // },
];

test.beforeEach(async ({ page }) => {
  await page.goto(signupPageUrl);
});

test('user can navigate back to login form', async ({ loc, page }) => {
  await loc.loginLink.click();
  //TODO: Remove redundant second click once bug ABC-123 is fixed
  await loc.loginLink.click();
  await expect(loc.loginHeader).toBeVisible();
  expect(page.url()).toContain(signinPageUrl);
});

test('user can sign up', async ({ loc, page }) => {
  const randomUser = randomUserInput();
  await page.route(usersApiUrl, route => expectPayloadToBe(route, randomUser));
  await fillSignupForm(loc, randomUser);
  await loc.signupButton.click();
  await page.expectApiResponseToBe(usersApiUrl, { status: 201, statusText: 'Created' });
  //TODO: Product is missing user facing success message, ABC-125, add verification once fixed
});

test.describe('sign up button is disabled when', () => {
  for (const testCase of invalidInputCases) {
    test(`${testCase.description}`, async ({ loc, page }) => {
      await fillSignupForm(loc, testCase.data);
      await loc.signupHeader.click();
      await expect(loc.signupButton).toBeDisabled();
      await expect(page.getByText(testCase.expectedError)).toBeVisible();
    });
  }
});

test('shows error when signup requests fails', async ({ loc, page }) => {
  await page.route(usersApiUrl, route => route.fulfill({ status: 500 }));
  await fillSignupForm(loc, randomUserInput());
  await loc.signupButton.click();
  //TODO: Product is missing user facing error message, ABC-125, add verification once fixed
  await expect(loc.signupHeader).toBeVisible();
});

test('shows spinner when signup requests takes longer', async ({ loc, page }) => {
  await page.route(usersApiUrl, route => delayRoute(route, 2000));
  await fillSignupForm(loc, randomUserInput());
  await loc.signupButton.click();
  //TODO: Verify spinner is visible (products does not have spinner yet)
  // Without the spinner implementation this serves only as a demonstration of how to use delayedRoute
  await page.waitForResponse(usersApiUrl);
  //TODO: Product is missing user facing success message, ABC-125, add verification once fixed
  await expect(loc.loginHeader).toBeVisible();
});
