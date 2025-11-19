import { expect } from "@playwright/test";
import { test } from "../fixtures/common-fixture";
import { testdataManager } from "../fixtures/hooks-fixture";

test("Global for auto login", async ({ page, loginPage }) => {
  const url = process.env.BASEURL!;
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

  await test.step("Login to the application with session state", async () => {
    await loginPage.openApplication(url);
    await loginPage.mslogin(username, password);
    await page.waitForURL(url + "web/index.php/dashboard/index");
  });

  await page.context().storageState({
    path: "./playwright/.auth/auth.json",
  });
});
