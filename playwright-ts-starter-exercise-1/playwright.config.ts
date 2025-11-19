import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv'
import * as fs from 'fs';
import { test } from './fixtures/hooks-fixture';

dotenv.config({
  path: `./env-files/.env.${process.env.ENV_NAME}`
})

const today = new Date();
const formattedDate = today.toLocaleString('en-GB');
const isLambdaTest = process.env.LAMBDATEST;
const lt_username = process.env.LAMBDATEST_USERNAME;
const lt_access_key = process.env.LAMBDATEST_ACCESS_KEY;
if (isLambdaTest == 'true') {
  console.log('Running tests on LambdaTest: https://automation.lambdatest.com/build?pageType=build');
}
const getLambdaTestConfig = (browserName: string, browserVersion: string, platform: string, name: string) => ({
  connectOptions: {
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify({
      'browserName': browserName,
      'browserVersion': browserVersion,
      'LT:Options': {
        'platform': platform,
        'build': `Test Playwright Build - ${formattedDate}`,
        'name': name,
        'user': lt_username,
        'accessKey': lt_access_key,
        'network': true,
        'video': true,
        'console': true,
        'tunnel': false,
        'tunnelName': '',
        'resolution': '2560x1600',
        'chrome.args': ['--start-fullscreen']
      }
    }))}`,
  }
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  globalTeardown: require.resolve('./fixtures/globalteardown'),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: [['html',{open:'always'}]],
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      suiteTitle: false,
      detail: false,
      links: [],
      environmentInfo: {
        'Environment': process.env.ENV_NAME,
        'Base URL': process.env.BASEURL
      },
      executorInfo: {
        name: process.env.LAMBDATEST === 'true' ? 'LambdaTest' : 'Local',
        type: process.env.LAMBDATEST === 'true' ? 'lambdatest' : 'local',
        buildName: 'Playwright Tests',
        buildOrder: 1,
        reportName: 'Test Execution Report'
      }
    }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 180000,
  expect: {
    timeout: 180000,
  },
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // screenshot: 'only-on-failure',
    // video: 'retain-on-failure',
     //  trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */

  projects: isLambdaTest === 'true' ? [
    {
      name: 'Functional',
      use: {
        ...getLambdaTestConfig('pw-chromium', 'latest', 'Windows 11', 'SEST Tests'),
        viewport: { width: 2560, height: 1600 },  //uncomment once fullscreen testing is fixed
      }
    }
  ] : [
    {
      name: 'Functional',
      use: {
        viewport: null,
        launchOptions: {
          headless: false,
          args: ['--start-maximized', '--incognito', '--force-device-scale-factor=0.7'],
          ignoreDefaultArgs: ['--disable-field-trial-config']
        }
      },
    },
    {
      name: 'Setup',
      testMatch: 'global.setup.ts'
    },
    {
      name: 'chromium-with-setup',
      dependencies:['Setup'],
      use: { ...devices['Desktop Chrome'],
        launchOptions: {
            headless: false,
            args: ['--start-maximized', '--incognito', '--force-device-scale-factor=0.7'],
            ignoreDefaultArgs: ['--disable-field-trial-config']
          } 
       },
    },
    {
      name: 'Setup-with-sessionstate',
      testMatch: 'global-with-sessionstate.setup.ts'
    },
    {
      name: 'chromium-with-setup-and-sessionstate',
      dependencies:['Setup-with-sessionstate'],
      use: { ...devices['Desktop Chrome'],
        storageState:'./playwright/.auth/auth.json',
        launchOptions: {
            headless: false,
            args: ['--start-maximized', '--incognito', '--force-device-scale-factor=0.7'],
            ignoreDefaultArgs: ['--disable-field-trial-config']
          } 
       },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // }

    // projects: [
    //   {
    //     name: 'chromium',
    //     use: { 
    //       ...devices['Desktop Chrome'],
    //       launchOptions: {
    //        args: ['--start-maximized'] // Maximizes the window
    //       } 
    //     },
    //   },
    //   {
    //     name: 'firefox',
    //     use: { ...devices['Desktop Firefox'] },
    //   },

    //   {
    //     name: 'webkit',
    //     use: { ...devices['Desktop Safari'] },
    //   },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]
}
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
);