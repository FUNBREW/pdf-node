# @funbrew/pdf

Official Node.js client library for the [FUNBREW PDF API](https://pdf.funbrew.cloud). Includes TypeScript type definitions.

[日本語ドキュメント](README.ja.md)

## Installation

```bash
npm install @funbrew/pdf
```

## Quick Start

```js
const { FunbrewPdf } = require('@funbrew/pdf');

const pdf = new FunbrewPdf('sk-your-api-key');

// HTML to PDF
const result = await pdf.fromHtml('<h1>Hello World</h1>');
console.log(result.data.download_url);

// URL to PDF
const result = await pdf.fromUrl('https://example.com');

// Markdown to PDF
const result = await pdf.fromMarkdown('# Hello World', 'modern');

// List available Markdown themes
const themes = await pdf.markdownThemes();

// Template to PDF
const result = await pdf.fromTemplate('invoice', {
  company_name: 'Acme Inc.',
  amount: '1,000',
});
```

## Features

```js
// Generate PDF and send via email
const result = await pdf.fromHtmlWithEmail(
  '<h1>Invoice</h1>',
  'customer@example.com',
  'Your invoice is ready',
);

// Test mode (no count, TEST watermark)
const result = await pdf.test('<h1>Test</h1>');

// File operations
const info = await pdf.info('uuid.pdf');
const buffer = await pdf.download('uuid.pdf');
require('fs').writeFileSync('output.pdf', buffer);
await pdf.delete('uuid.pdf');

// Batch generate
const batch = await pdf.batch([
  { type: 'html', html: '<h1>Doc 1</h1>' },
  { type: 'html', html: '<h1>Doc 2</h1>' },
]);

// Split PDF (extract pages)
const split = await pdf.split('uuid.pdf', '1-3');
const split2 = await pdf.split('uuid.pdf', '1,3,5');

// Rotate PDF pages
const rotated = await pdf.rotate('uuid.pdf', 90);
const rotated2 = await pdf.rotate('uuid.pdf', 180, { pages: '1,3' });

// Compress PDF
const compressed = await pdf.compress('uuid.pdf');
console.log(`Saved ${compressed.data.savings_percent}%`);
const compressed2 = await pdf.compress('uuid.pdf', 'low');

// Extract text
const text = await pdf.extractText('uuid.pdf');
const perPage = await pdf.extractText('uuid.pdf', { pages: '1,3', per_page: true });

// Read/Set metadata
const meta = await pdf.metadata('uuid.pdf');
const updated = await pdf.metadata('uuid.pdf', { title: 'Invoice', author: 'FUNBREW' });

// Add page numbers
const numbered = await pdf.pageNumbers('uuid.pdf', { position: 'top-right', format: 'Page {page} of {total}' });

// Convert to PDF/A
const archived = await pdf.toPdfA('uuid.pdf');
const pdfa1 = await pdf.toPdfA('uuid.pdf', '1b');

// PDF to Image
const images = await pdf.toImage('uuid.pdf');
const jpgImages = await pdf.toImage('uuid.pdf', 'jpg', { pages: '1,3', dpi: 300 });

// Merge PDFs
const merged = await pdf.merge(['file1.pdf', 'file2.pdf']);

// Markdown preview as HTML
const preview = await pdf.markdownPreview('# Hello', 'modern');
console.log(preview.data.html);

// Usage stats
const usage = await pdf.usage();
```

## SaaS Management API

Templates, webhooks, and storage configuration management (SaaS edition only):

```js
// Templates
await pdf.templates();
await pdf.createTemplate('Invoice', 'invoice', '<h1>{{ name }}</h1>', [
  { name: 'name', required: true },
]);
await pdf.updateTemplate(42, { html_content: '<h1>Updated</h1>' });
await pdf.deleteTemplate(42);

// Webhooks
await pdf.webhooks();
await pdf.createWebhook('https://example.com/hook', ['pdf.generated']);
await pdf.updateWebhook(7, { is_active: false });
await pdf.deleteWebhook(7);

// External storage configuration
await pdf.storageConfig();
await pdf.createStorageConfig('s3', { bucket: 'my-bucket', region: 'us-east-1' });
await pdf.updateStorageConfig({ is_active: false });
await pdf.deleteStorageConfig();
```

## Options

```js
const result = await pdf.fromHtml('<h1>Hello</h1>', {
  options: { 'page-size': 'A3', orientation: 'Landscape', engine: 'quality' },
  expiration_hours: 168,
  max_downloads: 5,
  password: 'secret',
  watermark: 'CONFIDENTIAL',
});
```

## TypeScript

Full type definitions are included. No need for `@types` packages.

```ts
import { FunbrewPdf, PdfResult } from '@funbrew/pdf';

const pdf = new FunbrewPdf('sk-your-api-key');
const result: PdfResult = await pdf.fromHtml('<h1>Hello</h1>');
```

## Error Handling

```js
const { FunbrewPdf, FunbrewError } = require('@funbrew/pdf');

try {
  const result = await pdf.fromHtml('<h1>Hello</h1>');
} catch (e) {
  if (e instanceof FunbrewError) {
    console.error(e.message);     // Error message
    console.error(e.statusCode);  // HTTP status code
  }
}
```

## License

MIT
