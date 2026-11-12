import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import { chromium } from 'playwright';

const root = new URL('../', import.meta.url);
const [source, css] = await Promise.all([
  readFile(new URL('README.md', root), 'utf8'),
  readFile(new URL('scripts/pdf.css', root), 'utf8'),
]);

// Keep repository-only links out of the CV.
const markdown = source.replace(
  /<!-- pdf:exclude:start -->[\s\S]*?<!-- pdf:exclude:end -->/g,
  '',
);
const body = new MarkdownIt({ linkify: true }).render(markdown);
const output = fileURLToPath(new URL('output/pdf/Ivan_Andrianovsky_cv.pdf', root));
await mkdir(new URL('output/pdf/', root), { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
});

try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Ivan Andrianovsky - CV</title>
    <style>${css}</style>
  </head>
  <body><main>${body}</main></body>
</html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: output,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  console.log(`Built ${output}`);
} finally {
  await browser.close();
}
