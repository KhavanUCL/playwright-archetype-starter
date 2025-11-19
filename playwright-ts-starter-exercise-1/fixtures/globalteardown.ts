// globalteardown.ts
import fs from 'fs';
import os from 'os';
import path from 'path';

export default async ({ browser }) => {
  if (process.env.LAMBDATEST == "true" && browser) {
        await browser.close();
        console.log('LambdaTest browser session closed');
    }
};