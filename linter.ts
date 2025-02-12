import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer, { Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import stylelint from 'stylelint';

// Polyfill for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let hasViolations = false;

  // Function to scan a page with axe-core
  const scanPage = async (page: Page, file: string) => {
    const results = await new AxePuppeteer(page).analyze();
    console.log(`Results for ${file}:`, results.violations);

    if (results.violations.length > 0) {
      console.log(`Accessibility issues found in ${file}:`, results.violations);
      hasViolations = true;
    }
  };

  // Scan HTML files
  const htmlDir = path.resolve(__dirname, 'ada/html'); // Adjust the relative path accordingly
  const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));

  for (const file of htmlFiles) {
    const filePath = path.join(htmlDir, file);
    const page = await browser.newPage();
    await page.goto(`file://${filePath}`);

    await scanPage(page, file);
    await page.close();
  }

  // Scan React components
  const reactComponentsDir = path.resolve(__dirname, 'ada/react'); // Adjust the relative path accordingly
  const reactFiles = fs.readdirSync(reactComponentsDir).filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));

  for (const file of reactFiles) {
    const filePath = path.join(reactComponentsDir, file);
    const Component = (await import(filePath)).default;
    const html = ReactDOMServer.renderToString(React.createElement(Component));

    const page = await browser.newPage();
    await page.setContent(html);

    await scanPage(page, file);
    await page.close();
  }

  // Scan additional directories for ADA issues
  const additionalDirs = ['src/components', 'src/pages']; // Add other directories as needed
  for (const dir of additionalDirs) {
    const dirPath = path.resolve(__dirname, dir);
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const Component = (await import(filePath)).default;
      const html = ReactDOMServer.renderToString(React.createElement(Component));

      const page = await browser.newPage();
      await page.setContent(html);

      await scanPage(page, file);
      await page.close();
    }
  }

  // Scan CSS files
  const cssDir = path.resolve(__dirname, 'src/styles'); // Adjust the relative path accordingly
  const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css') || file.endsWith('.scss'));

  for (const file of cssFiles) {
    const filePath = path.join(cssDir, file);
    const cssContent = fs.readFileSync(filePath, 'utf8');

    const lintResults = await stylelint.lint({
      code: cssContent,
      configFile: path.resolve(__dirname, '.stylelintrc.json')
    });

    if (lintResults.errored) {
      console.log(`CSS issues in ${file}:`, lintResults.output);
      hasViolations = true;
    }
  }

  await browser.close();

  if (hasViolations) {
    console.log("Accessibility issues found. Exiting with error.");
    process.exit(1); // Exit with error if there are violations
  } else {
    console.log("No accessibility issues found.");
  }
})();