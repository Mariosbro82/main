import { chromium, ConsoleMessage } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors: { type: string; text: string }[] = [];
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error' || msg.text().toLowerCase().includes('content security policy')) {
      errors.push({ type: msg.type(), text: msg.text() });
    }
  });

  const url = process.env.APP_URL ?? 'http://localhost:5000/';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  const rootStats = await page.evaluate(() => {
    const root = document.getElementById('root');
    if (!root) return { hasRoot: false, childCount: 0, innerHTMLLength: 0 };
    return {
      hasRoot: true,
      childCount: root.childElementCount,
      innerHTMLLength: root.innerHTML.trim().length,
    };
  });

  await browser.close();

  if (errors.length > 0) {
    console.error('Console errors detected:', JSON.stringify(errors, null, 2));
    process.exit(1);
    return;
  }

  if (!rootStats.hasRoot || rootStats.innerHTMLLength === 0) {
    throw new Error(`Root element not populated (childCount=${rootStats.childCount}, innerHTMLLength=${rootStats.innerHTMLLength}).`);
  }

  console.log('Dev app verified without console CSP errors.');
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
