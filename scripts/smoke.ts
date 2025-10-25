import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  const url = process.env.APP_URL || 'http://localhost:5001';
  await page.goto(url, { waitUntil: 'networkidle' });
  const title = await page.title();
  const outputDir = path.resolve('QA_DELIVERABLES/current_run/evidence');
  await fs.mkdir(outputDir, { recursive: true });
  const screenshotPath = path.join(outputDir, 'smoke_dashboard.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();
  return { url, title, screenshotPath };
}
run().then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(err => {
  console.error('SMOKE_FAILED', err);
  process.exitCode = 1;
});
