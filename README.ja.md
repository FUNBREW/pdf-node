# @funbrew/pdf

FUNBREW PDF APIのNode.jsクライアントライブラリです。TypeScript型定義付き。

## インストール

```bash
npm install @funbrew/pdf
```

## 使い方

```js
const { FunbrewPdf } = require('@funbrew/pdf');

const pdf = new FunbrewPdf('sk-your-api-key');

// HTML → PDF
const result = await pdf.fromHtml('<h1>Hello World</h1>');
console.log(result.data.download_url);

// URL → PDF
const result = await pdf.fromUrl('https://example.com');

// テンプレート → PDF
const result = await pdf.fromTemplate('invoice', {
  company_name: 'FUNBREW Inc.',
  amount: '100,000',
});

// PDF生成 + メール送信
const result = await pdf.fromHtmlWithEmail(
  '<h1>請求書</h1>',
  'customer@example.com',
  '請求書をお送りします',
);

// テストモード
const result = await pdf.test('<h1>Test</h1>');

// ダウンロード
const buffer = await pdf.download('uuid.pdf');
require('fs').writeFileSync('output.pdf', buffer);

// 利用状況
const usage = await pdf.usage();
```

## オプション

```js
const result = await pdf.fromHtml('<h1>Hello</h1>', {
  options: { 'page-size': 'A3' },
  expiration_hours: 168,
  max_downloads: 5,
  password: 'secret',
  watermark: 'CONFIDENTIAL',
});
```
