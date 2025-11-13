// ==UserScript==
// @name         UtilifyV2
// @namespace    add me on discord @ simonvhs if you have something useful to add gg
// @version      2.0.2
// @description  I keep going back on saying I'm done but hecc mannn, kogama is charming 
// @author       S
// @match        *://www.kogama.com/*
// @icon         https://avatars.githubusercontent.com/u/143356794?v=4
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      fonts.googleapis.com
// @connect      kogama.com
// @connect      kogama.com.br
// ==/UserScript==

(async function() { // bg + filters
  "use strict";

  const waitForElement = async (sel, timeout = 10000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(sel);
      if (el) return el;
      await new Promise(r => requestAnimationFrame(r));
    }
    throw new Error(`Element ${sel} not found`);
  };

  const effects = {
    blur: el => el.style.filter = "blur(5px)",
    none: el => { el.style.filter = "none"; el.style.opacity = "unset"; },
    dark: (el, img) => el.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.9),rgba(0,0,0,0.7)),url("${img}")`,
    rain: el => createRainEffect(el),
    snow: el => createSnowEffect(el)
  };


const createRainEffect = (e) => {
  const bg = document.createElement("div");
  Object.assign(bg.style, {
    position: "absolute", inset: "0", zIndex: "1",
    backgroundImage: e.style.backgroundImage, backgroundSize: "cover", backgroundPosition: "center",
    filter: e.style.filter
  });
  e.style.backgroundImage = "none";
  e.style.filter = "none";

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "absolute", inset: "0", pointerEvents: "none", zIndex: "2", overflow: "hidden"
  });

  let raf = 0;
  const drops = [];
  const MAX = 40; // max_amount

  const spawn = () => {
    if (drops.length > MAX) return;
    const d = {
      x: Math.random() * e.clientWidth,
      y: -10,
      len: Math.random() * 15 + 13,
      vx: (Math.random() - 0.8) * 0.7, // slower sway
      vy: Math.random() * 4.5 + 4, // slower fall
      opacity: Math.random() * 0.4 + 0.3
    };
    drops.push(d);
  };

  const draw = () => {
    if (!document.contains(e)) return cancel();
    if (!container._canvas) {
      const c = document.createElement("canvas");
      c.style.width = "100%";
      c.style.height = "100%";
      c.width = e.clientWidth * devicePixelRatio;
      c.height = e.clientHeight * devicePixelRatio;
      c.style.pointerEvents = "none";
      container.appendChild(c);
      container._canvas = c;
      container._ctx = c.getContext("2d");
    }
    const c = container._canvas;
    const ctx = container._ctx;
    if (c.width !== e.clientWidth * devicePixelRatio || c.height !== e.clientHeight * devicePixelRatio) {
      c.width = e.clientWidth * devicePixelRatio;
      c.height = e.clientHeight * devicePixelRatio;
    }
    ctx.clearRect(0,0,c.width,c.height);
    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);
    for (let i = 0; i < 2; i++) spawn(); // fewer new drops
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.x += d.vx;
      d.y += d.vy;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${d.opacity})`;
      ctx.lineWidth = Math.max(1, d.len * 0.06);
      ctx.shadowBlur = 2; // blur so its seems more real?
      ctx.shadowColor = "rgba(255,255,255,0.5)";
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.vx * 2, d.y + d.len);
      ctx.stroke();
      if (d.y - d.len > e.clientHeight + 20) drops.splice(i,1);
    }
    ctx.restore();
    raf = requestAnimationFrame(draw);
  };

  const cancel = () => {
    if (raf) cancelAnimationFrame(raf);
    container.remove();
    bg.remove();
  };

  e.appendChild(bg);
  e.appendChild(container);
  draw();

  const obs = new MutationObserver(() => { if (!document.contains(e)) { obs.disconnect(); cancel(); }});
  obs.observe(document.body, { childList: true, subtree: true });
};


const createSnowEffect = (e) => {
  const bg = document.createElement("div");
  Object.assign(bg.style, {
    position: "absolute", inset: "0", zIndex: "1",
    backgroundImage: e.style.backgroundImage, backgroundSize: "cover", backgroundPosition: "center",
    filter: e.style.filter
  });
  e.style.backgroundImage = "none";
  e.style.filter = "none";

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "absolute", inset: "0", pointerEvents: "none", zIndex: "2", overflow: "hidden"
  });

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = Math.max(1, e.clientWidth * devicePixelRatio);
  canvas.height = Math.max(1, e.clientHeight * devicePixelRatio);
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const FLAKES = Math.min(40, Math.max(16, Math.floor((e.clientWidth * e.clientHeight) / 80000))); // lower quantity
  const flakes = [];
  const now = () => performance.now();
  let last = now();
  let raf = 0;

  const makeFlake = () => ({
    x: Math.random() * canvas.width / devicePixelRatio,
    y: Math.random() * canvas.height / devicePixelRatio - canvas.height / devicePixelRatio,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.3, // slower
    vy: Math.random() * 0.5 + 0.2,   // slower
    sway: Math.random() * 20 + 5,    // subtle sway
    phase: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.5 + 0.3
  });

  for (let i = 0; i < FLAKES; i++) flakes.push(makeFlake());

  const resizeIfNeeded = () => {
    const w = Math.max(1, e.clientWidth * devicePixelRatio);
    const h = Math.max(1, e.clientHeight * devicePixelRatio);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const step = () => {
    if (!document.contains(e)) return cancel();
    resizeIfNeeded();
    const nowT = now();
    const dt = Math.min(40, nowT - last) / 1000;
    last = nowT;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.phase += dt;
      f.x += f.vx + Math.sin(f.phase) * (f.sway * 0.01);
      f.y += f.vy;
      if (f.y - f.r > canvas.height / devicePixelRatio + 10 || f.x < -50 || f.x > (canvas.width / devicePixelRatio) + 50) {
        flakes[i] = makeFlake();
        flakes[i].y = -10;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    raf = requestAnimationFrame(step);
  };

  const cancel = () => {
    if (raf) cancelAnimationFrame(raf);
    container.remove();
    bg.remove();
  };

  e.appendChild(bg);
  e.appendChild(container);
  step();

  const obs = new MutationObserver(() => {
    if (!document.contains(e)) {
      obs.disconnect();
      cancel();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });


    const onResize = () => resizeIfNeeded();
    window.addEventListener("resize", onResize);
    container._cleanup = () => window.removeEventListener("resize", onResize);
  };

  async function applyEffects() {
    try {
      const d = await waitForElement('div._9smi2 > div.MuiPaper-root._1rJI8.MuiPaper-rounded > div._1aUa_');
      const m = /(?:\|\|)?Background:\s*(\d+)(?:,\s*filter:\s*([a-z, ]+))?;?(?:\|\|)?/i.exec(d.textContent || "");
      if (!m) return;

      const img = await fetchImage(m[1]);
      const b = document.querySelector('._33DXe');
      if (!b) return;

      const fadeIn = () => b.style.opacity = '1';
      b.style.transition = 'opacity 0.28s ease-in';
      b.style.opacity = '0';
      b.style.backgroundImage = `
        linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.3) 100%),
        url("${img}")
      `;
      b.style.backgroundSize = 'cover';
      b.style.backgroundPosition = 'center';
      setTimeout(fadeIn, 300);

      (m[2] || "").split(',').map(s => s.trim()).filter(Boolean).forEach(f => {
        if (effects[f]) effects[f](b, img);
      });
    } catch (err) {
      // silent fail
    }
  }

  async function fetchImage(id) {
    const r = await fetch(`https://www.kogama.com/games/play/${id}/`);
    const h = await r.text();
    const m = h.match(/options\.bootstrap\s*=\s*({.*?});/s);
    if (!m) return "";
    try {
      const j = JSON.parse(m[1]);
      return j.object?.images?.large || Object.values(j.object?.images || {})[0] || "";
    } catch {
      return "";
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyEffects);
  else applyEffects();
})();

(async () => { // Profile Banner & Gradient - Utilify Exclusive
  "use strict";

  const waitForElement = selector => new Promise(resolve => {
    const f = () => {
      const el = document.querySelector(selector);
      el ? resolve(el) : requestAnimationFrame(f);
    };
    f();
  });

  try {
    const descEl = await waitForElement("[itemprop='description'], div._1aUa_");
    const text = descEl.textContent.trim();

    const usernameEl = document.querySelector("div._2IqY6 > h1") ||
                       document.querySelector("div._1wqQ3 > h1") ||
                       document.querySelector("h1");

    if (!usernameEl) {
      console.log("Username element not found");
      return;
    }

    // Banner parsing
    const bannerMatch = /banner:\s*['"“”]([^'"“”]+)['"“”],\s*#([0-9a-f]{6});/i.exec(text);
    if (bannerMatch) {
      const [_, bannerTextRaw, bannerColor] = bannerMatch;
      const bannerText = bannerTextRaw.trim();

      if (bannerText) {
        const bannerWrapper = document.createElement("div");
        Object.assign(bannerWrapper.style, {
          display: "flex",
          alignItems: "center",
          margin: "1px 0 10px",
          zIndex: "10",
        });

        const separator = document.createElement("div");
        separator.textContent = "|";
        Object.assign(separator.style, {
          color: `#${bannerColor}`,
          fontSize: ".75em",
          display: "inline-block",
          marginRight: "5px",
        });

        const bannerTextEl = document.createElement("div");
        bannerTextEl.textContent = bannerText;
        Object.assign(bannerTextEl.style, {
          color: `#${bannerColor}`,
          fontWeight: 600,
          fontSize: ".75em",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        });

        bannerWrapper.append(separator, bannerTextEl);

        const headerContainer = usernameEl.closest('div._2IqY6') ||
                                usernameEl.closest('div._1wqQ3') ||
                                usernameEl.parentElement;

        headerContainer?.insertBefore(bannerWrapper, usernameEl.nextSibling);
      }
    }

    // Gradient parsing
    const gradientMatch = /linear-gradient\((?:\d+deg, )?(#[0-9a-f]{6}, #[0-9a-f]{6}(?: \d+%)?)\)/i.exec(text);
    if (gradientMatch) {
      const rootEl = document.querySelector('#root-page-mobile');
      if (rootEl) {
        rootEl.style.transition = 'opacity 0.5s ease, background-image 1.3s ease-in';
        rootEl.style.opacity = '0';
        requestAnimationFrame(() => {
          rootEl.style.backgroundImage = gradientMatch[0];
          rootEl.style.opacity = '1';
        });
      }
    }

  } catch (e) {
    console.error(e);
  }
})();

(function() { // Copy Description - Utilify Exclusive
    let observer;
    let buttonAdded = false;
    function addCopyButton() {
        if (buttonAdded) return;
        const bioContainer = document.querySelector('.MuiPaper-root h2');
        if (!bioContainer || !bioContainer.textContent.includes('Bio') || bioContainer.querySelector('.aero-copy-btn')) {
            return;
        }
        const btn = document.createElement('button');
        btn.className = 'aero-copy-btn';
        btn.innerHTML = '⎘';
        btn.title = 'Copy Bio';
        btn.style.cssText = `
            margin-left: 12px;
            width: 26px;
            height: 26px;
            border: none;
            border-radius: 4px;
            background: rgba(255,255,255,0.85);
            backdrop-filter: blur(8px);
            color: #333;
            font-size: 14px;
            font-family: 'Segoe UI', system-ui, sans-serif;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            transition: all 0.2s ease;
            box-shadow:
                0 1px 1px rgba(0,0,0,0.1),
                inset 0 1px 1px rgba(255,255,255,0.7);
            position: relative;
            top: -1px;
        `;
        btn.onmouseenter = () => {
            btn.style.background = 'rgba(220,240,255,0.95)';
            btn.style.boxShadow = '0 1px 3px rgba(0,120,215,0.3)';
        };
        btn.onmouseleave = () => {
            btn.style.background = 'rgba(255,255,255,0.85)';
            btn.style.boxShadow = `
                0 1px 1px rgba(0,0,0,0.1),
                inset 0 1px 1px rgba(255,255,255,0.7)
            `;
        };
        btn.onclick = async () => {
            const bioContent = document.querySelector('div[itemprop="description"]')?.innerText.trim() || '';
            try {
                await navigator.clipboard.writeText(bioContent);
                showAeroNotification('Bio copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        };
        bioContainer.style.display = 'inline-flex';
        bioContainer.style.alignItems = 'center';
        bioContainer.appendChild(btn);
        buttonAdded = true;
        if (observer) {
            observer.disconnect();
        }
    }

    function showAeroNotification(message) {
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 6px 20px;
            background: rgba(240,248,255,0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.8);
            border-radius: 20px;
            box-shadow:
                0 2px 10px rgba(0,0,0,0.15),
                inset 0 1px 1px rgba(255,255,255,0.5);
            color: #333;
            font: 13px 'Segoe UI', system-ui, sans-serif;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(notif);
        setTimeout(() => { notif.style.opacity = '1'; }, 10);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    }
    addCopyButton();
    if (!buttonAdded) {
        observer = new MutationObserver(addCopyButton);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        setTimeout(() => {
            if (observer) {
                observer.disconnect();
            }
        }, 10000);
    }
})();
(() => { // Last Created, Last Seen, Last Played Game, InternetArchive
    'use strict';

    const enhance = () => {
        const container = document.querySelector('._13UrL ._23KvS ._1jTCU');
        const span = container?.querySelector('span._20K92');
        if (!container || !span || span.dataset.enhanced) return false;
        container.style.zIndex = '9';

        const script = [...document.scripts].find(s => s.textContent.includes('options.bootstrap = {'));
        if (!script) return false;

        try {
            const bootstrap = JSON.parse(script.textContent.match(/options\.bootstrap = (\{.*?\});/s)[1]);
            const {object: {created, last_ping}} = bootstrap;
            const gameInfo = JSON.parse(localStorage.getItem('__amplify__cache:game:last-played') || '{}')?.data;
            const formatCompactDate = d => new Date(d).toLocaleDateString([], {month: 'short', day: 'numeric', year: 'numeric'});

            const formatVerbose = d => {
                const date = new Date(d);
                const day = date.getDate();
                const daySuffix = (day % 100 >= 11 && day % 100 <= 13) ? 'th' : ['st', 'nd', 'rd'][day % 10 - 1] || 'th';
                const month = ['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()];
                const tzOffset = -date.getTimezoneOffset();
                return `${day}${daySuffix} of ${month} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} GMT${tzOffset >= 0 ? '+' : '-'}${Math.floor(Math.abs(tzOffset) / 60)}`;
            };

            const timeAgo = d => {
                const sec = Math.floor((Date.now() - new Date(d)) / 1000);
                const intervals = [31536000, 2592000, 86400, 3600, 60];
                const units = ['y', 'm', 'd', 'h', 'min'];
                for (let i = 0; i < intervals.length; i++) {
                    const val = Math.floor(sec / intervals[i]);
                    if (val >= 1) return `${val}${units[i]}`;
                }
                return 'now';
            };

            const createToggleInfo = (icon, compact, full) => {
                const container = document.createElement('div');
                container.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    margin: 0 8px 0 0;
                    font-size: 12px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.3s ease;
                    max-width: 200px;
                    overflow: hidden;
                `;

                const iconSpan = document.createElement('span');
                iconSpan.textContent = icon;
                iconSpan.style.opacity = '0.7';

                const compactSpan = document.createElement('span');
                compactSpan.textContent = compact;
                compactSpan.style.transition = 'all 0.3s ease';

                const fullSpan = document.createElement('span');
                fullSpan.textContent = full;
                fullSpan.style.display = 'none';
                fullSpan.style.transition = 'all 0.3s ease';

                container.appendChild(iconSpan);
                container.appendChild(compactSpan);
                container.appendChild(fullSpan);

                container.addEventListener('click', () => {
                    const isExpanded = fullSpan.style.display === 'inline';

                    if (isExpanded) {
                        fullSpan.style.display = 'none';
                        compactSpan.style.display = 'inline';
                        container.style.maxWidth = '200px';
                    } else {
                        fullSpan.style.display = 'inline';
                        compactSpan.style.display = 'none';
                        container.style.maxWidth = '400px';
                    }
                });

                return container;
            };

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-top: 4px;
                opacity: 0;
                transition: opacity 0.3s ease;
                gap: 6px;
            `;
            wrapper.appendChild(createToggleInfo('📅', formatCompactDate(created), formatVerbose(created)));
            wrapper.appendChild(createToggleInfo('👁️', timeAgo(last_ping), formatVerbose(last_ping)));

            if (bootstrap.object?.is_me && gameInfo?.id) {
                const game = document.createElement('a');
                game.href = `https://www.kogama.com/games/play/${gameInfo.id}/`;
                game.textContent = '🎮 ' + (gameInfo.name.length > 15 ? gameInfo.name.substring(0, 15) + '...' : gameInfo.name);
                game.style.cssText = `
                    margin: 0;
                    font-size: 12px;
                    color: #8ab4f8;
                    text-decoration: none;
                    white-space: nowrap;
                `;
                game.title = gameInfo.name;
                wrapper.appendChild(game);
            }

            const archive = document.createElement('a');
            archive.href = `https://web.archive.org/web/*/${location.href}`;
            archive.textContent = '📜 Archive';
            archive.style.cssText = `
                margin: 0;
                font-size: 12px;
                color: #f8b38a;
                text-decoration: none;
                white-space: nowrap;
            `;
            wrapper.appendChild(archive);

            span.dataset.enhanced = 'true';
            span.innerHTML = '';
            span.appendChild(wrapper);
            setTimeout(() => wrapper.style.opacity = '1', 400);
            return true;
        } catch (e) {
            console.error('Profile Enhancer error:', e);
            return false;
        }
    };

    setTimeout(() => {
        if (!enhance()) {
            const observer = new MutationObserver((_, obs) => enhance() && obs.disconnect());
            observer.observe(document.body, {childList: true, subtree: true});
            setTimeout(() => observer.disconnect(), 5000);
        }
    }, 400);
})();

// View Player-Type under games V3, complete re-do for my own satisfaction :3.
(() => {
  "use strict";

  if (!location.pathname.includes("/games/play/")) return;

  const SELECTOR = ".MuiChip-colorPrimary, .PlayerCountChip, [data-player-chip]";
  const CACHE_PREFIX = "player_analytics_v1|";
  const TTL = 10_000;
  const POLL = 15_000;
  const TIMEOUT = 8_000;

  const now = () => Date.now();

  const getCached = (k) => {
    try {
      const raw = sessionStorage.getItem(CACHE_PREFIX + k);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return now() - obj.t < TTL ? obj.v : null;
    } catch { return null; }
  };

  const setCached = (k, v) => {
    try { sessionStorage.setItem(CACHE_PREFIX + k, JSON.stringify({ t: now(), v })); } catch {}
  };

  const fetchText = async (url) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!r.ok) throw new Error(r.status);
      return await r.text();
    } finally { clearTimeout(t); }
  };

  const parseCounts = (html) => {
    const m = html.match(/playing_now_members["']\s*:\s*(\d+).*?playing_now_tourists["']\s*:\s*(\d+)/s);
    return m ? { members: +m[1], tourists: +m[2] } : null;
  };

  const styleChip = (el) => Object.assign(el.style, {
    background: "linear-gradient(180deg, rgba(8,14,24,0.65), rgba(6,10,16,0.55))",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "6px 12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    color: "#eaf6ff",
    boxShadow: "0 6px 22px rgba(0,0,0,0.35)",
    cursor: "pointer",
    userSelect: "none",
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial',
    fontSize: "13px"
  });

  const span = (title, val, color) => {
    const s = document.createElement("span");
    s.innerHTML = `<span style="color:${color}; font-weight:600; margin-right:6px">${title}:</span> ${val}`;
    return s;
  };

  const cloneIcon = (el) => {
    try { return el.querySelector("svg")?.cloneNode(true) ?? null; } catch { return null; }
  };

  const renderChip = (el, counts, meta = {}) => {
    el.dataset.analytics = "1";
    el.innerHTML = "";
    styleChip(el);
    const ic = cloneIcon(el) || (() => { const s = document.createElement("span"); s.textContent = "👥"; s.style.fontSize = "14px"; return s; })();
    const total = (counts.members || 0) + (counts.tourists || 0);
    const t = span("Global", total, "#a5d8ff");
    const p = span("Players", counts.members ?? 0, "#b2f2bb");
    const u = span("Tourists", counts.tourists ?? 0, "#ffc9c9");
    const time = document.createElement("span");
    time.style.opacity = "0.6";
    time.style.fontSize = "12px";
    time.textContent = meta.updatedAt ? `• ${meta.updatedAt}` : "";
    el.append(ic, t, p, u, time);
    el.onclick = (e) => { e.stopPropagation(); openPanel(counts, meta); };
  };

  const openPanel = (counts, meta = {}) => {
    if (document.getElementById("pa-panel")) return;
    const s = document.createElement("style");
    s.id = "pa-style";
    s.textContent = `
#pa-panel{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:120000;width:min(640px,92vw);border-radius:12px;padding:14px;background:linear-gradient(180deg,rgba(12,18,28,0.98),rgba(6,10,14,0.9));color:#eaf6ff;backdrop-filter:blur(12px);box-shadow:0 20px 60px rgba(0,0,0,0.6);font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial}
#pa-panel h2{margin:0 0 8px 0;font-size:16px;font-weight:700}
#pa-panel .row{display:flex;gap:12px;align-items:center;margin:8px 0;flex-wrap:wrap}
#pa-close{position:absolute;right:10px;top:8px;background:transparent;border:none;color:inherit;font-size:16px;cursor:pointer;padding:6px 8px;border-radius:8px}
#pa-refresh{margin-left:auto;padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);cursor:pointer}
`;
    document.head.appendChild(s);

    const p = document.createElement("div");
    p.id = "pa-panel";
    p.innerHTML = `
<button id="pa-close" aria-label="Close">✕</button>
<h2>Player Analytics</h2>
<div class="row"><div class="muted"><strong>Global</strong></div><div style="font-weight:700">${(counts.members||0)+(counts.tourists||0)}</div></div>
<div class="row"><div class="muted">Players</div><div style="font-weight:700">${counts.members||0}</div><div style="margin-left:12px" class="muted">Tourists</div><div style="font-weight:700">${counts.tourists||0}</div></div>
<div class="row"><div class="muted">Last update</div><div style="font-weight:600">${meta.updatedAt||"n/a"}</div><button id="pa-refresh">Refresh</button></div>
<div class="muted" style="margin-top:12px;display:flex;justify-content:space-between"><div>Source: page data</div><div>Refreshed ${new Date().toLocaleTimeString()}</div></div>
`;
    document.body.appendChild(p);
    const close = document.getElementById("pa-close");
    const refresh = document.getElementById("pa-refresh");
    close.addEventListener("click", () => { p.remove(); s.remove(); });
    refresh.addEventListener("click", async () => {
      refresh.disabled = true;
      refresh.textContent = "Refreshing…";
      try {
        const r = await obtainCounts(location.href, true);
        if (r) {
          p.querySelectorAll(".row")[0].children[1].textContent = (r.members||0)+(r.tourists||0);
          p.querySelectorAll(".row")[1].children[1].textContent = r.members||0;
          p.querySelectorAll(".row")[1].children[3].textContent = r.tourists||0;
          p.querySelectorAll(".row")[2].children[1].textContent = r.updatedAt||"n/a";
          p.querySelector(".muted:last-child").children[1].textContent = `Refreshed ${new Date().toLocaleTimeString()}`;
        }
      } finally { refresh.disabled = false; refresh.textContent = "Refresh"; }
    });
    document.addEventListener("keydown", function esc(e){ if (e.key === "Escape") { p.remove(); s.remove(); document.removeEventListener("keydown", esc); } });
  };

  const obtainCounts = async (url, force = false) => {
    if (!force) {
      const c = getCached(url);
      if (c) return c;
    }
    try {
      const txt = await fetchText(url);
      const parsed = parseCounts(txt) || { members: 0, tourists: 0 };
      parsed.updatedAt = new Date().toLocaleTimeString();
      setCached(location.href, parsed);
      return parsed;
    } catch {
      const fallback = { members: 0, tourists: 0, updatedAt: new Date().toLocaleTimeString() };
      setCached(location.href, fallback);
      return fallback;
    }
  };

  let last = null;
  let timer = null;

  const attach = async (chip) => {
    if (!chip || last === chip) return;
    last = chip;
    chip.dataset.analytics = "init";
    const c = await obtainCounts(location.href);
    renderChip(chip, c, { updatedAt: c.updatedAt });
    if (timer) clearInterval(timer);
    timer = setInterval(async () => {
      if (!document.contains(chip)) { clearInterval(timer); timer = null; last = null; return; }
      const r = await obtainCounts(location.href);
      renderChip(chip, r, { updatedAt: r.updatedAt });
    }, POLL);
  };

  const debounce = (() => { let t = 0; return (fn, d=120) => { clearTimeout(t); t = setTimeout(fn, d); }; })();

  const mo = new MutationObserver(() => debounce(async () => {
    const chip = document.querySelector(SELECTOR);
    if (!chip) return;
    if (chip.dataset.analytics && chip.dataset.analytics !== "init") { last = chip; return; }
    await attach(chip);
  }));

  mo.observe(document.body, { childList: true, subtree: true });

  const first = document.querySelector(SELECTOR);
  if (first) attach(first);

  window.addEventListener("beforeunload", () => { mo.disconnect(); if (timer) clearInterval(timer); });
})();

(() => {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
        ._2mwlM > div:first-child > button,
        ._3RptD:not(:has(a[href="/games/"])):not(:has(a[href="/build/"])):not(:has(a[href="/marketplace/"])) {
            display: none !important;
        }
        ._21Sfe { display: none !important; }
    `;
    document.head.appendChild(style);

    function modifyLogo() {
        const logoContainer = document.querySelector('._2Jlgl');
        if (!logoContainer) return false;
        const logoLink = logoContainer.querySelector('a[title="KoGaMa"]');
        if (logoLink) {
            logoLink.title = "UtilifyV2 with <3";
            logoLink.href = "https://github.com/7v6a";
            const logoImg = logoLink.querySelector('img');
            if (logoImg) {
                logoImg.src = "https://avatars.githubusercontent.com/u/143356794?v=4";
                logoImg.alt = "UtilifyV2 with <3";
            }
            return true;
        }
        return false;
    }
    if (modifyLogo()) return;
    const observer = new MutationObserver(() => {
        if (modifyLogo()) {
            observer.disconnect();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
(() => { // stalk ur friends, see location, view currently building/playing V3 - FIXED FINALLY YAY 2025 !!1!!
  'use strict';

  const POLL_INTERVAL = 5000;
  const gameTitles = {};
  const projectNames = {};

  function getProfileIdFromBootstrap() {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      if (script.textContent.includes('options.bootstrap')) {
        try {
          const match = /options\.bootstrap\s*=\s*({[\s\S]*?});/.exec(script.textContent);
          if (match && match[1]) {
            const options = eval(`(${match[1]})`);
            if (options.current_user?.id) return options.current_user.id;
            if (options.object?.id) return options.object.id;
          }
        } catch (e) {
          console.error('Bootstrap parsing error:', e);
        }
      }
    }
    return null;
  }

  async function fetchFriendChat(profileId) {
    if (!profileId) return;
    try {
      const res = await fetch(`https://www.kogama.com/user/${profileId}/friend/chat/`);
      const data = await res.json();
      if (!data.data || !Array.isArray(data.data)) return;

      data.data.forEach(friend => {
        const username = friend.username;
        const loc = friend.location || '/';

        const gameMatch = loc.match(/\/games\/play\/(\d+)\//);
        if (gameMatch) fetchGameTitle(gameMatch[1], username);

        const projectMatch = loc.match(/\/build\/\d+\/project\/(\d+)\//);
        if (projectMatch) fetchProjectName(projectMatch[1], username);
      });
    } catch (err) {
      console.error('Error fetching friend chat:', err);
    }
  }

  async function fetchGameTitle(GID, username) {
    if (gameTitles[GID]) {
      updateFriendStatus(username, gameTitles[GID]);
      return;
    }
    try {
      const res = await fetch(`https://www.kogama.com/games/play/${GID}/`);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const title = doc.querySelector('title')?.textContent.split(' - KoGaMa')[0].trim();
      if (title) {
        gameTitles[GID] = title;
        updateFriendStatus(username, title);
      }
    } catch (err) {
      console.error('Error fetching game title:', err);
    }
  }

  async function fetchProjectName(POID, username) {
    if (projectNames[POID]) {
      updateFriendStatus(username, projectNames[POID]);
      return;
    }
    try {
      const res = await fetch(`https://www.kogama.com/game/${POID}/member`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      if (data.data?.length) {
        const projectName = data.data[0].name;
        projectNames[POID] = projectName;
        updateFriendStatus(username, projectName);
      }
    } catch (err) {
      console.error('Error fetching project name:', err);
    }
  }

  function updateFriendStatus(username, text) {
    document.querySelectorAll('._1taAL').forEach(friendEl => {
      const nameEl = friendEl.querySelector('._3zDi-');
      const statusEl = friendEl.querySelector('._40qZj');
      if (nameEl?.textContent === username && statusEl) {
        statusEl.textContent = text;
      }
    });
  }
  function observeFriendList(callback) {
    const container = document.querySelector('._3Wytz');
    if (!container) {
      setTimeout(() => observeFriendList(callback), 500);
      return;
    }
    callback();
    const observer = new MutationObserver(callback);
    observer.observe(container, { childList: true, subtree: true });
  }
  function startUpdater() {
    const profileId = getProfileIdFromBootstrap();
    if (!profileId) return console.warn('Could not detect profile ID from bootstrap');

    observeFriendList(() => fetchFriendChat(profileId));
    setInterval(() => fetchFriendChat(profileId), POLL_INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startUpdater);
  } else {
    startUpdater();
  }

})();

(() => { // Paste Always Enabled + Obfuscate Dots (Toggle) within pasted content (mainly for URLs)
  'use strict';

  const WHITELISTED_DOMAINS = [ //will never obfuscate dots in those urls:
    'youtube.com',
    'youtu.be',
  ];

  const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?([\w.-]+(?:\.[\w.-]+)+)(?:\/[\w-./?%=&]*)?/gi;

  function isWhitelisted(domain) {
    domain = domain.toLowerCase();
    return WHITELISTED_DOMAINS.some(whitelisted =>
      domain === whitelisted ||
      domain.endsWith('.' + whitelisted)
    );
  }

  function obfuscateDotsInUrls(text, enabled = true) {
    if (!enabled) return text;
    return text.replace(URL_REGEX, (fullMatch, domain) => {
      if (isWhitelisted(domain)) return fullMatch;
      return fullMatch.replace(/\./g, '%2E');
    });
  }

  function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, text);
  }

  function handleInput(e) {
    const target = e.target;
    if (target._disableObfuscation) return;

    if (e.inputType !== 'insertText' || !e.data) return;

    const start = target.selectionStart;
    const end = target.selectionEnd;
    const newValue = obfuscateDotsInUrls(target.value, !target._disableObfuscation);

    if (newValue !== target.value) {
      const beforeSelection = target.value.substring(0, start);
      const afterChanges = obfuscateDotsInUrls(beforeSelection, !target._disableObfuscation);
      const cursorOffset = afterChanges.length - beforeSelection.length;

      target.value = newValue;
      target.setSelectionRange(start + cursorOffset, end + cursorOffset);
    }
  }

  function isTextInput(el) {
    if (el.tagName === 'TEXTAREA') return true;
    if (el.tagName !== 'INPUT') return false;
    return ['text', 'search', 'url', 'email', 'tel', 'password'].includes(el.type);
  }

  function createToggleButton(input) {
    if (!isTextInput(input) || input._hasObfuscationButton) return;
    input._hasObfuscationButton = true;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '⚡';
    input._disableObfuscation = false; // ON by default

    Object.assign(btn.style, {
      marginLeft: '4px',
      cursor: 'pointer',
      fontSize: '0.85em',
      transition: 'opacity 0.25s ease',
      opacity: '1'
    });

    btn.addEventListener('click', () => {
      input._disableObfuscation = !input._disableObfuscation;
      btn.style.opacity = input._disableObfuscation ? '0.5' : '1';
    });

    input.insertAdjacentElement('afterend', btn);
  }

  // Observe new nodes for dynamic fields
  const observer = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        if (isTextInput(node)) {
          createToggleButton(node);
          node.value = obfuscateDotsInUrls(node.value);
        }

        node.querySelectorAll && node.querySelectorAll('input, textarea').forEach(el => {
          if (isTextInput(el)) {
            createToggleButton(el);
            el.value = obfuscateDotsInUrls(el.value);
          }
        });
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('paste', handlePaste, true);
  document.addEventListener('input', handleInput, true);

  document.querySelectorAll('input, textarea').forEach(el => {
    if (isTextInput(el)) {
      createToggleButton(el);
      el.value = obfuscateDotsInUrls(el.value);
    }
  });
})();





(function() {
    'use strict';
    GM_addStyle(`
        .custom-settings-container {
            margin-right: 8px;
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1001 !important;
        }
        .custom-settings-button {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
            z-index: 1001 !important;
            position: relative;
        }
        .custom-settings-button:hover {
            transform: rotate(30deg) !important;
            filter: drop-shadow(0 0 4px rgba(139, 195, 74, 0.5));
        }
        .custom-gear-icon {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-settings-button:hover .custom-gear-icon {
            transform: rotate(330deg);
        }

        .settings-panel {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 500px;
            height: 400px;
            background: #2b2a2a;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none;
            overflow: hidden;
            border: 1px solid #3a3a3a;
            font-family: 'Segoe UI', Roboto, sans-serif;
            color: #e0e0e0;
            transition: all 0.3s ease;
        }
        .settings-panel.visible {
            display: flex;
        }
        .settings-panel-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: linear-gradient(90deg, #3a3a3a, #2b2a2a);
            display: flex;
            align-items: center;
            padding: 0 15px;
            cursor: move;
            border-bottom: 1px solid #1e1e1e;
            user-select: none;
            z-index: 2;
        }
        .settings-panel-title {
            flex-grow: 1;
            font-weight: 600;
            color: #8bc34a;
            text-shadow: 0 0 5px rgba(139, 195, 74, 0.3);
        }
        .settings-panel-close {
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .settings-panel-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        .settings-panel-body {
            display: flex;
            width: 100%;
            height: 100%;
            padding-top: 40px;
        }
        .settings-tabs {
            width: 120px;
            background: #252525;
            border-right: 1px solid #1e1e1e;
            padding: 10px 0;
        }
        .settings-tab {
            padding: 12px 15px;
            cursor: pointer;
            transition: all 0.2s;
            border-left: 3px solid transparent;
            font-size: 13px;
        }
        .settings-tab:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        .settings-tab.active {
            background: rgba(139, 195, 74, 0.1);
            border-left: 3px solid #8bc34a;
            color: #8bc34a;
        }
        .settings-content {
            flex-grow: 1;
            padding: 7px;
            overflow-y: auto;
        }
        .settings-tab-content {
            display: none;
        }
        .settings-tab-content.active {
            display: block;
        }

        /* Specific tab styles */
        .gradient-controls {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .color-picker-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .color-preview {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            border: 1px solid #444;
            cursor: pointer;
        }
        .slider-container {
            margin: 15px 0;
        }
        .slider-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .slider {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            background: #444;
            border-radius: 3px;
            outline: none;
        }
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #8bc34a;
            cursor: pointer;
        }

         .privacy-description {
            font-size: 12px;
            color: #aaa;
            margin-top: 16px;
            margin-bottom: 15px;
        }
        .privacy-option {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .privacy-toggle {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            margin-right: 10px;
        }
        .privacy-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .privacy-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #444;
            transition: .4s;
            border-radius: 20px;
        }
        .privacy-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .privacy-slider {
            background-color: #8bc34a;
        }
        input:checked + .privacy-slider:before {
            transform: translateX(20px);
        }

        .style-option {
            margin-bottom: 15px;
        }
        .style-select {
            width: 100%;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
            margin-top: 5px;
        }

        .font-option {
            margin-bottom: 15px;
        }
        .font-preview {
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            margin-top: 10px;
            background: #333;
        }
        .online-font-input {
            width: 100%;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
            margin-top: 5px;
            font-family: inherit;
            transition: border-color 0.3s;
        }
        .online-font-input.valid {
            border-color: #8bc34a;
        }
        .online-font-description {
            font-size: 12px;
            color: #aaa;
            margin-top: 5px;
        }
        .font-disclaimer {
            font-size: 12px;
            color: #ff9800;
            margin-top: 15px;
            padding: 8px;
            background: rgba(255, 152, 0, 0.1);
            border-radius: 4px;
        }
        .color-hex-input {
            padding: 5px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
            font-family: inherit;
        }
        .gradient-text-input {
            width: 100%;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
            margin-top: 10px;
            font-family: inherit;
        }
        .gradient-buttons-container {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .gradient-action-btn {
            padding: 8px 12px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }
        .gradient-action-btn:hover {
            background: rgba(255,255,255,0.2);
        }
                .style-option {
            margin-bottom: 15px;
        }
        .style-select {
            width: 100%;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
            margin-top: 5px;
        }

        /* New styles for our enhanced options */
        .glass-panel-controls {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 15px;
        }
        .control-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .slider-with-input {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
        }
        .slider-with-input input[type="range"] {
            flex-grow: 1;
        }
        .slider-with-input input[type="number"] {
            width: 60px;
            padding: 5px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
        }
        .css-input-area {
            width: 100%;
            height: 150px;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
            resize: vertical;
            font-family: monospace;
            margin-top: 5px;
        }
        .css-input-area.valid {
            border-color: #8bc34a;
        }
        .url-input-area {
            width: 100%;
            height: 80px;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            color: #e0e0e0;
            resize: vertical;
            font-family: monospace;
            margin-top: 5px;
        }
        .url-input-area.valid {
            border-color: #8bc34a;
        }
    `);

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        panel.innerHTML = `
<div class="settings-panel-header">
    <div class="settings-panel-title">UtilifyV2 Config Menu</div>
    <div class="settings-panel-close">✕</div>
</div>
<div class="settings-panel-body">
    <div class="settings-tabs">
        <div class="settings-tab active" data-tab="gradient">Gradient</div>
        <div class="settings-tab" data-tab="privacy">Privacy</div>
        <div class="settings-tab" data-tab="styles">Styles</div>
        <div class="settings-tab" data-tab="fonts">Fonts</div>
    </div>
    <div class="settings-content">
        <div class="settings-tab-content active" id="gradient-tab">
            <h3>Gradient Customization</h3>
            <div class="gradient-controls">
                <div class="slider-container">
                    <div class="slider-label">
                        <span>Gradient Angle</span>
                        <span id="angle-value">45°</span>
                    </div>
                    <input type="range" min="0" max="360" value="45" class="slider" id="gradient-angle">
                </div>
                <div class="color-picker-row">
                    <span>Start Color:</span>
                    <div class="color-preview" id="start-color" style="background: #3a3a3a;"></div>
                    <input type="text" class="color-hex-input" placeholder="#HEX">
                    <input type="color" id="start-color-picker" value="#3a3a3a" style="display: none;">
                </div>
                <div class="color-picker-row">
                    <span>End Color:</span>
                    <div class="color-preview" id="end-color" style="background: #2b2a2a;"></div>
                    <input type="text" class="color-hex-input" placeholder="#HEX">
                    <input type="color" id="end-color-picker" value="#2b2a2a" style="display: none;">
                </div>
                <input type="text" class="gradient-text-input" id="custom-gradient-input" placeholder="linear-gradient(45deg, #3a3a3a, #2b2a2a)">
                <div class="gradient-buttons-container">
                    <button class="gradient-action-btn">Copy Gradient</button>
                    <button class="gradient-action-btn">Clear Gradient</button>
                </div>
            </div>
        </div>

        <div class="settings-tab-content" id="privacy-tab">
            <h3>Privacy Settings</h3>
            <div class="privacy-option">
                <label class="privacy-toggle">
                    <input type="checkbox" id="disable-friendslist">
                    <span class="privacy-slider"></span>
                </label>
                <span>Disable Friendslist</span>
            </div>
            <div class="privacy-option">
                <label class="privacy-toggle">
                    <input type="checkbox" id="blur-sensitive">
                    <span class="privacy-slider"></span>
                </label>
                <span>Blur sensitive content</span>
                <div class="privacy-description">This feature is currently broken.</div>
            </div>
            <div class="privacy-option">
                <label class="privacy-toggle">
                    <input type="checkbox" id="blur-comments">
                    <span class="privacy-slider"></span>
                </label>
                <span>Blur comments</span>
            </div>
            <div class="privacy-option">
                <label class="privacy-toggle">
                    <input type="checkbox" id="disable-infobar">
                    <span class="privacy-slider"></span>
                </label>
                <span>Disable WebGL ProfileNav</span>
            </div>
        </div>

        <div class="settings-tab-content" id="styles-tab">
            <h3>Style Customization</h3>
            <div class="style-option">
                <label class="privacy-toggle">
                    <input type="checkbox" id="glass-panels-toggle" checked>
                    <span class="privacy-slider"></span>
                </label>
                <span>Glass Panels</span>
                <div class="glass-panel-controls">
                    <div class="control-row">
                        <span>Border Radius:</span>
                        <input type="number" id="glass-radius" min="0" max="50" value="8">
                    </div>
                    <div class="control-row">
                        <span>Hue:</span>
                        <div class="slider-with-input">
                            <input type="range" id="glass-hue" min="0" max="360" value="270">
                            <span id="glass-hue-value">270</span>
                        </div>
                    </div>
                    <div class="control-row">
                        <span>Transparency:</span>
                        <div class="slider-with-input">
                            <input type="range" id="glass-alpha" min="1" max="50" value="16">
                            <span id="glass-alpha-value">16</span>%
                        </div>
                    </div>
                </div>
            </div>
            <div class="style-option">
                <label class="privacy-toggle">
                    <input type="checkbox" id="invisible-avatars-toggle">
                    <span class="privacy-slider"></span>
                </label>
                <span>Invisible Avatar Backgrounds</span>
            </div>
            <div class="style-option">
                <label>Online Styles (URLs)</label>
                <textarea class="url-input-area" id="online-styles-input" placeholder="Enter one CSS URL per line (e.g., https://example.com/style.css)"></textarea>
            </div>
            <div class="style-option">
                <label>Custom CSS</label>
                <textarea class="css-input-area" id="custom-css-input" placeholder="Enter your custom CSS here"></textarea>
            </div>
        </div>

        <div class="settings-tab-content" id="fonts-tab">
            <h3>Font Customization</h3>
            <div class="font-option">
                <label>Main Font</label>
                <select class="style-select" id="main-font">
                    <option value="default">Default (Segoe UI)</option>
                    <option value="roboto">Roboto</option>
                    <option value="open-sans">Open Sans</option>
                    <option value="montserrat">Montserrat</option>
                    <option value="poppins">Poppins</option>
                    <option value="comfortaa">Comfortaa</option>
                    <option value="online">Online Font</option>
                </select>
                <div class="font-preview" style="font-family: 'Segoe UI'">
                    The quick brown fox jumps over the lazy dog
                </div>
            </div>
            <div class="font-option">
                <label>Online Font URL</label>
                <input type="text" class="online-font-input" id="online-font-url" placeholder="https://fonts.googleapis.com/css2?family=FontName">
                <div class="online-font-description">
                    Supports Google Fonts (copy the CSS URL) or direct .ttf/.woff URLs.
                    Only one online font can be active at a time.
                </div>
            </div>
            <div class="font-option">
                <label>Font Size</label>
                <select class="style-select" id="font-size">
                    <option value="default">Default</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>
            <div class="font-disclaimer">
                Note: Only one online font can be active at a time. The input border will turn green when your online font is successfully loaded.
            </div>
        </div>
    </div>
</div>

        `;

        document.body.appendChild(panel);
        return panel;
    }

    function makeDraggable(panel) {
        const header = panel.querySelector('.settings-panel-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            panel.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
            panel.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = '';
        });
    }

    function setupTabs(panel) {
        const tabs = panel.querySelectorAll('.settings-tab');
        const contents = panel.querySelectorAll('.settings-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    function setupGradientTab(panel) {
        const angleSlider = panel.querySelector('#gradient-angle');
        const angleValue = panel.querySelector('#angle-value');
        const startColorPreview = panel.querySelector('#start-color');
        const startColorPicker = panel.querySelector('#start-color-picker');
        const endColorPreview = panel.querySelector('#end-color');
        const endColorPicker = panel.querySelector('#end-color-picker');
        const startColorHex = panel.querySelectorAll('.color-hex-input')[0];
        const endColorHex = panel.querySelectorAll('.color-hex-input')[1];
        const customGradientInput = panel.querySelector('#custom-gradient-input');
        const copyButton = panel.querySelectorAll('.gradient-action-btn')[0];
        const clearButton = panel.querySelectorAll('.gradient-action-btn')[1];
        function parseGradient(gradient) {
            if (!gradient) return null;

            const match = gradient.match(/linear-gradient\((\d+)deg,\s*(#[0-9a-f]+|rgba?\([^)]+\)),\s*(#[0-9a-f]+|rgba?\([^)]+\))/i);
            if (match) {
                return {
                    angle: match[1],
                    color1: match[2],
                    color2: match[3]
                };
            }
            return null;
        }
        function isValidHex(hex) {
            return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
        }
        function updateColorFromHex(input, picker, preview) {
            const hex = input.value.trim();
            if (hex && isValidHex(hex)) {
                picker.value = hex;
                preview.style.background = hex;
                updateGradient();
            }
        }
        function loadGradient() {
            const savedConfig = GM_getValue('UConfig', {});
            const savedGradient = savedConfig.gradient || 'linear-gradient(45deg, #3a3a3a, #2b2a2a)';
            document.body.style.background = savedGradient;
            document.body.style.backgroundAttachment = 'fixed';
            const parsed = parseGradient(savedGradient);
            if (parsed) {
                angleSlider.value = parsed.angle;
                angleValue.textContent = `${parsed.angle}°`;
                startColorPicker.value = parsed.color1;
                startColorPreview.style.background = parsed.color1;
                startColorHex.value = parsed.color1;
                endColorPicker.value = parsed.color2;
                endColorPreview.style.background = parsed.color2;
                endColorHex.value = parsed.color2;
                customGradientInput.value = savedGradient;
            }
        }
        function updateGradient() {
            const angle = angleSlider.value;
            const color1 = startColorPicker.value;
            const color2 = endColorPicker.value;
            const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
            startColorPreview.style.background = color1;
            startColorHex.value = color1;
            endColorPreview.style.background = color2;
            endColorHex.value = color2;
            angleValue.textContent = `${angle}°`;
            customGradientInput.value = gradient;
            document.body.style.background = gradient;
            document.body.style.backgroundAttachment = 'fixed';
            const currentConfig = GM_getValue('UConfig', {});
            currentConfig.gradient = gradient;
            GM_setValue('UConfig', currentConfig);
        }

        function handleCustomGradient(e) {
            const value = e.target.value.trim();
            if (value.includes('linear-gradient')) {
                document.body.style.background = value;
                document.body.style.backgroundAttachment = 'fixed';
                const parsed = parseGradient(value);
                if (parsed) {
                    angleSlider.value = parsed.angle;
                    angleValue.textContent = `${parsed.angle}°`;
                    startColorPicker.value = parsed.color1;
                    startColorPreview.style.background = parsed.color1;
                    startColorHex.value = parsed.color1;
                    endColorPicker.value = parsed.color2;
                    endColorPreview.style.background = parsed.color2;
                    endColorHex.value = parsed.color2;
                }
                const currentConfig = GM_getValue('UConfig', {});
                currentConfig.gradient = value;
                GM_setValue('UConfig', currentConfig);
            }
        }
        function clearGradient() {
            document.body.style.background = '';
            customGradientInput.value = '';
            const currentConfig = GM_getValue('UConfig', {});
            delete currentConfig.gradient;
            GM_setValue('UConfig', currentConfig);
        }

        function copyGradient() {
            const gradient = customGradientInput.value ||
                             `linear-gradient(${angleSlider.value}deg, ${startColorPicker.value}, ${endColorPicker.value})`;

            navigator.clipboard.writeText(gradient).then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy gradient: ', err);
            });
        }
        angleSlider.addEventListener('input', updateGradient);
        startColorPicker.addEventListener('input', updateGradient);
        endColorPicker.addEventListener('input', updateGradient);
        startColorPreview.addEventListener('click', () => startColorPicker.click());
        endColorPreview.addEventListener('click', () => endColorPicker.click());
        startColorHex.addEventListener('change', () => updateColorFromHex(startColorHex, startColorPicker, startColorPreview));
        endColorHex.addEventListener('change', () => updateColorFromHex(endColorHex, endColorPicker, endColorPreview));
        customGradientInput.addEventListener('input', handleCustomGradient);
        copyButton.addEventListener('click', copyGradient);
        clearButton.addEventListener('click', clearGradient);
        loadGradient();
    }


    function setupFontTab(panel) {
        const fontSelect = panel.querySelector('#main-font');
        const fontPreview = panel.querySelector('.font-preview');
        const onlineFontInput = panel.querySelector('#online-font-url');
        let currentFontLink = null;
        let currentFontStyle = null;

        const fontMap = {
            'default': "'Segoe UI', sans-serif",
            'roboto': "'Roboto', sans-serif",
            'open-sans': "'Open Sans', sans-serif",
            'montserrat': "'Montserrat', sans-serif",
            'poppins': "'Poppins', sans-serif",
            'comfortaa': "'Comfortaa', sans-serif",
            'online': "var(--custom-font), sans-serif"
        };

        function loadComfortaa() {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        function loadOnlineFont(url) {
            if (currentFontLink) {
                document.head.removeChild(currentFontLink);
                currentFontLink = null;
            }

            if (!url) {
                onlineFontInput.classList.remove('valid');
                return;
            }
            try {
                new URL(url);
            } catch (e) {
                onlineFontInput.classList.remove('valid');
                return;
            }

            const link = document.createElement('link');
            link.href = url;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            currentFontLink = link;

            let fontFamily = 'CustomFont';
            if (url.includes('fonts.googleapis.com')) {
                const match = url.match(/family=([^&:]+)/);
                if (match) fontFamily = match[1].replace(/\+/g, ' ');
            }

            if (!currentFontStyle) {
                currentFontStyle = document.createElement('style');
                document.head.appendChild(currentFontStyle);
            }
            currentFontStyle.textContent = `:root { --custom-font: "${fontFamily}"; }`;

            onlineFontInput.classList.add('valid');

            const currentConfig = GM_getValue('UConfig', {});
            currentConfig.onlineFont = url;
            GM_setValue('UConfig', currentConfig);
        }

        function applyGlobalFont(fontValue) {
            const oldStyle = document.getElementById('global-font-style');
            if (oldStyle) oldStyle.remove();

            const style = document.createElement('style');
            style.id = 'global-font-style';
            style.textContent = `* { font-family: ${fontValue} !important; }`;
            document.head.appendChild(style);
        }

        fontSelect.addEventListener('change', (e) => {
            const selectedFont = e.target.value;

            if (selectedFont === 'online') {
                const savedConfig = GM_getValue('UConfig', {});
                const savedFont = savedConfig.onlineFont;
                if (savedFont) {
                    loadOnlineFont(savedFont);
                    onlineFontInput.value = savedFont;
                    applyGlobalFont(fontMap[selectedFont]);
                    fontPreview.style.fontFamily = fontMap[selectedFont].replace('var(--custom-font), ', '').replace('sans-serif', '');
                }
            } else {
                if (selectedFont === 'comfortaa') loadComfortaa();
                applyGlobalFont(fontMap[selectedFont]);
                fontPreview.style.fontFamily = fontMap[selectedFont];

                const currentConfig = GM_getValue('UConfig', {});
                currentConfig.fontFamily = selectedFont;
                if (currentConfig.onlineFont) {
                    delete currentConfig.onlineFont;
                    onlineFontInput.value = '';
                    onlineFontInput.classList.remove('valid');
                }
                GM_setValue('UConfig', currentConfig);
            }
        });

        onlineFontInput.addEventListener('change', (e) => {
            if (fontSelect.value === 'online') {
                loadOnlineFont(e.target.value.trim());
                if (e.target.value.trim()) {
                    applyGlobalFont(fontMap.online);
                    fontPreview.style.fontFamily = fontMap.online.replace('var(--custom-font), ', '').replace('sans-serif', '');
                }
            }
        });

        const savedConfig = GM_getValue('UConfig', {});
        if (savedConfig.fontFamily) {
            fontSelect.value = savedConfig.fontFamily;
            if (savedConfig.fontFamily === 'comfortaa') loadComfortaa();
            if (savedConfig.fontFamily === 'online' && savedConfig.onlineFont) {
                onlineFontInput.value = savedConfig.onlineFont;
                loadOnlineFont(savedConfig.onlineFont);
                applyGlobalFont(fontMap.online);
                fontPreview.style.fontFamily = fontMap.online.replace('var(--custom-font), ', '').replace('sans-serif', '');
            } else {
                applyGlobalFont(fontMap[savedConfig.fontFamily] || fontMap.default);
                fontPreview.style.fontFamily = fontMap[savedConfig.fontFamily] || fontMap.default;
            }
        }
    }

    function setupPrivacyTab(panel) {
        const disableFriendslist = panel.querySelector('#disable-friendslist');
        const blurSensitive = panel.querySelector('#blur-sensitive');
        const blurComments = panel.querySelector('#blur-comments');
        const disableInfobar = panel.querySelector('#disable-infobar');
        let privacyStyle = document.createElement('style');
        privacyStyle.id = 'kogama-privacy-styles';
        document.head.appendChild(privacyStyle);
        function updatePrivacyStyles() {
            let css = '';

            if (disableFriendslist.checked) {
                css += `._1Yhgq { display: none !important; transition: all 0.3s ease-in-out;}`;
            }
            if (blurSensitive.checked) {
                css += `.css-k9ok3b { filter: blur(5px) !important;transition: filter 0.3s ease !important; }.css-k9ok3b:focus {filter: none !important; }`;
            }
            if (blurComments.checked) {
                css += `._3Wsxf  {
                    filter: blur(5px) !important;
                    transition: all 0.7s ease !important;
                }
                ._3Wsxf:hover {
                    filter: none !important;
                }`;
            }
            if (disableInfobar.checked) {
                css += `._3i_24 { display: none !important; }`;
            }

            privacyStyle.textContent = css;
        }
        function loadPrivacySettings() {
            const savedConfig = GM_getValue('UConfig', {});

            if (savedConfig.disableFriendslist) disableFriendslist.checked = true;
            if (savedConfig.blurSensitive) blurSensitive.checked = true;
            if (savedConfig.blurComments) blurComments.checked = true;
            if (savedConfig.disableInfobar) disableInfobar.checked = true;

            updatePrivacyStyles();
        }
        function handlePrivacyToggle() {
            const currentConfig = GM_getValue('UConfig', {});

            currentConfig.disableFriendslist = disableFriendslist.checked;
            currentConfig.blurSensitive = blurSensitive.checked;
            currentConfig.blurComments = blurComments.checked;
            currentConfig.disableInfobar = disableInfobar.checked;

            GM_setValue('UConfig', currentConfig);
            updatePrivacyStyles();
        }
        disableFriendslist.addEventListener('change', handlePrivacyToggle);
        blurSensitive.addEventListener('change', handlePrivacyToggle);
        blurComments.addEventListener('change', handlePrivacyToggle);
        disableInfobar.addEventListener('change', handlePrivacyToggle);
        loadPrivacySettings();
    }
        function setupStylesTab(panel) {
        const glassPanelsToggle = panel.querySelector('#glass-panels-toggle');
        const glassRadiusInput = panel.querySelector('#glass-radius');
        const glassHueSlider = panel.querySelector('#glass-hue');
        const glassHueValue = panel.querySelector('#glass-hue-value');
        const glassAlphaSlider = panel.querySelector('#glass-alpha');
        const glassAlphaValue = panel.querySelector('#glass-alpha-value');
        const invisibleAvatarsToggle = panel.querySelector('#invisible-avatars-toggle');
        const onlineStylesInput = panel.querySelector('#online-styles-input');
        const customCSSInput = panel.querySelector('#custom-css-input');


        let dynamicStyle = document.createElement('style');
        dynamicStyle.id = 'kogama-enhanced-styles';
        document.head.appendChild(dynamicStyle);

        function updateGlassPanelStyles() {
            const enabled = glassPanelsToggle.checked;
            const radius = glassRadiusInput.value;
            const hue = glassHueSlider.value;
            const alpha = glassAlphaSlider.value / 100;

            if (!enabled) {
                dynamicStyle.textContent = dynamicStyle.textContent.replace(/\/\* GLASS PANELS START \*\/[\s\S]*?\/\* GLASS PANELS END \*\//g, '');
                return;
            }

            const glassCSS = `/* GLASS PANELS START */
            ._1q4mD ._1sUGu ._1u05O { background-color: transparent !important; }
                .css-1udp1s3, .css-zslu1c, .css-1rbdj9p {
                    background-color: hsla(${hue}, 68%, 43%, ${alpha}) !important;
                    backdrop-filter: blur(4px) !important;
                    border-radius: ${radius}px !important;
                }
                ._3TORb {
                    background-color: hsla(${hue}, 68%, 43%, ${alpha}) !important;
                    border-radius: ${radius}px !important;
                }
                .zUJzi, .uwn5j, ._2BvOT, ._375XK {
                    border: none !important;
                    background-color: hsla(${hue}, 68%, 43%, ${alpha}) !important;
                }
                ._375XK textarea {
                    border: none !important;
                    background-color: hsla(${hue}, 68%, 43%, ${alpha * 5.6}) !important;
                }
                ._1q4mD {
                background-color: hsla(${hue}, 68%, 43%, ${alpha}) !important;
                 backdrop-filter: blur(4px) !important;
                 }

            /* GLASS PANELS END */`;
            dynamicStyle.textContent = dynamicStyle.textContent.replace(/\/\* GLASS PANELS START \*\/[\s\S]*?\/\* GLASS PANELS END \*\//g, '');

            dynamicStyle.textContent += glassCSS;
        }
        function toggleInvisibleAvatars(enabled) {
            if (enabled) {
                const script = document.createElement('script');
                script.textContent = `(${removeBlueBackgrounds.toString()})();`;
                document.body.appendChild(script);
            } else {
                // This would need a way to revert the changes, which is complex
                // For now, we'll just reload the page
                window.location.reload();
            }
        }

        function removeBlueBackgrounds() {
            "use strict";

            function removeBlueBackground(imageUrl, callback) {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = function() {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        if (b > 150 && b > r && b > g) {
                            data[i + 3] = 0;
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                    callback(canvas.toDataURL());
                };
                img.src = imageUrl;
            }

            function processImages() {
                document.querySelectorAll("image._3tYRU").forEach((imageElement) => {
                    removeBlueBackground(imageElement.getAttribute("xlink:href"), (newImageUrl) => {
                        imageElement.setAttribute("xlink:href", newImageUrl);
                    });
                });
            }

            window.addEventListener("load", processImages);
        }

        function loadOnlineCSS(urls) {
            document.querySelectorAll('link[data-kogama-enhanced="online-style"]').forEach(el => el.remove());

            if (!urls) return;

            const urlList = urls.split('\n').filter(url => url.trim().length > 0);

            urlList.forEach(url => {
                if (url.startsWith('http')) {
                    const link = document.createElement('link');
                    link.href = url;
                    link.rel = 'stylesheet';
                    link.dataset.kogamaEnhanced = 'online-style';
                    link.onload = () => onlineStylesInput.classList.add('valid');
                    link.onerror = () => onlineStylesInput.classList.remove('valid');
                    document.head.appendChild(link);
                }
            });
        }
        function applyCustomCSS(css) {
            let customStyle = document.getElementById('kogama-custom-css');
            if (!customStyle) {
                customStyle = document.createElement('style');
                customStyle.id = 'kogama-custom-css';
                document.head.appendChild(customStyle);
            }
            customStyle.textContent = css;
        }
        function loadStylesSettings() {
            const savedConfig = GM_getValue('UConfig', {});
            if (savedConfig.glassPanels !== undefined) {
                glassPanelsToggle.checked = savedConfig.glassPanels.enabled;
                glassRadiusInput.value = savedConfig.glassPanels.radius || 8;
                glassHueSlider.value = savedConfig.glassPanels.hue || 270;
                glassHueValue.textContent = savedConfig.glassPanels.hue || 270;
                glassAlphaSlider.value = (savedConfig.glassPanels.alpha || 0.16) * 100;
                glassAlphaValue.textContent = Math.round((savedConfig.glassPanels.alpha || 0.16) * 100);
            } else {
                // default ig
                glassPanelsToggle.checked = true;
                glassRadiusInput.value = 8;
                glassHueSlider.value = 270;
                glassHueValue.textContent = 270;
                glassAlphaSlider.value = 16;
                glassAlphaValue.textContent = 16;
            }

            if (savedConfig.invisibleAvatars !== undefined) {
                invisibleAvatarsToggle.checked = savedConfig.invisibleAvatars;
            }

            if (savedConfig.onlineStyles) {
                onlineStylesInput.value = savedConfig.onlineStyles;
            }

            if (savedConfig.customCSS) {
                customCSSInput.value = savedConfig.customCSS;
            }
            updateGlassPanelStyles();
            if (invisibleAvatarsToggle.checked) {
                toggleInvisibleAvatars(true);
            }
            loadOnlineCSS(onlineStylesInput.value);
            applyCustomCSS(customCSSInput.value);
        }
        function saveStylesSettings() {
            const currentConfig = GM_getValue('UConfig', {});

            currentConfig.glassPanels = {
                enabled: glassPanelsToggle.checked,
                radius: parseInt(glassRadiusInput.value),
                hue: parseInt(glassHueSlider.value),
                alpha: parseInt(glassAlphaSlider.value) / 100
            };

            currentConfig.invisibleAvatars = invisibleAvatarsToggle.checked;
            currentConfig.onlineStyles = onlineStylesInput.value;
            currentConfig.customCSS = customCSSInput.value;

            GM_setValue('UConfig', currentConfig);
        }
        glassPanelsToggle.addEventListener('change', () => {
            updateGlassPanelStyles();
            saveStylesSettings();
        });

        glassRadiusInput.addEventListener('input', () => {
            updateGlassPanelStyles();
            saveStylesSettings();
        });

        glassHueSlider.addEventListener('input', () => {
            glassHueValue.textContent = glassHueSlider.value;
            updateGlassPanelStyles();
            saveStylesSettings();
        });

        glassAlphaSlider.addEventListener('input', () => {
            glassAlphaValue.textContent = glassAlphaSlider.value;
            updateGlassPanelStyles();
            saveStylesSettings();
        });

        invisibleAvatarsToggle.addEventListener('change', () => {
            toggleInvisibleAvatars(invisibleAvatarsToggle.checked);
            saveStylesSettings();
        });

        onlineStylesInput.addEventListener('change', () => {
            loadOnlineCSS(onlineStylesInput.value);
            saveStylesSettings();
        });

        customCSSInput.addEventListener('change', () => {
            applyCustomCSS(customCSSInput.value);
            saveStylesSettings();
        });

        loadStylesSettings();
    }
    function initSettingsPanel() {
        const panel = createSettingsPanel();
        makeDraggable(panel);
        setupTabs(panel);
        setupGradientTab(panel);
        setupFontTab(panel);
        setupPrivacyTab(panel);
        setupStylesTab(panel);
        panel.querySelector('.settings-panel-close').addEventListener('click', () => {
            panel.classList.remove('visible');
        });

        return panel;
    }

    function createSettingsButton() {
        const gearSVG = `
            <svg class="custom-gear-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
            </svg>
        `;

        const settingsButton = document.createElement('button');
        settingsButton.className = 'MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall custom-settings-button css-rebkop';
        settingsButton.setAttribute('tabindex', '0');
        settingsButton.setAttribute('type', 'button');
        settingsButton.innerHTML = gearSVG;

        const container = document.createElement('div');
        container.className = 'custom-settings-container';
        container.appendChild(settingsButton);

        const listItem = document.createElement('li');
        listItem.className = '_3WhKY';
        listItem.appendChild(container);

        return { button: settingsButton, element: listItem };
    }

    function initialize() {
        const panel = initSettingsPanel();
        const { button, element } = createSettingsButton();
        const notificationItem = document.querySelector('li._3WhKY:has(button.fodSP)');
        if (notificationItem) {
            notificationItem.parentNode.insertBefore(element, notificationItem);
            button.addEventListener('click', () => {
                panel.classList.toggle('visible');
            });
        } else {
            const observer = new MutationObserver(() => {
                const notificationItem = document.querySelector('li._3WhKY:has(button.fodSP)');
                if (notificationItem) {
                    notificationItem.parentNode.insertBefore(element, notificationItem);
                    button.addEventListener('click', () => {
                        panel.classList.toggle('visible');
                    });
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            setTimeout(() => {
                const notificationItem = document.querySelector('li._3WhKY:has(button.fodSP)');
                if (notificationItem) {
                    notificationItem.parentNode.insertBefore(element, notificationItem);
                    button.addEventListener('click', () => {
                        panel.classList.toggle('visible');
                    });
                }
                observer.disconnect();
            }, 5000);
        }
    }
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();

// Avatar Finder V3: Logic by Selene
(function() {
  'use strict';

  let modalMessage = null;
  let modalSpinner = null;

  function gmFetchJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: res => {
          try { resolve(JSON.parse(res.responseText)); }
          catch(e){ reject(e); }
        },
        onerror: reject
      });
    });
  }

  function getHost() {
    const h = location.hostname;
    if (h.includes('friends.kogama.com')) return 'friends.kogama.com';
    if (h.includes('kogama.com.br')) return 'kogama.com.br';
    return 'www.kogama.com';
  }

  function decodeEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  function showModal(msg, spinning = false) {
    hideModal();

    const overlay = document.createElement('div');
    overlay.id = 'am-modal-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 10001,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(2px)'
    });

    const container = document.createElement('div');
    Object.assign(container.style, {
      background: '#fff',
      padding: '24px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      minWidth: '220px'
    });

    const close = document.createElement('div');
    close.textContent = '✖';
    Object.assign(close.style, {
      position: 'absolute',
      top: '10px',
      right: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#999'
    });
    close.addEventListener('click', hideModal);

    const spinner = document.createElement('div');
    spinner.id = 'am-spinner';
    Object.assign(spinner.style, {
      width: '48px',
      height: '48px',
      border: '3px solid rgba(0,0,0,0.1)',
      borderTop: '3px solid #3498db',
      borderRadius: '50%',
      animation: 'am-spin 1s linear infinite',
      marginBottom: '16px',
      willChange: 'transform',
      backfaceVisibility: 'hidden'
    });

    const message = document.createElement('div');
    message.innerHTML = msg;
    modalMessage = message;
    modalSpinner = spinner;
    Object.assign(message.style, {
      color: '#000',
      fontSize: '14px',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    });

    if (spinning) container.append(spinner);
    container.append(close, message);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes am-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function updateModalMessage(msg, success = true) {
    if (modalMessage) {
      modalMessage.textContent = msg;
      if (modalSpinner && modalSpinner.parentElement) {
        modalSpinner.remove();
        modalSpinner = null;
      }
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("width", "36");
      icon.setAttribute("height", "36");
      icon.setAttribute("stroke", success ? "green" : "red");
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke-width", "2");
      icon.setAttribute("stroke-linecap", "round");
      icon.setAttribute("stroke-linejoin", "round");

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", success ? "M5 13l4 4L19 7" : "M18 6L6 18M6 6l12 12");
      icon.appendChild(path);

      const container = modalMessage.parentElement;
      container.insertBefore(icon, modalMessage);
    }
  }

  function hideModal() {
    const e = document.getElementById('am-modal-overlay');
    if (e) e.remove();
    modalMessage = null;
    modalSpinner = null;
  }

  const match = location.pathname.match(/\/profile\/(\d+)\/avatars/);
  if (!match) return;
  const userId = match[1], server = getHost();

  let inventoryIds = [], idToName = {};
  async function loadInventory() {
    let page = 1, pages = 1;
    do {
      try {
        const json = await gmFetchJson(`https://${server}/user/${userId}/avatar/?page=${page}&count=400`);
        (json.data||[]).forEach(a => {
          inventoryIds.push(a.avatar_id);
          idToName[a.avatar_id] = a.avatar_name||'';
        });
        pages = (json.paging && json.paging.pages) || 1;
      } catch(e) {
        console.error(e);
        showModal('Error loading avatars');
        return;
      }
      page++;
    } while(page <= pages);
  }

  async function fetchFeed(id, retries = 1) {
    try {
      const resp = await fetch(`https://${server}/api/feed/1/${id}`);
      if (resp.status === 429 && retries > 0) {
        await new Promise(r => setTimeout(r, 2000));
        return fetchFeed(id, retries - 1);
      }
      if (!resp.ok) return null;
      const j = await resp.json();
      return j.data;
    } catch {
      return null;
    }
  }

  async function findProductForAvatar(avId) {
    showModal('Searching...', true);
    const rawName = idToName[avId] || '';
    const expectedName = decodeEntities(rawName);
    let dataStr;
    try {
      dataStr = (await gmFetchJson(`https://${server}/model/market/a-${avId}/`)).data || '';
    } catch(e) {
      console.error(e);
      updateModalMessage('Failed fetching model info', false);
      return;
    }
    const sold = (dataStr.match(/sold_count=(\d+)/)||[])[1];
    if (sold && +sold !== 0) {
      GM_setClipboard(avId);
      updateModalMessage(`Found! Product ID: a-${avId}`, true);
      return;
    }
    const cr = dataStr.match(/created=datetime\.datetime\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)/);
    if (!cr) {
      updateModalMessage('Failed parsing creation date', false);
      return;
    }
    const Y = +cr[1], Mo = +cr[2], D = +cr[3], H = +cr[4], Mi = +cr[5], S = cr[6]?+cr[6]:0;
    const target = new Date(Date.UTC(Y, Mo-1, D, H, Mi, S));

    let low = 1, high = 80000000, approx = null;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const f = await fetchFeed(mid);
      if (!f || !f.created) { high = mid - 1; continue; }
      const dt = new Date(f.created);
      if (dt < target) low = mid + 1;
      else if (dt > target) high = mid - 1;
      else { approx = mid; break; }
    }
    if (approx === null) approx = low <= 80000000 ? low : high;

    const span = 100, start = Math.max(1, approx - span), end = approx + span;
    for (let i = start; i <= end; i++) {
      const f = await fetchFeed(i);
      await new Promise(r => setTimeout(r, 20));
      if (!f || !f.created) continue;
      if (f.profile_id == userId) {
        try {
          const info = JSON.parse(f._data||'{}');
          const pn = decodeEntities(info.product_name || '');
          if (pn === expectedName) {
            GM_setClipboard(info.product_id.slice(2));
            updateModalMessage(`Found via feed match! Product ID: ${info.product_id}`, true);
            return;
          }
        } catch {}
      }
      if (f.created === target.toISOString().split('.')[0]+'+00:00') {
        try {
          const info = JSON.parse(f._data||'{}');
          GM_setClipboard(info.product_id.slice(2));
          updateModalMessage(`Found! Product ID: ${info.product_id}`, true);
          return;
        } catch {}
      }
    }
    updateModalMessage('No matching feed entry found', false);
  }

  async function attachButtons() {
    const items = document.querySelectorAll('.MuiGrid-root.MuiGrid-container .MuiGrid-item');
    let pageNum = 1;
    const active = document.querySelector('.MuiPaginationItem-page.Mui-selected, .MuiPaginationItem-root.Mui-selected');
    if (active) pageNum = parseInt(active.textContent.trim(), 10) || 1;
    items.forEach((el, idx) => {
      if (el.querySelector('.am-find-overlay')) return;
      const globalIdx = (pageNum - 1) * items.length + idx;
      const avId = inventoryIds[globalIdx];
      if (!avId) return;

      const div = document.createElement('div');
      div.className = 'am-find-overlay';
      div.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>`;
      Object.assign(div.style, {
        position: 'absolute',
        bottom: '6px',
        right: '6px',
        zIndex: 999,
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.8)',
        border: '1px solid #ccc',
        borderRadius: '50%',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'transform 0.2s ease'
      });
      div.addEventListener('mouseenter', () => div.style.transform = 'scale(1.1)');
      div.addEventListener('mouseleave', () => div.style.transform = 'scale(1)');
      div.addEventListener('click', () => findProductForAvatar(avId));
      el.style.position = 'relative';
      el.appendChild(div);
    });
  }

  (async () => {
    await loadInventory();
    attachButtons();
    setInterval(attachButtons, 3000);
  })();
})();

// Faster Friends V2
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
#frlscrape-root { position: fixed; z-index: 99999; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
#frlscrape-panel { position: fixed; z-index: 100000; width: min(920px, 92vw); max-height: 84vh; background: linear-gradient(180deg, rgba(12,18,28,0.95), rgba(5,8,12,0.95)); color: #eef6ff; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); overflow: hidden; display: flex; flex-direction: column; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; pointer-events: auto; }
#frlscrape-header { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; gap:12px; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: grab; user-select: none; }
#frlscrape-header.dragging { cursor: grabbing; }
#frlscrape-title { font-size:18px; font-weight:600; letter-spacing:0.2px; }
#frlscrape-controls { display:flex; gap:8px; align-items:center; margin-left:8px; }
#frlscrape-close { background:transparent; border:none; color:inherit; font-size:16px; cursor:pointer; padding:6px 8px; border-radius:8px; }
#frlscrape-close:hover { background: rgba(255,255,255,0.03); }
#frlscrape-search { width: 100%; max-width: 560px; display:flex; gap:8px; align-items:center; }
#frlscrape-search input { width:100%; padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color:inherit; outline:none; font-size:14px; }
#frlscrape-body { display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; padding:14px 18px; overflow:auto; }
.frsection { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); padding:10px; border-radius:8px; min-height:120px; max-height:56vh; overflow:auto; }
.frsection h3 { margin:0 0 8px 0; font-size:13px; font-weight:600; color: #dbeefd; letter-spacing:0.3px; text-transform:uppercase; }
.entry { display:inline-flex; align-items:center; gap:6px; white-space:nowrap; margin-right:2px; margin-bottom:4px; }
.entry a { color: inherit; text-decoration: none; font-size:14px; padding:2px 6px; border-radius:6px; display:inline-block; }
.entry a:hover { background: rgba(255,255,255,0.03); text-decoration:underline; }
.separator { display:inline; margin-right:6px; color: rgba(255,255,255,0.48); }
.empty-note { color: rgba(255,255,255,0.5); font-size:13px; padding:6px 2px; }
#frlscrape-reopen { position: fixed; left: 50%; transform: translateX(-50%); bottom: 22px; z-index: 100000; padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); background: linear-gradient(180deg, rgba(10,16,26,0.98), rgba(20,30,45,0.98)); color: #eef6ff; cursor: pointer; box-shadow: 0 8px 30px rgba(0,0,0,0.45); font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; display: none; }
#frlscrape-reopen:hover { filter: brightness(1.02); }
@media (max-width:880px) { #frlscrape-body { grid-template-columns: 1fr; } }
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

      const header = document.createElement("div");
      header.id = "frlscrape-header";

      const leftWrap = document.createElement("div");
      leftWrap.style.display = "flex";
      leftWrap.style.alignItems = "center";
      leftWrap.style.gap = "12px";

      const title = document.createElement("div");
      title.id = "frlscrape-title";
      title.textContent = "Friends & Requests";

      const searchWrap = document.createElement("div");
      searchWrap.id = "frlscrape-search";

      const input = document.createElement("input");
      input.id = "frlscrape-search-input";
      input.type = "search";
      input.placeholder = "Search by username";
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
      closeBtn.innerHTML = "✕";

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
      document.body.appendChild(root);
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
        const inviting = arr.filter(r => String(r.profile_id) !== String(profileID)).map(r => ({ name: r.profile_username || `id:${r.profile_id}`, href: `https://www.kogama.com/profile/${r.profile_id}/`, id: r.id }));
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

