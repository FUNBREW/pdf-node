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

// Markdown → PDF
const result = await pdf.fromMarkdown('# Hello World', 'modern');

// Markdownテーマ一覧を取得
const themes = await pdf.markdownThemes();

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

// テキスト抽出
const text = await pdf.extractText('uuid.pdf');
const perPage = await pdf.extractText('uuid.pdf', { pages: '1,3', per_page: true });

// メタデータ読み書き
const meta = await pdf.metadata('uuid.pdf');
const updated = await pdf.metadata('uuid.pdf', { title: '請求書', author: 'FUNBREW' });

// ページ番号挿入
const numbered = await pdf.pageNumbers('uuid.pdf', { position: 'top-right', format: 'Page {page} of {total}' });

// PDF/A変換
const archived = await pdf.toPdfA('uuid.pdf');

// PDF→画像変換
const images = await pdf.toImage('uuid.pdf');
const jpgImages = await pdf.toImage('uuid.pdf', 'jpg', { pages: '1,3', dpi: 300 });

// PDF分割（ページ抽出）
const split = await pdf.split('uuid.pdf', '1-3');
const split2 = await pdf.split('uuid.pdf', '1,3,5');

// ページ回転
const rotated = await pdf.rotate('uuid.pdf', 90);
const rotated2 = await pdf.rotate('uuid.pdf', 180, { pages: '1,3' });

// PDF圧縮
const compressed = await pdf.compress('uuid.pdf');
console.log(`削減率: ${compressed.data.savings_percent}%`);

// MarkdownをHTMLとしてプレビュー
const preview = await pdf.markdownPreview('# Hello', 'modern');
console.log(preview.data.html);

// 利用状況
const usage = await pdf.usage();
```

## SaaS管理API

テンプレート・Webhook・外部ストレージ設定の管理（SaaSエディションのみ）。

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

// 外部ストレージ設定
await pdf.storageConfig();
await pdf.createStorageConfig('s3', { bucket: 'my-bucket', region: 'us-east-1' });
await pdf.updateStorageConfig({ is_active: false });
await pdf.deleteStorageConfig();
```

## オプション

```js
const result = await pdf.fromHtml('<h1>Hello</h1>', {
  options: { 'page-size': 'A3', orientation: 'Landscape' },
  expiration_hours: 168,
  max_downloads: 5,
  password: 'secret',
  watermark: 'CONFIDENTIAL',
});
```
