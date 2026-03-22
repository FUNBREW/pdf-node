# @funbrew/pdf

Official Node.js client library for the [FUNBREW PDF API](https://pdf.funbrew.tech). Includes TypeScript type definitions.

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

// Usage stats
const usage = await pdf.usage();
```

## Options

```js
const result = await pdf.fromHtml('<h1>Hello</h1>', {
  options: { 'page-size': 'A3' },
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
