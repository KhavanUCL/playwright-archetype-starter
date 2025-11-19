import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly msUsernameTextBox: Locator;
  readonly msPasswordTextBox: Locator;
  readonly loginButton: Locator;
  readonly signInHeading: Locator;
  readonly signUpBtnLocator: Locator;
  readonly emailTextBox: Locator;
  readonly passwordTextBox: Locator;
  readonly confirmPasswordTextBox: Locator;
  readonly givenNameTextBox: Locator;
  readonly surnameTextBox: Locator;
  readonly createBtn: Locator;

  constructor(page: Page) {
    //SSO Login Page Locators
    this.page = page;
    this.msUsernameTextBox = page.locator("#i0116");
    this.msPasswordTextBox = page.locator("#i0118");
    this.loginButton = page.locator("#idSIButton9");

    //Cubase Portal Locators
    this.signInHeading = page.getByRole("heading", { name: "Sign in" });
    this.signUpBtnLocator = page.locator("#createAccount");

    //Register Form Locators
    this.emailTextBox = page.locator("#email");
    this.passwordTextBox = page.locator("#newPassword");
    this.confirmPasswordTextBox = page.locator("#reenterPassword");
    this.givenNameTextBox = page.locator("#givenName");
    this.surnameTextBox = page.locator("#surname");
    this.createBtn = page.locator("#continue");
  }

  //Open SSO Login Page
  async openApplication(url: string) {
    await this.page.goto(url);
  }

  async msloginUsername(userName: string) {
    await this.msUsernameTextBox.fill(userName);
    await this.loginButton.click();
  }
  async msloginPassword(password: string) {
    await this.msPasswordTextBox.fill(password);
    await this.loginButton.click();
  }

  async waitforlogin() {
    await expect(this.signInHeading.first()).toBeVisible();
  }

  async clickSignUpButton() {
    await this.signUpBtnLocator.click();
  }

  async enterSignUpCredentials(
    email: string,
    password: string,
    givenName: string,
    surname: string
  ) {
    await this.emailTextBox.fill(email);
    await this.passwordTextBox.fill(password);
    await this.confirmPasswordTextBox.fill(password);
    await this.givenNameTextBox.fill(givenName);
    await this.surnameTextBox.fill(surname);
  }

  async checkUserLoggedIn(name: string) {
    expect(this.page.getByText(name));
  }
}
