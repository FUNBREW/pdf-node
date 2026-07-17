class FunbrewPdf {
  /**
   * @param {string} apiKey
   * @param {object} [options]
   * @param {string} [options.baseUrl]
   */
  constructor(apiKey, { baseUrl = 'https://pdf.funbrew.cloud' } = {}) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /** Generate PDF from HTML */
  async fromHtml(html, options = {}) {
    return this._post('/api/pdf/generate-from-html', { html, ...options });
  }

  /** Generate PDF from URL */
  async fromUrl(url, options = {}) {
    return this._post('/api/pdf/generate-from-url', { url, ...options });
  }

  /** Generate PDF from Markdown */
  async fromMarkdown(markdown, theme = 'business', options = {}) {
    return this._post('/api/pdf/generate-from-markdown', {
      markdown,
      theme,
      ...options,
    });
  }

  /** Get available Markdown themes */
  async markdownThemes() {
    return this._get('/api/markdown/themes');
  }

  /** Preview Markdown as HTML */
  async markdownPreview(markdown, theme = 'business') {
    return this._post('/api/markdown/preview', { markdown, theme });
  }

  /** Generate PDF from template */
  async fromTemplate(slug, variables = {}, options = {}) {
    return this._post('/api/pdf/generate-from-template', {
      template: slug,
      variables,
      ...options,
    });
  }

  /** Generate PDF and send via email */
  async fromHtmlWithEmail(html, to, subject = '', body = '', options = {}) {
    const email = { to };
    if (subject) email.subject = subject;
    if (body) email.body = body;
    return this.fromHtml(html, { ...options, email });
  }

  /** Get PDF file info */
  async info(filename) {
    return this._get(`/api/pdf/info/${filename}`);
  }

  /** Download PDF file as Buffer */
  async download(filename) {
    const res = await fetch(`${this.baseUrl}/api/pdf/download/${filename}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) throw new FunbrewError('Download failed', res.status);
    return Buffer.from(await res.arrayBuffer());
  }

  /** Delete PDF file */
  async delete(filename) {
    return this._request('DELETE', `/api/pdf/delete/${filename}`);
  }

  /** Batch generate multiple PDFs */
  async batch(items) {
    return this._post('/api/pdf/batch', { items });
  }

  /** Get batch status */
  async batchStatus(batchUuid) {
    return this._get(`/api/pdf/batch/${batchUuid}`);
  }

  /** Merge multiple PDFs into one */
  async merge(filenames, options = {}) {
    return this._post('/api/pdf/merge', { filenames, ...options });
  }

  /** Split a PDF by extracting specific pages */
  async split(filename, pages, options = {}) {
    return this._post('/api/pdf/split', { filename, pages, ...options });
  }

  /** Rotate PDF pages (angle: 90, 180, or 270) */
  async rotate(filename, angle, options = {}) {
    return this._post('/api/pdf/rotate', { filename, angle, ...options });
  }

  /** Compress a PDF to reduce file size (quality: low, medium, high) */
  async compress(filename, quality = 'medium', options = {}) {
    return this._post('/api/pdf/compress', { filename, quality, ...options });
  }

  /** Convert PDF pages to images (format: png, jpg) */
  async toImage(filename, format = 'png', options = {}) {
    return this._post('/api/pdf/to-image', { filename, format, ...options });
  }

  /** Extract text from a PDF */
  async extractText(filename, options = {}) {
    return this._post('/api/pdf/extract-text', { filename, ...options });
  }

  /** Read or set PDF metadata */
  async metadata(filename, fields = {}) {
    return this._post('/api/pdf/metadata', { filename, ...fields });
  }

  /** Add page numbers to a PDF */
  async pageNumbers(filename, options = {}) {
    return this._post('/api/pdf/page-numbers', { filename, ...options });
  }

  /** Convert PDF to PDF/A archival format */
  async toPdfA(filename, conformance = '2b', options = {}) {
    return this._post('/api/pdf/to-pdfa', { filename, conformance, ...options });
  }

  /**
   * Merge uploaded PDF files (and optionally server files) into one
   * @param {Array<string|Buffer|ReadableStream>} files - File paths, Buffers, or ReadableStreams
   * @param {object} [options]
   * @param {string[]} [options.filenames] - Existing server filenames to include
   * @param {number} [options.expiration_hours]
   * @param {number} [options.max_downloads]
   * @param {string} [options.watermark]
   */
  async mergeUpload(files, options = {}) {
    const { filenames: serverFilenames = [], ...rest } = options;
    const { FormData, Blob } = await import('formdata-node');
    const { readFile } = await import('fs/promises');
    const { basename } = await import('path');

    const form = new FormData();

    for (const file of files) {
      if (typeof file === 'string') {
        const content = await readFile(file);
        form.append('files[]', new Blob([content], { type: 'application/pdf' }), basename(file));
      } else if (Buffer.isBuffer(file)) {
        form.append('files[]', new Blob([file], { type: 'application/pdf' }), 'upload.pdf');
      } else {
        form.append('files[]', file, 'upload.pdf');
      }
    }

    for (const name of serverFilenames) {
      form.append('filenames[]', name);
    }

    for (const [key, value] of Object.entries(rest)) {
      form.append(key, String(value));
    }

    const res = await fetch(`${this.baseUrl}/api/pdf/merge-upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: 'application/json',
      },
      body: form,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new FunbrewError(json.message || 'API request failed', res.status);
    }
    return json;
  }

  // --- Templates (SaaS) ---

  /** List all templates */
  async templates() {
    return this._get('/api/templates');
  }

  /**
   * Create a template
   * @param {string} name Template name
   * @param {string} slug URL-safe slug (lowercase alphanumeric and hyphens)
   * @param {string} htmlContent HTML content with {{ variable }} placeholders
   * @param {Array<{name: string, required?: boolean}>} [variables] Variable definitions
   */
  async createTemplate(name, slug, htmlContent, variables) {
    const payload = { name, slug, html_content: htmlContent };
    if (variables !== undefined) payload.variables = variables;
    return this._post('/api/templates', payload);
  }

  /** Update a template */
  async updateTemplate(templateId, data = {}) {
    return this._request('PUT', `/api/templates/${templateId}`, data);
  }

  /** Delete a template */
  async deleteTemplate(templateId) {
    return this._request('DELETE', `/api/templates/${templateId}`);
  }

  // --- Webhooks (SaaS) ---

  /** List all webhooks */
  async webhooks() {
    return this._get('/api/webhooks');
  }

  /**
   * Create a webhook
   * @param {string} url Webhook URL
   * @param {string[]} events Event names to subscribe to
   */
  async createWebhook(url, events) {
    return this._post('/api/webhooks', { url, events });
  }

  /** Update a webhook */
  async updateWebhook(webhookId, data = {}) {
    return this._request('PUT', `/api/webhooks/${webhookId}`, data);
  }

  /** Delete a webhook */
  async deleteWebhook(webhookId) {
    return this._request('DELETE', `/api/webhooks/${webhookId}`);
  }

  // --- Storage Config (SaaS) ---

  /** Get current storage configuration */
  async storageConfig() {
    return this._get('/api/storage-config');
  }

  /**
   * Create storage configuration
   * @param {'s3'|'gcs'} driver Storage driver
   * @param {object} config Driver config (must include "bucket")
   */
  async createStorageConfig(driver, config) {
    return this._post('/api/storage-config', { driver, config });
  }

  /** Update storage configuration */
  async updateStorageConfig(data = {}) {
    return this._request('PUT', '/api/storage-config', data);
  }

  /** Delete storage configuration */
  async deleteStorageConfig() {
    return this._request('DELETE', '/api/storage-config');
  }

  /** Get usage information */
  async usage() {
    return this._get('/api/usage');
  }

  /** Generate PDF in test mode */
  async test(html, options = {}) {
    return this.fromHtml(html, { ...options, test: true });
  }

  async _get(path) {
    return this._request('GET', path);
  }

  async _post(path, data) {
    return this._request('POST', path, data);
  }

  async _request(method, path, data) {
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(`${this.baseUrl}${path}`, options);
    const json = await res.json();

    if (!res.ok) {
      throw new FunbrewError(json.message || 'API request failed', res.status);
    }

    return json;
  }
}

class FunbrewError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'FunbrewError';
    this.statusCode = statusCode;
  }
}

module.exports = { FunbrewPdf, FunbrewError };
