export interface PdfResult {
  success: boolean;
  data: {
    filename: string;
    download_url: string;
    public_url: string | null;
    file_size: number;
    expires_at: string;
    max_downloads: number;
    remaining_downloads: number;
    s3_url?: string;
    test_mode?: boolean;
  };
}

export interface PdfOptions {
  options?: { 'page-size'?: 'A3' | 'A4' | 'A5' | 'Letter' | 'Legal'; orientation?: 'Portrait' | 'Landscape'; engine?: 'fast' | 'quality' };
  expiration_hours?: number;
  max_downloads?: number;
  password?: string;
  watermark?: string;
  filename?: string;
  test?: boolean;
  email?: { to: string; subject?: string; body?: string };
}

export interface UsageResult {
  success: boolean;
  data: {
    plan: { name: string; slug: string; monthly_limit: number };
    usage: { current_month: string; generated: number; remaining: number | null; is_unlimited: boolean };
    features: Record<string, boolean | { enabled: boolean; limit: number }>;
  };
}

export interface TemplateVariableDef {
  name: string;
  required?: boolean;
  default?: string;
}

export interface WebhookUpdate {
  url?: string;
  events?: string[];
  is_active?: boolean;
}

export interface StorageConfigUpdate {
  driver?: 's3' | 'gcs';
  config?: Record<string, any>;
  is_active?: boolean;
}

export class FunbrewPdf {
  constructor(apiKey: string, options?: { baseUrl?: string });
  fromHtml(html: string, options?: PdfOptions): Promise<PdfResult>;
  fromUrl(url: string, options?: PdfOptions): Promise<PdfResult>;
  fromMarkdown(markdown: string, theme?: 'business' | 'modern' | 'minimal' | 'academic' | 'creative', options?: PdfOptions): Promise<PdfResult>;
  markdownThemes(): Promise<{ data: Array<{ id: string; name: string; description: string }> }>;
  markdownPreview(markdown: string, theme?: string): Promise<{ success: boolean; data: { html: string } }>;
  fromTemplate(slug: string, variables?: Record<string, string>, options?: PdfOptions): Promise<PdfResult>;
  fromHtmlWithEmail(html: string, to: string, subject?: string, body?: string, options?: PdfOptions): Promise<PdfResult>;
  batch(items: Array<Record<string, any>>): Promise<any>;
  batchStatus(batchUuid: string): Promise<any>;
  split(filename: string, pages: string, options?: Record<string, any>): Promise<PdfResult>;
  rotate(filename: string, angle: 90 | 180 | 270, options?: { pages?: string; expiration_hours?: number; max_downloads?: number }): Promise<PdfResult>;
  compress(filename: string, quality?: 'low' | 'medium' | 'high', options?: Record<string, any>): Promise<PdfResult>;
  toImage(filename: string, format?: 'png' | 'jpg', options?: { pages?: string; dpi?: number }): Promise<any>;
  extractText(filename: string, options?: { pages?: string; per_page?: boolean }): Promise<any>;
  metadata(filename: string, fields?: { title?: string; author?: string; subject?: string; keywords?: string }): Promise<any>;
  pageNumbers(filename: string, options?: { position?: string; format?: string; start_number?: number; font_size?: number }): Promise<PdfResult>;
  toPdfA(filename: string, conformance?: '1b' | '2b' | '3b', options?: Record<string, any>): Promise<PdfResult>;
  merge(filenames: string[], options?: Record<string, any>): Promise<PdfResult>;
  mergeUpload(files: Array<string | Buffer>, options?: { filenames?: string[]; expiration_hours?: number; max_downloads?: number; watermark?: string }): Promise<PdfResult>;
  info(filename: string): Promise<any>;
  download(filename: string): Promise<Buffer>;
  delete(filename: string): Promise<any>;

  templates(): Promise<any>;
  createTemplate(name: string, slug: string, htmlContent: string, variables?: TemplateVariableDef[]): Promise<any>;
  updateTemplate(templateId: number, data?: { name?: string; html_content?: string; variables?: TemplateVariableDef[]; is_active?: boolean }): Promise<any>;
  deleteTemplate(templateId: number): Promise<any>;

  webhooks(): Promise<any>;
  createWebhook(url: string, events: string[]): Promise<any>;
  updateWebhook(webhookId: number, data?: WebhookUpdate): Promise<any>;
  deleteWebhook(webhookId: number): Promise<any>;

  storageConfig(): Promise<any>;
  createStorageConfig(driver: 's3' | 'gcs', config: Record<string, any>): Promise<any>;
  updateStorageConfig(data?: StorageConfigUpdate): Promise<any>;
  deleteStorageConfig(): Promise<any>;

  usage(): Promise<UsageResult>;
  test(html: string, options?: PdfOptions): Promise<PdfResult>;
}

export class FunbrewError extends Error {
  statusCode: number;
}
