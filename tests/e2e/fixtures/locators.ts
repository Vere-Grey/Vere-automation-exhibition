import { Locator, Page } from 'playwright/test';

export class Locators {
  //login
  usernameField: Locator;
  usernameHelp: Locator;
  passwordField: Locator;
  submitButton: Locator;
  signUpButton: Locator;
  rememberMeCheckbox: Locator;
  failedLoginMessage: Locator;
  //sideMenu
  userBalance: Locator;
  userFullName: Locator;
  //home

  constructor(page: Page) {
    //login
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.usernameHelp = page.getByText('Username is required');
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.signUpButton = page.getByRole('link', { name: "Don't have an account? Sign Up" });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.failedLoginMessage = page.getByText('Username or password is invalid');
    //sideMenu
    this.userBalance = page.locator('[data-test="sidenav-user-balance"]');
    this.userFullName = page.locator('[data-test="sidenav-user-full-name"]');
    //home
  }
}
