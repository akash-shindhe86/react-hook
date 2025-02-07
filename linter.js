const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('/Users/ashin19/Desktop/albertsons/architecture/ADA/sample-repo/ada/html/3.html'); // Replace with your app's URL

  const results = await new AxePuppeteer(page).analyze();
  console.log(results.violations);

  await browser.close();

  if (results.violations.length > 0) {
    process.exit(1); // Exit with error if there are violations
  }
})();