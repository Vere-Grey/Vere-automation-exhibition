import { Locator, Page } from "playwright/test";

export class Locators {
  //login
  usernameField: Locator;
  passwordField: Locator;
  submitButton: Locator;
  signUpButton: Locator;
  rememberMeCheckbox: Locator;
  //sideMenu
  userBalance: Locator;
  userFullName: any;
  //home
  
  constructor(page: Page) {
    //login
    this.usernameField = page.getByLabel("Username");
    this.passwordField = page.getByLabel("Password");
    this.submitButton = page.locator('[data-test="signin-submit"]');
    this.signUpButton = page.locator('[data-test="signup"]');
    this.rememberMeCheckbox = page.getByLabel("Remember me");
    //sideMenu
    this.userBalance = page.locator('[data-test="sidenav-user-balance"]');
    this.userFullName = page.locator('[data-test="sidenav-user-full-name"]');
    //home
  }
}
