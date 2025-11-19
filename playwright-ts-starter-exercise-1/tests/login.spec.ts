import { log } from "console";
import { test, expect, testdataManager } from "../fixtures/hooks-fixture";
import * as allure from "allure-js-commons";

test.describe("[Login] Login Test journey", () => {
  test(
    "[Login] Login Test",
    {
      tag: ["@Smoke"],
      annotation: [
        { type: "testCaseId", description: "Jira Id" },
        { type: "businessUnit", description: "Business Unit" },
        { type: "feature", description: "Role" },
      ],
    },
    async ({ loginPage }) => {
      await allure.parentSuite("Parent suite name");
      await allure.suite("Suite name");
      await allure.subSuite("Login to the application");
      await allure.testCaseId("Jira id");

      const url = process.env.BASEURL;
      await allure.parameter("Base URL", url);

      const msUsername = process.env.USER_NAME;
      const msPassword = process.env.PASSWORD;

      const data = testdataManager.getTestDataFromJsonFile(
        "user-data",
        "test-user"
      );

      const name = testdataManager.getTestDataStringFromJsonFile(
        "user-data",
        "test-user",
        "given-name"
      );

      await test.step("Go to MS URL", async () => {
        await loginPage.openApplication(url);
      });

      await test.step("Enter MS Username", async () => {
        await loginPage.msloginUsername(msUsername);
      });

      await test.step("Enter MS Password", async () => {
        await loginPage.msloginPassword(msPassword);
      });

      await test.step("Stay Signed In - Yes", async () => {
        await loginPage.loginButton.click();
      });

      await test.step("Validate Microsoft login", async () => {
        await loginPage.waitforlogin();
      });

      await test.step("CLick Sign Up Button", async () => {
        await loginPage.clickSignUpButton();
      });

      await test.step("Enter Sign Up Credentials", async () => {
        await loginPage.enterSignUpCredentials(
          data["email"],
          data["password"],
          data["given-name"],
          data["surname"]
        );
      });

      await test.step("Submit Sign Up Form", async () => {
        await loginPage.createBtn.click();
      });

      await test.step("Validate Sign Up", async () => {
        console.log("GIVEN-NAME: ", name);
        await loginPage.checkUserLoggedIn(name);
      });
    }
  );
});
