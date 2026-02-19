// Title * Translator
// Desc * A basic one-way translator using Google Auto Detect API
// Ver * 1.0.1
// Date * 19 Feb 2026
// Auth * Haden, Simon

// Based on Haden's public script:
//   greasyfork.org/en/scripts/563386-kogama-chat-translator
// I have been given permission to implement my own approach and use in any way I want.
//   i.imgur.com/fOMwQBg.png

(function () {
    'use strict';
    let userLang = "off";
    let lastChatUser = null;
    let translationCache = new Map();
    let translationQueue = new Set();
    let isPageTranslating = false;
    let userLocale = null;
    const LOCALE_TO_LANG = {
        'en_US': 'en', 'en_GB': 'en', 'en': 'en',
        'es_ES': 'es', 'es_MX': 'es', 'es': 'es',
        'pt_BR': 'pt', 'pt_PT': 'pt', 'pt': 'pt',
        'fr_FR': 'fr', 'fr': 'fr',
        'de_DE': 'de', 'de': 'de',
        'it_IT': 'it', 'it': 'it',
        'ru_RU': 'ru', 'ru': 'ru',
        'pl_PL': 'pl', 'pl': 'pl',
        'tr_TR': 'tr', 'tr': 'tr',
        'nl_NL': 'nl', 'nl': 'nl',
        'sv_SE': 'sv', 'sv': 'sv',
        'cs_CZ': 'cs', 'cs': 'cs',
        'sk_SK': 'sk', 'sk': 'sk',
        'ro_RO': 'ro', 'ro': 'ro',
        'ar_SA': 'ar', 'ar': 'ar',
        'ja_JP': 'ja', 'ja': 'ja',
        'ko_KR': 'ko', 'ko': 'ko',
        'zh_CN': 'zh', 'zh_TW': 'zh', 'zh': 'zh'
    };

    const LANG_NAMES = {
        'en': 'English', 'es': 'Spanish', 'pt': 'Portuguese',
        'fr': 'French', 'de': 'German', 'it': 'Italian',
        'ru': 'Russian', 'pl': 'Polish', 'tr': 'Turkish',
        'nl': 'Dutch', 'sv': 'Swedish', 'cs': 'Czech',
        'sk': 'Slovak', 'ro': 'Romanian', 'ar': 'Arabic',
        'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese'
    };

    const EXCLUDE_SELECTORS = [
        'script', 'style', 'code', 'pre', 'svg', 'path',
        'input[type="password"]', 'input[type="email"]',
        '[contenteditable="true"]', '[data-no-translate]',
        '.translation-label'
    ];

    function detectUserLocale() {
        try {
            if (window.App && window.App.options && window.App.options.bootstrap) {
                const locale = window.App.options.bootstrap.locale ||
                              window.App.options.bootstrap.current_user?.language;
                if (locale) {
                    console.log('[Auto-Translator] Detected locale from App:', locale);
                    return locale;
                }
            }
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const text = script.textContent;
                if (text.includes('options.bootstrap')) {
                    const localeMatch = text.match(/locale:\s*["']([^"']+)["']/);
                    if (localeMatch) {
                        console.log('[Auto-Translator] Detected locale from script:', localeMatch[1]);
                        return localeMatch[1];
                    }
                }
            }
            const browserLang = navigator.language || navigator.userLanguage;
            console.log('[Auto-Translator] Using browser language:', browserLang);
            return browserLang;
        } catch (e) {
            console.error('[Auto-Translator] Error detecting locale:', e);
            return 'en_US';
        }
    }

    function getLanguageFromLocale(locale) {
        const langCode = LOCALE_TO_LANG[locale] || locale.split('_')[0].toLowerCase();
        return langCode;
    }

    function getCacheKey(text, lang) {
        return `${lang}:${text.substring(0, 100)}`;
    }

    function getCachedTranslation(text, lang) {
        return translationCache.get(getCacheKey(text, lang));
    }

    function setCachedTranslation(text, lang, translation) {
        const key = getCacheKey(text, lang);
        translationCache.set(key, translation);
        if (translationCache.size > 1000) {
            const firstKey = translationCache.keys().next().value;
            translationCache.delete(firstKey);
        }
    }

    function translate(text, targetLang, callback) {
        const cached = getCachedTranslation(text, targetLang);
        if (cached) {
            callback(cached.translation, cached.detected);
            return;
        }

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        fetch(url)
            .then(r => r.json())
            .then(data => {
                const translation = data[0].map(x => x[0]).join("");
                const detected = data[2];
                setCachedTranslation(text, targetLang, { translation, detected });
                callback(translation, detected);
            })
            .catch(e => {
                console.error('[Auto-Translator] Translation error:', e);
                callback(text, targetLang);
            });
    }

    function createTranslationLabel(sourceLang, element) {
        const existingLabel = element.querySelector('.translation-label');
        if (existingLabel) {
            existingLabel.remove();
        }

        const label = document.createElement('span');
        label.className = 'translation-label';
        label.style.cssText = `
            display: block;
            font-size: 10px;
            color: #888;
            margin-top: 2px;
            font-style: italic;
            cursor: pointer;
            user-select: none;
        `;

        const langName = LANG_NAMES[sourceLang] || sourceLang.toUpperCase();
        label.innerHTML = `Translated from ${langName} • <span style="text-decoration: underline;">Show original</span>`;

        let showingOriginal = false;
        label.onclick = (e) => {
            e.stopPropagation();
            showingOriginal = !showingOriginal;

            if (showingOriginal) {
                const textNode = Array.from(element.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
                if (textNode && element.dataset.originalText) {
                    textNode.textContent = element.dataset.originalText;
                }
                label.innerHTML = `Translated from ${langName} • <span style="text-decoration: underline;">Show translation</span>`;
            } else {
                const textNode = Array.from(element.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
                if (textNode && element.dataset.translatedText) {
                    textNode.textContent = element.dataset.translatedText;
                }
                label.innerHTML = `Translated from ${langName} • <span style="text-decoration: underline;">Show original</span>`;
            }
        };

        return label;
    }

    function findChatContainer() {
        return document.querySelector("._2XaOw") ||
               document.querySelector("[style*='overflow-y']");
    }

    function getChatUser() {
        const el = document.querySelector("._2XzvN");
        return el ? el.textContent.trim() : null;
    }

    function isOwnMessage(node) {
        if (node.classList?.contains("_1Xzzq")) return true;
        const s = getComputedStyle(node);
        return s.justifyContent === "flex-end" || s.textAlign === "right";
    }

    function getMessageParagraph(node) {
        return node instanceof HTMLElement ? node.querySelector("p") : null;
    }

    function getLangMap() {
        return JSON.parse(localStorage.getItem("chatLangByUser") || "{}");
    }

    function getCurrentLang() {
        const user = getChatUser();
        if (!user) return userLang;
        return getLangMap()[user] || userLang;
    }

    function setCurrentLang(lang) {
        const user = getChatUser();
        if (!user) {
            userLang = lang;
            return;
        }
        const map = getLangMap();
        map[user] = lang;
        localStorage.setItem("chatLangByUser", JSON.stringify(map));
    }

    function createHeaderLangSelector() {
        const header = document.querySelector(".F3PyX");
        if (!header) return;

        if (!header.querySelector("#tm-lang-btn")) {
            header.style.display = "flex";
            header.style.alignItems = "center";
            header.style.gap = "6px";

            const btn = document.createElement("button");
            btn.id = "tm-lang-btn";
            btn.textContent = "🌐";
            btn.title = "Chat language";
            btn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                padding: 2px;
                opacity: 0.85;
            `;

            const select = document.createElement("select");
            select.id = "tm-lang-select";
            select.style.cssText = `
                font-size: 12px;
                padding: 2px 4px;
                border-radius: 4px;
                margin-right: 6px;
                display: none;
            `;

            const langs = {
                off: "🚫 No translate",
                es: "🇪🇸 Español",
                en: "🇬🇧 English",
                fr: "🇫🇷 Français",
                pt: "🇵🇹 Português",
                de: "🇩🇪 Deutsch",
                it: "🇮🇹 Italiano",
                ru: "🇷🇺 Русский",
                pl: "🇵🇱 Polski",
                tr: "🇹🇷 Türkçe",
                nl: "🇳🇱 Nederlands",
                sv: "🇸🇪 Svenska",
                cs: "🇨🇿 Čeština",
                sk: "🇸🇰 Slovenčina",
                ro: "🇷🇴 Română",
                ar: "🇸🇦 العربية",
                ja: "🇯🇵 日本語",
                ko: "🇰🇷 한국어",
                zh: "🇨🇳 中文"
            };

            for (const code in langs) {
                const opt = document.createElement("option");
                opt.value = code;
                opt.textContent = langs[code];
                select.appendChild(opt);
            }

            select.value = getCurrentLang();

            select.onchange = () => {
                const newLang = select.value;
                setCurrentLang(newLang);
                updateAllChatMessages();
            };

            btn.onclick = () => {
                select.style.display =
                    select.style.display === "none" ? "inline-block" : "none";
            };

            const closeBtn = header.querySelector("button[aria-label='close']");
            header.insertBefore(btn, closeBtn);
            header.insertBefore(select, closeBtn);
        }

        const select = document.getElementById("tm-lang-select");
        const currentLang = getCurrentLang();
        if (select && select.value !== currentLang) {
            select.value = currentLang;
        }
    }

    function processChatMessage(node) {
        const p = getMessageParagraph(node);
        if (!p || isOwnMessage(node)) return;

        if (!node.dataset.originalText) {
            node.dataset.originalText = p.innerText;
        }

        const currentLang = getCurrentLang();

        if (currentLang === "off") {
            p.innerText = node.dataset.originalText;
            node.dataset.translated = "";
            const label = node.querySelector('.translation-label');
            if (label) label.remove();
            return;
        }

        if (node.dataset.translated === currentLang) return;

        translate(node.dataset.originalText, currentLang, (t, detected) => {
            if (detected === currentLang) return;
            if (t !== node.dataset.originalText) {
                p.innerText = t;
                node.dataset.translatedText = t;
                node.dataset.translated = currentLang;
                node.dataset.detectedLang = detected;
                p.appendChild(createTranslationLabel(detected, p));
            }
        });
    }

    function updateAllChatMessages() {
        const c = findChatContainer();
        if (!c) return;
        c.querySelectorAll("div").forEach(processChatMessage);
    }

    function observeChatMessages() {
        const c = findChatContainer();
        if (!c || c._observer) return;

        const o = new MutationObserver(m =>
            m.forEach(x => x.addedNodes.forEach(processChatMessage))
        );
        o.observe(c, { childList: true, subtree: true });
        c._observer = o;
    }

    function detectLanguage(text) {
        const patterns = {
            en: /\b(the|and|or|is|are|was|were|have|has|been|will|would|could|should|may|might|can|do|does|did|not|but|for|with|from|this|that|these|those)\b/gi,
            es: /\b(el|la|los|las|de|que|en|un|una|por|con|para|como|es|son|está|están|fue|fueron|ser|estar|haber|hacer|tener|poder|decir|ir|ver|dar|saber|querer)\b/gi,
            pt: /\b(o|a|os|as|de|que|em|um|uma|por|com|para|não|se|mais|como|mas|eu|ele|ela|você|fazer|ter|estar|ser|poder|dizer|ir|ver|dar|saber|querer)\b/gi,
            fr: /\b(le|la|les|de|un|une|des|et|ou|est|sont|été|être|avoir|faire|dire|aller|voir|savoir|pouvoir|vouloir|venir|devoir|prendre|donner|mettre|parler)\b/gi,
            de: /\b(der|die|das|den|dem|des|ein|eine|und|oder|ist|sind|war|waren|sein|haben|werden|können|müssen|sollen|wollen|machen|gehen|sehen|wissen|sagen)\b/gi,
            ru: /[а-яА-ЯёЁ]{3,}/g,
            pl: /\b(i|w|z|na|do|o|się|że|nie|jest|są|był|była|było|były|być|mieć|móc|chcieć|wiedzieć|robić|iść|widzieć|jak|co|to|ten|ta|te|który)\b/gi,
            ar: /[\u0600-\u06FF]{3,}/g,
            ja: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g,
            ko: /[\uAC00-\uD7AF]{2,}/g,
            zh: /[\u4E00-\u9FFF]{2,}/g
        };

        const counts = {};
        for (const lang in patterns) {
            const matches = text.match(patterns[lang]);
            counts[lang] = matches ? matches.length : 0;
        }

        let maxCount = 0;
        let detectedLang = null;
        for (const lang in counts) {
            if (counts[lang] > maxCount) {
                maxCount = counts[lang];
                detectedLang = lang;
            }
        }
        return maxCount >= 3 ? detectedLang : null;
    }

    function shouldTranslateText(text, targetLang) {
        if (text.length < 5) return false;
        const detected = detectLanguage(text);
        if (detected === targetLang) return false;
        const alphaCount = (text.match(/[a-zA-Z\u0080-\uFFFF]/g) || []).length;
        if (alphaCount < text.length * 0.3) return false;
        return true;
    }

    function shouldTranslateElement(element) {
        for (const selector of EXCLUDE_SELECTORS) {
            if (element.matches && element.matches(selector)) return false;
            if (element.closest && element.closest(selector)) return false;
        }
        if (element.dataset?.originalText) return false;
        return true;
    }

    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const text = node.textContent.trim();
                    if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentElement;
                    if (!shouldTranslateElement(parent)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        return textNodes;
    }

    function translatePageElement(element) {
        if (!shouldTranslateElement(element)) return;

        const textNodes = getTextNodes(element);

        textNodes.forEach(textNode => {
            const parent = textNode.parentElement;
            const originalText = textNode.textContent.trim();

            if (!originalText || originalText.length < 2) return;
            if (!shouldTranslateText(originalText, userLang)) return;

            if (!parent.dataset.originalText) {
                parent.dataset.originalText = originalText;
            }

            const queueKey = `${userLang}:${originalText}`;
            if (translationQueue.has(queueKey)) return;
            translationQueue.add(queueKey);

            translate(originalText, userLang, (translated, detected) => {
                translationQueue.delete(queueKey);
                if (detected === userLang) return;
                if (translated !== originalText && textNode.parentElement === parent) {
                    textNode.textContent = translated;
                    parent.dataset.translatedText = translated;
                    parent.dataset.translated = userLang;
                    parent.dataset.detectedLang = detected;
                    if (parent.tagName.match(/^(P|H[1-6]|DIV|LI|TD|TH)$/)) {
                        parent.appendChild(createTranslationLabel(detected, parent));
                    }
                }
            });
        });
    }

    function translateEntirePage() {
        if (userLang === "off" || isPageTranslating) return;

        isPageTranslating = true;
        console.log('[Auto-Translator] Starting page translation to:', userLang);

        const elementsToTranslate = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label, li, td, th');

        let batchIndex = 0;
        const batchSize = 20;

        function processBatch() {
            const start = batchIndex * batchSize;
            const end = Math.min(start + batchSize, elementsToTranslate.length);

            for (let i = start; i < end; i++) {
                translatePageElement(elementsToTranslate[i]);
            }

            batchIndex++;

            if (end < elementsToTranslate.length) {
                setTimeout(processBatch, 100);
            } else {
                isPageTranslating = false;
                console.log('[Auto-Translator] Page translation complete');
            }
        }

        processBatch();
    }

    function restoreOriginalPage() {
        document.querySelectorAll('[data-original-text]').forEach(el => {
            const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
            if (textNode && el.dataset.originalText) {
                textNode.textContent = el.dataset.originalText;
                delete el.dataset.translated;
                delete el.dataset.translatedText;
                delete el.dataset.detectedLang;
            }
            const label = el.querySelector('.translation-label');
            if (label) label.remove();
        });
    }

    function observePageChanges() {
        if (document.body._pageObserver) return;

        let pendingNodes = new Set();

        const observer = new MutationObserver((mutations) => {
            if (userLang === "off") return;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        pendingNodes.add(node);
                    }
                });
            });

            clearTimeout(observer._debounce);
            observer._debounce = setTimeout(() => {
                console.log(`[Auto-Translator] Processing ${pendingNodes.size} new elements`);
                pendingNodes.forEach(node => {
                    translatePageElement(node);
                });
                pendingNodes.clear();
            }, 3000);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.body._pageObserver = observer;
        console.log('[Auto-Translator] Page observer started with 3s debounce');
    }

    function createGlobalToggle() {
        if (document.getElementById('tm-global-toggle')) return;

        const toggle = document.createElement('div');
        toggle.id = 'tm-global-toggle';
        toggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            z-index: 999999;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            user-select: none;
        `;

        const updateToggleText = () => {
            const langName = userLang === 'off' ? 'OFF' : userLang.toUpperCase();
            toggle.innerHTML = `🌐 Auto-Translate: <strong>${langName}</strong>`;
        };

        updateToggleText();

        toggle.onclick = () => {
            if (userLang === "off") {
                userLang = getLanguageFromLocale(userLocale);
                localStorage.setItem('translator_globalLang', userLang);
                isPageTranslating = false;
                translateEntirePage();
            } else {
                userLang = "off";
                localStorage.setItem('translator_globalLang', userLang);
                restoreOriginalPage();
            }
            updateToggleText();
        };

        document.body.appendChild(toggle);
    }

    function initialize() {
        console.log('[Auto-Translator] Initializing...');
        userLocale = detectUserLocale();
        const detectedLang = getLanguageFromLocale(userLocale);

        console.log('[Auto-Translator] User locale:', userLocale);
        console.log('[Auto-Translator] Detected language:', detectedLang);

        const savedLang = localStorage.getItem('translator_globalLang');
        userLang = savedLang !== null ? savedLang : detectedLang;

        console.log('[Auto-Translator] Active language:', userLang);

        if (userLang !== "off") {
            translateEntirePage();
        }
        observePageChanges();
        createGlobalToggle();

        console.log('[Auto-Translator] Initialization complete');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    setInterval(() => {
        const chatUser = getChatUser();
        if (chatUser && chatUser !== lastChatUser) {
            lastChatUser = chatUser;
            updateAllChatMessages();
        }

        createHeaderLangSelector();
        observeChatMessages();
    }, 1000);

})();
