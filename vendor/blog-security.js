/* Blog rendering boundary: authored content is data, never executable code. */
(() => {
  'use strict';
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const siteRoot = new URL('../', document.currentScript.src);
  function imageURL(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = value.startsWith('/images/') ? new URL(value.slice(1), siteRoot) : new URL(value, document.baseURI);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return '';
      // Safe inside either HTML attributes or a quoted CSS url().
      return url.href.replace(/["'()<>\\]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
    } catch { return ''; }
  }
  function sanitizeHTML(value) {
    const html = String(value ?? '');
    if (!window.DOMPurify?.isSupported) return escapeHTML(html);
    return window.DOMPurify.sanitize(html, {
      USE_PROFILES: {html: true},
      FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'option', 'iframe', 'object', 'embed', 'base', 'link', 'meta'],
      FORBID_ATTR: ['style', 'id', 'name'],
      ALLOW_DATA_ATTR: false
    });
  }
  window.BlogSecurity = Object.freeze({imageURL, sanitizeHTML});
})();
