const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const htmlDir = path.resolve(__dirname, 'ada/html'); // Adjust the relative path accordingly
  const files = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));

  let hasViolations = false;

  for (const file of files) {
    const filePath = path.join(htmlDir, file);
    const page = await browser.newPage(); // Ensure this line is correct
    await page.goto(`file://${filePath}`);

    const results = await new AxePuppeteer(page).analyze();
    console.log(`Results for ${file}:`, results.violations);

    if (results.violations.length > 0) {
      hasViolations = true;
    }

    await page.close();
  }

  await browser.close();

  if (hasViolations) {
    process.exit(1); // Exit with error if there are violations
  }
})();