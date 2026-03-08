// Title * Google Translator
// Desc * A built-in translator to ease communication. Toggle the popout by entering  `-t` into any text field. Remain cautious with descriptions, use within those is not recommended.
// Ver * 3.0
// Date * 8 Mar 2026
// Auth * Lappy, Haden

// Made based on Haden's public script:
// greasyfork.org/en/scripts/563386-kogama-chat-translator
// I have been given permission to implement my own approach and use in any way I want.
// i.imgur.com/fOMwQBg.png


(function () {
    'use strict';
    const TRANSLATE_API = (text, tl) =>
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

    const DETECT_API = (text) =>
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;

    const LANG_OPTIONS = {
        en: '🇬🇧 English',    es: '🇪🇸 Español',     pt: '🇵🇹 Português',
        fr: '🇫🇷 Français',   de: '🇩🇪 Deutsch',     it: '🇮🇹 Italiano',
        ru: '🇷🇺 Русский',    pl: '🇵🇱 Polski',       tr: '🇹🇷 Türkçe',
        nl: '🇳🇱 Nederlands', sv: '🇸🇪 Svenska',     cs: '🇨🇿 Čeština',
        sk: '🇸🇰 Slovenčina', ro: '🇷🇴 Română',      ar: '🇸🇦 العربية',
        ja: '🇯🇵 日本語',      ko: '🇰🇷 한국어',       zh: '🇨🇳 中文',
    };

    const LANG_NAMES = {
        en: 'English', es: 'Spanish', pt: 'Portuguese', fr: 'French',
        de: 'German', it: 'Italian', ru: 'Russian', pl: 'Polish',
        tr: 'Turkish', nl: 'Dutch', sv: 'Swedish', cs: 'Czech',
        sk: 'Slovak', ro: 'Romanian', ar: 'Arabic', ja: 'Japanese',
        ko: 'Korean', zh: 'Chinese'
    };

    const LOCALE_MAP = {
        'en': 'en', 'es': 'es', 'pt': 'pt', 'fr': 'fr', 'de': 'de',
        'it': 'it', 'ru': 'ru', 'pl': 'pl', 'tr': 'tr', 'nl': 'nl',
        'sv': 'sv', 'cs': 'cs', 'sk': 'sk', 'ro': 'ro', 'ar': 'ar',
        'ja': 'ja', 'ko': 'ko', 'zh': 'zh',
    };

    const EXCLUDE_TAGS = new Set([
        'SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT',
        'TEXTAREA', 'SELECT', 'BUTTON', 'NOSCRIPT', 'IFRAME'
    ]);

    const SCAN_DEBOUNCE_MS = 1800;
    const MIN_TEXT_LEN    = 8;
    const CACHE_MAX       = 2000;

    const cache        = new Map();   // "lang:text" → { translation, detected }
    const pendingScan  = new Set();   // DOM nodes queued for scanning
    let   scanTimer    = null;
    let   userLang     = detectUserLang();

    function detectUserLang() {
        try {
            const locale = (navigator.language || 'en').split(/[-_]/)[0].toLowerCase();
            return LOCALE_MAP[locale] || 'en';
        } catch { return 'en'; }
    }

    function cacheGet(text, lang) {
        return cache.get(`${lang}\x00${text.slice(0, 120)}`);
    }

    function cacheSet(text, lang, value) {
        const key = `${lang}\x00${text.slice(0, 120)}`;
        if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
        cache.set(key, value);
    }

    async function apiTranslate(text, targetLang, sourceLang = 'auto') {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const r   = await fetch(url);
        const d   = await r.json();
        return {
            translation : d[0].map(x => x[0]).join(''),
            detected    : d[2] || 'und'
        };
    }

    async function translate(text, targetLang) {
        const hit = cacheGet(text, targetLang);
        if (hit) return hit;
        const result = await apiTranslate(text, targetLang);
        cacheSet(text, targetLang, result);
        return result;
    }

    async function detectLang(text) {
        const url = DETECT_API(text);
        const r   = await fetch(url);
        const d   = await r.json();
        return d[2] || 'und';
    }

    const NAMED_SCRIPTS = {
        ru  : /[а-яёА-ЯЁ\u0400-\u04FF]/,          // Cyrillic
        ar  : /[\u0600-\u06FF\u0750-\u077F]/,        // Arabic / Arabic supplement
        ja  : /[\u3040-\u30FF\u4E00-\u9FAF\uFF65-\uFF9F]/, // Hiragana/Katakana/CJK
        ko  : /[\uAC00-\uD7AF\u1100-\u11FF]/,        // Hangul
        zh  : /[\u4E00-\u9FFF\u3400-\u4DBF]/,        // CJK unified
        he  : /[\u05D0-\u05FF]/,                     // Hebrew
        el  : /[\u0370-\u03FF]/,                     // Greek
        th  : /[\u0E00-\u0E7F]/,                     // Thai
        hi  : /[\u0900-\u097F]/,                     // Devanagari (Hindi etc.)
        ka  : /[\u10A0-\u10FF]/,                     // Georgian  ← fixes your test case
        am  : /[\u1200-\u137F]/,                     // Ethiopic
        uk  : /[\u0400-\u04FF]/,                     // (also Cyrillic, covers Ukrainian)
    };

    const ANY_NON_LATIN_RE = /[^\u0000-\u024F\u1E00-\u1EFF\u2000-\u206F\u20A0-\u20CF\u2100-\u214F\uFE50-\uFE6F\uFF01-\uFF60]/;

    const WORD_RE = {
        en : /\b(the|and|is|are|was|were|have|has|will|would|could|should|can|do|does|did|not|but|for|with|from|this|that|they|their|there|what|when|where|how|why|who)\b/gi,
        es : /\b(el|la|los|las|de|que|en|un|una|por|con|para|como|es|son|está|fue|ser|hacer|tener|poder|decir|yo|no|más|su|también|pero|bien)\b/gi,
        pt : /\b(o|a|os|as|de|que|em|um|uma|por|com|para|não|se|mais|como|mas|eu|você|ele|ela|fazer|ter|estar|ser|poder|dizer|ir)\b/gi,
        fr : /\b(le|la|les|de|un|une|des|et|ou|est|sont|été|avoir|faire|dire|aller|voir|pas|plus|cette|dans|sur|pour|avec|que)\b/gi,
        de : /\b(der|die|das|den|dem|des|ein|eine|und|oder|ist|sind|war|sein|haben|werden|können|nicht|auch|sich|bei|noch|nach|wie)\b/gi,
        pl : /\b(i|w|z|na|do|o|się|że|nie|jest|są|był|być|mieć|jak|co|to|ten|ta|te|który|która|jego|jej|im)\b/gi,
        it : /\b(il|lo|la|i|gli|le|di|da|in|con|su|per|che|è|sono|era|essere|avere|fare|dire|andare|non|più|un|una)\b/gi,
        tr : /\b(ve|bir|bu|da|de|ile|için|gibi|daha|çok|ne|ki|var|yok|olan|mi|mı|mu|mü)\b/gi,
    };

    function looksLikeUserLang(text) {
        const userScript = NAMED_SCRIPTS[userLang];
        if (userScript && userScript.test(text)) return true;
        const wordRe = WORD_RE[userLang];
        if (wordRe) {
            const m = text.match(wordRe) || [];
            const words = text.split(/\s+/).length;
            if (words > 2 && m.length / words >= 0.2) return true;
        }
        return false;
    }

    function looksLikeForeign(text) {
        if (text.length < MIN_TEXT_LEN) return false;
        if (ANY_NON_LATIN_RE.test(text)) {
            const userScript = NAMED_SCRIPTS[userLang];
            if (!userScript || !userScript.test(text)) return true;
            return false;
        }

        if (looksLikeUserLang(text)) return false;

        let topForeignScore = 0;
        for (const [lang, re] of Object.entries(WORD_RE)) {
            if (lang === userLang) continue;
            const m = text.match(re) || [];
            if (m.length > topForeignScore) topForeignScore = m.length;
        }
        const userRe    = WORD_RE[userLang];
        const userScore = userRe ? (text.match(userRe) || []).length : 0;
        return topForeignScore >= 3 && topForeignScore > userScore * 1.5;
    }

    function injectStyles() {
        if (document.getElementById('__tr_styles')) return;
        const s = document.createElement('style');
        s.id = '__tr_styles';
        s.textContent = `
            [data-tr-foreign] {
                cursor: pointer;
                border-bottom: 1px dotted #60a5fa;
                transition: border-color .15s, color .15s;
            }
            [data-tr-foreign]:hover {
                border-bottom-color: #3b82f6;
            }
            [data-tr-foreign][data-tr-done] {
                border-bottom: 1px solid #34d399;
            }

            .tr-label {
                display: inline-block;
                margin-left: 6px;
                font-size: .72em;
                color: #6b7280;
                font-style: italic;
                cursor: pointer;
                user-select: none;
                transition: color .15s;
                white-space: nowrap;
            }
            .tr-label:hover { color: #3b82f6; }
            .tr-label b { font-style: normal; font-weight: 500; }

            #tr-compose-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,.55);
                backdrop-filter: blur(3px);
                z-index: 2147483646;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: tr-fade-in .18s ease;
            }
            @keyframes tr-fade-in {
                from { opacity: 0; }
                to   { opacity: 1; }
            }

            #tr-compose-card {
                background: #0f172a;
                border: 1px solid #1e293b;
                border-radius: 16px;
                padding: 28px 32px 24px;
                width: min(520px, 92vw);
                box-shadow: 0 24px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(99,102,241,.12);
                font-family: 'Segoe UI', system-ui, sans-serif;
                color: #e2e8f0;
                animation: tr-slide-up .22s cubic-bezier(.34,1.56,.64,1);
            }
            @keyframes tr-slide-up {
                from { transform: translateY(18px) scale(.97); opacity: 0; }
                to   { transform: none; opacity: 1; }
            }

            #tr-compose-card h2 {
                margin: 0 0 20px;
                font-size: 1.05rem;
                font-weight: 600;
                letter-spacing: .02em;
                color: #f1f5f9;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #tr-compose-card h2 span.tr-globe {
                font-size: 1.2em;
            }

            .tr-lang-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 18px;
            }
            .tr-lang-row label {
                font-size: .75rem;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: .07em;
                min-width: 38px;
            }
            .tr-lang-row select {
                flex: 1;
                background: #1e293b;
                border: 1px solid #334155;
                color: #e2e8f0;
                border-radius: 8px;
                padding: 7px 10px;
                font-size: .88rem;
                cursor: pointer;
                outline: none;
                transition: border-color .15s;
            }
            .tr-lang-row select:focus { border-color: #6366f1; }

            .tr-swap-btn {
                background: none;
                border: 1px solid #334155;
                color: #64748b;
                border-radius: 6px;
                padding: 6px 8px;
                cursor: pointer;
                font-size: .9rem;
                transition: color .15s, border-color .15s;
                line-height: 1;
            }
            .tr-swap-btn:hover { color: #a5b4fc; border-color: #6366f1; }
            .tr-panes {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 18px;
            }
            .tr-pane-label {
                font-size: .7rem;
                color: #475569;
                text-transform: uppercase;
                letter-spacing: .07em;
                margin-bottom: 5px;
            }
            .tr-pane textarea,
            .tr-pane .tr-output {
                width: 100%;
                min-height: 110px;
                background: #1e293b;
                border: 1px solid #334155;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: .9rem;
                color: #e2e8f0;
                resize: vertical;
                box-sizing: border-box;
                font-family: inherit;
                line-height: 1.5;
                outline: none;
                transition: border-color .15s;
            }
            .tr-pane textarea:focus { border-color: #6366f1; }
            .tr-pane .tr-output {
                color: #94a3b8;
                font-style: italic;
                cursor: default;
                display: flex;
                align-items: flex-start;
                position: relative;
            }
            .tr-output-text { flex: 1; }
            .tr-output-spinner {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #1e293b;
                border-radius: 8px;
            }
            .tr-spinner {
                width: 20px; height: 20px;
                border: 2px solid #334155;
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: tr-spin .6s linear infinite;
            }
            @keyframes tr-spin { to { transform: rotate(360deg); } }

            .tr-detected-badge {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                font-size: .72rem;
                background: #1e293b;
                border: 1px solid #334155;
                border-radius: 20px;
                padding: 3px 10px;
                color: #94a3b8;
                margin-bottom: 14px;
            }
            .tr-detected-badge span { color: #a5b4fc; font-weight: 500; }

            /* action row */
            .tr-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            .tr-btn {
                padding: 9px 20px;
                border-radius: 8px;
                font-size: .88rem;
                font-weight: 500;
                cursor: pointer;
                border: none;
                transition: all .15s;
                letter-spacing: .01em;
            }
            .tr-btn-cancel {
                background: #1e293b;
                color: #64748b;
                border: 1px solid #334155;
            }
            .tr-btn-cancel:hover { color: #e2e8f0; border-color: #475569; }
            .tr-btn-confirm {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: #fff;
                box-shadow: 0 4px 14px rgba(99,102,241,.35);
            }
            .tr-btn-confirm:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(99,102,241,.5);
            }
            .tr-btn-confirm:active { transform: none; }
            .tr-btn-confirm:disabled {
                opacity: .45;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
        `;
        document.head.appendChild(s);
    }

    function markForeignNode(textNode) {
        const text = textNode.textContent.trim();
        if (!looksLikeForeign(text)) return;

        const parent = textNode.parentElement;
        if (!parent || parent.closest('[data-tr-foreign]')) return;
        const wrap = document.createElement('span');
        wrap.dataset.trForeign  = '1';
        wrap.dataset.trOriginal = text;
        wrap.title = 'Click to translate';
        wrap.textContent = text;

        parent.replaceChild(wrap, textNode);

        wrap.addEventListener('click', onForeignClick, { once: false });
    }

    async function onForeignClick(e) {
        e.stopPropagation();
        const el = e.currentTarget;
        if (el.dataset.trDone) {
            el.textContent = el.dataset.trOriginal;
            delete el.dataset.trDone;
            el._trLabel?.remove();
            el._trLabel = null;
            return;
        }

        if (el.dataset.trLoading) return;
        el.dataset.trLoading = '1';
        el.title = 'Translating…';

        try {
            const original = el.dataset.trOriginal;
            const { translation, detected } = await translate(original, userLang);

            if (detected === userLang || translation === original) {
                delete el.dataset.trLoading;
                el.title = '(already in your language)';
                return;
            }

            el.textContent = translation;
            el.dataset.trDone = '1';
            delete el.dataset.trLoading;

            const langName = LANG_NAMES[detected] || detected.toUpperCase();

            const label = document.createElement('span');
            label.className = 'tr-label';
            label.innerHTML = `Translated from <b>${langName}</b> · <u>show original</u>`;
            label.title = `Original: ${original}`;
            el._trLabel = label;
            el.after(label);

            label.addEventListener('click', (ev) => {
                ev.stopPropagation();
                el.click(); // toggle
                label.remove();
            });

        } catch (err) {
            console.error('[Translator] Error:', err);
            delete el.dataset.trLoading;
            el.title = 'Translation failed — click to retry';
        }
    }

    function shouldScanElement(el) {
        if (!(el instanceof HTMLElement)) return false;
        if (EXCLUDE_TAGS.has(el.tagName)) return false;
        if (el.isContentEditable) return false;
        if (el.closest('[data-no-translate]')) return false;
        if (el.classList.contains('tr-label')) return false;
        return true;
    }

    function scanNode(root) {
        if (!shouldScanElement(root)) return;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const text = node.textContent.trim();
                if (text.length < MIN_TEXT_LEN) return NodeFilter.FILTER_REJECT;
                if (!shouldScanElement(node.parentElement)) return NodeFilter.FILTER_REJECT;
                if (node.parentElement.dataset.trForeign) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);
        nodes.forEach(markForeignNode);
    }

    function scheduleScan(roots) {
        roots.forEach(r => pendingScan.add(r));
        clearTimeout(scanTimer);
        scanTimer = setTimeout(() => {
            pendingScan.forEach(scanNode);
            pendingScan.clear();
        }, SCAN_DEBOUNCE_MS);
    }

    function startObserver() {
        const obs = new MutationObserver(mutations => {
            const roots = new Set();
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) roots.add(node);
                    else if (node.nodeType === Node.TEXT_NODE && node.parentElement)
                        roots.add(node.parentElement);
                }
            }
            if (roots.size) scheduleScan(roots);
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    let composePopupOpen = false;
    let composeTargetEl  = null;
    let composeTimer     = null;

    function buildLangSelect(id, selected, includeAuto = false) {
        const sel = document.createElement('select');
        sel.id = id;
        if (includeAuto) {
            const opt = document.createElement('option');
            opt.value = 'auto'; opt.textContent = '🔍 Auto-detect';
            sel.appendChild(opt);
        }
        for (const [code, name] of Object.entries(LANG_OPTIONS)) {
            const opt = document.createElement('option');
            opt.value = code; opt.textContent = name;
            if (code === selected) opt.selected = true;
            sel.appendChild(opt);
        }
        return sel;
    }

    function openComposePopup(targetEl, originalText) {
        if (composePopupOpen) return;
        composePopupOpen = true;
        composeTargetEl  = targetEl;
        const overlay = document.createElement('div');
        overlay.id = 'tr-compose-overlay';
        const card = document.createElement('div');
        card.id = 'tr-compose-card';
        const h2 = document.createElement('h2');
        h2.innerHTML = '<span class="tr-globe">🌐</span> Translate &amp; Replace';
        card.appendChild(h2);

        const badge = document.createElement('div');
        badge.className = 'tr-detected-badge';
        badge.innerHTML = `Detected language: <span id="tr-detected-name">detecting…</span>`;
        card.appendChild(badge);
        const langRow = document.createElement('div');
        langRow.className = 'tr-lang-row';

        const fromLabel = document.createElement('label');
        fromLabel.textContent = 'From';
        const fromSel = buildLangSelect('tr-from-sel', 'auto', true);

        const swapBtn = document.createElement('button');
        swapBtn.className = 'tr-swap-btn';
        swapBtn.title = 'Swap languages';
        swapBtn.textContent = '⇄';

        const toLabel = document.createElement('label');
        toLabel.textContent = 'To';
        const toSel = buildLangSelect('tr-to-sel', userLang);

        langRow.append(fromLabel, fromSel, swapBtn, toLabel, toSel);
        card.appendChild(langRow);

        const panes = document.createElement('div');
        panes.className = 'tr-panes';

        const srcPane = document.createElement('div');
        srcPane.className = 'tr-pane';
        const srcLabel = document.createElement('div');
        srcLabel.className = 'tr-pane-label';
        srcLabel.textContent = 'Original';
        const srcArea = document.createElement('textarea');
        srcArea.value = originalText;
        srcArea.placeholder = 'Enter text…';
        srcPane.append(srcLabel, srcArea);

        const dstPane = document.createElement('div');
        dstPane.className = 'tr-pane';
        const dstLabel = document.createElement('div');
        dstLabel.className = 'tr-pane-label';
        dstLabel.textContent = 'Translation';
        const dstOut = document.createElement('div');
        dstOut.className = 'tr-output';
        dstOut.innerHTML = `<span class="tr-output-text" id="tr-out-text"></span>`;
        dstPane.append(dstLabel, dstOut);

        panes.append(srcPane, dstPane);
        card.appendChild(panes);

        const actions = document.createElement('div');
        actions.className = 'tr-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'tr-btn tr-btn-cancel';
        cancelBtn.textContent = 'Cancel';

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'tr-btn tr-btn-confirm';
        confirmBtn.textContent = 'Replace text';
        confirmBtn.disabled = true;

        actions.append(cancelBtn, confirmBtn);
        card.appendChild(actions);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        let currentTranslation = '';
        let detectedSource     = 'auto';

        function showSpinner(show) {
            const existing = dstOut.querySelector('.tr-output-spinner');
            if (show && !existing) {
                const s = document.createElement('div');
                s.className = 'tr-output-spinner';
                s.innerHTML = '<div class="tr-spinner"></div>';
                dstOut.appendChild(s);
                confirmBtn.disabled = true;
            } else if (!show && existing) {
                existing.remove();
            }
        }

        async function doTranslate() {
            const text   = srcArea.value.trim();
            const toLang = toSel.value;
            const fromLang = fromSel.value;

            if (!text) {
                document.getElementById('tr-out-text').textContent = '';
                currentTranslation = '';
                confirmBtn.disabled = true;
                return;
            }

            showSpinner(true);

            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
                const r = await fetch(url);
                const d = await r.json();
                currentTranslation = d[0].map(x => x[0]).join('');
                detectedSource     = d[2] || fromLang;

                document.getElementById('tr-out-text').textContent = currentTranslation;
                document.getElementById('tr-detected-name').textContent =
                    LANG_NAMES[detectedSource] || detectedSource.toUpperCase();

                confirmBtn.disabled = !currentTranslation;
            } catch (e) {
                document.getElementById('tr-out-text').textContent = '⚠ Translation failed';
                currentTranslation = '';
                confirmBtn.disabled = true;
            } finally {
                showSpinner(false);
            }
        }
        if (originalText.trim()) doTranslate();
        swapBtn.addEventListener('click', () => {
            if (fromSel.value !== 'auto') {
                const tmp = fromSel.value;
                fromSel.value = toSel.value;
                toSel.value   = tmp;
            } else {
                fromSel.value = detectedSource !== 'auto' ? detectedSource : 'en';
                toSel.value   = userLang;
            }
            doTranslate();
        });

        srcArea.addEventListener('input', () => {
            clearTimeout(composeTimer);
            composeTimer = setTimeout(doTranslate, 700);
        });
        fromSel.addEventListener('change', doTranslate);
        toSel.addEventListener('change', doTranslate);
        confirmBtn.addEventListener('click', () => {
            if (!currentTranslation) return;
            setFieldValue(composeTargetEl, currentTranslation);
            closePopup();
        });
        cancelBtn.addEventListener('click', closePopup);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closePopup();
        });
        document.addEventListener('keydown', escHandler);

        function escHandler(e) {
            if (e.key === 'Escape') closePopup();
        }

        function closePopup() {
            overlay.remove();
            composePopupOpen = false;
            composeTargetEl  = null;
            document.removeEventListener('keydown', escHandler);
        }
    }
    function getFieldValue(el) {
        if (el.isContentEditable) return el.innerText;
        return el.value || '';
    }

    function setFieldValue(el, value) {
        if (el.isContentEditable) {
            el.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, value);
            el.dispatchEvent(new InputEvent('input', { bubbles: true, data: value }));
        } else if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
            el.focus();
            el.select();
            const inserted = document.execCommand('insertText', false, value);
            if (!inserted) {
                const proto = el.tagName === 'TEXTAREA'
                    ? window.HTMLTextAreaElement.prototype
                    : window.HTMLInputElement.prototype;
                const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (setter) setter.call(el, value);
                else el.value = value;
                el.dispatchEvent(new Event('input',  { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }
// MAIN -T LOGIC FLAG

    function isTextInput(el) {
        if (!el) return false;
        if (el.isContentEditable) return true;
        if (el.tagName === 'TEXTAREA') return true;
        if (el.tagName === 'INPUT' && /^(text|search|url|tel)$/i.test(el.type || 'text')) return true;
        return false;
    }

    document.addEventListener('input', (e) => {
        if (composePopupOpen) return;
        const el = e.target;
        if (!isTextInput(el)) return;

        const raw = (el.isContentEditable ? el.innerText : el.value) || '';
        // -t flag
        if (!raw.trimStart().startsWith('-t ') && raw.trim() !== '-t') return;

        const body = raw.trimStart().replace(/^-t\s*/, '');
        setFieldValue(el, body);
        openComposePopup(el, body);
    }, true);

    // -t flag
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        if (composePopupOpen) return;
        const el = document.activeElement;
        if (!isTextInput(el)) return;

        const raw = (el.isContentEditable ? el.innerText : el.value) || '';
        if (raw.trim() !== '-t') return;

        e.preventDefault();
        e.stopPropagation();
        setFieldValue(el, '');
        openComposePopup(el, '');
    }, true);
    function init() {
        injectStyles();
        scanNode(document.body);
        startObserver();
        console.log(`[Translator v2] Active — user lang: ${userLang}. Type -t in any text field to translate.`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
