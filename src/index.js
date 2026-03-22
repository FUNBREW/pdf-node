class FunbrewPdf {
  /**
   * @param {string} apiKey
   * @param {object} [options]
   * @param {string} [options.baseUrl]
   */
  constructor(apiKey, { baseUrl = 'https://pdf.funbrew.tech' } = {}) {
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
