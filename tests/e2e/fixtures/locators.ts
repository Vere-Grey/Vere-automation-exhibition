import { Locator, Page } from 'playwright/test';

export class Locators {
  //login
  usernameField: Locator;
  usernameHelp: Locator;
  passwordField: Locator;
  loginButton: Locator;
  signUpLink: Locator;
  rememberMeCheckbox: Locator;
  failedLoginMessage: Locator;
  loginHeader: Locator;
  //signup
  signupHeader: Locator;
  signupFirstNameField: Locator;
  signupLastNameField: Locator;
  signupUsernameField: Locator;
  signupPasswordField: Locator;
  signupConfirmPasswordField: Locator;
  signupButton: Locator;
  loginLink: Locator;
  //sideMenu
  userBalance: Locator;
  userFullName: Locator;
  logoutButton: Locator;
  //home

  constructor(page: Page) {
    //login
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.usernameHelp = page.getByText('Username is required');
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.signUpLink = page.getByRole('link', { name: "Don't have an account? Sign Up" });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.failedLoginMessage = page.getByText('Username or password is invalid');
    this.loginHeader = page.getByRole('heading', { name: 'Sign in' });
    //signup
    this.signupHeader = page.getByRole('heading', { name: 'Sign up' });
    this.signupFirstNameField = page.getByLabel('First Name *');
    this.signupLastNameField = page.getByLabel('Last Name *');
    this.signupUsernameField = page.getByLabel('Username *');
    this.signupPasswordField = page.getByLabel('Password *', { exact: true });
    this.signupConfirmPasswordField = page.getByLabel('Confirm Password *');
    this.signupButton = page.getByRole('button', { name: 'Sign Up' });
    this.loginLink = page.getByRole('link', { name: 'Have an account? Sign In' });
    //sideMenu
    this.userBalance = page.locator('[data-test="sidenav-user-balance"]');
    this.userFullName = page.locator('[data-test="sidenav-user-full-name"]');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    //home
  }
}
