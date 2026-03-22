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
  options?: { 'page-size'?: 'A3' | 'A4' | 'A5' | 'Letter' | 'Legal' };
  expiration_hours?: number;
  max_downloads?: number;
  password?: string;
  watermark?: string;
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

export class FunbrewPdf {
  constructor(apiKey: string, options?: { baseUrl?: string });
  fromHtml(html: string, options?: PdfOptions): Promise<PdfResult>;
  fromUrl(url: string, options?: PdfOptions): Promise<PdfResult>;
  fromTemplate(slug: string, variables?: Record<string, string>, options?: PdfOptions): Promise<PdfResult>;
  fromHtmlWithEmail(html: string, to: string, subject?: string, body?: string, options?: PdfOptions): Promise<PdfResult>;
  info(filename: string): Promise<any>;
  download(filename: string): Promise<Buffer>;
  delete(filename: string): Promise<any>;
  usage(): Promise<UsageResult>;
  test(html: string, options?: PdfOptions): Promise<PdfResult>;
}

export class FunbrewError extends Error {
  statusCode: number;
}
