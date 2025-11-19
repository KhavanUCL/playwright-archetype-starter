import { test, expect as playwrightExpect, Page, Locator, TestInfo } from '@playwright/test';
import { testdataManager } from '../fixtures/hooks-fixture';
import fs from 'fs';
import os from 'os';
import path from 'path';

export function expectWithStep(actual: any, description: string, page?: Page) {
    return {
        async toHaveText(expected: string | RegExp) {
            return await test.step(`Expect: ${description}`, async () => {
                try {
                    await playwrightExpect(actual).toHaveText(expected);
                    console.log(`✅ PASS: ${description}`);
                } catch (error) {
                    console.log(`❌ FAIL: ${description}`);
                    throw error;
                }
            });
        },

        async toBeVisible() {
            return await test.step(`Expect: ${description}`, async () => {
                try {
                    await playwrightExpect(actual).toBeVisible();
                    console.log(`✅ PASS: ${description}`);

                } catch (error) {
                    console.log(`❌ FAIL: ${description}`);
                    throw error;
                }
            });
        },

        async toBe(expected: any) {
            return await test.step(`Expect: ${description}`, async () => {
                try {
                    await playwrightExpect(actual).toBe(expected);
                    console.log(`✅ PASS: ${description}`);
                } catch (error) {
                    console.log(`❌ FAIL: ${description}`);
                    throw error;
                }
            });
        },

        not: {
            async toBeVisible() {
                return await test.step(`Expect: ${description}`, async () => {
                    try {
                        await playwrightExpect(actual).not.toBeVisible();
                        console.log(`✅ PASS: ${description}`);
                    } catch (error) {
                        console.log(`❌ FAIL: ${description}`);
                        throw error;
                    }
                });
            },

            async toHaveText(expected: string | RegExp) {
                return await test.step(`Expect: ${description}`, async () => {
                    try {
                        await playwrightExpect(actual).not.toHaveText(expected);
                        console.log(`✅ PASS: ${description}`);
                    } catch (error) {
                        console.log(`❌ FAIL: ${description}`);
                        throw error;
                    }
                });
            },

            async toBe(expected: any) {
                return await test.step(`Expect: ${description}`, async () => {
                    try {
                        await playwrightExpect(actual).not.toBe(expected);
                        console.log(`✅ PASS: ${description}`);
                    } catch (error) {
                        console.log(`❌ FAIL: ${description}`);
                        throw error;
                    }
                });
            }
        }
    };
}

export function validateNotNull<T extends Record<string, any>>(obj: T, objectName: string): T {
    for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) {
            throw new Error(`${objectName}.${key} is null or undefined`);
        }
    }
    return obj;
}

export function compareSharedFieldsOfExtendedObjects<X, Y extends X>(baseObject: X, extendedObject: Y): void {
    const baseKeys = Object.keys(baseObject as Record<string, any>);
    const mismatches: string[] = [];
    for (const key of baseKeys) {
        if (key in (extendedObject as Record<string, any>)) {
            const baseValue = (baseObject as any)[key];
            const extendedValue = (extendedObject as any)[key];
            if (JSON.stringify(extendedValue) === JSON.stringify(baseValue)) {
                console.log(`✅ Field '${key}' matches: ${JSON.stringify(baseValue)}`);
            } else {
                console.log(`❌ Field '${key}' mismatch:`);
                console.log(`   Expected: ${JSON.stringify(baseValue)}`);
                console.log(`   Actual:   ${JSON.stringify(extendedValue)}`);
                mismatches.push(`${key}: expected ${JSON.stringify(baseValue)}, got ${JSON.stringify(extendedValue)}`);
            }
        }
    }
    if (mismatches.length > 0) {
        throw new Error(`Field comparison failed:\n${mismatches.map(m => `  - ${m}`).join('\n')}`);
    }
    console.log(`🎉 All ${baseKeys.length} shared fields match successfully!`);
}

export function resetAllFlagsToFalse(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const flags = JSON.parse(raw);
  const updated = Object.fromEntries(Object.keys(flags).map(key => [key, false]));
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
}

export async function attachScreenshot(
  target: Locator | Page,
  name: string
) {
  const screenshot =
    'screenshot' in target
      ? await target.screenshot()
      : await (target as Page).screenshot();

  await test.info().attach(name, {
    body: screenshot,
    contentType: 'image/png',
  });
}

export async function attachJsonToReport(
    title: string, jsonData: any
) {
  await test.info().attach(title, {
    body: JSON.stringify(jsonData, null, 2),
    contentType: 'application/json',
  });
}

export async function attachTextToReport(
    title: string, jsonData: any
) {
  await test.info().attach(title, {
    body: JSON.stringify(jsonData, null, 2),
    contentType: 'text/plain',
  });
}

const SEED_FILE_PATH = path.join(os.tmpdir(), 'playwright-test-run-seed.txt');

let cachedSeed: string | null = null;

export function getTestRunSeed(): string {
  if (cachedSeed) return cachedSeed;

  try {
    if (fs.existsSync(SEED_FILE_PATH)) {
      cachedSeed = fs.readFileSync(SEED_FILE_PATH, 'utf-8').trim();
      console.log(`[Seed] Reusing seed from temp file: ${cachedSeed}`);
    } else {
      cachedSeed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      fs.writeFileSync(SEED_FILE_PATH, cachedSeed, 'utf-8');
      console.log(`[Seed] Generated and saved new seed: ${cachedSeed}`);
    }
  } catch (err) {
    console.warn(`[Seed] Error reading/writing seed file, fallback to memory. Reason: ${err}`);
    cachedSeed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  return cachedSeed;
}


export default class CommonUtils {
    constructor() {

    }
}