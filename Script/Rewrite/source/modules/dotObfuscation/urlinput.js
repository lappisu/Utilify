(() => {
  'use strict';

  const WHITELISTED_DOMAINS = ['youtube.com', 'youtu.be'];

  const URL_REGEX =
    /\bhttps?:\/\/(?:www\.)?([\w.-]+\.[a-z]{2,})(?:\/[^\s]*)?/gi;

  const isTextInput = el =>
    el &&
    (el.tagName === 'TEXTAREA' ||
      (el.tagName === 'INPUT' &&
        ['text', 'search', 'url', 'email', 'tel', 'password'].includes(el.type)));

  const isWhitelisted = domain =>
    WHITELISTED_DOMAINS.some(w => domain === w || domain.endsWith('.' + w));

  const obfuscateURLs = text =>
    text.replace(URL_REGEX, (match, domain) =>
      isWhitelisted(domain)
        ? match
        : match.replace(/\./g, '%2E')
    );

  const processValue = el => {
    const start = el.selectionStart;
    const end = el.selectionEnd;

    const next = obfuscateURLs(el.value);
    if (next === el.value) return;

    el.value = next;
    el.setSelectionRange(start, end);
  };

  document.addEventListener(
    'input',
    e => {
      if (!isTextInput(e.target)) return;
      if (e.inputType && !e.inputType.startsWith('insert')) return;
      processValue(e.target);
    },
    true
  );

  document.addEventListener(
    'paste',
    e => {
      if (!isTextInput(e.target)) return;

      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      document.execCommand('insertText', false, obfuscateURLs(text));
    },
    true
  );
})();
