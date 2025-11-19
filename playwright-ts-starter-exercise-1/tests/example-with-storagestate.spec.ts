import { log } from "console";
import { test, expect, testdataManager } from "../fixtures/hooks-fixture";
import * as allure from "allure-js-commons";

test.describe("[Login] Login Test journey With Session State", () => {
  test(
    "[Login] Login Test - Session State",
    {
      tag: ["@UI", "@ExampleSessionState"],
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

      const url = process.env.BASEURL!;
      await allure.parameter("Base URL", url);
      const username = await testdataManager.getTestDataStringFromJsonFile(
        "example-data",
        "login1",
        "username"
      );
      const password = await testdataManager.getTestDataStringFromJsonFile(
        "example-data",
        "login1",
        "password"
      );

      await test.step("Login to the application", async () => {
        await loginPage.openApplication(url);
        console.log("Successfully authenticated");
      });

      await test.step("Validate login", async () => {});
    }
  );
});
