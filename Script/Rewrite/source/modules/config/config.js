
(function() {
    'use strict';

    const CONFIG = {
      PANEL_ID: 'utilify_panel',
      STYLE_ID: 'utilify_style',
      STORAGE_KEY: 'UtilifyConfig',
      UPDATE_URL: 'https://raw.githubusercontent.com/gxthickitty/Utilify/main/Script/Rewrite/Utilify.user.js',
      
      defaults: {
        gradient: null,
        gradientAngle: 45,
        gradientColor1: '#3a3a3a',
        gradientColor2: '#2b2a2a',
        fontFamily: null,
        onlineFont: null,
        glassPanels: { enabled: true, radius: 8, hue: 270, alpha: 0.16 },
        onlineStyles: '',
        customCSS: '',
        disableFriendslist: false,
        blurSensitive: false,
        blurComments: false,
        appearOffline: false,
        friendActivity: false,
        playerTypeDisplay: false,
        lazyStreakKeeper: false
      }
    };
  

    const Storage = {
      get(key, fallback) {
        try {
          if (typeof GM_getValue === 'function') return GM_getValue(key, fallback);
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : fallback;
        } catch {
          return fallback;
        }
      },
      
      set(key, value) {
        try {
          if (typeof GM_setValue === 'function') return GM_setValue(key, value);
          localStorage.setItem(key, JSON.stringify(value));
        } catch {}
      },
      
      getConfig() {
        return { ...CONFIG.defaults, ...this.get(CONFIG.STORAGE_KEY, {}) };
      },
      
      saveConfig(cfg) {
        this.set(CONFIG.STORAGE_KEY, cfg);
      }
    };
  

    function getProfileIdFromBootstrap() {
      const scripts = document.querySelectorAll('script');
      for (let script of scripts) {
        if (!script.textContent) continue;
        if (script.textContent.includes('options.bootstrap')) {
          try {
            const match = /options\.bootstrap\s*=\s*({[\s\S]*?});/.exec(script.textContent);
            if (match && match[1]) {
              const options = eval(`(${match[1]})`);
              if (options.current_user?.id) return options.current_user.id;
              if (options.object?.id) return options.object.id;
            }
          } catch {}
        }
      }
      return null;
    }
  
    function debounce(fn, ms) {
      let timer;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
      };
    }
  
    const Styles = {
      inject(id, css) {
        let el = document.getElementById(id);
        if (!el) {
          el = document.createElement('style');
          el.id = id;
          document.head.appendChild(el);
        }
        el.textContent = css;
        return el;
      },
      
      initBase() {
        this.inject(CONFIG.STYLE_ID, `
          @keyframes sparkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 100% 0; }
          }
  
          #${CONFIG.PANEL_ID} {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: min(720px, 94vw);
            max-height: 64vh;
            border-radius: 20px;
            overflow: hidden;
            background: linear-gradient(135deg, #1a1b1e 0%, #252629 50%, #1a1b1e 100%);
            color: #e8e8ee;
            box-shadow: 
              0 0 60px rgba(200, 190, 220, 0.15),
              0 20px 80px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            z-index: 120000;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            border: 1px solid rgba(200, 190, 220, 0.2);
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            backdrop-filter: blur(20px);
          }
          
          #${CONFIG.PANEL_ID}.visible {
            display: flex;
            flex-direction: column;
            opacity: 1;
          }
  
          #${CONFIG.PANEL_ID}::before {
            content: '';
            position: absolute;
            top: -2px;
            right: -2px;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255, 192, 203, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: shimmer 4s ease-in-out infinite;
          }
  
          /* Sparkle stars on left border */
          #${CONFIG.PANEL_ID}::after {
            content: '✦';
            position: absolute;
            left: -1px;
            top: 20%;
            color: rgba(255, 192, 203, 0.5);
            font-size: 16px;
            animation: sparkle 2s ease-in-out infinite;
            text-shadow: 0 0 10px rgba(255, 192, 203, 0.8);
          }
  
          .star-1, .star-2, .star-3, .star-4, .star-5, .star-6 {
            position: absolute;
            color: rgba(200, 190, 220, 0.6);
            font-size: 12px;
            animation: sparkle 3s ease-in-out infinite;
            pointer-events: none;
          }
          .star-1 { left: -1px; top: 40%; animation-delay: 0.5s; }
          .star-2 { left: -1px; top: 60%; animation-delay: 1s; font-size: 14px; }
          .star-3 { left: -1px; top: 80%; animation-delay: 1.5s; }
          .star-4 { right: -1px; top: 30%; animation-delay: 0.7s; font-size: 10px; color: rgba(255, 192, 203, 0.5); }
          .star-5 { right: -1px; top: 50%; animation-delay: 1.2s; color: rgba(255, 192, 203, 0.5); }
          .star-6 { right: -1px; top: 70%; animation-delay: 1.8s; font-size: 13px; color: rgba(255, 192, 203, 0.5); }
          
          /* Header sparkles */
          .header-star-1, .header-star-2, .header-star-3 {
            position: absolute;
            color: rgba(255, 192, 203, 0.4);
            font-size: 10px;
            animation: sparkle 2.5s ease-in-out infinite;
            pointer-events: none;
          }
          .header-star-1 { left: 10%; top: 15px; animation-delay: 0.4s; }
          .header-star-2 { left: 30%; top: 12px; animation-delay: 1.1s; }
          .header-star-3 { right: 10%; top: 15px; animation-delay: 0.8s; }
  
          #${CONFIG.PANEL_ID} .header {
            height: 60px;
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 0 24px;
            cursor: grab;
            user-select: none;
            background: linear-gradient(135deg, rgba(40, 42, 48, 0.8) 0%, rgba(30, 32, 38, 0.9) 100%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            position: relative;
          }
  
          #${CONFIG.PANEL_ID} .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, 
              transparent 0%, 
              rgba(255, 192, 203, 0.3) 50%, 
              transparent 100%);
          }
  
          #${CONFIG.PANEL_ID} .title {
            font-weight: 500;
            font-size: 12px;
            letter-spacing: 2px;
            color: rgba(200, 190, 220, 0.5);
            text-transform: uppercase;
            flex: 1;
            text-align: center;
            position: relative;
          }
          
          #${CONFIG.PANEL_ID} .title::before,
          #${CONFIG.PANEL_ID} .title::after {
            content: '✦';
            position: absolute;
            color: rgba(255, 192, 203, 0.4);
            font-size: 10px;
            animation: sparkle 2s ease-in-out infinite;
          }
          
          #${CONFIG.PANEL_ID} .title::before {
            left: -16px;
            animation-delay: 0.3s;
          }
          
          #${CONFIG.PANEL_ID} .title::after {
            right: -16px;
            animation-delay: 0.8s;
          }
  
          #${CONFIG.PANEL_ID} .close {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #d8d8de;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 18px;
            line-height: 1;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          #${CONFIG.PANEL_ID} .close:hover {
            background: rgba(255, 192, 203, 0.15);
            border-color: rgba(255, 192, 203, 0.3);
            color: #ffc0cb;
            transform: scale(1.05);
          }
  
          #${CONFIG.PANEL_ID} .body {
            display: flex;
            gap: 2px;
            height: calc(64vh - 60px);
            background: rgba(0, 0, 0, 0.2);
            position: relative;
          }
  
          /* Vertical text on right */
          #${CONFIG.PANEL_ID} .body::after {
            content: 'Made by Simon';
            position: absolute;
            right: 12px;
            bottom: 20px;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            font-size: 11px;
            letter-spacing: 2px;
            color: rgba(200, 190, 220, 0.4);
            font-weight: 500;
            text-transform: uppercase;
            pointer-events: none;
          }
  
          #${CONFIG.PANEL_ID} .tabs {
            width: 180px;
            background: linear-gradient(180deg, rgba(30, 32, 38, 0.6) 0%, rgba(20, 22, 28, 0.8) 100%);
            padding: 16px 12px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
  
          #${CONFIG.PANEL_ID} .tab {
            padding: 14px 16px;
            cursor: pointer;
            border-left: 3px solid transparent;
            color: #a8a8b8;
            border-radius: 10px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 14px;
            font-weight: 500;
            position: relative;
            overflow: hidden;
          }
  
          #${CONFIG.PANEL_ID} .tab::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 192, 203, 0.1) 0%, rgba(200, 190, 220, 0.05) 100%);
            opacity: 0;
            transition: opacity 0.25s ease;
          }
  
          #${CONFIG.PANEL_ID} .tab:hover {
            background: rgba(255, 255, 255, 0.03);
            color: #d8d8e8;
            transform: translateX(4px);
          }
  
          #${CONFIG.PANEL_ID} .tab:hover::before {
            opacity: 1;
          }
  
          #${CONFIG.PANEL_ID} .tab.active {
            background: linear-gradient(135deg, rgba(255, 192, 203, 0.15) 0%, rgba(200, 190, 220, 0.1) 100%);
            border-left-color: #ffc0cb;
            color: #ffc0cb;
            transform: translateX(6px);
            box-shadow: 0 4px 12px rgba(255, 192, 203, 0.2);
            position: relative;
          }
  
          #${CONFIG.PANEL_ID} .tab.active::after {
            content: '✦';
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 192, 203, 0.6);
            font-size: 12px;
            animation: sparkle 2s ease-in-out infinite;
          }
  
          #${CONFIG.PANEL_ID} .tab.active::before {
            opacity: 1;
          }
  
          #${CONFIG.PANEL_ID} .content {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            background: linear-gradient(180deg, rgba(26, 27, 30, 0.95) 0%, rgba(22, 23, 26, 0.98) 100%);
            position: relative;
          }
  
          .field-row {
            margin: 16px 0;
            display: flex;
            gap: 12px;
            align-items: center;
          }
  
          .field-label {
            font-size: 13px;
            color: #c8c8d8;
            min-width: 110px;
            font-weight: 500;
          }
  
          .color-input {
            width: 54px;
            height: 38px;
            border: 2px solid rgba(200, 190, 220, 0.2);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: rgba(0, 0, 0, 0.3);
          }
          
          .color-input:hover {
            transform: scale(1.05);
            border-color: rgba(255, 192, 203, 0.4);
            box-shadow: 0 4px 16px rgba(255, 192, 203, 0.2);
          }
  
          input[type="text"], input[type="number"], select, textarea {
            padding: 10px 14px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(200, 190, 220, 0.15);
            border-radius: 10px;
            color: #e8e8ee;
            font-size: 13px;
            transition: all 0.2s ease;
          }
          
          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: rgba(255, 192, 203, 0.5);
            box-shadow: 0 0 0 3px rgba(255, 192, 203, 0.1);
            background: rgba(0, 0, 0, 0.5);
          }
  
          input[type="range"] {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: linear-gradient(90deg, rgba(200, 190, 220, 0.2) 0%, rgba(255, 192, 203, 0.4) 100%);
            outline: none;
            -webkit-appearance: none;
          }
          
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffc0cb 0%, #c8bed8 100%);
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(255, 192, 203, 0.3);
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 16px rgba(255, 192, 203, 0.5);
          }
  
          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #ffc0cb;
          }
  
          .button {
            padding: 11px 20px;
            background: linear-gradient(135deg, rgba(255, 192, 203, 0.2) 0%, rgba(200, 190, 220, 0.15) 100%);
            color: #ffc0cb;
            border-radius: 10px;
            border: 1px solid rgba(255, 192, 203, 0.3);
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
  
          .button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
          }
  
          .button:hover::before {
            width: 300px;
            height: 300px;
          }
  
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 192, 203, 0.3);
            border-color: rgba(255, 192, 203, 0.5);
          }
  
          .button:active {
            transform: translateY(0);
          }
  
          .small-note {
            font-size: 12px;
            color: #9898a8;
            margin-top: 8px;
            line-height: 1.6;
          }
  
          label {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            color: #c8c8d8;
            font-size: 14px;
            transition: color 0.2s ease;
          }
  
          label:hover {
            color: #e8e8ee;
          }
  
          /* Scrollbars */
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(255, 192, 203, 0.3) 0%, rgba(200, 190, 220, 0.3) 100%);
            border-radius: 5px;
            border: 2px solid transparent;
            background-clip: padding-box;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(255, 192, 203, 0.5) 0%, rgba(200, 190, 220, 0.5) 100%);
            background-clip: padding-box;
          }
  
          a {
            color: #ffc0cb;
            text-decoration: none;
            transition: color 0.2s ease;
          }
  
          a:hover {
            color: #ffb0bb;
            text-decoration: underline;
          }
        `);
      },
      
      applyGradient(value, angle, c1, c2) {
        if (!value) {
          document.body.style.background = '';
          return;
        }
        document.body.style.background = value;
        document.body.style.backgroundAttachment = 'fixed';
      },
      
      applyPrivacy(cfg) {
        let css = '';
        if (cfg.disableFriendslist) css += `._1Yhgq{display:none!important}\n`;
        if (cfg.blurSensitive) css += `._13UrL .kR267 ._9smi2 ._1rJI8 ._1aUa_{filter:blur(8px);transition:filter .25s ease}\n._13UrL .kR267 ._9smi2 ._1rJI8 ._1aUa_:hover{filter:blur(0)}\n._3zDi-{filter:blur(8px);transition:filter .25s ease}\n._3zDi-:hover{filter:blur(0)}\n._2O_AH{filter:blur(8px);transition:filter .25s ease}\n._2O_AH:hover{filter: blur(0)}\n._3hI0M{filter:blur(8px);transition:filter .25s ease}\n._3hI0M:hover{filter: blur(0)}\n._2IqY6{filter:blur(8px);transition:filter .25s ease}\n._2IqY6:hover{filter: blur(0)}\n.css-1hitfzb{filter:blur(8px);transition:filter .25s ease}\n.css-1hitfzb:hover{filter: blur(0)}`;
        if (cfg.blurComments) css += `._3Wsxf{filter:blur(8px);transition:filter .25s ease}\n._3Wsxf:hover{filter:none}\n`;
        this.inject('utilify_privacy', css);
      },
      
      applyGlass(cfg) {
        if (!cfg.glassPanels?.enabled) {
          this.inject('utilify_glass', '');
          return;
        }
        const { radius, hue, alpha } = cfg.glassPanels;
        this.inject('utilify_glass', `
          ._3TORb ._2E1AL .tRx6U, .css-1wbcikz, .css-wog98n, .css-o4yc28, .css-z05bui,  {
            background-color: hsla(${hue},68%,43%,${alpha}) !important;
            backdrop-filter: blur(6px) !important;
            border-radius: ${radius}px !important;
            transition: all 0.25s ease !important;
          }
          ._3TORb {
            background-color: hsla(${hue},68%,43%,${alpha}) !important;
            border-radius: ${radius}px !important;
            transition: all 0.25s ease !important;            
          }
        `);
      },
      
      applyCustomCSS(css) {
        this.inject('utilify_custom', css || '');
      },
  
      loadOnlineCSS(urls) {
        document.querySelectorAll('link[data-utilify-online]').forEach(el => el.remove());
        if (!urls) return;
        urls.split('\n').map(s => s.trim()).filter(Boolean).forEach(url => {
          try {
            const u = new URL(url);
            const l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = u.href;
            l.dataset.utilifyOnline = '1';
            document.head.appendChild(l);
          } catch {}
        });
      },
  
      applyFont(fontName, fontUrl) {
        document.querySelectorAll('link[data-utilify-font]').forEach(el => el.remove());
        document.querySelectorAll('style[data-utilify-font-style]').forEach(el => el.remove());
        
        if (!fontName || !fontUrl) {
          const st = document.createElement('style');
          st.dataset.utilifyFontStyle = '1';
          st.textContent = `* { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }`;
          document.head.appendChild(st);
          return;
        }
  
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontUrl;
        link.dataset.utilifyFont = '1';
        document.head.appendChild(link);
  
        // Apply font
        const st = document.createElement('style');
        st.dataset.utilifyFontStyle = '1';
        st.textContent = `* { font-family: '${fontName}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }`;
        document.head.appendChild(st);
      },
  
      loadOnlineFont(url) {
        if (!url) return;
        try {
          new URL(url);
          const match = url.includes('fonts.googleapis.com') ? (url.match(/family=([^&:]+)/) || [])[1] : null;
          const family = match ? match.replace(/\+/g, ' ') : 'CustomFont';
          this.applyFont(family, url);
        } catch {}
      }
    };
  
    const RiskyFeatures = {
      pulseBlocker: { installed: false },
      friendActivity: { timer: null, observer: null, profileId: null },
      playerType: { attached: false, observer: null },
      streakKeeper: { timer: null },
  
      // Pulse blocker (appear offline)
      installPulseBlocker() {
        if (this.pulseBlocker.installed) return;
        
        window.__utilify_orig_xhr_open = XMLHttpRequest.prototype.open;
        window.__utilify_orig_xhr_send = XMLHttpRequest.prototype.send;
        window.__utilify_orig_fetch = window.fetch;
  
        XMLHttpRequest.prototype.open = function(method, url) {
          this.__utilify_method = (method || '').toUpperCase();
          this.__utilify_url = typeof url === 'string' ? url : null;
          return window.__utilify_orig_xhr_open.apply(this, arguments);
        };
  
        XMLHttpRequest.prototype.send = function(body) {
          try {
            if (this.__utilify_method === 'POST' && this.__utilify_url) {
              const u = new URL(this.__utilify_url, location.href);
              if (/^\/user\/\d+\/pulse\/?$/.test(u.pathname)) {
                this.abort && this.abort();
                return;
              }
            }
          } catch {}
          return window.__utilify_orig_xhr_send.apply(this, arguments);
        };
  
        window.fetch = function(resource, init) {
          try {
            const method = (init?.method || 'GET').toUpperCase();
            if (method === 'POST') {
              const url = resource instanceof Request ? resource.url : resource;
              const u = new URL(url, location.href);
              if (/^\/user\/\d+\/pulse\/?$/.test(u.pathname)) {
                return Promise.resolve(new Response(null, { status: 204 }));
              }
            }
          } catch {}
          return window.__utilify_orig_fetch.apply(this, arguments);
        };
  
        this.pulseBlocker.installed = true;
      },
  
      uninstallPulseBlocker() {
        if (!this.pulseBlocker.installed) return;
        if (window.__utilify_orig_xhr_open) XMLHttpRequest.prototype.open = window.__utilify_orig_xhr_open;
        if (window.__utilify_orig_xhr_send) XMLHttpRequest.prototype.send = window.__utilify_orig_xhr_send;
        if (window.__utilify_orig_fetch) window.fetch = window.__utilify_orig_fetch;
        this.pulseBlocker.installed = false;
      },
  
      // Friend Activity
      async fetchGameTitle(gid, cache = {}) {
        if (cache[gid]) return cache[gid];
        try {
          const res = await fetch(`https://www.kogama.com/games/play/${gid}/`);
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const title = doc.querySelector('title')?.textContent.split(' - KoGaMa')[0]?.trim() || null;
          if (title) cache[gid] = title;
          return title;
        } catch { return null; }
      },
  
      async fetchProjectName(pid, cache = {}) {
        if (cache[pid]) return cache[pid];
        try {
          const res = await fetch(`https://www.kogama.com/game/${pid}/member`);
          if (!res.ok) return null;
          const data = await res.json();
          if (data.data?.length) {
            const name = data.data[0].name;
            cache[pid] = name;
            return name;
          }
        } catch {}
        return null;
      },
  
      updateFriendStatus(name, text) {
        document.querySelectorAll('._1taAL').forEach(el => {
          const nameEl = el.querySelector('._3zDi-');
          const statusEl = el.querySelector('._40qZj');
          if (nameEl?.textContent?.trim() === name && statusEl) {
            statusEl.textContent = text;
          }
        });
      },
  
      async processFriendEntry(entry, cache = { games: {}, projects: {} }) {
        const nameEl = entry.querySelector('._3zDi-');
        if (!nameEl) return;
        const name = nameEl.textContent?.trim();
        if (!name) return;
  
        const statusEl = entry.querySelector('._40qZj');
        const loc = statusEl?.textContent?.trim() || entry.querySelector('a[href]')?.getAttribute('href');
        if (!loc) return;
  
        const gameMatch = loc.match(/\/games\/play\/(\d+)\//);
        if (gameMatch) {
          const title = await this.fetchGameTitle(gameMatch[1], cache.games);
          if (title) this.updateFriendStatus(name, title);
          return;
        }
  
        const projectMatch = loc.match(/\/build\/\d+\/project\/(\d+)\//) || loc.match(/\/game\/(\d+)\/member/);
        if (projectMatch) {
          const nameText = await this.fetchProjectName(projectMatch[1], cache.projects);
          if (nameText) this.updateFriendStatus(name, nameText);
        }
      },
  
      enableFriendActivity() {
        if (this.friendActivity.observer) return;
        
        const profileId = getProfileIdFromBootstrap();
        if (!profileId) return;
  
        this.friendActivity.profileId = profileId;
        const cache = { games: {}, projects: {} };
  
        const scanList = (container) => {
          container?.querySelectorAll('._1lvYU, ._1taAL').forEach(node => 
            this.processFriendEntry(node, cache)
          );
        };
  
        const containers = ['._1Yhgq', '._3Wytz', 'div[role="list"]'];
        let target = null;
        for (const sel of containers) {
          target = document.querySelector(sel);
          if (target) break;
        }
  
        if (target) {
          scanList(target);
          const mo = new MutationObserver(() => scanList(target));
          mo.observe(target, { childList: true, subtree: true });
          this.friendActivity.observer = mo;
        }
      },
  
      disableFriendActivity() {
        if (this.friendActivity.observer) {
          this.friendActivity.observer.disconnect();
          this.friendActivity.observer = null;
        }
      },
  
      // Player Type Display
      async renderPlayerChip(el) {
        if (!el) return;
        try {
          const res = await fetch(location.href);
          const html = await res.text();
          const m = html.match(/playing_now_members["']\s*:\s*(\d+).*?playing_now_tourists["']\s*:\s*(\d+)/s);
          const counts = m ? { members: +m[1], tourists: +m[2] } : { members: 0, tourists: 0 };
          
          el.innerHTML = '';
          el.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 192, 203, 0.15), rgba(200, 190, 220, 0.1));
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 192, 203, 0.2);
            border-radius: 12px;
            padding: 8px 16px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            color: #e8e8ee;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            font-size: 13px;
          `;
  
          const total = counts.members + counts.tourists;
          el.innerHTML = `
            <span style="font-weight:600; color:#ffc0cb;">Global: ${total}</span>
            <span style="color:#c8bed8;">Players: ${counts.members}</span>
            <span style="color:#a8a8b8;">Tourists: ${counts.tourists}</span>
          `;
        } catch {}
      },
  
      enablePlayerTypeDisplay() {
        if (!location.pathname.includes('/games/play/')) return;
        if (this.playerType.attached) return;
  
        const selectors = ['.MuiChip-colorPrimary', '.PlayerCountChip', '[data-player-chip]'];
        const findAndRender = () => {
          for (const sel of selectors) {
            const chip = document.querySelector(sel);
            if (chip) {
              this.renderPlayerChip(chip);
              this.playerType.attached = true;
              return true;
            }
          }
          return false;
        };
  
        if (findAndRender()) return;
  
        const mo = new MutationObserver(() => {
          if (findAndRender()) mo.disconnect();
        });
        mo.observe(document.body, { childList: true, subtree: true });
        this.playerType.observer = mo;
      },
  
      disablePlayerTypeDisplay() {
        if (this.playerType.observer) {
          this.playerType.observer.disconnect();
          this.playerType.observer = null;
        }
        this.playerType.attached = false;
      },
  
      // Lazy Streak Keeper
      enableStreakKeeper() {
        if (this.streakKeeper.timer) return;
  
        const userId = getProfileIdFromBootstrap();
        if (!userId) return;
  
        const TARGET = 670350173;
        const INTERVAL = 7 * 60 * 60 * 1000;
        const MESSAGES = [
          "you are so loved <3",
          "streak check in, hi!",
          "keeping the streak alive <3",
          "quick hello from your streak bot"
        ];
  
        const sendMessage = async () => {
          const lastSent = parseInt(localStorage.getItem('ls_last_sent') || '0');
          if (Date.now() - lastSent < INTERVAL) return;
  
          try {
            const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            await fetch(`https://www.kogama.com/chat/${userId}/`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ to_profile_id: TARGET, message: msg })
            });
            localStorage.setItem('ls_last_sent', Date.now().toString());
          } catch {}
        };
  
        sendMessage();
        this.streakKeeper.timer = setInterval(sendMessage, 60 * 1000);
      },
  
      disableStreakKeeper() {
        if (this.streakKeeper.timer) {
          clearInterval(this.streakKeeper.timer);
          this.streakKeeper.timer = null;
        }
      }
    };

    const UI = {
      panel: null,
      
      create() {
        if (this.panel) return this.panel;
        
        this.panel = document.createElement('div');
        this.panel.id = CONFIG.PANEL_ID;
        this.panel.innerHTML = `
          <div class="star-1">✦</div>
          <div class="star-2">✧</div>
          <div class="star-3">✦</div>
          <div class="star-4">✧</div>
          <div class="star-5">✦</div>
          <div class="star-6">✧</div>
          <div class="header">
            <div class="header-star-1">✦</div>
            <div class="header-star-2">✧</div>
            <div class="header-star-3">✦</div>
            <div class="title">Utilify V2</div>
            <button class="close" aria-label="Close">×</button>
          </div>
          <div class="body">
            <div class="tabs">
              <div class="tab active" data-tab="gradient">Gradient</div>
              <div class="tab" data-tab="privacy">Privacy</div>
              <div class="tab" data-tab="styles">Styles</div>
              <div class="tab" data-tab="fonts">Fonts</div>
              <div class="tab" data-tab="risky">UAOR</div>
              <div class="tab" data-tab="about">About</div>
            </div>
            <div class="content">
              ${this.renderTabs()}
            </div>
          </div>
        `;
        
        document.body.appendChild(this.panel);
        this.setupEvents();
        this.enableDrag();
        return this.panel;
      },
      
      renderTabs() {
        return `
          <div class="tab-content" id="tab-gradient">
            <div class="field-row">
              <span class="field-label">Angle</span>
              <input id="gradient-angle" type="range" min="0" max="360" value="45" style="flex:1"/>
              <span id="angle-val" style="min-width:40px; text-align:right; color:#ffc0cb;">45°</span>
            </div>
            <div class="field-row">
              <span class="field-label">Color 1</span>
              <input id="color1" class="color-input" type="color" value="#3a3a3a"/>
              <input id="color1hex" type="text" placeholder="#HEX" style="flex:1"/>
            </div>
            <div class="field-row">
              <span class="field-label">Color 2</span>
              <input id="color2" class="color-input" type="color" value="#2b2a2a"/>
              <input id="color2hex" type="text" placeholder="#HEX" style="flex:1"/>
            </div>
            <div class="field-row">
              <span class="field-label">Gradient CSS</span>
              <input id="gradient-input" type="text" placeholder="linear-gradient(...)" style="flex:1"/>
            </div>
            <div class="field-row" style="margin-top:20px;">
              <button id="gradient-apply" class="button">Apply</button>
              <button id="gradient-copy" class="button">Copy CSS</button>
              <button id="gradient-clear" class="button">Clear</button>
            </div>
            <div class="small-note" style="margin-top:12px;">
              Changes apply live as you adjust colors and angle. Paste custom gradient CSS in the input above.
            </div>
          </div>
  
          <div class="tab-content" id="tab-privacy" style="display:none">
            <div class="small-note" style="margin-bottom:20px;">
              Privacy controls to manage your browsing experience.
            </div>
            <div class="field-row">
              <label><input type="checkbox" id="disable-friendslist" /> Hide Friendslist</label>
            </div>
            <div class="field-row">
              <label><input type="checkbox" id="blur-sensitive" /> Blur Sensitive Content</label>
            </div>
            <div class="field-row">
              <label><input type="checkbox" id="blur-comments" /> Blur Comments</label>
            </div>
            <div class="small-note" style="margin-top:16px;">
              Hover over blurred content to reveal it.
            </div>
          </div>
  
          <div class="tab-content" id="tab-styles" style="display:none">
            <div class="field-row">
              <label><input type="checkbox" id="glass-toggle" /> Enable Glass Panels</label>
            </div>
            <div class="field-row">
              <span class="field-label">Border Radius</span>
              <input id="glass-radius" type="number" min="0" max="50" value="8" style="width:80px"/>
              <span style="color:#a8a8b8;">px</span>
            </div>
            <div class="field-row">
              <span class="field-label">Hue</span>
              <input id="glass-hue" type="range" min="0" max="360" value="270" style="flex:1"/>
              <span id="glass-hue-val" style="min-width:40px; text-align:right; color:#ffc0cb;">270</span>
            </div>
            <div class="field-row">
              <span class="field-label">Alpha</span>
              <input id="glass-alpha" type="range" min="1" max="50" value="16" style="flex:1"/>
              <span id="glass-alpha-val" style="min-width:40px; text-align:right; color:#ffc0cb;">16</span>
            </div>
            <div style="margin-top:24px">
              <span class="field-label" style="display:block; margin-bottom:8px;">Online CSS URLs (one per line)</span>
              <textarea id="online-styles" rows="4" style="width:100%; resize:vertical;"></textarea>
            </div>
            <div style="margin-top:16px">
              <span class="field-label" style="display:block; margin-bottom:8px;">Custom CSS</span>
              <textarea id="custom-css" rows="6" style="width:100%; resize:vertical;"></textarea>
            </div>
          </div>
  
          <div class="tab-content" id="tab-fonts" style="display:none">
            <div class="field-row">
              <span class="field-label">Font Family</span>
              <select id="main-font" style="flex:1">
                <option value="default">System Default</option>
                <option value="roboto">Roboto</option>
                <option value="comfortaa">Comfortaa</option>
                <option value="online">Custom Online Font</option>
              </select>
            </div>
            <div class="field-row">
              <span class="field-label">Font URL</span>
              <input id="online-font-url" type="text" placeholder="https://fonts.googleapis.com/..." style="flex:1"/>
            </div>
            <div class="small-note" style="margin-top:16px;">
              For Google Fonts, copy the &lt;link&gt; href URL.
            </div>
          </div>
  
          <div class="tab-content" id="tab-risky" style="display:none">
            <div style="background:rgba(255,100,100,0.1); border:1px solid rgba(255,100,100,0.3); border-radius:10px; padding:16px; margin-bottom:24px;">
              <strong style="color:#ff6b6b;">⚠️ Use At Your Own Risk</strong>
              <p class="small-note" style="margin-top:8px;">These features may potentially violate Terms of Service.</p>
            </div>
            <div class="field-row">
              <label><input type="checkbox" id="appear-offline" /> Appear Offline (blocks pulse requests)</label>
            </div>
            <div class="field-row">
              <label><input type="checkbox" id="friend-activity" /> Friend Activity Monitor</label>
            </div>
            <div class="field-row">
              <label><input type="checkbox" id="player-type" /> Player Type Display</label>
            </div>
            <div class="field-row">
              <label><input type="checkbox" id="lazy-streak" /> Lazy Streak Keeper</label>
            </div>
            <div class="small-note" style="margin-top:16px;">
              Streak Keeper requires friending profile <a href="https://www.kogama.com/profile/670350173/" target="_blank">670350173</a>.
            </div>
          </div>
  
          <div class="tab-content" id="tab-about" style="display:none">
            <div style="text-align:center; padding:20px 0;">
              <h3 style="color:#ffc0cb; margin-bottom:16px; font-size:20px;">✦ Utilify V2 ✦</h3>
              <p class="small-note" style="font-size:13px; line-height:1.8; margin-bottom:24px;">
                Made by Community For Community.<br>
                A project of passion & love.<br><br>
                Fully maintained by <a href="https://www.github.com/gxthickitty/utilify" target="_blank">Simon</a>
              </p>
              <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:20px;">
                <h4 style="color:#c8bed8; font-size:14px; margin-bottom:16px;">Contributors</h4>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; font-size:13px; color:#a8a8b8;">
                  <div>Death Wolf.</div>
                  <div>Snowy</div>
                  <div>Awoi</div>
                  <div>Selene</div>
                  <div>Tungsten</div>
                  <div>Raptor</div>
                  <div>Comenxo</div>
                  <div>Idealism</div>
                  <div>Sorry</div>
                </div>
                <p class="small-note" style="margin-top:16px;">Thank you to all testers and supporters! ✨</p>
              </div>
            </div>
          </div>
        `;
      },
      
      setupEvents() {
        // Tab switching
        this.panel.querySelectorAll('.tab').forEach(tab => {
          tab.addEventListener('click', () => {
            this.panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.panel.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            tab.classList.add('active');
            this.panel.querySelector(`#tab-${tab.dataset.tab}`).style.display = '';
          });
        });
        
        this.panel.querySelector('.close').addEventListener('click', () => this.hide());
        
        // Gradient controls
        const angleInput = this.panel.querySelector('#gradient-angle');
        const angleVal = this.panel.querySelector('#angle-val');
        const color1 = this.panel.querySelector('#color1');
        const color2 = this.panel.querySelector('#color2');
        const color1hex = this.panel.querySelector('#color1hex');
        const color2hex = this.panel.querySelector('#color2hex');
        const gradientInput = this.panel.querySelector('#gradient-input');
  
        let gradientTimeout = null;
        const updateGradientLive = debounce(() => {
          const angle = angleInput.value;
          const c1 = color1.value;
          const c2 = color2.value;
          const grad = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
          
          gradientInput.value = grad;
          Styles.applyGradient(grad, angle, c1, c2);
          
          const cfg = Storage.getConfig();
          cfg.gradient = grad;
          cfg.gradientAngle = angle;
          cfg.gradientColor1 = c1;
          cfg.gradientColor2 = c2;
          Storage.saveConfig(cfg);
        }, 150);
  
        angleInput.addEventListener('input', () => {
          angleVal.textContent = angleInput.value + '°';
          updateGradientLive();
        });
  
        color1.addEventListener('input', () => {
          color1hex.value = color1.value;
          updateGradientLive();
        });
  
        color2.addEventListener('input', () => {
          color2hex.value = color2.value;
          updateGradientLive();
        });
  
        color1hex.addEventListener('change', (e) => {
          const val = e.target.value.trim();
          if (/^#[0-9a-f]{3,6}$/i.test(val)) {
            color1.value = val;
            updateGradientLive();
          }
        });
  
        color2hex.addEventListener('change', (e) => {
          const val = e.target.value.trim();
          if (/^#[0-9a-f]{3,6}$/i.test(val)) {
            color2.value = val;
            updateGradientLive();
          }
        });
  
        gradientInput.addEventListener('input', debounce(() => {
          const val = gradientInput.value.trim();
          if (!val) return;
          const match = val.match(/linear-gradient\((\d+)deg\s*,\s*(#[0-9a-f]{3,6})\s*,\s*(#[0-9a-f]{3,6})\)/i);
          if (match) {
            angleInput.value = match[1];
            angleVal.textContent = match[1] + '°';
            color1.value = match[2];
            color2.value = match[3];
            color1hex.value = match[2];
            color2hex.value = match[3];
            Styles.applyGradient(val, match[1], match[2], match[3]);
            
            const cfg = Storage.getConfig();
            cfg.gradient = val;
            cfg.gradientAngle = match[1];
            cfg.gradientColor1 = match[2];
            cfg.gradientColor2 = match[3];
            Storage.saveConfig(cfg);
          }
        }, 300));
  
        this.panel.querySelector('#gradient-apply').addEventListener('click', updateGradientLive);
        
        this.panel.querySelector('#gradient-copy').addEventListener('click', () => {
          const val = gradientInput.value.trim();
          if (val && navigator.clipboard) {
            navigator.clipboard.writeText(val);
            const btn = this.panel.querySelector('#gradient-copy');
            const orig = btn.textContent;
            btn.textContent = 'Copied! ✓';
            setTimeout(() => btn.textContent = orig, 1500);
          }
        });
        
        this.panel.querySelector('#gradient-clear').addEventListener('click', () => {
          const cfg = Storage.getConfig();
          cfg.gradient = null;
          Storage.saveConfig(cfg);
          Styles.applyGradient(null);
          gradientInput.value = '';
        });
        
        // Privacy toggles
        ['disable-friendslist', 'blur-sensitive', 'blur-comments'].forEach(id => {
          this.panel.querySelector(`#${id}`).addEventListener('change', (e) => {
            const cfg = Storage.getConfig();
            const key = id.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
            cfg[key] = e.target.checked;
            Storage.saveConfig(cfg);
            Styles.applyPrivacy(cfg);
          });
        });
        
        // Glass panels
        this.panel.querySelector('#glass-toggle').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.glassPanels.enabled = e.target.checked;
          Storage.saveConfig(cfg);
          Styles.applyGlass(cfg);
        });
  
        this.panel.querySelector('#glass-radius').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.glassPanels.radius = parseInt(e.target.value) || 8;
          Storage.saveConfig(cfg);
          Styles.applyGlass(cfg);
        });
        
        const hueInput = this.panel.querySelector('#glass-hue');
        const hueVal = this.panel.querySelector('#glass-hue-val');
        const alphaInput = this.panel.querySelector('#glass-alpha');
        const alphaVal = this.panel.querySelector('#glass-alpha-val');
        
        hueInput.addEventListener('input', debounce(() => {
          hueVal.textContent = hueInput.value;
          const cfg = Storage.getConfig();
          cfg.glassPanels.hue = parseInt(hueInput.value);
          Storage.saveConfig(cfg);
          Styles.applyGlass(cfg);
        }, 150));
  
        alphaInput.addEventListener('input', debounce(() => {
          alphaVal.textContent = alphaInput.value;
          const cfg = Storage.getConfig();
          cfg.glassPanels.alpha = parseInt(alphaInput.value) / 100;
          Storage.saveConfig(cfg);
          Styles.applyGlass(cfg);
        }, 150));
  
        this.panel.querySelector('#online-styles').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.onlineStyles = e.target.value;
          Storage.saveConfig(cfg);
          Styles.loadOnlineCSS(cfg.onlineStyles);
        });
        
        this.panel.querySelector('#custom-css').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.customCSS = e.target.value;
          Storage.saveConfig(cfg);
          Styles.applyCustomCSS(cfg.customCSS);
        });
  
        this.panel.querySelector('#main-font').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.fontFamily = e.target.value;
          Storage.saveConfig(cfg);
          
          if (e.target.value === 'roboto') {
            Styles.applyFont('Roboto', 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          } else if (e.target.value === 'comfortaa') {
            Styles.applyFont('Comfortaa', 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap');
          } else if (e.target.value === 'online' && cfg.onlineFont) {
            Styles.loadOnlineFont(cfg.onlineFont);
          } else {
            Styles.applyFont(null, null);
          }
        });
  
        this.panel.querySelector('#online-font-url').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.onlineFont = e.target.value;
          Storage.saveConfig(cfg);
          if (e.target.value && cfg.fontFamily === 'online') {
            Styles.loadOnlineFont(e.target.value);
          }
        });
  
        // Risky features
        this.panel.querySelector('#appear-offline').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.appearOffline = e.target.checked;
          Storage.saveConfig(cfg);
          e.target.checked ? RiskyFeatures.installPulseBlocker() : RiskyFeatures.uninstallPulseBlocker();
        });
  
        this.panel.querySelector('#friend-activity').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.friendActivity = e.target.checked;
          Storage.saveConfig(cfg);
          e.target.checked ? RiskyFeatures.enableFriendActivity() : RiskyFeatures.disableFriendActivity();
        });
  
        this.panel.querySelector('#player-type').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.playerTypeDisplay = e.target.checked;
          Storage.saveConfig(cfg);
          e.target.checked ? RiskyFeatures.enablePlayerTypeDisplay() : RiskyFeatures.disablePlayerTypeDisplay();
        });
  
        this.panel.querySelector('#lazy-streak').addEventListener('change', (e) => {
          const cfg = Storage.getConfig();
          cfg.lazyStreakKeeper = e.target.checked;
          Storage.saveConfig(cfg);
          e.target.checked ? RiskyFeatures.enableStreakKeeper() : RiskyFeatures.disableStreakKeeper();
        });
      },
      
      enableDrag() {
        const header = this.panel.querySelector('.header');
        let isDragging = false;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;
        
        header.addEventListener('mousedown', (e) => {
          if (e.target.closest('.close')) return;
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          const rect = this.panel.getBoundingClientRect();
          startLeft = rect.left;
          startTop = rect.top;
          header.style.cursor = 'grabbing';
          this.panel.style.transition = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          this.panel.style.left = (startLeft + dx) + 'px';
          this.panel.style.top = (startTop + dy) + 'px';
          this.panel.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', () => {
          if (!isDragging) return;
          isDragging = false;
          header.style.cursor = '';
          setTimeout(() => {
            this.panel.style.transition = '';
          }, 50);
        });
      },
      
      show() {
        this.panel.classList.add('visible');
        const cfg = Storage.getConfig();
        this.loadConfig(cfg);
      },
      
      hide() {
        this.panel.classList.remove('visible');
      },
      
      loadConfig(cfg) {
        this.panel.querySelector('#gradient-angle').value = cfg.gradientAngle;
        this.panel.querySelector('#angle-val').textContent = cfg.gradientAngle + '°';
        this.panel.querySelector('#color1').value = cfg.gradientColor1;
        this.panel.querySelector('#color2').value = cfg.gradientColor2;
        this.panel.querySelector('#color1hex').value = cfg.gradientColor1;
        this.panel.querySelector('#color2hex').value = cfg.gradientColor2;
        this.panel.querySelector('#gradient-input').value = cfg.gradient || `linear-gradient(${cfg.gradientAngle}deg, ${cfg.gradientColor1}, ${cfg.gradientColor2})`;
        this.panel.querySelector('#disable-friendslist').checked = cfg.disableFriendslist;
        this.panel.querySelector('#blur-sensitive').checked = cfg.blurSensitive;
        this.panel.querySelector('#blur-comments').checked = cfg.blurComments;
        this.panel.querySelector('#glass-toggle').checked = cfg.glassPanels.enabled;
        this.panel.querySelector('#glass-radius').value = cfg.glassPanels.radius;
        this.panel.querySelector('#glass-hue').value = cfg.glassPanels.hue;
        this.panel.querySelector('#glass-hue-val').textContent = cfg.glassPanels.hue;
        this.panel.querySelector('#glass-alpha').value = Math.round((cfg.glassPanels.alpha || 0.16) * 100);
        this.panel.querySelector('#glass-alpha-val').textContent = Math.round((cfg.glassPanels.alpha || 0.16) * 100);
        this.panel.querySelector('#online-styles').value = cfg.onlineStyles;
        this.panel.querySelector('#custom-css').value = cfg.customCSS;
        this.panel.querySelector('#main-font').value = cfg.fontFamily || 'default';
        this.panel.querySelector('#online-font-url').value = cfg.onlineFont || '';
        this.panel.querySelector('#appear-offline').checked = cfg.appearOffline;
        this.panel.querySelector('#friend-activity').checked = cfg.friendActivity;
        this.panel.querySelector('#player-type').checked = cfg.playerTypeDisplay;
        this.panel.querySelector('#lazy-streak').checked = cfg.lazyStreakKeeper;
      }
    };

    function createSettingsButton() {
      const btn = document.createElement('button');
      btn.id = 'utilify_settings_btn';
      btn.setAttribute('aria-label', 'Open Utilify Settings');
      btn.innerHTML = '✦';
      btn.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255, 192, 203, 0.3), rgba(200, 190, 220, 0.3));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 192, 203, 0.4);
        color: #ffc0cb;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(255, 192, 203, 0.3);
        z-index: 119999;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1) rotate(90deg)';
        btn.style.boxShadow = '0 6px 30px rgba(255, 192, 203, 0.5)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1) rotate(0deg)';
        btn.style.boxShadow = '0 4px 20px rgba(255, 192, 203, 0.3)';
      });
      
      btn.addEventListener('click', () => UI.show());
      document.body.appendChild(btn);
    }
  
    function init() {
      Styles.initBase();
      UI.create();
      createSettingsButton();
      
      const cfg = Storage.getConfig();
      Styles.applyGradient(cfg.gradient);
      Styles.applyPrivacy(cfg);
      Styles.applyGlass(cfg);
      Styles.applyCustomCSS(cfg.customCSS);
      Styles.loadOnlineCSS(cfg.onlineStyles);
  
      if (cfg.fontFamily === 'roboto') {
        Styles.applyFont('Roboto', 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
      } else if (cfg.fontFamily === 'comfortaa') {
        Styles.applyFont('Comfortaa', 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap');
      } else if (cfg.fontFamily === 'online' && cfg.onlineFont) {
        Styles.loadOnlineFont(cfg.onlineFont);
      }
  
      if (cfg.appearOffline) RiskyFeatures.installPulseBlocker();
      if (cfg.friendActivity) RiskyFeatures.enableFriendActivity();
      if (cfg.playerTypeDisplay) RiskyFeatures.enablePlayerTypeDisplay();
      if (cfg.lazyStreakKeeper) RiskyFeatures.enableStreakKeeper();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    window.addEventListener('beforeunload', () => {
      RiskyFeatures.disableFriendActivity();
      RiskyFeatures.disablePlayerTypeDisplay();
      RiskyFeatures.disableStreakKeeper();
    });
  })();



// Faster Friends V3 - Ethereal Edition
(function () {
    "use strict";
  
    const URL_PATTERN = /^https:\/\/www\.kogama\.com\/profile\/(\w+)\/friends\/$/i;
  
    function run() {
      if (!URL_PATTERN.test(window.location.href)) return;
  
      function getProfileIDFromURL() {
        const m = window.location.href.match(URL_PATTERN);
        return m ? m[1] : null;
      }
  
      function saveProfileID() {
        const id = getProfileIDFromURL();
        if (id) localStorage.setItem("kogamaProfileID", id);
      }
  
      function alphaFirstComparator(a, b) {
        const sa = String(a || "").toLowerCase();
        const sb = String(b || "").toLowerCase();
        const isLetter = s => /^[a-z]/.test(s);
        const aLetter = isLetter(sa);
        const bLetter = isLetter(sb);
        if (aLetter && !bLetter) return -1;
        if (!aLetter && bLetter) return 1;
        return sa.localeCompare(sb, undefined, { sensitivity: "base", numeric: false });
      }
  
      function ensureRootUIRemoved(rootId) {
        const existing = document.getElementById(rootId);
        if (existing) existing.remove();
        const existingStyle = document.getElementById("frlscrape-style");
        if (existingStyle) existingStyle.remove();
        const existingReopen = document.getElementById("frlscrape-reopen");
        if (existingReopen) existingReopen.remove();
      }
  
      function createStyle() {
        const css = `
  @keyframes sparkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 100% 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  #frlscrape-root {
    position: fixed;
    z-index: 99999;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  
  #frlscrape-panel {
    position: fixed;
    z-index: 100000;
    width: min(920px, 92vw);
    max-height: 84vh;
    background: linear-gradient(135deg, #1a1b1e 0%, #252629 50%, #1a1b1e 100%);
    color: #e8e8ee;
    border-radius: 20px;
    box-shadow: 
      0 0 60px rgba(200, 190, 220, 0.15),
      0 20px 80px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    pointer-events: auto;
    border: 1px solid rgba(200, 190, 220, 0.2);
    backdrop-filter: blur(20px);
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  #frlscrape-panel::before {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 192, 203, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: shimmer 4s ease-in-out infinite;
  }
  
  /* Border sparkles */
  .panel-star-1, .panel-star-2, .panel-star-3, 
  .panel-star-4, .panel-star-5, .panel-star-6 {
    position: absolute;
    color: rgba(200, 190, 220, 0.6);
    font-size: 12px;
    animation: sparkle 3s ease-in-out infinite;
    pointer-events: none;
  }
  
  .panel-star-1 { left: -1px; top: 20%; animation-delay: 0.5s; }
  .panel-star-2 { left: -1px; top: 50%; animation-delay: 1s; font-size: 14px; }
  .panel-star-3 { left: -1px; top: 80%; animation-delay: 1.5s; }
  .panel-star-4 { right: -1px; top: 30%; animation-delay: 0.7s; font-size: 10px; color: rgba(255, 192, 203, 0.5); }
  .panel-star-5 { right: -1px; top: 60%; animation-delay: 1.2s; color: rgba(255, 192, 203, 0.5); }
  .panel-star-6 { right: -1px; top: 85%; animation-delay: 1.8s; font-size: 13px; color: rgba(255, 192, 203, 0.5); }
  
  #frlscrape-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    gap: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    cursor: grab;
    user-select: none;
    background: linear-gradient(135deg, rgba(40, 42, 48, 0.8) 0%, rgba(30, 32, 38, 0.9) 100%);
    position: relative;
  }
  
  #frlscrape-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 192, 203, 0.3) 50%, 
      transparent 100%);
  }
  
  /* Header sparkles */
  .header-star-1, .header-star-2, .header-star-3 {
    position: absolute;
    color: rgba(255, 192, 203, 0.4);
    font-size: 10px;
    animation: sparkle 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  .header-star-1 { left: 10%; top: 15px; animation-delay: 0.4s; }
  .header-star-2 { left: 40%; top: 12px; animation-delay: 1.1s; }
  .header-star-3 { right: 10%; top: 15px; animation-delay: 0.8s; }
  
  #frlscrape-header.dragging {
    cursor: grabbing;
  }
  
  #frlscrape-title {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    color: rgba(200, 190, 220, 0.5);
    text-transform: uppercase;
    position: relative;
    white-space: nowrap;
  }
  
  #frlscrape-title::before,
  #frlscrape-title::after {
    content: '✦';
    position: absolute;
    color: rgba(255, 192, 203, 0.4);
    font-size: 10px;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  #frlscrape-title::before {
    left: -14px;
    animation-delay: 0.3s;
  }
  
  #frlscrape-title::after {
    right: -14px;
    animation-delay: 0.8s;
  }
  
  #frlscrape-controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  #frlscrape-close {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #d8d8de;
    font-size: 18px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 10px;
    line-height: 1;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  #frlscrape-close:hover {
    background: rgba(255, 192, 203, 0.15);
    border-color: rgba(255, 192, 203, 0.3);
    color: #ffc0cb;
    transform: scale(1.05);
  }
  
  #frlscrape-search {
    flex: 1;
    max-width: 480px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  #frlscrape-search input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid rgba(200, 190, 220, 0.15);
    background: rgba(0, 0, 0, 0.4);
    color: #e8e8ee;
    outline: none;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  #frlscrape-search input::placeholder {
    color: rgba(200, 190, 220, 0.4);
  }
  
  #frlscrape-search input:focus {
    border-color: rgba(255, 192, 203, 0.5);
    box-shadow: 0 0 0 3px rgba(255, 192, 203, 0.1);
    background: rgba(0, 0, 0, 0.5);
  }
  
  #frlscrape-body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 20px;
    overflow: auto;
    background: linear-gradient(180deg, rgba(26, 27, 30, 0.95) 0%, rgba(22, 23, 26, 0.98) 100%);
    position: relative;
  }
  
  /* Vertical "Made by Simon" text */
  #frlscrape-body::after {
    content: 'Made by Simon';
    position: absolute;
    right: 8px;
    bottom: 16px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 11px;
    letter-spacing: 2px;
    color: rgba(200, 190, 220, 0.4);
    font-weight: 500;
    text-transform: uppercase;
    pointer-events: none;
  }
  
  .frsection {
    background: linear-gradient(135deg, rgba(255, 192, 203, 0.03) 0%, rgba(200, 190, 220, 0.02) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 16px;
    border-radius: 12px;
    min-height: 140px;
    max-height: 56vh;
    overflow: auto;
    transition: all 0.2s ease;
  }
  
  .frsection:hover {
    background: linear-gradient(135deg, rgba(255, 192, 203, 0.05) 0%, rgba(200, 190, 220, 0.03) 100%);
    border-color: rgba(255, 192, 203, 0.15);
  }
  
  .frsection h3 {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    background: linear-gradient(135deg, #ffc0cb 0%, #c8bed8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    position: relative;
  }
  
  .frsection h3::before {
    content: '✦';
    position: absolute;
    left: -16px;
    color: rgba(255, 192, 203, 0.4);
    font-size: 10px;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  .entry {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    margin-right: 2px;
    margin-bottom: 6px;
  }
  
  .entry a {
    color: #c8c8d8;
    text-decoration: none;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 8px;
    display: inline-block;
    transition: all 0.15s ease;
  }
  
  .entry a:hover {
    background: rgba(255, 192, 203, 0.12);
    color: #ffc0cb;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 192, 203, 0.2);
  }
  
  .separator {
    display: inline;
    margin-right: 4px;
    color: rgba(255, 255, 255, 0.3);
  }
  
  .empty-note {
    color: rgba(200, 190, 220, 0.5);
    font-size: 13px;
    padding: 8px 4px;
    font-style: italic;
  }
  
  #frlscrape-reopen {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 24px;
    z-index: 100000;
    padding: 12px 24px;
    border-radius: 12px;
    border: 1px solid rgba(255, 192, 203, 0.3);
    background: linear-gradient(135deg, rgba(255, 192, 203, 0.2) 0%, rgba(200, 190, 220, 0.15) 100%);
    backdrop-filter: blur(10px);
    color: #ffc0cb;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(255, 192, 203, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    display: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  #frlscrape-reopen:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 30px rgba(255, 192, 203, 0.5);
    border-color: rgba(255, 192, 203, 0.5);
  }
  
  /* Scrollbars */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(255, 192, 203, 0.3) 0%, rgba(200, 190, 220, 0.3) 100%);
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(255, 192, 203, 0.5) 0%, rgba(200, 190, 220, 0.5) 100%);
    background-clip: padding-box;
  }
  
  @media (max-width: 880px) {
    #frlscrape-body {
      grid-template-columns: 1fr;
    }
    
    #frlscrape-body::after {
      display: none;
    }
  }
  `;
        const style = document.createElement("style");
        style.id = "frlscrape-style";
        style.textContent = css;
        document.head.appendChild(style);
      }
  
      function buildUI() {
        const rootId = "frlscrape-root";
        ensureRootUIRemoved(rootId);
        createStyle();
  
        const root = document.createElement("div");
        root.id = rootId;
  
        const panel = document.createElement("div");
        panel.id = "frlscrape-panel";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "false");
  
        // Add sparkle stars to panel
        for (let i = 1; i <= 6; i++) {
          const star = document.createElement("div");
          star.className = `panel-star-${i}`;
          star.textContent = i % 2 === 0 ? '✧' : '✦';
          panel.appendChild(star);
        }
  
        const header = document.createElement("div");
        header.id = "frlscrape-header";
  
        // Add header sparkles
        for (let i = 1; i <= 3; i++) {
          const star = document.createElement("div");
          star.className = `header-star-${i}`;
          star.textContent = i % 2 === 0 ? '✧' : '✦';
          header.appendChild(star);
        }
  
        const leftWrap = document.createElement("div");
        leftWrap.style.display = "flex";
        leftWrap.style.alignItems = "center";
        leftWrap.style.gap = "16px";
  
        const title = document.createElement("div");
        title.id = "frlscrape-title";
        title.textContent = "Friends & Requests";
  
        const searchWrap = document.createElement("div");
        searchWrap.id = "frlscrape-search";
  
        const input = document.createElement("input");
        input.id = "frlscrape-search-input";
        input.type = "search";
        input.placeholder = "Search by username...";
        input.autocomplete = "off";
        input.addEventListener("input", () => filterAllLists(input.value.trim().toLowerCase()));
  
        searchWrap.appendChild(input);
        leftWrap.appendChild(title);
        leftWrap.appendChild(searchWrap);
  
        const controls = document.createElement("div");
        controls.id = "frlscrape-controls";
  
        const closeBtn = document.createElement("button");
        closeBtn.id = "frlscrape-close";
        closeBtn.setAttribute("aria-label", "Close");
        closeBtn.innerHTML = "×";
  
        controls.appendChild(closeBtn);
  
        header.appendChild(leftWrap);
        header.appendChild(controls);
  
        const body = document.createElement("div");
        body.id = "frlscrape-body";
  
        const friendsSection = document.createElement("div");
        friendsSection.className = "frsection";
        friendsSection.id = "friendsList";
        const fh = document.createElement("h3");
        fh.textContent = "Friends";
        friendsSection.appendChild(fh);
  
        const invitingSection = document.createElement("div");
        invitingSection.className = "frsection";
        invitingSection.id = "invitingList";
        const ih = document.createElement("h3");
        ih.textContent = "Inviting";
        invitingSection.appendChild(ih);
  
        const sentSection = document.createElement("div");
        sentSection.className = "frsection";
        sentSection.id = "sentList";
        const sh = document.createElement("h3");
        sh.textContent = "Sent";
        sentSection.appendChild(sh);
  
        body.appendChild(friendsSection);
        body.appendChild(invitingSection);
        body.appendChild(sentSection);
  
        panel.appendChild(header);
        panel.appendChild(body);
        root.appendChild(panel);
        document.body.appendChild(panel);
  
        panel.style.left = "50%";
        panel.style.top = "50%";
        panel.style.transform = "translate(-50%,-50%)";
        delete panel.dataset.dragged;
  
        const reopen = document.createElement("button");
        reopen.id = "frlscrape-reopen";
        reopen.type = "button";
        reopen.textContent = "Open Friends Panel";
        document.body.appendChild(reopen);
  
        const ui = { root, panel, header, input, friendsSection, invitingSection, sentSection, reopen };
  
        const centerPanel = () => {
          const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
          const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
          const w = panel.offsetWidth;
          const h = panel.offsetHeight;
          panel.style.left = `${Math.max(12, (vw - w) / 2)}px`;
          panel.style.top = `${Math.max(12, (vh - h) / 2)}px`;
        };
  
        centerPanel();
  
        function onWindowResize() {
          if (!panel.dataset.dragged) centerPanel();
        }
  
        window.addEventListener("resize", onWindowResize);
  
        let dragState = null;
  
        function startDrag(clientX, clientY) {
          const rect = panel.getBoundingClientRect();
          panel.style.left = `${rect.left}px`;
          panel.style.top = `${rect.top}px`;
          panel.style.transform = "";
          panel.classList.add("dragging");
          header.classList.add("dragging");
          dragState = {
            startX: clientX,
            startY: clientY,
            panelLeft: rect.left,
            panelTop: rect.top,
            panelW: rect.width,
            panelH: rect.height
          };
          panel.style.transition = "none";
        }
  
        function moveDrag(clientX, clientY) {
          if (!dragState) return;
          const dx = clientX - dragState.startX;
          const dy = clientY - dragState.startY;
          const left = dragState.panelLeft + dx;
          const top = dragState.panelTop + dy;
          const maxLeft = Math.max(8, window.innerWidth - dragState.panelW - 8);
          const maxTop = Math.max(8, window.innerHeight - dragState.panelH - 8);
          panel.style.left = `${Math.min(Math.max(8, left), maxLeft)}px`;
          panel.style.top = `${Math.min(Math.max(8, top), maxTop)}px`;
          panel.dataset.dragged = "1";
        }
  
        function endDrag() {
          if (!dragState) return;
          dragState = null;
          panel.classList.remove("dragging");
          header.classList.remove("dragging");
          panel.style.transition = "";
        }
  
        header.addEventListener("mousedown", (ev) => {
          if (ev.target.closest("#frlscrape-close")) return;
          startDrag(ev.clientX, ev.clientY);
          const onMove = (e) => moveDrag(e.clientX, e.clientY);
          const onUp = () => {
            endDrag();
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
          };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        });
  
        header.addEventListener("touchstart", (ev) => {
          if (ev.target.closest("#frlscrape-close")) return;
          const t = ev.touches[0];
          startDrag(t.clientX, t.clientY);
          const onMove = (e) => {
            const t2 = e.touches[0];
            moveDrag(t2.clientX, t2.clientY);
          };
          const onEnd = () => {
            endDrag();
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onEnd);
            document.removeEventListener("touchcancel", onEnd);
          };
          document.addEventListener("touchmove", onMove, { passive: false });
          document.addEventListener("touchend", onEnd);
          document.addEventListener("touchcancel", onEnd);
        });
  
        closeBtn.addEventListener("click", () => {
          panel.style.display = "none";
          ui.reopen.style.display = "block";
        });
  
        ui.reopen.addEventListener("click", () => {
          panel.style.display = "";
          ui.reopen.style.display = "none";
          if (!panel.dataset.dragged) centerPanel();
        });
  
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            if (panel.style.display !== "none") {
              panel.style.display = "none";
              ui.reopen.style.display = "block";
            } else {
              panel.style.display = "";
              ui.reopen.style.display = "none";
              if (!panel.dataset.dragged) centerPanel();
            }
          }
        });
  
        function onDocClick(e) {
          if (panel.style.display === "none") return;
          if (!panel.contains(e.target) && e.target !== ui.reopen) {
            panel.style.display = "none";
            ui.reopen.style.display = "block";
          }
        }
  
        setTimeout(() => document.addEventListener("click", onDocClick), 50);
  
        return ui;
      }
  
      function createEntryLink(text, href, id) {
        const wrapper = document.createElement("span");
        wrapper.className = "entry";
        if (id) wrapper.dataset.entryId = id;
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = text;
        const sep = document.createElement("span");
        sep.className = "separator";
        sep.textContent = ",";
        wrapper.appendChild(a);
        wrapper.appendChild(sep);
        return wrapper;
      }
  
      function updateSeparators(sectionEl) {
        if (!sectionEl) return;
        const entries = Array.from(sectionEl.querySelectorAll(".entry"));
        entries.forEach(e => (e.style.display = e.style.display || ""));
        const visible = entries.filter(e => e.style.display !== "none");
        sectionEl.querySelectorAll(".empty-note").forEach(n => n.remove());
        if (visible.length === 0) {
          entries.forEach(e => (e.style.display = "none"));
          const note = document.createElement("div");
          note.className = "empty-note";
          note.textContent = "No matches.";
          sectionEl.appendChild(note);
          return;
        }
        for (let i = 0; i < entries.length; i++) {
          const el = entries[i];
          const sep = el.querySelector(".separator");
          const isVisible = el.style.display !== "none";
          const hasVisibleAfter = entries.slice(i + 1).some(e => e.style.display !== "none");
          if (sep) sep.style.display = isVisible && hasVisibleAfter ? "inline" : "none";
        }
      }
  
      async function fetchJSON(url, opts = {}) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 12000);
        try {
          const res = await fetch(url, { ...opts, signal: controller.signal });
          clearTimeout(id);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        } finally {
          clearTimeout(id);
        }
      }
  
      function appendSortedEntries(container, items) {
        if (!container) return;
        container.querySelectorAll(".entry").forEach(n => n.remove());
        container.querySelectorAll(".empty-note").forEach(n => n.remove());
        const mapped = items.slice();
        mapped.sort((a, b) => alphaFirstComparator(a.name, b.name));
        if (mapped.length === 0) {
          const n = document.createElement("div");
          n.className = "empty-note";
          n.textContent = "No entries.";
          container.appendChild(n);
          return;
        }
        mapped.forEach((it) => {
          const el = createEntryLink(it.name, it.href, it.id);
          container.appendChild(el);
        });
        updateSeparators(container);
      }
  
      async function fetchAndRenderFriends(ui) {
        const profileID = localStorage.getItem("kogamaProfileID");
        if (!profileID) return;
        const url = `https://www.kogama.com/user/${profileID}/friend/?count=555`;
        try {
          const data = await fetchJSON(url);
          const friends = Array.isArray(data.data) ? data.data.filter(f => f.friend_status === "accepted") : [];
          const items = friends.map(f => ({ name: f.friend_username || f.friend_profile_id, href: `https://www.kogama.com/profile/${f.friend_profile_id}/`, id: f.friend_profile_id }));
          appendSortedEntries(ui.friendsSection, items);
        } catch (err) {
          const note = document.createElement("div");
          note.className = "empty-note";
          note.textContent = "Failed to load friends.";
          ui.friendsSection.appendChild(note);
          console.error("Friends fetch error", err);
        }
      }
  
      async function fetchAndRenderRequests(ui) {
        const profileID = localStorage.getItem("kogamaProfileID");
        if (!profileID) return;
        const url = `https://www.kogama.com/user/${profileID}/friend/requests/?page=1&count=1000`;
        try {
          const data = await fetchJSON(url, { method: "GET", headers: { "Content-Type": "application/json" } });
          const arr = Array.isArray(data.data) ? data.data : [];
          const sent = arr.filter(r => String(r.profile_id) === String(profileID)).map(r => ({ name: r.friend_username || `id:${r.friend_profile_id}`, href: `https://www.kogama.com/profile/${r.friend_profile_id}/`, id: r.id }));
          const inviting = arr
            .filter(r => String(r.profile_id) !== String(profileID))
            .map(r => ({ name: r.profile_username || `id:${r.profile_id}`, href: `https://www.kogama.com/profile/${r.profile_id}/`, id: r.id }));
          appendSortedEntries(ui.sentSection, sent);
          appendSortedEntries(ui.invitingSection, inviting);
        } catch (err) {
          const note = document.createElement("div");
          note.className = "empty-note";
          note.textContent = "Failed to load requests.";
          ui.invitingSection.appendChild(note);
          ui.sentSection.appendChild(note.cloneNode(true));
          console.error("Requests fetch error", err);
        }
      }
  
      function filterAllLists(query) {
        const lists = ["friendsList", "invitingList", "sentList"];
        lists.forEach(id => {
          const root = document.getElementById(id);
          if (!root) return;
          const entries = Array.from(root.querySelectorAll(".entry"));
          entries.forEach(el => {
            const link = el.querySelector("a");
            const matches = !query || (link && link.textContent.toLowerCase().includes(query));
            el.style.display = matches ? "" : "none";
          });
          updateSeparators(root);
        });
      }
  
      saveProfileID();
      const ui = buildUI();
      fetchAndRenderFriends(ui);
      fetchAndRenderRequests(ui);
    }
  
    run();
  })();
  
