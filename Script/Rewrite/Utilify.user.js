// ==UserScript==
// @name         Utilify 
// @namespace    author @ simonvs (UID: 970332627221504081)
// @version      3.0.5
// @description  (Almost) personal userscript inspired by KoGaMaBuddy containing various utilities and visual enhancements. 
// @author       Simon
// @match        *://www.kogama.com/*
// @icon         https://avatars.githubusercontent.com/u/143356794?v=4
// @connect      fonts.googleapis.com
// @connect      kogama.com
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

// CSS: Custom Layouts and improvements
(() => {
    const style = document.createElement("style");
    style.textContent = `
        .MuiCollapse-root.MuiCollapse-vertical._2Nols.MuiCollapse-entered.css-1cbf1l2 { display: none !important; } /* badge bullshit begone */
        ._1Cwd5 { display: none !important; } /* streak bullshit begone */
        ._1RMYS { display: none !important; } /* Footer begone */
        ._4OXDk { display: none !important; } /* level display begone */
        ._13UrL ._23KvS ._1z4jM ._4OXDk { width: 80px !important; } /* level to the left */
        ._13UrL ._1F5Kt .CgH1- { justify-content: left !important; } /* creations, avatars */
        ._13UrL ._23KvS ._1z4jM ._1aUa_ { max-height: 130px !important; max-width: 600px !important; } /* bio fix */
        ._13UrL ._23KvS ._25Vmr ._2IqY6 ._2O_AH { margin-top: 13px !important; } /* rank etc, fix the gap */
        ._1q4mD ._1sUGu ._1u05O { background-color: transparent !important; } /* navbar fix */
        .css-1hitfzb, .css-1q1eu9e { color: #4adeb7 !important; } /* Feed & comment author usernames + some button text idk*/
        .css-1995t1d, .css-e5yc1l { background-color: transparent !important; } /* kill the annoying orange badges */
        ._2hUvr ._1T9vj, ._3-qgq ._2uIZL { background-color:hsla(0, 0%, 0%, 0.6) !important; backdrop-filter: blur(5px) !important; } /* titles on avatar cards */
        /* DM CHAT BOX */
        .zUJzi, ._375XK, ._375XK ._2drTe, .zUJzi .o_DA6 .uwn5j { border: none !important; background-color: rgba(0, 0, 0, 0.3) !important; backdrop-filter: blur(6px) !important; }
        .zUJzi .o_DA6 .uwn5j ._3DYYr:hover { background-color: rgba(20, 80, 80, 0.2) !important; } /* chat-selector hover */
        ._375XK .F3PyX { border: none !important; }
        .zUJzi .o_DA6 .uwn5j ._3DYYr._2dPu4 { 
        background-color: rgba(20, 80, 80, 0.5) !important; 
        border-left: 3px solid rgba(100, 200, 200, 0.9) !important;
        padding-left: 12px !important;
        }
        .uwn5j ._3DYYr ._1j2Cd { 
        filter: blur(5px); 
        transition: filter 0.3s ease-in-out !important;
        }

        .uwn5j ._3DYYr:hover ._1j2Cd { 
        filter: blur(0px) !important;
        }
        /* Incoming messages (sent to us) */
        ._375XK ._2XaOw ._1j2Cd p {
        background-color: rgba(20, 80, 80, 0.7) !important;
        border: 1px solid rgba(100, 200, 200, 0.4) !important;
        border-radius: 8px !important;
        backdrop-filter: blur(10px) !important;
        padding: 10px 14px !important;
        color: white !important;
        position: relative !important;
        }

        ._375XK ._2XaOw ._1j2Cd p::before {
        content: "Them" !important;
        position: absolute !important;
        top: -10px !important;
        left: 8px !important;
        font-size: 6px !important;
        color: rgba(100, 200, 200, 0.9) !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        padding: 2px 6px !important;
        border-radius: 3px !important;
        z-index: 10 !important;
        }

        /* Outgoing messages (sent by us) */
        ._375XK ._2XaOw ._1j2Cd._1Xzzq p {
        background-color: rgba(30, 90, 90, 0.65) !important;
        border: 1px solid rgba(120, 220, 220, 0.35) !important;
        border-radius: 8px !important;
        backdrop-filter: blur(10px) !important;
        padding: 10px 14px !important;
        color: white !important;
        position: relative !important;
        }

        ._375XK ._2XaOw ._1j2Cd._1Xzzq p::before {
        content: "You" !important;
        position: absolute !important;
        top: -10px !important;
        right: 8px !important;
        font-size: 6px !important;
        color: rgba(120, 220, 220, 0.9) !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        padding: 2px 6px !important;
        border-radius: 3px !important;
        z-index: 10 !important;
        }
    `;
    document.documentElement.appendChild(style);
})();

(async function() {
    "use strict";
    
    const AVAILABLE_FILTERS = ["rain", "snow", "fireflies", "roses", "sparkles"];
    const AVAILABLE_MODIFIERS = ["blur", "dark"];

    const SNOWFLAKE_SVGS = [
        "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="white" d="M50,10 L55,45 L50,50 L45,45 Z M50,90 L55,55 L50,50 L45,55 Z M10,50 L45,55 L50,50 L45,45 Z M90,50 L55,55 L50,50 L55,45 Z M25,25 L45,45 L50,40 L40,30 Z M75,75 L55,55 L50,60 L60,70 Z M75,25 L55,45 L60,50 L70,40 Z M25,75 L45,55 L40,50 L30,60 Z"/><circle cx="50" cy="50" r="8" fill="white"/></svg>`),
        "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="white"><rect x="47" y="5" width="6" height="90" rx="2"/><rect x="5" y="47" width="90" height="6" rx="2"/><rect x="47" y="5" width="6" height="90" rx="2" transform="rotate(45 50 50)"/><rect x="47" y="5" width="6" height="90" rx="2" transform="rotate(-45 50 50)"/><circle cx="50" cy="50" r="10"/></g></svg>`)
    ];

    const ROSE_SVG = "data:image/svg+xml," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
                <radialGradient id="roseGrad" cx="50%" cy="40%">
                    <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
                    <stop offset="60%" style="stop-color:#c9184a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#a4133c;stop-opacity:1" />
                </radialGradient>
            </defs>
            <path fill="url(#roseGrad)" d="M50 20c-4 0-7 3-9 6-2-3-5-6-9-6-6 0-11 5-11 11 0 8 9 16 20 26 11-10 20-18 20-26 0-6-5-11-11-11z"/>
            <ellipse cx="50" cy="30" rx="8" ry="10" fill="#ff8fa3" opacity="0.6"/>
            <path d="M45 35c0 3 2 5 5 5s5-2 5-5" stroke="#c9184a" stroke-width="1.5" fill="none"/>
            <path fill="#2d6a4f" d="M50 46l-2 8c-1 4 0 8 3 10l-1-18zm0 0l2 8c1 4 0 8-3 10l1-18z"/>
        </svg>
    `);

    const SPARKLE_SVG = "data:image/svg+xml," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
                <radialGradient id="sparkleGrad">
                    <stop offset="0%" style="stop-color:#4adeb7;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#6ef0cb;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#2a9d8f;stop-opacity:0" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#sparkleGrad)"/>
            <path fill="#fff" d="M50 10l3 37 37 3-37 3-3 37-3-37-37-3 37-3z"/>
        </svg>
    `);

    let tooltip = null;

    function injectTooltipStyles() {
        if (document.getElementById('bg-effects-tooltip-style')) return;
        
        const css = `
            @keyframes tooltip-slide-in {
                from { 
                    opacity: 0;
                    transform: translateY(5px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .bg-effects-tooltip {
                animation: tooltip-slide-in 0.2s ease-out;
            }
            
            .bg-effects-badge {
                display: inline-block;
                padding: 4px 10px;
                margin: 3px 2px;
                background: linear-gradient(135deg, rgba(74, 222, 183, 0.15), rgba(42, 157, 143, 0.1));
                border: 1px solid rgba(74, 222, 183, 0.25);
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                color: #4adeb7;
                letter-spacing: 0.3px;
                transition: all 0.2s ease;
            }
            
            .bg-effects-badge:hover {
                background: linear-gradient(135deg, rgba(74, 222, 183, 0.25), rgba(42, 157, 143, 0.15));
                border-color: rgba(74, 222, 183, 0.4);
                transform: translateY(-1px);
            }
            
            .bg-effects-section {
                margin-bottom: 10px;
            }
            
            .bg-effects-section-title {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: rgba(74, 222, 183, 0.6);
                margin-bottom: 6px;
                font-weight: 500;
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'bg-effects-tooltip-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function showTooltip(target) {
        if (tooltip) return;
        
        injectTooltipStyles();
        
        tooltip = document.createElement("div");
        tooltip.className = 'bg-effects-tooltip';
        Object.assign(tooltip.style, {
            position: "fixed",
            zIndex: "100000",
            background: "linear-gradient(135deg, rgba(13, 31, 29, 0.98), rgba(26, 47, 45, 0.98))",
            color: "#e0f0ee",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid rgba(74, 222, 183, 0.25)",
            fontSize: "12px",
            boxShadow: "0 6px 24px rgba(74, 222, 183, 0.2), inset 0 1px 0 rgba(74, 222, 183, 0.15)",
            pointerEvents: "none",
            backdropFilter: "blur(12px)",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            maxWidth: "280px"
        });
        
        const effectBadges = AVAILABLE_FILTERS.map(f => 
            `<span class="bg-effects-badge">${f}</span>`
        ).join('');
        
        const modifierBadges = AVAILABLE_MODIFIERS.map(m => 
            `<span class="bg-effects-badge">${m}</span>`
        ).join('');
        
        tooltip.innerHTML = `
            <div class="bg-effects-section">
                <div class="bg-effects-section-title">◆ Effects</div>
                <div>${effectBadges}</div>
            </div>
            <div class="bg-effects-section">
                <div class="bg-effects-section-title">◆ Modifiers</div>
                <div>${modifierBadges}</div>
            </div>
            <div style="margin-top:8px; font-size:10px; color:rgba(74, 222, 183, 0.5); font-style:italic;">
                filter: effect1, modifier1, ...
            </div>
        `;
        
        document.body.appendChild(tooltip);
        updateTooltipPos(target);
    }

    function updateTooltipPos(target) {
        if (!tooltip) return;
        const r = target.getBoundingClientRect();
        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;
        
        // Position to the right of the textarea if there's space
        const spaceOnRight = window.innerWidth - r.right;
        if (spaceOnRight > tooltipWidth + 20) {
            tooltip.style.left = (r.right + 10) + "px";
            tooltip.style.top = r.top + "px";
        } else {
            // Otherwise position above
            tooltip.style.left = Math.max(10, r.left) + "px";
            tooltip.style.top = Math.max(10, r.top - tooltipHeight - 10) + "px";
        }
    }

function removeTooltip() {
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-5px)';
        const tooltipRef = tooltip;
        tooltip = null;
        setTimeout(() => {
            try {
                tooltipRef?.remove(); // use .remove() — it's a no-op if already detached
            } catch {}
        }, 200);
    }
}

    // Bootstrap reader
    const waitForBootstrap = () => new Promise(resolve => {
        const check = () => {
            const desc = window.__capturedBootstrap?.object?.description || 
                        window.__capturedBootstrap?.current_user?.description;
            
            if (desc) {
                resolve(desc);
            } else {
                requestAnimationFrame(check);
            }
        };
        check();
    });

    class ParticleSystem {
        constructor(targetEl) {
            this.target = targetEl;
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d", { alpha: true });
            this.dpr = window.devicePixelRatio || 1;
            this.particles = [];
            this.container = document.createElement("div");
            
            Object.assign(this.container.style, {
                position: "absolute",
                pointerEvents: "none",
                zIndex: "9",
                overflow: "hidden"
            });
            
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            this.container.appendChild(this.canvas);
            document.body.appendChild(this.container);
            
            this.observer = new ResizeObserver(() => this.resize());
            this.observer.observe(this.target);
            this.loop = this.loop.bind(this);
        }

        resize() {
            const r = this.target.getBoundingClientRect();
            this.container.style.top = r.top + scrollY + "px";
            this.container.style.left = r.left + scrollX + "px";
            this.container.style.width = r.width + "px";
            this.container.style.height = r.height + "px";
            this.w = r.width;
            this.h = r.height;
            this.canvas.width = this.w * this.dpr;
            this.canvas.height = this.h * this.dpr;
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        start() {
            this.resize();
            this.initParticles();
            requestAnimationFrame(this.loop);
            
            const scrollHandler = () => this.resize();
            addEventListener("scroll", scrollHandler);
            this.cleanup = () => removeEventListener("scroll", scrollHandler);
        }

        loop() {
            if (!document.contains(this.container)) {
                this.cleanup?.();
                return;
            }
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.updateAndDraw();
            requestAnimationFrame(this.loop);
        }

        destroy() {
            this.observer?.disconnect();
            this.cleanup?.();
            // Check parent exists before removing
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }
    }

    class RainSystem extends ParticleSystem {
        initParticles() {
            for (let i = 0; i < 60; i++) {
                this.particles.push(this.reset({}));
            }
        }
        
        reset(p) {
            p.x = Math.random() * this.w;
            p.y = Math.random() * -this.h;
            p.z = Math.random() * 0.6 + 0.4;
            p.len = Math.random() * 20 + 15;
            p.vy = (Math.random() * 8 + 12) * p.z;
            return p;
        }
        
        updateAndDraw() {
            this.ctx.lineWidth = 1.5;
            this.ctx.lineCap = "round";
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
            gradient.addColorStop(0, "rgba(200, 220, 255, 0.4)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
            this.ctx.strokeStyle = gradient;
            
            this.ctx.beginPath();
            for (const p of this.particles) {
                p.y += p.vy;
                if (p.y > this.h + p.len) this.reset(p);
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x, p.y + p.len * p.z);
            }
            this.ctx.stroke();
        }
    }

    class SnowSystem extends ParticleSystem {
        constructor(target) {
            super(target);
            this.imgs = SNOWFLAKE_SVGS.map(s => {
                const img = new Image();
                img.src = s;
                return img;
            });
            this.start();
        }
        
        initParticles() {
            for (let i = 0; i < 80; i++) {
                this.particles.push(this.reset({}));
            }
        }
        
        reset(p) {
            p.x = Math.random() * this.w;
            p.y = Math.random() * -this.h;
            p.z = Math.random() * 0.6 + 0.4;
            p.size = (Math.random() * 15 + 12) * p.z;
            p.vy = (Math.random() * 0.8 + 0.5) * p.z;
            p.sway = Math.random() * 0.08;
            p.swayOff = Math.random() * Math.PI * 2;
            p.rot = Math.random() * 360;
            p.rotSpeed = (Math.random() - 0.5) * 0.6;
            p.img = this.imgs[Math.floor(Math.random() * this.imgs.length)];
            p.alpha = 0.6 + Math.random() * 0.3;
            return p;
        }
        
        updateAndDraw() {
            for (const p of this.particles) {
                p.y += p.vy;
                p.swayOff += p.sway;
                p.x += Math.sin(p.swayOff) * 0.6;
                p.rot += p.rotSpeed;
                
                if (p.y > this.h + 30) this.reset(p);
                
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rot * Math.PI / 180);
                this.ctx.globalAlpha = p.alpha;
                
                if (p.img.complete) {
                    this.ctx.drawImage(p.img, -p.size/2, -p.size/2, p.size, p.size);
                }
                
                this.ctx.restore();
            }
        }
    }

    class FireflySystem extends ParticleSystem {
        constructor(target) {
            super(target);
            this.start();
        }
        
        initParticles() {
            for (let i = 0; i < 50; i++) {
                this.particles.push(this.reset({}));
            }
        }
        
        reset(p) {
            p.x = Math.random() * this.w;
            p.y = Math.random() * this.h;
            p.vx = (Math.random() - 0.5) * 0.8;
            p.vy = (Math.random() - 0.5) * 0.8;
            p.phase = Math.random() * Math.PI * 2;
            p.phaseSpeed = 0.04 + Math.random() * 0.04;
            p.size = Math.random() * 2 + 1.5;
            return p;
        }
        
        updateAndDraw() {
            for (const p of this.particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.phase += p.phaseSpeed;
                
                if (p.x < -10) p.x = this.w + 10;
                if (p.x > this.w + 10) p.x = -10;
                if (p.y < -10) p.y = this.h + 10;
                if (p.y > this.h + 10) p.y = -10;
                
                const glow = (Math.sin(p.phase) + 1) / 2;
                const alpha = 0.4 + glow * 0.6;
                
                this.ctx.shadowBlur = 20 * glow;
                this.ctx.shadowColor = "rgba(255, 250, 200, 1)";
                this.ctx.fillStyle = `rgba(255, 250, 200, ${alpha})`;
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size + glow * 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.shadowBlur = 0;
            }
        }
    }

    class RoseSystem extends ParticleSystem {
        constructor(target) {
            super(target);
            this.img = new Image();
            this.img.src = ROSE_SVG;
            this.start();
        }
        
        initParticles() {
            for (let i = 0; i < 35; i++) {
                this.particles.push(this.reset({}));
            }
        }
        
        reset(p) {
            p.x = Math.random() * this.w;
            p.y = Math.random() * -this.h - 50;
            p.vy = Math.random() * 0.7 + 0.5;
            p.vx = (Math.random() - 0.5) * 0.3;
            p.rot = Math.random() * 360;
            p.rotSpeed = (Math.random() - 0.5) * 0.8;
            p.size = Math.random() * 18 + 15;
            p.sway = Math.random() * 0.05;
            p.swayOff = Math.random() * Math.PI * 2;
            return p;
        }
        
        updateAndDraw() {
            for (const p of this.particles) {
                p.y += p.vy;
                p.swayOff += p.sway;
                p.x += p.vx + Math.sin(p.swayOff) * 0.4;
                p.rot += p.rotSpeed;
                
                if (p.y > this.h + 50) this.reset(p);
                
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rot * Math.PI / 180);
                this.ctx.globalAlpha = 0.9;
                
                if (this.img.complete) {
                    this.ctx.drawImage(this.img, -p.size/2, -p.size/2, p.size, p.size);
                }
                
                this.ctx.restore();
            }
        }
    }

    class SparkleSystem extends ParticleSystem {
        constructor(target) {
            super(target);
            this.img = new Image();
            this.img.src = SPARKLE_SVG;
            this.start();
        }
        
        initParticles() {
            for (let i = 0; i < 40; i++) {
                this.particles.push(this.reset({}));
            }
        }
        
        reset(p) {
            p.x = Math.random() * this.w;
            p.y = Math.random() * this.h;
            p.phase = Math.random() * Math.PI * 2;
            p.phaseSpeed = 0.03 + Math.random() * 0.03;
            p.size = Math.random() * 25 + 20;
            p.floatSpeed = (Math.random() - 0.5) * 0.3;
            p.lifetime = Math.random() * 200 + 150;
            p.age = 0;
            return p;
        }
        
        updateAndDraw() {
            for (const p of this.particles) {
                p.age++;
                p.phase += p.phaseSpeed;
                p.y += p.floatSpeed;
                
                if (p.age > p.lifetime) this.reset(p);
                
                const twinkle = (Math.sin(p.phase) + 1) / 2;
                const lifeFade = Math.min(p.age / 50, 1) * Math.min((p.lifetime - p.age) / 50, 1);
                const alpha = twinkle * 0.7 * lifeFade;
                
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.globalAlpha = alpha;
                
                if (this.img.complete) {
                    this.ctx.drawImage(this.img, -p.size/2, -p.size/2, p.size, p.size);
                }
                
                this.ctx.restore();
            }
        }
    }

    async function fetchGameImage(id) {
        try {
            const response = await fetch(`https://www.kogama.com/games/play/${id}/`);
            const html = await response.text();
            const match = html.match(/options\.bootstrap\s*=\s*({.*?});/s);
            if (!match) return "";
            
            const data = JSON.parse(match[1]);
            return data.object?.images?.large || 
                   Object.values(data.object?.images || {})[0] || "";
        } catch (err) {
            console.error('Failed to fetch game image:', err);
            return "";
        }
    }

    async function fetchImgurImage(id) {
        for (const ext of ["png", "jpg", "gif", "jpeg"]) {
            const url = `https://i.imgur.com/${id}.${ext}`;
            try {
                const response = await fetch(url, { method: "HEAD" });
                if (response.ok) return url;
            } catch {}
        }
        return "";
    }

    const activeSystems = [];

    async function applyEffects() {
        try {
            // Clean up existing systems
            activeSystems.forEach(sys => sys.destroy?.());
            activeSystems.length = 0;
            
            // Get description from bootstrap
            const description = await waitForBootstrap();
            
            if (!description) {
                console.log('Background Effects: No description found in bootstrap');
                return;
            }
            
            // Parse background syntax: Background: i-abc123 or Background: 123456
            // Optional filter: filter: rain, snow, blur, dark
            const match = /Background:\s*(?:i-([a-zA-Z0-9]+)|(\d+))(?:,\s*filter:\s*([a-z, ]+))?/i.exec(description);
            
            if (!match) {
                console.log('Background Effects: No background syntax found');
                return;
            }
            
            const imgurId = match[1];
            const gameId = match[2];
            const imageUrl = imgurId 
                ? await fetchImgurImage(imgurId) 
                : await fetchGameImage(gameId);
            
            if (!imageUrl) {
                console.warn('Background Effects: No image URL found');
                return;
            }
            
            const bgElement = document.querySelector("._33DXe");
            if (!bgElement) {
                console.warn('Background Effects: Background element not found');
                return;
            }
            
            // Parse filters and modifiers
            const filters = match[3] ? match[3].split(",").map(f => f.trim().toLowerCase()) : [];
            
            const hasBlur = filters.includes('blur');
            const hasDark = filters.includes('dark');
            
            // Build CSS filters
            let cssFilters = [];
            if (hasBlur) cssFilters.push('blur(4px)');
            if (hasDark) cssFilters.push('brightness(0.7)');
            
            // Apply background with filters
            Object.assign(bgElement.style, {
                transition: "opacity 0.3s ease-in",
                opacity: "1",
                backgroundImage: `url("${imageUrl}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "absolute",
                filter: cssFilters.join(' ') || 'none',
                zIndex: "1"
            });
            
            // Apply particle effects
            filters.forEach(filter => {
                let system;
                switch(filter) {
                    case "rain":
                        system = new RainSystem(bgElement);
                        system.start();
                        activeSystems.push(system);
                        console.log('Background Effects: Rain applied');
                        break;
                    case "snow":
                        system = new SnowSystem(bgElement);
                        activeSystems.push(system);
                        console.log('Background Effects: Snow applied');
                        break;
                    case "fireflies":
                        system = new FireflySystem(bgElement);
                        activeSystems.push(system);
                        console.log('Background Effects: Fireflies applied');
                        break;
                    case "roses":
                        system = new RoseSystem(bgElement);
                        activeSystems.push(system);
                        console.log('Background Effects: Roses applied');
                        break;
                    case "sparkles":
                        system = new SparkleSystem(bgElement);
                        activeSystems.push(system);
                        console.log('Background Effects: Sparkles applied');
                        break;
                }
            });
            
            console.log('Background Effects: Applied successfully', {
                source: imgurId ? `imgur:${imgurId}` : `game:${gameId}`,
                filters: filters.join(', ') || 'none'
            });
            
        } catch (err) {
            console.error('Background Effects: Failed to apply', err);
        }
    }

    // Tooltip trigger for textarea
    const inputObserver = new MutationObserver(() => {
        const textarea = document.querySelector("textarea#description");
        
        if (textarea && !textarea._bgEffectsMonitored) {
            textarea._bgEffectsMonitored = true;
            
            let debounceTimer;
            textarea.addEventListener("input", (e) => {
                clearTimeout(debounceTimer);
                const value = e.target.value.toLowerCase();
                
                if (value.includes("filter:")) {
                    debounceTimer = setTimeout(() => showTooltip(e.target), 300);
                } else {
                    removeTooltip();
                }
            });
            
            textarea.addEventListener("blur", () => {
                setTimeout(removeTooltip, 200);
            });
            
            textarea.addEventListener("focus", (e) => {
                if (e.target.value.toLowerCase().includes("filter:")) {
                    setTimeout(() => showTooltip(e.target), 300);
                }
            });
        }
    });

    inputObserver.observe(document.body, { 
        childList: true, 
        subtree: true 
    });

    if (document.readyState === "loading") {
        addEventListener("DOMContentLoaded", applyEffects);
    } else {
        applyEffects();
    }

})();

// Find kogama app/window.kogama
(() => {
    let capturedOptions = null;
    
    Object.defineProperty(window, 'kogamaApp', {
        set: function(fn) {
            this._kogamaApp = function(options) {
                // console.log("[Gradient DBG] kogamaApp called, capturing options");
                capturedOptions = options;
                window.__capturedBootstrap = options.bootstrap;
                return fn(options);
            };
        },
        get: function() {
            return this._kogamaApp;
        }
    });
})();
// personalized profile griadents via description 
(async () => {
  "use strict";
    // now reading from options.bootstrap to save time and future-proof         
  const waitForBootstrap = () => new Promise(resolve => {
    const check = () => {
      const desc = window.__capturedBootstrap?.object?.description || 
                   window.__capturedBootstrap?.current_user?.description;
      
      if (desc) {
        resolve(desc);
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

  const waitForElement = selector => new Promise(resolve => {
    const check = () => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

  const description = await waitForBootstrap(); 
  

  const gradientMatch = /linear-gradient\((?:\d+deg, )?(#[0-9a-f]{6}, #[0-9a-f]{6}(?: \d+%)?)\)/i.exec(description);
  
  if (gradientMatch) {
    const rootEl = await waitForElement('#root-page-mobile');
    
    if (rootEl) {
      rootEl.style.transition = 'opacity 0.5s ease, background-image 1.3s ease-in';
      rootEl.style.opacity = '0';
      
      requestAnimationFrame(() => {
        rootEl.style.backgroundImage = gradientMatch[0];
        rootEl.style.opacity = '1';
      });
    }
  }
})();


// decode html by force for inputs (easy bio editing)
(function() {
    'use strict';
    const decodeAllHtmlEntities = (text) => {
        if (!text || typeof text !== 'string') return text;

        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        let decoded = textarea.value;

        let previousDecoded = '';
        let iterations = 0;
        const maxIterations = 10;

        while (decoded !== previousDecoded && iterations < maxIterations) {
            previousDecoded = decoded;
            textarea.innerHTML = decoded;
            decoded = textarea.value;
            iterations++;
        }

        return decoded;
    };
    const attachedListeners = new WeakSet();
    const getReactProps = (element) => {
        for (let key in element) {
            if (key.startsWith('__reactProps$') || key.startsWith('__reactInternalInstance$')) {
                return element[key];
            }
        }
        return null;
    };

    const setReactValue = (element, value) => {
        const previousValue = element.value;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            element.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
            'value'
        )?.set;
        
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, value);
        }
        element.value = value;
        const reactProps = getReactProps(element);
        if (reactProps && reactProps.onChange) {
            const event = new Event('input', { bubbles: true });
            Object.defineProperty(event, 'target', { writable: false, value: element });
            reactProps.onChange(event);
        }
        ['input', 'change'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });
        element._valueTracker?.setValue(previousValue);
        // console.log('[HTML Decoder] Updated:', previousValue, '→', value);
    };
    const processInput = (element, immediate = false) => {
        if (!element || !element.value) return;
        const decoded = decodeAllHtmlEntities(element.value);
        if (decoded !== element.value) {
            if (immediate) {
                setReactValue(element, decoded);
            } else {
                requestAnimationFrame(() => setReactValue(element, decoded));
            }
        }
    };
    const attachListeners = (element) => {
        if (attachedListeners.has(element)) return;
        attachedListeners.add(element);
        element.addEventListener('focus', () => {
            processInput(element, true);
        });
        element.addEventListener('click', () => {
            processInput(element, true);
        });
        element.addEventListener('input', (e) => {
            setTimeout(() => processInput(element, true), 0);
        });
        element.addEventListener('blur', () => {
            processInput(element, true);
        });
        processInput(element, false);
    };
    const scanForInputs = () => {
        document.querySelectorAll('input, textarea').forEach(attachListeners);
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.matches && node.matches('input, textarea')) {
                        attachListeners(node);
                    }
                    node.querySelectorAll?.('input, textarea').forEach(attachListeners);
                }
            });
        });
    });
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        scanForInputs();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
            scanForInputs();
        });
    }
    setInterval(scanForInputs, 2000);

  //  console.log('[HTML Decoder] React  loaded');
})();


// config and settings long bullshit basically
(function() {
    'use strict';

    const CONFIG = {
      PANEL_ID: 'utilify_panel',
      STYLE_ID: 'utilify_style',
      STORAGE_KEY: 'UtilifyConfig',
      PLUGINS_KEY: 'UtilifyPlugins',
      UPDATE_URL: 'https://raw.githubusercontent.com/gxthickitty/Utilify/main/Script/Rewrite/Utilify.user.js',
      
      defaults: {
        gradient: null,
        gradientAngle: 135,
        gradientColor1: '#0a2e2a',
        gradientColor2: '#1a4d47',
        fontFamily: null,
        onlineFont: null,
        glassPanels: { enabled: true, radius: 6, hue: 170, alpha: 0.18 },
        onlineStyles: '',
        customCSS: '',
        disableFriendslist: false,
        blurSensitive: false,
        blurComments: false,
        appearOffline: false,
        friendActivity: false,
        playerTypeDisplay: false,
        lazyStreakKeeper: false,
        plugins: []
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
      },

      getPlugins() {
        return this.get(CONFIG.PLUGINS_KEY, []);
      },

      savePlugins(plugins) {
        this.set(CONFIG.PLUGINS_KEY, plugins);
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
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }

          @keyframes glow-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }

          #${CONFIG.PANEL_ID} {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: min(780px, 94vw);
            max-height: 72vh;
            border-radius: 12px;
            overflow: hidden;
            background: linear-gradient(135deg, #0d1f1d 0%, #1a2f2d 50%, #0d1f1d 100%);
            color: #e0f0ee;
            box-shadow: 
              0 0 40px rgba(74, 222, 183, 0.2),
              0 20px 80px rgba(0, 0, 0, 0.7),
              inset 0 1px 0 rgba(74, 222, 183, 0.15);
            z-index: 120000;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            border: 1px solid rgba(74, 222, 183, 0.25);
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

          /* Subtle tech accent on corners */
          #${CONFIG.PANEL_ID}::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle at top right, rgba(74, 222, 183, 0.15) 0%, transparent 60%);
            border-radius: 0 12px 0 0;
            pointer-events: none;
          }

          #${CONFIG.PANEL_ID}::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle at bottom left, rgba(42, 157, 143, 0.1) 0%, transparent 60%);
            pointer-events: none;
          }

          #${CONFIG.PANEL_ID} .header {
            height: 64px;
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 0 28px;
            cursor: grab;
            user-select: none;
            background: linear-gradient(135deg, rgba(20, 35, 33, 0.85) 0%, rgba(15, 28, 26, 0.95) 100%);
            border-bottom: 1px solid rgba(74, 222, 183, 0.12);
            position: relative;
          }

          #${CONFIG.PANEL_ID} .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 5%;
            right: 5%;
            height: 1px;
            background: linear-gradient(90deg, 
              transparent 0%, 
              rgba(74, 222, 183, 0.4) 50%, 
              transparent 100%);
          }

          #${CONFIG.PANEL_ID} .title {
            font-weight: 500;
            font-size: 11px;
            letter-spacing: 3px;
            color: rgba(74, 222, 183, 0.7);
            text-transform: uppercase;
            flex: 1;
            text-align: center;
            position: relative;
          }
          
          #${CONFIG.PANEL_ID} .title::before,
          #${CONFIG.PANEL_ID} .title::after {
            content: '◆';
            position: absolute;
            color: rgba(74, 222, 183, 0.5);
            font-size: 8px;
          }
          
          #${CONFIG.PANEL_ID} .title::before {
            left: -20px;
          }
          
          #${CONFIG.PANEL_ID} .title::after {
            right: -20px;
          }

          #${CONFIG.PANEL_ID} .close {
            background: rgba(74, 222, 183, 0.08);
            border: 1px solid rgba(74, 222, 183, 0.2);
            color: #4adeb7;
            cursor: pointer;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 18px;
            line-height: 1;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          #${CONFIG.PANEL_ID} .close:hover {
            background: rgba(74, 222, 183, 0.15);
            border-color: rgba(74, 222, 183, 0.4);
            color: #6ef0cb;
            transform: scale(1.05);
          }

          #${CONFIG.PANEL_ID} .body {
            display: flex;
            gap: 2px;
            height: calc(72vh - 64px);
            background: rgba(0, 0, 0, 0.25);
            position: relative;
          }

          /* Made by Simon - vertical text */
          #${CONFIG.PANEL_ID} .body::after {
            content: 'Made by Simon';
            position: absolute;
            right: 14px;
            bottom: 24px;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            font-size: 10px;
            letter-spacing: 2.5px;
            color: rgba(74, 222, 183, 0.35);
            font-weight: 500;
            text-transform: uppercase;
            pointer-events: none;
          }

          #${CONFIG.PANEL_ID} .tabs {
            width: 190px;
            background: linear-gradient(180deg, rgba(15, 28, 26, 0.7) 0%, rgba(10, 20, 18, 0.85) 100%);
            padding: 18px 14px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          #${CONFIG.PANEL_ID} .tab {
            padding: 14px 18px;
            cursor: pointer;
            border-left: 2px solid transparent;
            color: #a0c8c0;
            border-radius: 8px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 13px;
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
            background: linear-gradient(135deg, rgba(74, 222, 183, 0.08) 0%, rgba(42, 157, 143, 0.05) 100%);
            opacity: 0;
            transition: opacity 0.25s ease;
          }

          #${CONFIG.PANEL_ID} .tab:hover {
            background: rgba(74, 222, 183, 0.05);
            color: #c0e8dd;
            transform: translateX(4px);
          }

          #${CONFIG.PANEL_ID} .tab:hover::before {
            opacity: 1;
          }

          #${CONFIG.PANEL_ID} .tab.active {
            background: linear-gradient(135deg, rgba(74, 222, 183, 0.12) 0%, rgba(42, 157, 143, 0.08) 100%);
            border-left-color: #4adeb7;
            color: #4adeb7;
            transform: translateX(5px);
            box-shadow: 0 3px 10px rgba(74, 222, 183, 0.15);
            position: relative;
          }

          #${CONFIG.PANEL_ID} .tab.active::after {
            content: '◆';
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(74, 222, 183, 0.7);
            font-size: 10px;
          }

          #${CONFIG.PANEL_ID} .tab.active::before {
            opacity: 1;
          }

          #${CONFIG.PANEL_ID} .content {
            flex: 1;
            overflow-y: auto;
            padding: 26px;
            background: linear-gradient(180deg, rgba(13, 23, 21, 0.95) 0%, rgba(10, 18, 16, 0.98) 100%);
            position: relative;
          }

          .field-row {
            margin: 18px 0;
            display: flex;
            gap: 14px;
            align-items: center;
          }

          .field-label {
            font-size: 13px;
            color: #b8d8d0;
            min-width: 120px;
            font-weight: 500;
          }

          .color-input {
            width: 56px;
            height: 40px;
            border: 2px solid rgba(74, 222, 183, 0.25);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: rgba(0, 0, 0, 0.4);
          }
          
          .color-input:hover {
            transform: scale(1.05);
            border-color: rgba(74, 222, 183, 0.5);
            box-shadow: 0 4px 16px rgba(74, 222, 183, 0.2);
          }

          input[type="text"], input[type="number"], select, textarea {
            padding: 11px 15px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(74, 222, 183, 0.18);
            border-radius: 8px;
            color: #e0f0ee;
            font-size: 13px;
            transition: all 0.2s ease;
          }

          input[type="text"]:focus, input[type="number"]:focus, select:focus, textarea:focus {
            outline: none;
            border-color: rgba(74, 222, 183, 0.4);
            box-shadow: 0 0 0 3px rgba(74, 222, 183, 0.1);
          }

          input[type="range"] {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: linear-gradient(90deg, rgba(42, 157, 143, 0.3) 0%, rgba(74, 222, 183, 0.5) 100%);
            outline: none;
            -webkit-appearance: none;
          }
          
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4adeb7 0%, #2a9d8f 100%);
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(74, 222, 183, 0.4);
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 16px rgba(74, 222, 183, 0.6);
          }

          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #4adeb7;
          }

          .button {
            padding: 11px 22px;
            background: linear-gradient(135deg, rgba(74, 222, 183, 0.18) 0%, rgba(42, 157, 143, 0.12) 100%);
            color: #4adeb7;
            border-radius: 8px;
            border: 1px solid rgba(74, 222, 183, 0.35);
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
            background: rgba(255, 255, 255, 0.12);
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
          }

          .button:hover::before {
            width: 300px;
            height: 300px;
          }

          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 222, 183, 0.3);
            border-color: rgba(74, 222, 183, 0.6);
          }

          .button:active {
            transform: translateY(0);
          }

          .small-note {
            font-size: 12px;
            color: #8aa8a0;
            margin-top: 10px;
            line-height: 1.7;
          }

          label {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            color: #b8d8d0;
            font-size: 14px;
            transition: color 0.2s ease;
          }

          label:hover {
            color: #d0ede5;
          }

        /* Plugin list styles */
        .plugin-item {
        background: rgba(74, 222, 183, 0.05);
        border: 1px solid rgba(74, 222, 183, 0.15);
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        }

        .plugin-info h4 {
        color: #4adeb7;
        font-size: 14px;
        margin: 0 0 4px 0;
        }

        .plugin-info p {
        color: #8aa8a0;
        font-size: 12px;
        margin: 0 0 2px 0;
        }

        .plugin-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        margin-top: 6px;
        }

        .plugin-meta span {
        color: #5c8a80;
        font-size: 11px;
        }

        .plugin-meta span b {
        color: #7ab8ae;
        font-weight: 600;
        }

        .plugin-controls {
        display: flex;
        gap: 8px;
        }

        .plugin-toggle {
        padding: 6px 12px;
        font-size: 12px;
        }

        .plugin-remove {
        background: rgba(239, 71, 111, 0.15);
        border-color: rgba(239, 71, 111, 0.3);
        color: #ef476f;
        padding: 6px 12px;
        font-size: 12px;
        }

        .plugin-remove:hover {
        background: rgba(239, 71, 111, 0.25);
        border-color: rgba(239, 71, 111, 0.5);
        }

          /* Scrollbars */
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(74, 222, 183, 0.35) 0%, rgba(42, 157, 143, 0.35) 100%);
            border-radius: 5px;
            border: 2px solid transparent;
            background-clip: padding-box;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(74, 222, 183, 0.55) 0%, rgba(42, 157, 143, 0.55) 100%);
            background-clip: padding-box;
          }

          a {
            color: #4adeb7;
            text-decoration: none;
            transition: color 0.2s ease;
          }

          a:hover {
            color: #6ef0cb;
            text-decoration: underline;
          }
        `);
      },
      
      applyGradient(value, angle, c1, c2) {
        const target = document.getElementById('root-page-mobile');
        if (!target) {
          // Fallback to body if new selector doesn't exist
          document.body.style.backgroundImage = value || '';
          document.body.style.backgroundAttachment = 'fixed';
          return;
        }
        target.style.backgroundImage = value || '';
        target.style.backgroundAttachment = 'fixed';
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
          ._3TORb ._2E1AL .tRx6U, .css-1wbcikz, .css-wog98n, .css-o4yc28, .css-z05bui, ._1q4mD, .css-e8xqt2, .css-yrsbmg, .css-ry78up {
            background-color: hsla(${hue},65%,40%,${alpha}) !important;
            backdrop-filter: blur(8px) !important;
            border-radius: ${radius}px !important;
            transition: all 0.25s ease !important;
          }
          ._3TORb {
            background-color: hsla(${hue},65%,40%,${alpha}) !important;
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

 const PluginManager = {
  loadedPlugins: new Map(),

  async fetchPlugin(url) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: (response) => {
            if (response.status === 200) {
              resolve(response.responseText);
            } else {
              reject(new Error(`HTTP ${response.status}`));
            }
          },
          onerror: () => reject(new Error('Network error'))
        });
      } else {
        fetch(url)
          .then(r => r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`)))
          .then(resolve)
          .catch(reject);
      }
    });
  },

  async addPlugin(url) {
    try {
      const code = await this.fetchPlugin(url);

      // Extract structured metadata using "// Key * Value" format
      const meta = (key) => {
        const m = code.match(new RegExp(`\\/\\/\\s*${key}\\s*\\*\\s*(.+)`));
        return m ? m[1].trim() : null;
      };

      const plugin = {
        id: Date.now().toString(),
        name:        meta('Title')       || 'Unnamed Plugin',
        description: meta('Desc')        || 'No description',
        version:     meta('Ver')         || null,
        date:        meta('Date')        || null,
        author:      meta('Auth')        || null,
        url:         url,
        code:        code,
        enabled:     true
      };

      const plugins = Storage.getPlugins();
      plugins.push(plugin);
      Storage.savePlugins(plugins);

      this.enablePlugin(plugin);
      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin: ${error.message}`);
    }
  },

  enablePlugin(plugin) {
    if (this.loadedPlugins.has(plugin.id)) return;

    try {
      const script = document.createElement('script');
      script.id = `utilify-plugin-${plugin.id}`;
      script.textContent = plugin.code;
      document.head.appendChild(script);
      this.loadedPlugins.set(plugin.id, script);
    } catch (error) {
      console.error(`Failed to enable plugin ${plugin.name}:`, error);
    }
  },

  disablePlugin(plugin) {
    const script = this.loadedPlugins.get(plugin.id);
    if (script) {
      script.remove();
      this.loadedPlugins.delete(plugin.id);
    }
  },

  removePlugin(pluginId) {
    const plugins = Storage.getPlugins();
    const plugin = plugins.find(p => p.id === pluginId);

    if (plugin && plugin.enabled) {
      this.disablePlugin(plugin);
    }

    const filtered = plugins.filter(p => p.id !== pluginId);
    Storage.savePlugins(filtered);
  },

  togglePlugin(pluginId) {
    const plugins = Storage.getPlugins();
    const plugin = plugins.find(p => p.id === pluginId);

    if (!plugin) return;

    plugin.enabled = !plugin.enabled;
    Storage.savePlugins(plugins);

    if (plugin.enabled) {
      this.enablePlugin(plugin);
    } else {
      this.disablePlugin(plugin);
    }
  },

  loadAllPlugins() {
    const plugins = Storage.getPlugins();
    plugins.forEach(plugin => {
      if (plugin.enabled) {
        this.enablePlugin(plugin);
      }
    });
  }
};
    const RiskyFeatures = {
      pulseBlocker: { installed: false },
      friendActivity: { timer: null, observer: null, profileId: null },
      playerType: { attached: false, observer: null },
      streakKeeper: { timer: null },

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

      cache: { games: {}, projects: {} },

      async fetchGameTitle(gid) {
        if (this.cache.games[gid]) return this.cache.games[gid];
        try {
          const res = await fetch(`https://www.kogama.com/games/play/${gid}/`);
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const title = doc.querySelector('title')?.textContent.split(' - KoGaMa')[0]?.trim() || null;
          if (title) this.cache.games[gid] = title;
          return title;
        } catch { return null; }
      },

      async fetchProjectName(pid) {
        if (this.cache.projects[pid]) return this.cache.projects[pid];
        try {
          const res = await fetch(`https://www.kogama.com/game/${pid}/member`);
          if (!res.ok) return null;
          const data = await res.json();
          if (data.data?.length) {
            const name = data.data[0].name;
            this.cache.projects[pid] = name;
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

      async fetchFriendChat() {
        if (!this.friendActivity.profileId) return;
        try {
          const res = await fetch(`https://www.kogama.com/user/${this.friendActivity.profileId}/friend/chat/`);
          if (!res.ok) return;
          const data = await res.json();
          
          if (data.data && Array.isArray(data.data)) {
            data.data.forEach(friend => {
              const username = friend.username;
              const loc = friend.location || '/';
              
              const gameMatch = loc.match(/\/games\/play\/(\d+)\//);
              if (gameMatch) {
                this.fetchGameTitle(gameMatch[1]).then(title => {
                  if (title) this.updateFriendStatus(username, title);
                });
              }

              const projectMatch = loc.match(/\/build\/\d+\/project\/(\d+)\//) || loc.match(/\/game\/(\d+)\/member/);
              if (projectMatch) {
                this.fetchProjectName(projectMatch[1]).then(nameText => {
                  if (nameText) this.updateFriendStatus(username, nameText);
                });
              }
            });
          }
        } catch (err) {
          console.error('Utilify Friend Fetch Error:', err);
        }
      },

      processFriendEntry(entry) {
        const nameEl = entry.querySelector('._3zDi-');
        if (!nameEl) return;
        const name = nameEl.textContent?.trim();
        
        const statusEl = entry.querySelector('._40qZj');
        const loc = statusEl?.textContent?.trim() || entry.querySelector('a[href]')?.getAttribute('href');
        
        if (!loc) return;

        const gameMatch = loc.match(/\/games\/play\/(\d+)\//);
        if (gameMatch) {
          this.fetchGameTitle(gameMatch[1]).then(title => {
            if (title) this.updateFriendStatus(name, title);
          });
          return;
        }

        const projectMatch = loc.match(/\/build\/\d+\/project\/(\d+)\//) || loc.match(/\/game\/(\d+)\/member/);
        if (projectMatch) {
          this.fetchProjectName(projectMatch[1]).then(name => {
            if (name) this.updateFriendStatus(name, name);
          });
        }
      },

      enableFriendActivity() {
        if (this.friendActivity.observer || this.friendActivity.timer) return;
        
        const profileId = getProfileIdFromBootstrap();
        if (!profileId) return;

        this.friendActivity.profileId = profileId;
        this.fetchFriendChat();

        this.friendActivity.timer = setInterval(() => {
          this.fetchFriendChat();
        }, 30000);

        const scanList = (container) => {
          container?.querySelectorAll('._1lvYU, ._1taAL').forEach(node => 
            this.processFriendEntry(node)
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
          const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
              m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && (node.matches?._1lvYU || node.querySelector?._1lvYU)) {
                  this.processFriendEntry(node);
                }
              });
            }
          });
          mo.observe(target, { childList: true, subtree: true });
          this.friendActivity.observer = mo;
        }
      },

      disableFriendActivity() {
        if (this.friendActivity.observer) {
          this.friendActivity.observer.disconnect();
          this.friendActivity.observer = null;
        }
        if (this.friendActivity.timer) {
          clearInterval(this.friendActivity.timer);
          this.friendActivity.timer = null;
        }
      },

    async renderPlayerChip(el) {
    if (!el) return;
    try {
        const res = await fetch(location.href);
        const html = await res.text();
        const m = html.match(/playing_now_members["']\s*:\s*(\d+).*?playing_now_tourists["']\s*:\s*(\d+)/s);
        const counts = m ? { members: +m[1], tourists: +m[2] } : { members: 0, tourists: 0 };
        
        // Remove existing chip if present
        const existingChip = document.querySelector('[data-player-stats-chip]');
        if (existingChip) existingChip.remove();
        
        const total = counts.members + counts.tourists;
        
        const chip = document.createElement('div');
        chip.setAttribute('data-player-stats-chip', 'true');
        chip.style.cssText = `
        background: linear-gradient(135deg, rgba(20, 184, 166, 0.12), rgba(13, 148, 136, 0.08));
        backdrop-filter: blur(12px);
        border: 1px solid rgba(20, 184, 166, 0.3);
        border-radius: 8px;
        padding: 6px 12px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-left: 12px;
        vertical-align: middle;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        font-size: 12px;
        font-weight: 500;
        `;
        
        chip.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
            <circle cx="12" cy="12" r="10" stroke="#14b8a6" stroke-width="2" fill="rgba(20,184,166,0.15)"/>
            <circle cx="12" cy="12" r="3" fill="#5eead4"/>
        </svg>
        <span class="stat-num" data-label="Total Players" style="color:#5eead4; font-weight:600; position:relative; cursor:help;">${total}</span>
        <span style="color:#99f6e4; opacity:0.8;">|</span>
        <span class="stat-num" data-label="Members" style="color:#99f6e4; position:relative; cursor:help;">${counts.members}</span>
        <span style="color:#5eead4; opacity:0.6;">+</span>
        <span class="stat-num" data-label="Tourists" style="color:#5eead4; opacity:0.6; position:relative; cursor:help;">${counts.tourists}</span>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
        .stat-num::before {
            content: attr(data-label);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-4px);
            background: rgba(13, 148, 136, 0.95);
            color: #f0fdfa;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s, transform 0.2s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(20, 184, 166, 0.4);
        }
        .stat-num::after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: rgba(13, 148, 136, 0.95);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
        }
        .stat-num:hover::before {
            opacity: 1;
            transform: translateX(-50%) translateY(-8px);
        }
        .stat-num:hover::after {
            opacity: 1;
        }
        `;
        if (!document.querySelector('[data-player-stats-style]')) {
        style.setAttribute('data-player-stats-style', 'true');
        document.head.appendChild(style);
        }
        
        el.parentElement.style.position = 'relative';
        el.style.display = 'inline-block';
        el.after(chip);
    } catch {}
    },

    enablePlayerTypeDisplay() {
    if (!location.pathname.includes('/games/play/')) return;
    if (this.playerType.attached) return;

    const findAndRender = () => {
        const gameTitle = document.querySelector('h1.game-title');
        if (gameTitle) {
        this.renderPlayerChip(gameTitle);
        this.playerType.attached = true;
        return true;
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
    const chip = document.querySelector('[data-player-stats-chip]');
    if (chip) chip.remove();
    const style = document.querySelector('[data-player-stats-style]');
    if (style) style.remove();
    this.playerType.attached = false;
    },

      enableStreakKeeper() {
        if (this.streakKeeper.timer) return;

        const userId = getProfileIdFromBootstrap();
        if (!userId) return;

        const TARGET = 670350173;
        const INTERVAL = 7 * 60 * 60 * 1000;
        const POLL_INTERVAL = 60 * 1000;
        const INITIAL_HISTORY_DELAY_MS = 1000;
        const HISTORY_RETRY_DELAY_MS = 10 * 1000;
        const RESPONSE_WAIT_MS = 3 * 60 * 1000;
        const SECOND_RESPONSE_WAIT_MS = 60 * 1000;

        const MESSAGES = [
          "you are so loved <3",
          "streak check in, hi!",
          "keeping the streak alive <3",
          "quick hello from your streak bot"
        ];

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        const postChat = async message => {
          await fetch(`https://www.kogama.com/chat/${userId}/`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to_profile_id: TARGET, message })
          });
        };

        const fetchHistory = async () => {
          const r = await fetch(
            `https://www.kogama.com/chat/${userId}/history/${TARGET}/`,
            { credentials: 'include' }
          );
          return r.json().catch(() => null);
        };

        const waitForReply = async timeoutMs => {
          const start = Date.now();
          await sleep(INITIAL_HISTORY_DELAY_MS);

          while (Date.now() - start < timeoutMs) {
            try {
              const h = await fetchHistory();
              if (h && Array.isArray(h.data) && h.data[0]?.from_profile_id == TARGET) {
                return h.data[0];
              }
            } catch {}
            await sleep(HISTORY_RETRY_DELAY_MS);
          }
          return null;
        };

        const sendMessage = async () => {
          const lastSent = parseInt(localStorage.getItem('ls_last_sent') || '0');
          if (Date.now() - lastSent < INTERVAL) return;

          try {
            const msg1 = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            await postChat(msg1);
            localStorage.setItem('ls_last_sent', Date.now().toString());

            const reply1 = await waitForReply(RESPONSE_WAIT_MS);
            if (!reply1) return;

            const msg2 = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            await postChat(msg2);

            const reply2 = await waitForReply(SECOND_RESPONSE_WAIT_MS);
            if (!reply2) return;

            const msg3 = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            await postChat(msg3);
          } catch {}
        };

        sendMessage();
        this.streakKeeper.timer = setInterval(sendMessage, POLL_INTERVAL);
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
          <div class="header">
            <div class="title">Utilify V2</div>
            <button class="close" aria-label="Close">×</button>
          </div>
          <div class="body">
            <div class="tabs">
              <div class="tab active" data-tab="gradient">Gradient</div>
              <div class="tab" data-tab="privacy">Privacy</div>
              <div class="tab" data-tab="styles">Styles</div>
              <div class="tab" data-tab="fonts">Fonts</div>
              <div class="tab" data-tab="plugins">Plugins</div>
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
              <input id="gradient-angle" type="range" min="0" max="360" value="135" style="flex:1"/>
              <span id="angle-val" style="min-width:40px; text-align:right; color:#4adeb7;">135°</span>
            </div>
            <div class="field-row">
              <span class="field-label">Color 1</span>
              <input id="color1" class="color-input" type="color" value="#0a2e2a"/>
              <input id="color1hex" type="text" placeholder="#HEX" style="flex:1"/>
            </div>
            <div class="field-row">
              <span class="field-label">Color 2</span>
              <input id="color2" class="color-input" type="color" value="#1a4d47"/>
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
              Changes apply live. Targets: #root-page-mobile (new) or body (fallback)
            </div>
          </div>

          <div class="tab-content" id="tab-privacy" style="display:none">
            <div class="small-note" style="margin-bottom:20px;">
              Privacy controls for your browsing experience.
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
              <input id="glass-radius" type="number" min="0" max="50" value="6" style="width:80px"/>
              <span style="color:#a0c8c0;">px</span>
            </div>
            <div class="field-row">
              <span class="field-label">Hue</span>
              <input id="glass-hue" type="range" min="0" max="360" value="170" style="flex:1"/>
              <span id="glass-hue-val" style="min-width:40px; text-align:right; color:#4adeb7;">170</span>
            </div>
            <div class="field-row">
              <span class="field-label">Alpha</span>
              <input id="glass-alpha" type="range" min="1" max="50" value="18" style="flex:1"/>
              <span id="glass-alpha-val" style="min-width:40px; text-align:right; color:#4adeb7;">18</span>
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

          <div class="tab-content" id="tab-plugins" style="display:none">
            <div class="small-note" style="margin-bottom:20px;">
              Add external plugins via GitHub raw URLs. Plugins should export valid JavaScript code.
            </div>
            <div class="field-row">
              <input id="plugin-url" type="text" placeholder="https://raw.githubusercontent.com/..." style="flex:1"/>
              <button id="add-plugin" class="button">Add Plugin</button>
            </div>
            <div id="plugin-list" style="margin-top:24px;">
              <!-- Plugins will be rendered here -->
            </div>
          </div>

          <div class="tab-content" id="tab-risky" style="display:none">
            <div style="background:rgba(239,71,111,0.12); border:1px solid rgba(239,71,111,0.3); border-radius:10px; padding:16px; margin-bottom:24px;">
              <strong style="color:#ef476f;">⚠️ Use At Your Own Risk</strong>
              <p class="small-note" style="margin-top:8px;">These features may violate Terms of Service.</p>
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
              <h3 style="color:#4adeb7; margin-bottom:16px; font-size:20px;">◆ Utilify V2 ◆</h3>
              <p class="small-note" style="font-size:13px; line-height:1.8; margin-bottom:24px;">
                Made by Community For Community.<br>
                Design inspired by Zhuang Fangyi from A: Endfield<br><br>
                Fully maintained by <a href="https://www.github.com/gxthickitty/utilify" target="_blank">Simon</a>
              </p>
              <div style="border-top:1px solid rgba(74, 222, 183, 0.15); padding-top:20px;">
                <h4 style="color:#6ef0cb; font-size:14px; margin-bottom:16px;">Contributors</h4>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; font-size:13px; color:#a0c8c0;">
                  <div>Death Wolf.</div>
                  <div>Snowy</div>
                  <div>Awoi</div>
                  <div>Selene</div>
                  <div>Tungsten</div>
                  <div>Raptor</div>
                  <div>Comenxo</div>
                  <div>Idealism</div>
                  <div>Sorry</div>
                  <div>Zpayer</div>
                  <div>ReZa</div> 
                  <div>ValDon</div>
                </div>
                <p class="small-note" style="margin-top:16px;">Thank you to all testers and supporters! ✨</p>
              </div>
            </div>
          </div>
        `;
      },
      
      setupEvents() {
        this.panel.querySelectorAll('.tab').forEach(tab => {
          tab.addEventListener('click', () => {
            this.panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.panel.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            tab.classList.add('active');
            this.panel.querySelector(`#tab-${tab.dataset.tab}`).style.display = '';
            
            if (tab.dataset.tab === 'plugins') {
              this.renderPluginList();
            }
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
          cfg.glassPanels.radius = parseInt(e.target.value) || 6;
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

        // Fonts
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
          const url = e.target.value.trim();
          const cfg = Storage.getConfig();
          cfg.onlineFont = url;
          Storage.saveConfig(cfg);
          
          if (url) {
            Styles.loadOnlineFont(url);
            if (cfg.fontFamily !== 'online') {
              cfg.fontFamily = 'online';
              this.panel.querySelector('#main-font').value = 'online';
              Storage.saveConfig(cfg);
            }
          }
        });

        // Plugins - YET TO BE FULLY IMPLEMENTED!
        this.panel.querySelector('#add-plugin').addEventListener('click', async () => {
          const url = this.panel.querySelector('#plugin-url').value.trim();
          if (!url) return;

          const btn = this.panel.querySelector('#add-plugin');
          const origText = btn.textContent;
          btn.textContent = 'Loading...';
          btn.disabled = true;

          try {
            await PluginManager.addPlugin(url);
            this.panel.querySelector('#plugin-url').value = '';
            this.renderPluginList();
            btn.textContent = 'Added! ';
          } catch (error) {
            alert(`Failed to add plugin: ${error.message}`);
            btn.textContent = origText;
          }

          btn.disabled = false;
          setTimeout(() => btn.textContent = origText, 2000);
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

    renderPluginList() {
    const container = this.panel.querySelector('#plugin-list');
    const plugins = Storage.getPlugins();

    if (plugins.length === 0) {
        container.innerHTML = '<div class="small-note">No plugins installed.</div>';
        return;
    }

    container.innerHTML = plugins.map(plugin => `
        <div class="plugin-item">
        <div class="plugin-info">
            <h4>${plugin.name}</h4>
            <p>${plugin.description}</p>
            <div class="plugin-meta">
            ${plugin.version ? `<span><b>v</b>${plugin.version}</span>` : ''}
            ${plugin.date    ? `<span><b>Date</b> ${plugin.date}</span>` : ''}
            ${plugin.author  ? `<span><b>By</b> ${plugin.author}</span>` : ''}
            </div>
        </div>
        <div class="plugin-controls">
            <button class="button plugin-toggle" data-id="${plugin.id}">
            ${plugin.enabled ? 'Disable' : 'Enable'}
            </button>
            <button class="button plugin-remove" data-id="${plugin.id}">Remove</button>
        </div>
        </div>
    `).join('');


        container.querySelectorAll('.plugin-toggle').forEach(btn => {
          btn.addEventListener('click', () => {
            PluginManager.togglePlugin(btn.dataset.id);
            this.renderPluginList();
          });
        });

        container.querySelectorAll('.plugin-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            if (confirm('Remove this plugin?')) {
              PluginManager.removePlugin(btn.dataset.id);
              this.renderPluginList();
            }
          });
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
        this.panel.querySelector('#glass-alpha').value = Math.round((cfg.glassPanels.alpha || 0.18) * 100);
        this.panel.querySelector('#glass-alpha-val').textContent = Math.round((cfg.glassPanels.alpha || 0.18) * 100);
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
      if (document.getElementById('utilify_settings_btn')) return;

      const tryInject = () => {
        const targetList = document.querySelector('ol._3hI0M');
        if (!targetList) return false;

        const li = document.createElement('li');
        li.className = '_3WhKY';

        const btn = document.createElement('button');
        btn.id = 'utilify_settings_btn';
        btn.setAttribute('aria-label', 'Open Utilify Settings');
        btn.innerHTML = '◆';

        btn.style.cssText = `
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(74, 222, 183, 0.25), rgba(42, 157, 143, 0.2));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(74, 222, 183, 0.4);
          color: #4adeb7;
          font-size: 11px;
          line-height: 1;
          margin-right: 8px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(74, 222, 183, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: 50% 50%;
        `;

        btn.addEventListener('mouseenter', () => {
          btn.style.transform = 'scale(1.15)';
          btn.style.boxShadow = '0 6px 30px rgba(74, 222, 183, 0.4)';
          btn.style.borderColor = 'rgba(74, 222, 183, 0.6)';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'scale(1)';
          btn.style.boxShadow = '0 4px 20px rgba(74, 222, 183, 0.25)';
          btn.style.borderColor = 'rgba(74, 222, 183, 0.4)';
        });

        btn.addEventListener('click', () => UI.show());

        li.appendChild(btn);
        targetList.insertBefore(li, targetList.firstElementChild);

        return true;
      };

      if (tryInject()) return;

      const observer = new MutationObserver(() => {
        if (tryInject()) observer.disconnect();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
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

      // Load plugins
      PluginManager.loadAllPlugins();
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

// Creation Date, Last Seen, *Last Played, WebArchive
// <span class="_20K92">Joined KoGaMa on ...</span>
(() => {
    'use strict';
    const injectStyles = () => {
        const css = `
            @keyframes sparkle {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.1); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .profile-info-wrapper {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-top: 4px;
                gap: 6px;
                animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .profile-info-item {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 4px 10px;
                background: linear-gradient(135deg, rgba(0,128,128,0.08) 0%, rgba(46,139,86,0.05) 100%);
                border: 1px solid rgba(0,128,128,0.2);
                border-radius: 20px;        
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(4px);
                color: #e0f0e0;
                line-height: 1.3;
            }
            .profile-info-item:hover {
                background: linear-gradient(135deg, rgba(0,128,128,0.15) 0%, rgba(46,139,86,0.1) 100%);
                border-color: rgba(0,128,128,0.4);
                transform: translateY(-1px);
                box-shadow: 0 3px 8px rgba(0,128,128,0.2);
            }
            .profile-info-item.expanded {
                background: linear-gradient(135deg, rgba(0,128,128,0.12) 0%, rgba(46,139,86,0.08) 100%);
                border-color: rgba(0,128,128,0.3);
                max-width: 380px;
                white-space: normal;
                word-break: break-word;
            }

            .profile-info-icon {
                width: 14px;
                height: 14px;
                fill: currentColor;
                opacity: 0.85;
                animation: sparkle 3s ease-in-out infinite;
                flex-shrink: 0;
            }

            .profile-info-text {
                color: #e8f0e8;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .profile-info-full {
                color: #a0d6b4;
                font-weight: 400;
                font-size: 10.5px;
                display: none;
            }

            .profile-link-item {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 4px 10px;
                background: linear-gradient(135deg, rgba(46,139,86,0.1) 0%, rgba(0,128,128,0.08) 100%);
                border: 1px solid rgba(46,139,86,0.25);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 500;
                color: #c0e0c0;
                text-decoration: none;
                white-space: nowrap;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(4px);
                line-height: 1.3;
            }
            .profile-link-item:hover {
                background: linear-gradient(135deg, rgba(46,139,86,0.18) 0%, rgba(0,128,128,0.15) 100%);
                border-color: rgba(0,128,128,0.5);
                transform: translateY(-1px);
                box-shadow: 0 3px 8px rgba(46,139,86,0.25);
                color: #d8f0d8;
            }
            .profile-link-icon {
                width: 14px;
                height: 14px;
                fill: currentColor;
                animation: sparkle 3.5s ease-in-out infinite;
                animation-delay: 0.3s;
                flex-shrink: 0;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };
    const formatVerbose = (dateString, prefix = '') => {
        const date = new Date(dateString);
        const day = date.getDate();
        const suffix = (day % 100 >= 11 && day % 100 <= 13) ? 'th' 
            : ['st', 'nd', 'rd'][day % 10 - 1] || 'th';
        const months = ['January','February','March','April','May','June',
            'July','August','September','October','November','December'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2,'0');
        const minutes = String(date.getMinutes()).padStart(2,'0');
        const tz = -date.getTimezoneOffset();
        const tzStr = `GMT${tz >= 0 ? '+' : '-'}${Math.floor(Math.abs(tz)/60)}`;
        return `${prefix}${day}${suffix} ${month} ${year}, ${hours}:${minutes} ${tzStr}`;
    };

    const formatRelativePrecise = (dateString) => {
        const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
        if (seconds < 60) return 'just now';
        const intervals = [
            { value: 31536000, unit: 'y', decimals: 1 },
            { value: 2592000, unit: 'mo', decimals: 1 },
            { value: 86400, unit: 'd', decimals: 0 },
            { value: 3600, unit: 'h', decimals: 0 },
            { value: 60, unit: 'm', decimals: 0 }
        ];
        for (const iv of intervals) {
            if (seconds >= iv.value) {
                let val = seconds / iv.value;
                if (iv.decimals === 1) val = val.toFixed(1);
                else val = Math.floor(val);
                return `${val}${iv.unit} ago`;
            }
        }
        return 'just now';
    };

    const createSVGIcon = (type) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.classList.add(type === 'link' ? 'profile-link-icon' : 'profile-info-icon');
        let path;
        switch (type) {
            case 'calendar':
                path = 'M7 2v2H5v-2H3v4h18v-4h-2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2zm-4 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12zm2 2h14v10h-14z'; // simple calendar
                break;
            case 'eye':
                path = 'M12 5C5.636 5 2 12 2 12s3.636 7 10 7 10-7 10-7-3.636-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
                break;
            case 'gamepad':
                path = 'M18 7h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2zm-2-2h2v2h2v2h2v2h-2v-2h-2v-2h-2zm-8 0v2h-2v2h-2v-2h2v-2zm-2 8h2v2h2v2h-2v-2h-2zm10 0h2v2h2v2h-2v-2h-2z'; // simplified gamepad
                break;
            case 'archive':
                path = 'M4 3h16l2 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7l2-4zm0 4v12h16V7H4zm2 2h12v2H6V9zm0 4h12v2H6v-2z';
                break;
            default: path = '';
        }
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', path);
        svg.appendChild(p);
        return svg;
    };

    const createToggleInfo = (iconType, compactText, fullText) => {
        const container = document.createElement('div');
        container.className = 'profile-info-item';

        const icon = createSVGIcon(iconType);
        const compactSpan = document.createElement('span');
        compactSpan.className = 'profile-info-text';
        compactSpan.textContent = compactText;
        const fullSpan = document.createElement('span');
        fullSpan.className = 'profile-info-full';
        fullSpan.textContent = fullText;

        container.appendChild(icon);
        container.appendChild(compactSpan);
        container.appendChild(fullSpan);

        let expanded = false;
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            expanded = !expanded;
            if (expanded) {
                container.classList.add('expanded');
                compactSpan.style.display = 'none';
                fullSpan.style.display = 'inline';
            } else {
                container.classList.remove('expanded');
                compactSpan.style.display = 'inline';
                fullSpan.style.display = 'none';
            }
        });
        return container;
    };

    const getBootstrapData = () => {
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const text = script.textContent;
            if (!text?.includes('options.bootstrap')) continue;
            try {
                const match = text.match(/options\.bootstrap\s*=\s*({[\s\S]*?});/);
                if (!match) continue;
                const data = Function(`"use strict"; return (${match[1]});`)();
                return data?.object || null;
            } catch (e) {
                console.debug('Bootstrap parse error (non-critical)', e);
            }
        }
        return null;
    };
    const getLastPlayedGame = () => {
        try {
            const cached = localStorage.getItem('__amplify__cache:game:last-played');
            if (!cached) return null;
            const parsed = JSON.parse(cached);
            return parsed?.data || null;
        } catch {
            return null;
        }
    };

    const enhance = () => {
        const span = document.querySelector('div._2IqY6 span._20K92');
        if (!span || span.dataset.enhanced === 'true') return false;

        const bootstrap = getBootstrapData();
        if (!bootstrap?.created || !bootstrap?.last_ping) return false;

        const { created, last_ping, is_me } = bootstrap;
        const gameInfo = getLastPlayedGame();
        const wrapper = document.createElement('div');
        wrapper.className = 'profile-info-wrapper';
        wrapper.appendChild(createToggleInfo(
            'calendar',
            formatRelativePrecise(created),
            formatVerbose(created, 'Created @ ')
        ));
        wrapper.appendChild(createToggleInfo(
            'eye',
            formatRelativePrecise(last_ping),
            formatVerbose(last_ping, 'Last seen @ ')
        ));
        if (is_me && gameInfo?.id && gameInfo?.name) {
            const gameLink = document.createElement('a');
            gameLink.className = 'profile-link-item';
            gameLink.href = `https://www.kogama.com/games/play/${gameInfo.id}/`;
            gameLink.target = '_blank';
            gameLink.rel = 'noopener';
            gameLink.title = gameInfo.name;

            const icon = createSVGIcon('gamepad');
            icon.classList.remove('profile-info-icon');
            icon.classList.add('profile-link-icon');

            const nameSpan = document.createElement('span');
            let displayName = gameInfo.name;
            if (displayName.length > 16) displayName = displayName.slice(0, 14) + '…';
            nameSpan.textContent = displayName;

            gameLink.appendChild(icon);
            gameLink.appendChild(nameSpan);
            wrapper.appendChild(gameLink);
        }
        const archiveLink = document.createElement('a');
        archiveLink.className = 'profile-link-item';
        archiveLink.href = `https://web.archive.org/web/*/${location.href}`;
        archiveLink.target = '_blank';
        archiveLink.rel = 'noopener';
        archiveLink.title = 'View on Internet Archive';

        const archiveIcon = createSVGIcon('archive');
        archiveIcon.classList.remove('profile-info-icon');
        archiveIcon.classList.add('profile-link-icon');

        const archiveText = document.createElement('span');
        archiveText.textContent = 'Archive';

        archiveLink.appendChild(archiveIcon);
        archiveLink.appendChild(archiveText);
        wrapper.appendChild(archiveLink);
        span.dataset.enhanced = 'true';
        span.innerHTML = '';
        span.appendChild(wrapper);
        return true;
    };
    const init = () => {
        injectStyles();
        setTimeout(() => {
            if (!enhance()) {
                const observer = new MutationObserver((mutations, obs) => {
                    if (enhance()) obs.disconnect();
                });
                observer.observe(document.body, { childList: true, subtree: true });
                setTimeout(() => observer.disconnect(), 5000);
            }
        }, 400);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Display User Account Level Compactly
(function () {
    "use strict";

    function getLevel() {
        for (const s of document.scripts) {
            const t = s.textContent;
            if (!t || t.indexOf("options.bootstrap") === -1) continue;
            const m = t.match(/options\.bootstrap\s*=\s*({[\s\S]*?})\s*;/);
            if (!m) continue;
            try {
                const j = JSON.parse(m[1]);
                if (j && j.object && typeof j.object.level === "number") return j.object.level;
            } catch {}
        }
        return null;
    }

    function add(level) {
        if (level == null) return;
        const box = document.querySelector("div._2IqY6");
        if (!box) return;
        const h1 = box.querySelector("h1");
        if (!h1) return;
        if (box.querySelector(".tm-level")) return;
        const d = document.createElement("div");
        d.className = "tm-level";
        d.textContent = "Level " + level;
        d.style.fontSize = "12px";
        d.style.opacity = "0.85";
        d.style.fontWeight = "600";
        h1.insertAdjacentElement("afterend", d);
    }

    function tryRun() {
        const level = getLevel();
        if (level != null) add(level);
    }

    const obs = new MutationObserver(() => {
        if (document.querySelector("div._2IqY6 h1")) {
            obs.disconnect();
            setTimeout(tryRun, 50);
        }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });
    tryRun();
})();

(() => { // dot obfuscation + paste enable
  'use strict';
  const WHITELISTED_DOMAINS = ['youtube.com', 'youtu.be',"fonts.googleapis.com"];

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

(() => { // logo and reflink
    'use strict';
    function modifyLogo() {
        const logoContainer = document.querySelector('._2Jlgl');
        if (!logoContainer) return false;

        const logoLink = logoContainer.querySelector('a');
        if (!logoLink) return false;

        logoLink.title = "You're using UtilifyV2 by Simon! Thank you!";
        logoLink.href = "https://github.com/lappisu";

        const logoImg = logoLink.querySelector('img');
        if (!logoImg) return false;

        logoImg.removeAttribute('srcset');
        logoImg.src = "https://i.imgur.com/G3Y7IM8.jpeg";
        logoImg.alt = "You're using UtilifyV2 by Simon! Thank you!";

        logoImg.style.setProperty('object-fit', 'cover', 'important');
        logoImg.style.setProperty('object-position', 'center', 'important');

        return true;
    }

    if (modifyLogo()) return;

    const observer = new MutationObserver(() => {
        if (modifyLogo()) observer.disconnect();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

(() => { // Leaderboard Fix, Credits to Zpayer as the idea was his lol
  const ENDPOINT_RE = /(^|https?:\/\/(?:www\.)?kogama\.com\/)(api\/leaderboard\/around_me\/)(\d+)(\/top\/?)(.*)$/i;
  const PROFILE_PATH_RE = /^\/profile\/(\d+)\/leaderboard(\/|$)/i;

  function getUidFromLocation() {
    const m = location.pathname.match(PROFILE_PATH_RE);
    return m ? m[1] : null;
  }

  function toAbsolute(urlLike) {
    try {
      return new URL(String(urlLike), location.href).toString();
    } catch (e) {
      return String(urlLike);
    }
  }

  function rewriteLeaderboardUrl(urlLike) {
    try {
      const abs = toAbsolute(urlLike);
      const parts = abs.match(ENDPOINT_RE);
      const pageUid = getUidFromLocation();
      if (!parts || !pageUid) return abs;
      const prefix = parts[1].startsWith('/') ? location.origin + '/' : parts[1];
      const rewritten = prefix + parts[2] + pageUid + parts[4] + (parts[5] || '');
      return rewritten;
    } catch (e) {
      return toAbsolute(urlLike);
    }
  }

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    try {
      let originalRequest = null;
      let urlStr = null;
      if (input instanceof Request) {
        originalRequest = input;
        urlStr = originalRequest.url;
      } else {
        urlStr = String(input);
      }
      const rewritten = rewriteLeaderboardUrl(urlStr);
      if (rewritten !== urlStr) {
        if (originalRequest) {
          const newReqInit = {
            method: originalRequest.method,
            headers: originalRequest.headers,
            mode: originalRequest.mode,
            credentials: originalRequest.credentials,
            cache: originalRequest.cache,
            redirect: originalRequest.redirect,
            referrer: originalRequest.referrer,
            referrerPolicy: originalRequest.referrerPolicy,
            integrity: originalRequest.integrity,
            keepalive: originalRequest.keepalive,
            signal: originalRequest.signal
          };
          let body = null;
          try {
            const clone = originalRequest.clone();
            body = await clone.arrayBuffer().then(buf => buf.byteLength ? buf : null).catch(() => null);
          } catch (e) {
            body = null;
          }
          if (body) newReqInit.body = body;
          const newReq = new Request(rewritten, newReqInit);
          return nativeFetch(newReq);
        } else {
          return nativeFetch(rewritten, init);
        }
      }
      return nativeFetch(input, init);
    } catch (e) {
      return nativeFetch(input, init);
    }
  };

  const XHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    try {
      const rewritten = rewriteLeaderboardUrl(url);
      return XHROpen.call(this, method, rewritten, async === undefined ? true : async, user, password);
    } catch (e) {
      return XHROpen.call(this, method, url, async === undefined ? true : async, user, password);
    }
  };

  function applyHighlightToUid(uid) {
    if (!uid) return;
    const prev = document.querySelector('tr._13LmU');
    if (prev && prev.id !== uid + 'Row') prev.classList.remove('_13LmU');
    const tr = document.getElementById(uid + 'Row');
    if (tr && !tr.classList.contains('_13LmU')) tr.classList.add('_13LmU');
  }

  function installLocationChangeHook() {
    const _push = history.pushState;
    const _replace = history.replaceState;
    history.pushState = function(...args) {
      const rv = _push.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return rv;
    };
    history.replaceState = function(...args) {
      const rv = _replace.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return rv;
    };
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  }

  let observer;
  function installObserver() {
    if (observer) return;
    observer = new MutationObserver(() => {
      applyHighlightToUid(getUidFromLocation());
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }

  installLocationChangeHook();
  window.addEventListener('locationchange', () => {
    setTimeout(() => applyHighlightToUid(getUidFromLocation()), 50);
  });

  applyHighlightToUid(getUidFromLocation());
  installObserver();
})();

// seamlesss desc cause looks better
(function () {
  "use strict";

  const decodeHTML = s => {
    const t = document.createElement("textarea");
    t.innerHTML = s;
    return t.value;
  };

  const decodeAll = s => {
    if (!s) return "";
    let out = s;
    for (let i = 0; i < 3; i++) out = decodeHTML(out);
    out = out.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    out = out.replace(/\\n/g, "\n").replace(/\u2800/g, " ");
    return out.trim();
  };

  const hookBootstrap = () => {
    const wait = () => {
      if (typeof window.kogamaApp !== "function") return requestAnimationFrame(wait);
      const orig = window.kogamaApp;
      window.kogamaApp = function (options) {
        if (options?.bootstrap) window.__capturedBootstrap = options.bootstrap;
        return orig.apply(this, arguments);
      };
    };
    wait();
  };

  const waitDesc = () => new Promise(resolve => {
    const check = () => {
      const b = window.__capturedBootstrap;
      const raw = b?.object?.description || b?.current_user?.description;
      if (raw) resolve(decodeAll(raw));
      else requestAnimationFrame(check);
    };
    check();
  });

  const removeReactBits = root => {
    root.querySelectorAll('[itemprop="description"]').forEach(n => n.remove());
    root.querySelectorAll(".MuiCollapse-root").forEach(n => n.remove());
    root.querySelectorAll("button").forEach(b => {
      if (/show more/i.test(b.textContent)) b.remove();
    });
  };

  const buildBox = text => {
    const box = document.createElement("div");
    box.id = "tm-desc-box";
    box.textContent = text;

    box.style.overflowY = "auto";
    box.style.whiteSpace = "pre-wrap";
    box.style.wordBreak = "break-word";

    box.style.color = "#a8adb3";
    box.style.fontSize = "0.92em";
    box.style.lineHeight = "1.45";

    box.style.padding = "14px 16px 22px 16px";
    box.style.marginTop = "6px";

    box.style.background = "rgba(0,0,0,0.10)";
    box.style.borderRadius = "8px";

    box.style.scrollbarGutter = "stable";
    box.style.overscrollBehavior = "contain";

    return box;
  };

  const fitHeight = (box, host) => {
    const parent = host.parentElement;
    const h1 = parent ? parent.clientHeight : 0;
    const h2 = window.innerHeight;

    const limit = h1 > 0 ? Math.floor(h1 * 0.55) : Math.floor(h2 * 0.28);
    box.style.maxHeight = limit + "px";
  };

  const guard = root => {
    const mo = new MutationObserver(() => removeReactBits(root));
    mo.observe(root, { childList: true, subtree: true });
  };

  const run = async () => {
    const desc = await waitDesc();

    const waitMount = () => {
      const host = document.querySelector("div._1aUa_");
      if (!host) return requestAnimationFrame(waitMount);
      if (host.dataset.tmMounted) return;
      host.dataset.tmMounted = "1";

      host.style.height = "500px";
      host.style.maxHeight = "auto";
      host.style.overflow = "visible";

      removeReactBits(host);
      guard(host);

      const box = buildBox(desc);
      host.appendChild(box);
      fitHeight(box, host);

      new ResizeObserver(() => fitHeight(box, host)).observe(document.body);
    };

    waitMount();
  };

  hookBootstrap();
  run();
})();
// Manage Feed
(function() {
  'use strict';
  
  function getBootstrapData() {
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      const text = script.textContent;
      if (!text || !text.includes('options.bootstrap')) continue;
      
      try {
        const match = text.match(/options\.bootstrap\s*=\s*({[\s\S]*?});/);
        if (!match) continue;
        
        const data = Function(`"use strict"; return (${match[1]});`)();
        return data?.object || null;
      } catch {}
    }
    return null;
  }

  function shouldRun() {
    const bootstrap = getBootstrapData();
    if (!bootstrap) return false;
    
    if (!bootstrap.is_me || bootstrap.is_me !== true) return false;
    
    const userId = bootstrap.id;
    if (!userId) return false;
    
    const urlPattern = new RegExp(`^https://www\\.kogama\\.com/profile/${userId}/?$`);
    if (!urlPattern.test(window.location.href)) return false;
    
    return { userId, username: bootstrap.username };
  }

  const profileData = shouldRun();
  if (!profileData) return;

  const { userId, username } = profileData;

  function injectStyles() {
    const css = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

/* Feed Manager Card Button */
.feed-manager-card {
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.feed-manager-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.05) 0%, rgba(42, 157, 143, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.feed-manager-card:hover::before {
  opacity: 1;
}

.feed-manager-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 8px 24px rgba(74, 222, 183, 0.2) !important;
  border-color: rgba(74, 222, 183, 0.3) !important;
}

.feed-manager-card .MuiCardContent-root {
  position: relative;
  z-index: 1;
}

.feed-manager-card ._2fSqj {
  color: #4adeb7 !important;
  font-weight: 600 !important;
}

.feed-manager-card ._2LT6y {
  color: #6ef0cb !important;
}

#feed-manager-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 100000;
  display: none;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.25s ease;
}

#feed-manager-overlay.visible {
  display: flex;
}

#feed-manager-panel {
  width: min(820px, 92vw);
  max-height: 88vh;
  background: linear-gradient(135deg, #0d1f1d 0%, #1a2f2d 50%, #0d1f1d 100%);
  color: #e0f0ee;
  border-radius: 12px;
  box-shadow: 
    0 0 40px rgba(74, 222, 183, 0.2),
    0 20px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(74, 222, 183, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  border: 1px solid rgba(74, 222, 183, 0.25);
  backdrop-filter: blur(20px);
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

#feed-manager-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle at top right, rgba(74, 222, 183, 0.15) 0%, transparent 60%);
  border-radius: 0 12px 0 0;
  pointer-events: none;
}

#feed-manager-panel::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle at bottom left, rgba(42, 157, 143, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

#feed-manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(74, 222, 183, 0.12);
  background: linear-gradient(135deg, rgba(20, 35, 33, 0.85) 0%, rgba(15, 28, 26, 0.95) 100%);
  position: relative;
}

#feed-manager-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(74, 222, 183, 0.4) 50%, transparent 100%);
}

#feed-manager-title {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  color: rgba(74, 222, 183, 0.7);
  text-transform: uppercase;
  position: relative;
}

#feed-manager-title::before,
#feed-manager-title::after {
  content: '◆';
  position: absolute;
  color: rgba(74, 222, 183, 0.5);
  font-size: 8px;
}

#feed-manager-title::before { left: -20px; }
#feed-manager-title::after { right: -20px; }

.header-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.fm-btn {
  padding: 9px 18px;
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.18) 0%, rgba(42, 157, 143, 0.12) 100%);
  color: #4adeb7;
  border-radius: 8px;
  border: 1px solid rgba(74, 222, 183, 0.35);
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.fm-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.fm-btn:hover::before {
  width: 300px;
  height: 300px;
}

.fm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 222, 183, 0.3);
  border-color: rgba(74, 222, 183, 0.6);
}

.fm-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.fm-btn-close {
  background: rgba(74, 222, 183, 0.08);
  border: 1px solid rgba(74, 222, 183, 0.2);
  color: #4adeb7;
  padding: 8px 14px;
  font-size: 18px;
  line-height: 1;
}

.fm-btn-close:hover {
  background: rgba(74, 222, 183, 0.15);
  border-color: rgba(74, 222, 183, 0.4);
  color: #6ef0cb;
}

#feed-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: linear-gradient(180deg, rgba(13, 23, 21, 0.95) 0%, rgba(10, 18, 16, 0.98) 100%);
  position: relative;
}

#feed-content::after {
  content: 'Made by Simon';
  position: absolute;
  right: 12px;
  bottom: 20px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 10px;
  letter-spacing: 2.5px;
  color: rgba(74, 222, 183, 0.35);
  font-weight: 500;
  text-transform: uppercase;
  pointer-events: none;
}

.feed-item {
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.04) 0%, rgba(42, 157, 143, 0.02) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 222, 183, 0.08);
  padding: 18px;
  border-radius: 10px;
  margin-bottom: 14px;
  transition: all 0.25s ease;
  animation: slideUp 0.3s ease;
  position: relative;
}

.feed-item:hover {
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.08) 0%, rgba(42, 157, 143, 0.04) 100%);
  border-color: rgba(74, 222, 183, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.feed-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #a0c8c0;
}

.feed-date {
  color: rgba(74, 222, 183, 0.7);
}

.feed-type-badge {
  display: inline-block;
  padding: 5px 12px;
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.15), rgba(42, 157, 143, 0.1));
  border: 1px solid rgba(74, 222, 183, 0.3);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #4adeb7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.feed-text {
  color: #e0f0ee;
  line-height: 1.7;
  margin-bottom: 12px;
  word-wrap: break-word;
}

.feed-text a {
  color: #4adeb7;
  text-decoration: none;
  transition: all 0.15s ease;
}

.feed-text a:hover {
  color: #6ef0cb;
  text-decoration: underline;
}

.feed-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.feed-btn {
  padding: 7px 14px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid rgba(74, 222, 183, 0.15);
  background: rgba(0, 0, 0, 0.4);
  color: #b8d8d0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.feed-btn:hover {
  background: rgba(74, 222, 183, 0.1);
  border-color: rgba(74, 222, 183, 0.35);
  color: #4adeb7;
  transform: translateY(-1px);
}

.feed-btn-delete {
  background: rgba(239, 71, 111, 0.1);
  border-color: rgba(239, 71, 111, 0.3);
  color: #ef476f;
}

.feed-btn-delete:hover {
  background: rgba(239, 71, 111, 0.2);
  border-color: rgba(239, 71, 111, 0.5);
}

.comments-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(74, 222, 183, 0.08);
}

.comment-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #b8d8d0;
  border: 1px solid rgba(74, 222, 183, 0.08);
  transition: all 0.2s ease;
}

.comment-item:hover {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(74, 222, 183, 0.15);
}

.comment-author {
  font-weight: 600;
  color: #4adeb7;
  margin-bottom: 6px;
}

.comment-delete-btn {
  background: rgba(239, 71, 111, 0.12);
  border: 1px solid rgba(239, 71, 111, 0.3);
  color: #ef476f;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.comment-delete-btn:hover {
  background: rgba(239, 71, 111, 0.25);
  border-color: rgba(239, 71, 111, 0.5);
  transform: scale(1.15);
}

.loading-msg {
  text-align: center;
  padding: 50px 20px;
  color: rgba(74, 222, 183, 0.5);
  font-size: 14px;
}

.empty-msg {
  text-align: center;
  padding: 70px 20px;
  color: rgba(74, 222, 183, 0.4);
  font-size: 14px;
  font-style: italic;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(74, 222, 183, 0.35) 0%, rgba(42, 157, 143, 0.35) 100%);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(74, 222, 183, 0.55) 0%, rgba(42, 157, 143, 0.55) 100%);
  background-clip: padding-box;
}
`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createCardButton() {
    const checkContainer = setInterval(() => {
      const container = document.querySelector('.CgH1-');
      if (!container) return;
      if (container.querySelector('.feed-manager-card')) return;
      
      clearInterval(checkContainer);
      
      const card = document.createElement('div');
      card.className = 'MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root _2Hovk feed-manager-card css-wog98n';
      card.style.cssText = '--Paper-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12); --Paper-overlay: linear-gradient(rgba(255, 255, 255, 0.051), rgba(255, 255, 255, 0.051));';
      
      card.innerHTML = `
        <div class="MuiCardContent-root _1l7RM css-15q2cw4">
          <div class="_2fSqj">Manage Feed</div>
          <div class="_2LT6y">◆</div>
        </div>
      `;
      
      card.addEventListener('click', () => openPanel());
      
      container.insertBefore(card, container.firstChild);
    }, 100);
  }

  function createPanel() {
    const overlay = document.createElement('div');
    overlay.id = 'feed-manager-overlay';
    
    overlay.innerHTML = `
      <div id="feed-manager-panel">
        <div id="feed-manager-header">
          <div id="feed-manager-title">Feed Manager</div>
          
          <div class="header-controls">
            <button class="fm-btn" id="fm-delete-all">Delete All</button>
            <button class="fm-btn fm-btn-close" id="fm-close">×</button>
          </div>
        </div>
        
        <div id="feed-content">
          <div class="loading-msg">Loading feed...</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePanel();
    });
    
    document.getElementById('fm-close').addEventListener('click', closePanel);
    document.getElementById('fm-delete-all').addEventListener('click', deleteAllPosts);
    
    return overlay;
  }

  let panel = null;
  let feedData = [];
  let isLoading = false;
  let currentPage = 1;
  let hasMore = true;

  function openPanel() {
    if (!panel) panel = createPanel();
    panel.classList.add('visible');
    loadFeed();
  }

  function closePanel() {
    if (panel) panel.classList.remove('visible');
  }

  async function loadFeed(page = 1) {
    if (isLoading || (!hasMore && page > 1)) return;
    
    isLoading = true;
    const content = document.getElementById('feed-content');
    
    if (page === 1) {
      content.innerHTML = '<div class="loading-msg">Loading feed...</div>';
      feedData = [];
      currentPage = 1;
      hasMore = true;
    }
    
    try {
      const res = await fetch(`https://www.kogama.com/api/feed/${userId}/?page=${page}&count=20`, {
        method: 'GET',
        credentials: 'omit',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error('Failed to load');
      
      const data = await res.json();
      let items = [];
      
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data?.feed)) items = data.feed;
      else if (Array.isArray(data?.data)) items = data.data;
      
      if (items.length === 0) {
        hasMore = false;
        if (page === 1) {
          content.innerHTML = '<div class="empty-msg">No feed posts found.</div>';
        }
      } else {
        feedData.push(...items);
        renderFeed();
        currentPage = page;
      }
    } catch (err) {
      content.innerHTML = '<div class="empty-msg">Failed to load feed.</div>';
      console.error('Feed load error:', err);
    } finally {
      isLoading = false;
    }
  }

  function renderFeed() {
    const content = document.getElementById('feed-content');
    content.innerHTML = '';
    
    feedData.forEach((item, index) => {
      const feedItem = createFeedItem(item, index);
      content.appendChild(feedItem);
    });
    
    // Infinite scroll
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    content.appendChild(sentinel);
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadFeed(currentPage + 1);
      }
    });
    
    observer.observe(sentinel);
  }

  function formatTimeAgo(dateString) {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function parseFeedData(item) {
    const feedType = item.feed_type || 'status_updated';
    let data = {};
    
    try {
      if (item._data && typeof item._data === 'string') {
        data = JSON.parse(item._data);
      } else if (item.data) {
        data = item.data;
      }
    } catch {
      data = item.data || {};
    }
    
    return { feedType, data };
  }

  function renderFeedContent(item) {
    const { feedType, data } = parseFeedData(item);
    
    const youtubeMatch = (data.status_message || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    
    if (youtubeMatch) {
      return `
        <div class="feed-type-badge">Shared a video</div>
        <div class="feed-text">
          <a href="https://youtube.com/watch?v=${youtubeMatch[1]}" target="_blank" rel="noopener" style="color:#4adeb7;">
            🎥 YouTube Video
          </a>
        </div>
      `;
    }
    
    switch (feedType) {
      case 'marketplace_buy':
        const productName = data.product_name || 'Unknown Item';
        const productId = data.product_id || '';
        const creditorName = data.creditor_username || 'Unknown';
        const creditorId = data.creditor_profile_id || '';
        
        return `
          <div class="feed-type-badge">Marketplace Purchase</div>
          <div class="feed-text">
            Purchased <a href="https://www.kogama.com/marketplace/avatar/${productId}/" target="_blank" rel="noopener" style="color:#4adeb7;">${escapeHtml(productName)}</a>
            ${creditorId ? `from <a href="https://www.kogama.com/profile/${creditorId}/" target="_blank" rel="noopener" style="color:#6ef0cb;">${escapeHtml(creditorName)}</a>` : ''}
          </div>
        `;
        
      case 'badge_earned':
        const badgeName = item.badge_name || 'Unknown Badge';
        return `
          <div class="feed-type-badge">Badge Earned</div>
          <div class="feed-text">
            🏆 Earned the <span style="color:#4adeb7; font-weight:600;">${escapeHtml(badgeName)}</span> badge
          </div>
        `;
        
      case 'wall_post':
        const authorName = item.profile_username || 'Someone';
        const authorId = item.profile_id || '';
        const message = data.status_message || '';
        
        return `
          <div class="feed-type-badge">Wall Post</div>
          <div class="feed-text">
            <a href="https://www.kogama.com/profile/${authorId}/" target="_blank" rel="noopener" style="color:#6ef0cb; font-weight:600;">${escapeHtml(authorName)}</a> posted:
            <div style="margin-top:8px; padding-left:12px; border-left:2px solid rgba(74, 222, 183, 0.3);">${escapeHtml(message)}</div>
          </div>
        `;
        
      case 'status_updated':
      default:
        const statusMessage = data.status_message || data.message || item.message || 'No content';
        return `
          <div class="feed-type-badge">Status Update</div>
          <div class="feed-text">${escapeHtml(statusMessage)}</div>
        `;
    }
  }

  function createFeedItem(item, index) {
    const div = document.createElement('div');
    div.className = 'feed-item';
    div.dataset.feedId = item.id;
    div.style.animationDelay = `${index * 0.05}s`;
    
    const timeAgo = formatTimeAgo(item.created);
    const fullDate = item.created ? new Date(item.created).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : 'Unknown date';
    
    div.innerHTML = `
      <div class="feed-header">
        <div class="feed-meta">
          <span class="feed-date" title="${fullDate}">${timeAgo}</span>
        </div>
      </div>
      ${renderFeedContent(item)}
      <div class="feed-actions">
        <button class="feed-btn feed-btn-comments" data-feed-id="${item.id}">
          View Comments
        </button>
        <button class="feed-btn feed-btn-delete" data-feed-id="${item.id}">
          Delete Post
        </button>
      </div>
      <div class="comments-section" id="comments-${item.id}" style="display:none;"></div>
    `;
    
    div.querySelector('.feed-btn-comments').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleComments(item.id);
    });
    div.querySelector('.feed-btn-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deletePost(item.id);
    });
    
    return div;
  }

  async function toggleComments(feedId) {
    const section = document.getElementById(`comments-${feedId}`);
    const btn = document.querySelector(`.feed-btn-comments[data-feed-id="${feedId}"]`);
    
    if (section.style.display === 'none') {
      section.innerHTML = '<div class="loading-msg" style="padding:20px;">Loading comments...</div>';
      section.style.display = 'block';
      
      try {
        const res = await fetch(`https://www.kogama.com/api/feed/${feedId}/comment/?count=50`, {
          method: 'GET',
          credentials: 'include'
        });
        
        const data = await res.json();
        const comments = Array.isArray(data?.data) ? data.data : [];
        
        if (comments.length === 0) {
          section.innerHTML = '<div class="empty-msg" style="padding:20px;">No comments</div>';
        } else {
          section.innerHTML = '';
          comments.forEach(comment => {
            const timeAgo = formatTimeAgo(comment.created);
            
            let commentText = '';
            try {
              if (comment._data && typeof comment._data === 'string') {
                const parsed = JSON.parse(comment._data);
                commentText = parsed.data || parsed.message || '';
              }
            } catch {
              commentText = comment.message || '';
            }
            
            const div = document.createElement('div');
            div.className = 'comment-item';
            div.dataset.commentId = comment.id;
            div.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <div class="comment-author">${escapeHtml(comment.profile_username || 'Unknown')}</div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="font-size:11px; color:rgba(74, 222, 183, 0.5);">${timeAgo}</div>
                  ${comment.can_delete ? `<button class="comment-delete-btn" data-comment-id="${comment.id}" data-feed-id="${feedId}" title="Delete comment">×</button>` : ''}
                </div>
              </div>
              <div>${escapeHtml(commentText)}</div>
            `;
            
            if (comment.can_delete) {
              div.querySelector('.comment-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteComment(feedId, comment.id);
              });
            }
            
            section.appendChild(div);
          });
        }
        
        btn.textContent = 'Hide Comments';
      } catch (err) {
        section.innerHTML = '<div class="empty-msg" style="padding:20px;">Failed to load comments</div>';
        console.error('Comments load error:', err);
      }
    } else {
      section.style.display = 'none';
      section.innerHTML = '';
      btn.textContent = 'View Comments';
    }
  }

  async function deleteComment(feedId, commentId) {
    const commentEl = document.querySelector(`.comment-item[data-comment-id="${commentId}"]`);
    if (!commentEl) return;
    
    if (!confirm('Delete this comment?')) return;
    
    try {
      await fetch(`https://www.kogama.com/api/feed/${feedId}/comment/${commentId}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      commentEl.style.opacity = '0';
      commentEl.style.transform = 'translateX(-10px)';
      setTimeout(() => {
        commentEl.remove();
        
        const section = document.getElementById(`comments-${feedId}`);
        if (section && section.querySelectorAll('.comment-item').length === 0) {
          section.innerHTML = '<div class="empty-msg" style="padding:20px;">No comments</div>';
        }
      }, 200);
    } catch (err) {
      alert('Failed to delete comment');
      console.error('Comment delete error:', err);
    }
  }

  async function deletePost(feedId) {
    const item = document.querySelector(`[data-feed-id="${feedId}"]`).closest('.feed-item');
    if (!item) return;
    
    if (!confirm('Delete this post?')) return;
    
    try {
      await fetch(`https://www.kogama.com/api/feed/${userId}/${feedId}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        item.remove();
        feedData = feedData.filter(f => f.id !== feedId);
        if (feedData.length === 0) {
          document.getElementById('feed-content').innerHTML = '<div class="empty-msg">No feed posts found.</div>';
        }
      }, 200);
    } catch (err) {
      alert('Failed to delete post');
      console.error('Delete error:', err);
    }
  }

  async function deleteAllPosts() {
    if (!confirm(`Delete all ${feedData.length} posts? This cannot be undone.`)) return;
    
    const btn = document.getElementById('fm-delete-all');
    btn.disabled = true;
    btn.textContent = 'Deleting...';
    
    let deleted = 0;
    for (const item of feedData) {
      try {
        await fetch(`https://www.kogama.com/api/feed/${userId}/${item.id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        deleted++;
        btn.textContent = `Deleted ${deleted}/${feedData.length}`;
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
    
    btn.textContent = 'Delete All';
    btn.disabled = false;
    feedData = [];
    document.getElementById('feed-content').innerHTML = '<div class="empty-msg">All posts deleted.</div>';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  injectStyles();
  createCardButton();
})();


// Update Checker 
(function() {
  'use strict';
  
  const UPDATE_CHECK_URL = 'https://raw.githubusercontent.com/lappisu/Utilify/refs/heads/main/Script/Rewrite/Utilify.user.js';
  const INSTALL_URL = 'https://github.com/lappisu/Utilify/raw/refs/heads/main/Script/Rewrite/Utilify.user.js';
  const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  const STORAGE_KEY = 'utilify_last_update_check';

  function injectStyles() {
    if (document.getElementById('update-checker-style')) return;
    
    const css = `
      @keyframes float-in {
        from { 
          opacity: 0; 
          transform: translate(-50%, -30px) scale(0.92);
        }
        to { 
          opacity: 1; 
          transform: translate(-50%, 0) scale(1);
        }
      }
      
      @keyframes shimmer-glow {
        0%, 100% { 
          box-shadow: 
            0 8px 32px rgba(74, 222, 183, 0.3),
            0 0 60px rgba(74, 222, 183, 0.15),
            inset 0 1px 0 rgba(74, 222, 183, 0.3);
        }
        50% { 
          box-shadow: 
            0 8px 32px rgba(74, 222, 183, 0.5),
            0 0 80px rgba(74, 222, 183, 0.25),
            inset 0 1px 0 rgba(74, 222, 183, 0.4);
        }
      }
      
      @keyframes pulse-icon {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
      }
      
      .update-notification {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483647;
        padding: 18px 26px;
        background: linear-gradient(135deg, #0d1f1d 0%, #1a2f2d 50%, #0d1f1d 100%);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(74, 222, 183, 0.3);
        border-radius: 12px;
        animation: 
          float-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards,
          shimmer-glow 3s ease-in-out infinite;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        max-width: 460px;
        display: flex;
        align-items: center;
        gap: 16px;
        position: relative;
      }
      
      .update-notification::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle at top right, rgba(74, 222, 183, 0.12) 0%, transparent 60%);
        border-radius: 0 12px 0 0;
        pointer-events: none;
      }
      
      .update-notification::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, rgba(74, 222, 183, 0.4) 50%, transparent 100%);
      }
      
      .update-icon {
        font-size: 32px;
        color: #4adeb7;
        animation: pulse-icon 2.5s ease-in-out infinite;
        flex-shrink: 0;
        filter: drop-shadow(0 0 8px rgba(74, 222, 183, 0.5));
        z-index: 1;
      }
      
      .update-content {
        flex: 1;
        z-index: 1;
      }
      
      .update-title {
        font-size: 15px;
        font-weight: 600;
        color: #4adeb7;
        margin-bottom: 5px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-size: 12px;
      }
      
      .update-message {
        font-size: 14px;
        color: #e0f0ee;
        line-height: 1.5;
      }
      
      .update-version {
        font-weight: 600;
        color: #6ef0cb;
        background: rgba(74, 222, 183, 0.1);
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid rgba(74, 222, 183, 0.2);
      }
      
      .update-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
        z-index: 1;
      }
      
      .update-btn {
        padding: 9px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        display: inline-block;
        border: none;
        position: relative;
        overflow: hidden;
      }
      
      .update-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
      }
      
      .update-btn:hover::before {
        width: 300px;
        height: 300px;
      }
      
      .update-btn-primary {
        background: linear-gradient(135deg, rgba(74, 222, 183, 0.2) 0%, rgba(42, 157, 143, 0.15) 100%);
        color: #4adeb7;
        border: 1px solid rgba(74, 222, 183, 0.4);
        box-shadow: 0 3px 10px rgba(74, 222, 183, 0.2);
      }
      
      .update-btn-primary:hover {
        background: linear-gradient(135deg, rgba(74, 222, 183, 0.3) 0%, rgba(42, 157, 143, 0.25) 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(74, 222, 183, 0.35);
        border-color: rgba(74, 222, 183, 0.6);
      }
      
      .update-btn-secondary {
        background: rgba(74, 222, 183, 0.08);
        color: #b8d8d0;
        border: 1px solid rgba(74, 222, 183, 0.2);
      }
      
      .update-btn-secondary:hover {
        background: rgba(74, 222, 183, 0.15);
        color: #d0ede5;
        transform: translateY(-1px);
        border-color: rgba(74, 222, 183, 0.35);
      }
      
      .update-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(74, 222, 183, 0.1);
        border: 1px solid rgba(74, 222, 183, 0.2);
        color: #4adeb7;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 2;
      }
      
      .update-close:hover {
        background: rgba(74, 222, 183, 0.2);
        border-color: rgba(74, 222, 183, 0.4);
        transform: scale(1.1);
      }
      
      .update-notification.dismissing {
        opacity: 0;
        transform: translate(-50%, -30px) scale(0.92);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'update-checker-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getInstalledVersion() {
    try {
      if (typeof GM_info !== 'undefined' && GM_info?.script?.version) {
        return GM_info.script.version;
      }
    } catch {}
    return null;
  }
  
  function parseVersion(versionString) {
    if (!versionString) return [0, 0, 0];
    const parts = versionString.split('.').map(n => parseInt(n) || 0);
    while (parts.length < 3) parts.push(0);
    return parts;
  }
  
  function compareVersions(current, remote) {
    const c = parseVersion(current);
    const r = parseVersion(remote);
    
    for (let i = 0; i < 3; i++) {
      if (r[i] > c[i]) return 1; // Remote is newer
      if (r[i] < c[i]) return -1; // Current is newer
    }
    return 0;
  }

  async function fetchRemoteVersion() {
    try {
      const response = await fetch(UPDATE_CHECK_URL, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const text = await response.text();
      const match = text.match(/@version\s+([^\s\n]+)/);
      
      return match ? match[1].trim() : null;
    } catch (err) {
      console.error('Utilify Update Check: Failed to fetch remote version', err);
      return null;
    }
  }

  function dismissNotification(notification) {
    notification.classList.add('dismissing');
    setTimeout(() => notification.remove(), 300);
  }

  function showUpdateNotification(currentVersion, remoteVersion) {
    console.log('Utilify Update Check: Showing notification for update to v' + remoteVersion);
    document.querySelectorAll('.update-notification').forEach(n => dismissNotification(n));
    
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.style.cssText = `
      position: fixed !important;
      top: 24px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 2147483647 !important;
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    
    notification.innerHTML = `
      <button class="update-close" aria-label="Dismiss">×</button>
      <div class="update-icon">◆</div>
      <div class="update-content">
        <div class="update-title">◆ Update Available ◆</div>
        <div class="update-message">
          <span class="update-version">v${remoteVersion}</span> is ready to install
          ${currentVersion ? ` · Current: v${currentVersion}` : ''}
        </div>
      </div>
      <div class="update-actions">
        <a href="${INSTALL_URL}" class="update-btn update-btn-primary" target="_blank" rel="noopener">
          Update Now
        </a>
        <button class="update-btn update-btn-secondary" id="update-dismiss">
          Later
        </button>
      </div>
    `;
    

    if (!document.body) {
 //     console.error('Utilify Update Check: document.body does not exist yet!');
      setTimeout(() => showUpdateNotification(currentVersion, remoteVersion), 100);
      return;
    }
    
    document.body.appendChild(notification);
 //   console.log('Utilify Update Check: Notification element appended to body', notification);
    setTimeout(() => {
      const check = document.querySelector('.update-notification');
      if (check) {
    //    console.log('Utilify Update Check: Notification confirmed in DOM');
      } else {
   //     console.error('Utilify Update Check: Notification NOT found in DOM!');
      }
    }, 100);

    notification.querySelector('.update-close').addEventListener('click', () => {
      dismissNotification(notification);
    });
    notification.querySelector('#update-dismiss').addEventListener('click', () => {
      dismissNotification(notification);
    });
    
    // Auto-dismiss after 45 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        dismissNotification(notification);
      }
    }, 45000);
  }

  function shouldCheckForUpdates() {
    try {
      const lastCheck = localStorage.getItem(STORAGE_KEY);
      if (!lastCheck) return true;
      
      const lastCheckTime = parseInt(lastCheck);
      const now = Date.now();
      
      return (now - lastCheckTime) >= CHECK_INTERVAL;
    } catch {
      return true;
    }
  }
  
  function updateLastCheckTime() {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {}
  }
  
  async function checkForUpdates(force = false) {
    if (!force && !shouldCheckForUpdates()) {
 //     console.log('Utilify Update Check: Skipped (checked recently)');
      return;
    }
    
//    console.log('Utilify Update Check: Starting...');
    
    const currentVersion = getInstalledVersion();
    if (!currentVersion) {
 //     console.log('Utilify Update Check: Cannot determine installed version');
      return;
    }
    
    const remoteVersion = await fetchRemoteVersion();
    if (!remoteVersion) {
 //     console.log('Utilify Update Check: Failed to fetch remote version');
      return;
    }
    
//    console.log(`Utilify Update Check: Current v${currentVersion}, Remote v${remoteVersion}`);
    
    const comparison = compareVersions(currentVersion, remoteVersion);
    
    if (comparison > 0) {
//      console.log('Utilify Update Check: Update available!');
      showUpdateNotification(currentVersion, remoteVersion);
    } else if (comparison === 0) {
 //     console.log('Utilify Update Check: Up to date ✓');
    } else {
  //    console.log('Utilify Update Check: Local version is newer (dev build?)');
    }
    
    updateLastCheckTime();
  }

  // Expose API for manual checks
  window.UtilifyUpdateChecker = {
    check: () => checkForUpdates(true),
    getVersion: getInstalledVersion,
    checkUrl: UPDATE_CHECK_URL,
    installUrl: INSTALL_URL,
    testNotification: () => {
      const currentVer = getInstalledVersion() || '2.0.0';
      const testVer = '2.1.0';
 //     console.log('Utilify Update Check: Testing notification display...');
      showUpdateNotification(currentVer, testVer);
    }
  };

  function init() {
    injectStyles();
    setTimeout(() => checkForUpdates(), 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


// Faster Friends 

(function () {
    "use strict";

    const URL_PATTERN = /^https:\/\/www\.kogama\.com\/profile\/(\d+)\/friends\/$/i;

    function getViewedProfileID() {
        const m = window.location.href.match(URL_PATTERN);
        return m ? m[1] : null;
    }

    function getBootstrap() {
        if (window.App?.options?.bootstrap) return window.App.options.bootstrap;
        const scripts = document.scripts;
        for (let i = 0; i < scripts.length; i++) {
            const t = scripts[i].textContent;
            if (!t || !t.includes("options.bootstrap")) continue;
            const m = t.match(/options\.bootstrap\s*=\s*({[\s\S]*?})\s*;/);
            if (!m) continue;
            try { return JSON.parse(m[1]); } catch { return null; }
        }
        return null;
    }

    function getCurrentUser() {
        const b = getBootstrap();
        return b?.current_user || null;
    }

    function isOwnProfile(viewedID, currentUser) {
        if (!currentUser || !viewedID) return false;
        return String(currentUser.id) === String(viewedID);
    }

    function waitBootstrapStart(fn) {
        const i = setInterval(() => {
            if (getBootstrap()) {
                clearInterval(i);
                fn();
            }
        }, 50);
    }

    function run() {
        if (!URL_PATTERN.test(window.location.href)) return;
        const viewedProfileID = getViewedProfileID();
        const currentUser = getCurrentUser();

        if (!viewedProfileID || !currentUser?.id) {
            console.error("Faster Friends: bootstrap not ready");
            return;
        }

        const isOwn = isOwnProfile(viewedProfileID, currentUser);

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

        function ensureRootUIRemoved() {
            document.getElementById("frlscrape-panel")?.remove();
            document.getElementById("frlscrape-style")?.remove();
            document.getElementById("frlscrape-reopen")?.remove();
        }


        function createStyle() {
            const css = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer-glow {
  0%, 100% { 
    box-shadow: 
      0 8px 32px rgba(74, 222, 183, 0.25),
      0 0 60px rgba(74, 222, 183, 0.12),
      inset 0 1px 0 rgba(74, 222, 183, 0.2);
  }
  50% { 
    box-shadow: 
      0 8px 32px rgba(74, 222, 183, 0.35),
      0 0 80px rgba(74, 222, 183, 0.18),
      inset 0 1px 0 rgba(74, 222, 183, 0.3);
  }
}

#frlscrape-panel {
  position: fixed;
  z-index: 100000;
  width: min(920px, 92vw);
  max-height: 86vh;
  background: linear-gradient(135deg, #0d1f1d 0%, #1a2f2d 50%, #0d1f1d 100%);
  color: #e0f0ee;
  border-radius: 12px;
  box-shadow: 
    0 0 40px rgba(74, 222, 183, 0.2),
    0 20px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(74, 222, 183, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  border: 1px solid rgba(74, 222, 183, 0.25);
  backdrop-filter: blur(20px);
  animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

#frlscrape-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle at top right, rgba(74, 222, 183, 0.15) 0%, transparent 60%);
  border-radius: 0 12px 0 0;
  pointer-events: none;
}

#frlscrape-panel::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle at bottom left, rgba(42, 157, 143, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

#frlscrape-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  gap: 16px;
  border-bottom: 1px solid rgba(74, 222, 183, 0.12);
  cursor: grab;
  user-select: none;
  background: linear-gradient(135deg, rgba(20, 35, 33, 0.85) 0%, rgba(15, 28, 26, 0.95) 100%);
  position: relative;
  z-index: 1;
}

#frlscrape-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(74, 222, 183, 0.4) 50%, transparent 100%);
}

#frlscrape-header.dragging {
  cursor: grabbing;
}

#frlscrape-title {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  color: rgba(74, 222, 183, 0.7);
  text-transform: uppercase;
  position: relative;
  white-space: nowrap;
}

#frlscrape-title::before,
#frlscrape-title::after {
  content: '◆';
  position: absolute;
  color: rgba(74, 222, 183, 0.5);
  font-size: 8px;
}

#frlscrape-title::before { left: -20px; }
#frlscrape-title::after { right: -20px; }

#frlscrape-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

#frlscrape-close {
  background: rgba(74, 222, 183, 0.08);
  border: 1px solid rgba(74, 222, 183, 0.2);
  color: #4adeb7;
  font-size: 18px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  line-height: 1;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

#frlscrape-close:hover {
  background: rgba(74, 222, 183, 0.15);
  border-color: rgba(74, 222, 183, 0.4);
  color: #6ef0cb;
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
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid rgba(74, 222, 183, 0.18);
  background: rgba(0, 0, 0, 0.5);
  color: #e0f0ee;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

#frlscrape-search input::placeholder {
  color: rgba(74, 222, 183, 0.4);
}

#frlscrape-search input:focus {
  border-color: rgba(74, 222, 183, 0.4);
  box-shadow: 0 0 0 3px rgba(74, 222, 183, 0.1);
  background: rgba(0, 0, 0, 0.6);
}

#frlscrape-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 24px;
  overflow: auto;
  background: linear-gradient(180deg, rgba(13, 23, 21, 0.95) 0%, rgba(10, 18, 16, 0.98) 100%);
  position: relative;
  z-index: 1;
}

#frlscrape-body.two-columns {
  grid-template-columns: repeat(2, 1fr);
}


#frlscrape-body::after {
  content: 'Made by Simon';
  position: absolute;
  right: 12px;
  bottom: 20px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 10px;
  letter-spacing: 2.5px;
  color: rgba(74, 222, 183, 0.35);
  font-weight: 500;
  text-transform: uppercase;
  pointer-events: none;
}

.frsection {
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.04) 0%, rgba(42, 157, 143, 0.02) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 222, 183, 0.08);
  padding: 18px;
  border-radius: 10px;
  min-height: 150px;
  max-height: 60vh;
  overflow: auto;
  transition: all 0.25s ease;
}

.frsection:hover {
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.08) 0%, rgba(42, 157, 143, 0.04) 100%);
  border-color: rgba(74, 222, 183, 0.2);
}

.frsection h3 {
  margin: 0 0 14px 0;
  font-size: 12px;
  font-weight: 600;
  color: #4adeb7;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  position: relative;
}

.frsection h3::before {
  content: '◆';
  position: absolute;
  left: -18px;
  color: rgba(74, 222, 183, 0.5);
  font-size: 9px;
}

.entry {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  margin-right: 2px;
  margin-bottom: 7px;
}

.entry a {
  color: #b8d8d0;
  text-decoration: none;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 8px;
  display: inline-block;
  transition: all 0.2s ease;
}

.entry a:hover {
  background: rgba(74, 222, 183, 0.15);
  color: #4adeb7;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(74, 222, 183, 0.2);
}

.separator {
  display: inline;
  margin-right: 4px;
  color: rgba(74, 222, 183, 0.3);
}

.empty-note {
  color: rgba(74, 222, 183, 0.4);
  font-size: 13px;
  padding: 10px 5px;
  font-style: italic;
}

#frlscrape-reopen {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 28px;
  z-index: 100000;
  padding: 12px 26px;
  border-radius: 10px;
  border: 1px solid rgba(74, 222, 183, 0.35);
  background: linear-gradient(135deg, rgba(74, 222, 183, 0.18) 0%, rgba(42, 157, 143, 0.12) 100%);
  backdrop-filter: blur(12px);
  color: #4adeb7;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(74, 222, 183, 0.25);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  font-weight: 600;
  display: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: shimmer-glow 3s ease-in-out infinite;
}

#frlscrape-reopen:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 8px 32px rgba(74, 222, 183, 0.35);
  border-color: rgba(74, 222, 183, 0.5);
}

/* Scrollbars */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(74, 222, 183, 0.35) 0%, rgba(42, 157, 143, 0.35) 100%);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(74, 222, 183, 0.55) 0%, rgba(42, 157, 143, 0.55) 100%);
  background-clip: padding-box;
}

@media (max-width: 880px) {
  #frlscrape-body {
    grid-template-columns: 1fr !important;
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

        function buildUI(isOwn) {
            ensureRootUIRemoved();
            createStyle();

            const panel = document.createElement("div");
            panel.id = "frlscrape-panel";
            panel.setAttribute("role", "dialog");
            panel.setAttribute("aria-modal", "false");

            const header = document.createElement("div");
            header.id = "frlscrape-header";

            const leftWrap = document.createElement("div");
            leftWrap.style.display = "flex";
            leftWrap.style.alignItems = "center";
            leftWrap.style.gap = "16px";

            const title = document.createElement("div");
            title.id = "frlscrape-title";
            title.textContent = isOwn ? "◆ Friends & Requests ◆" : "◆ Friends Overview ◆";

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
            
            if (!isOwn) {
                body.classList.add("two-columns");
            }

            const friendsSection = document.createElement("div");
            friendsSection.className = "frsection";
            friendsSection.id = "friendsList";
            const fh = document.createElement("h3");
            fh.textContent = "Friends";
            friendsSection.appendChild(fh);
            body.appendChild(friendsSection);

            let invitingSection, sentSection, commonSection;

            if (isOwn) {
                invitingSection = document.createElement("div");
                invitingSection.className = "frsection";
                invitingSection.id = "invitingList";
                const ih = document.createElement("h3");
                ih.textContent = "Incoming Requests";
                invitingSection.appendChild(ih);

                sentSection = document.createElement("div");
                sentSection.className = "frsection";
                sentSection.id = "sentList";
                const sh = document.createElement("h3");
                sh.textContent = "Sent Requests";
                sentSection.appendChild(sh);

                body.appendChild(invitingSection);
                body.appendChild(sentSection);
            } else {
                commonSection = document.createElement("div");
                commonSection.className = "frsection";
                commonSection.id = "commonList";
                const ch = document.createElement("h3");
                ch.textContent = "Mutual Friends";
                commonSection.appendChild(ch);

                body.appendChild(commonSection);
            }

            panel.appendChild(header);
            panel.appendChild(body);
            document.body.appendChild(panel);

            panel.style.left = "50%";
            panel.style.top = "50%";
            panel.style.transform = "translate(-50%,-50%)";
            delete panel.dataset.dragged;

            const reopen = document.createElement("button");
            reopen.id = "frlscrape-reopen";
            reopen.type = "button";
            reopen.textContent = "◆ Open Friends Panel ◆";
            document.body.appendChild(reopen);

            const ui = { 
                panel, 
                header, 
                input, 
                friendsSection, 
                invitingSection, 
                sentSection, 
                commonSection,
                reopen 
            };

            setupDragging(ui);
            setupEvents(ui);

            return ui;
        }

        function setupDragging(ui) {
            const { panel, header } = ui;

            const centerPanel = () => {
                const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                const w = panel.offsetWidth;
                const h = panel.offsetHeight;
                panel.style.left = `${Math.max(12, (vw - w) / 2)}px`;
                panel.style.top = `${Math.max(12, (vh - h) / 2)}px`;
            };

            centerPanel();

            window.addEventListener("resize", () => {
                if (!panel.dataset.dragged) centerPanel();
            });

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
        }

        function setupEvents(ui) {
            const { panel, reopen } = ui;

            document.getElementById("frlscrape-close").addEventListener("click", () => {
                panel.style.display = "none";
                reopen.style.display = "block";
            });

            reopen.addEventListener("click", () => {
                panel.style.display = "";
                reopen.style.display = "none";
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    if (panel.style.display !== "none") {
                        panel.style.display = "none";
                        reopen.style.display = "block";
                    } else {
                        panel.style.display = "";
                        reopen.style.display = "none";
                    }
                }
            });

            requestAnimationFrame(() => {
                document.addEventListener("click", (e) => {
                    if (panel.style.display === "none") return;
                    if (!panel.contains(e.target) && e.target !== reopen) {
                        panel.style.display = "none";
                        reopen.style.display = "block";
                    }
                });
            });
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
            container.querySelectorAll(".entry, .empty-note").forEach(n => n.remove());
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

        async function fetchAndRenderFriends(ui, profileID) {
            const url = `https://www.kogama.com/user/${profileID}/friend/?count=555`;
            try {
                const data = await fetchJSON(url);
                const friends = Array.isArray(data.data) ? data.data.filter(f => f.friend_status === "accepted") : [];
                const items = friends.map(f => ({ 
                    name: f.friend_username || f.friend_profile_id, 
                    href: `https://www.kogama.com/profile/${f.friend_profile_id}/`, 
                    id: f.friend_profile_id 
                }));
                appendSortedEntries(ui.friendsSection, items);
                return items;
            } catch (err) {
                const note = document.createElement("div");
                note.className = "empty-note";
                note.textContent = "Failed to load friends.";
                ui.friendsSection.appendChild(note);
                console.error("Faster Friends: Friends fetch error", err);
                return [];
            }
        }

        async function fetchAndRenderRequests(ui, profileID) {
            const url = `https://www.kogama.com/user/${profileID}/friend/requests/?page=1&count=1000`;
            try {
                const data = await fetchJSON(url, { method: "GET", headers: { "Content-Type": "application/json" } });
                const arr = Array.isArray(data.data) ? data.data : [];
                
                const sent = arr
                    .filter(r => String(r.profile_id) === String(profileID))
                    .map(r => ({ 
                        name: r.friend_username || `id:${r.friend_profile_id}`, 
                        href: `https://www.kogama.com/profile/${r.friend_profile_id}/`, 
                        id: r.id 
                    }));
                
                const inviting = arr
                    .filter(r => String(r.profile_id) !== String(profileID))
                    .map(r => ({ 
                        name: r.profile_username || `id:${r.profile_id}`, 
                        href: `https://www.kogama.com/profile/${r.profile_id}/`, 
                        id: r.id 
                    }));
                
                appendSortedEntries(ui.sentSection, sent);
                appendSortedEntries(ui.invitingSection, inviting);
            } catch (err) {
                const note = document.createElement("div");
                note.className = "empty-note";
                note.textContent = "Failed to load requests.";
                if (ui.invitingSection) ui.invitingSection.appendChild(note);
                if (ui.sentSection) ui.sentSection.appendChild(note.cloneNode(true));
                console.error("Faster Friends: Requests fetch error", err);
            }
        }

        async function fetchAndRenderCommonFriends(ui, viewedProfileID, currentUserID) {
            try {
                const [viewedData, currentData] = await Promise.all([
                    fetchJSON(`https://www.kogama.com/user/${viewedProfileID}/friend/?count=555`),
                    fetchJSON(`https://www.kogama.com/user/${currentUserID}/friend/?count=555`)
                ]);

                const viewedFriends = Array.isArray(viewedData.data) 
                    ? viewedData.data.filter(f => f.friend_status === "accepted") 
                    : [];
                const currentFriends = Array.isArray(currentData.data) 
                    ? currentData.data.filter(f => f.friend_status === "accepted") 
                    : [];

                const currentFriendIds = new Set(currentFriends.map(f => String(f.friend_profile_id)));

                const commonFriends = viewedFriends
                    .filter(f => currentFriendIds.has(String(f.friend_profile_id)))
                    .map(f => ({
                        name: f.friend_username || f.friend_profile_id,
                        href: `https://www.kogama.com/profile/${f.friend_profile_id}/`,
                        id: f.friend_profile_id
                    }));

                appendSortedEntries(ui.commonSection, commonFriends);
            } catch (err) {
                const note = document.createElement("div");
                note.className = "empty-note";
                note.textContent = "Failed to load mutual friends.";
                if (ui.commonSection) ui.commonSection.appendChild(note);
                console.error("Faster Friends: Mutual friends fetch error", err);
            }
        }

        function filterAllLists(query) {
            const lists = ["friendsList", "invitingList", "sentList", "commonList"];
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

        const ui = buildUI(isOwn);

         console.log('Faster Friends: Initialized', {
            viewedProfile: viewedProfileID,
            currentUser: currentUser.id,
            isOwnProfile: isOwn
        });

        if (isOwn) {
            fetchAndRenderFriends(ui, viewedProfileID);
            fetchAndRenderRequests(ui, viewedProfileID);
        } else {
            fetchAndRenderFriends(ui, viewedProfileID);
            fetchAndRenderCommonFriends(ui, viewedProfileID, currentUser.id);
        }
    }

    waitBootstrapStart(run);

})();

// Avatar Marketplace Finder
(function () {
	"use strict"

	if (!/^https:\/\/www\.kogama\.com\/profile\/\d+\/avatars\/?$/.test(location.href)) return

	const PAGE_COUNT = 500
	const MAX_PAGES = 40
	const CONCURRENCY = 4
	const BATCH_DELAY = 150

	let modal = null
	let overlay = null
	let closeBtn = null
	let searchInput = null
	let resultsContainer = null
	let statusBar = null
	let fetching = false
	let controller = null
	let allResults = []

	function base(u) {
		return u ? u.split("?")[0] : ""
	}

	function openMarketplace(o) {
		window.open(`https://www.kogama.com/marketplace/avatar/${o.product_id}/`, "_blank")
	}

	function abortFetch() {
		if (controller) {
			controller.abort()
			controller = null
		}
		fetching = false
	}

	function ensurePanel() {
		if (modal) {
			modal.style.display = "flex"
			overlay.style.display = "block"
			closeBtn.style.display = "flex"
			return
		}

		overlay = document.createElement("div")
		overlay.className = "amf-overlay"
		overlay.onclick = closePanel

		modal = document.createElement("div")
		modal.className = "amf-panel"

		const header = document.createElement("div")
		header.className = "amf-header"

		const title = document.createElement("div")
		title.className = "amf-title"
		title.textContent = "◆ Marketplace Search ◆"

		searchInput = document.createElement("input")
		searchInput.className = "amf-search"
		searchInput.type = "search"
		searchInput.placeholder = "Filter results..."
		searchInput.addEventListener("input", filterResults)

		statusBar = document.createElement("div")
		statusBar.className = "amf-status"
		statusBar.textContent = "Ready"

		header.appendChild(title)
		header.appendChild(searchInput)
		header.appendChild(statusBar)

		resultsContainer = document.createElement("div")
		resultsContainer.className = "amf-results"

		closeBtn = document.createElement("button")
		closeBtn.className = "amf-close"
		closeBtn.innerHTML = "×"
		closeBtn.onclick = closePanel

		modal.appendChild(header)
		modal.appendChild(resultsContainer)
		modal.appendChild(closeBtn)

		document.body.append(overlay, modal)
	}

	function closePanel() {
		if (!modal) return
		abortFetch()
		modal.style.display = "none"
		overlay.style.display = "none"
		allResults = []
		if (searchInput) searchInput.value = ""
	}

	function createLoading() {
		const loading = document.createElement("div")
		loading.className = "amf-loading"
		loading.innerHTML = `
			<div class="amf-spinner"></div>
			<div class="amf-loading-text">Searching marketplace...</div>
		`
		return loading
	}

	function updateStatus(text, isLoading = false) {
		if (!statusBar) return
		statusBar.textContent = text
		statusBar.className = `amf-status ${isLoading ? 'amf-status-loading' : ''}`
	}

	function createCard(item) {
		const card = document.createElement("div")
		card.className = "amf-card"
		card.dataset.name = (item.name || "").toLowerCase()

		const imgWrap = document.createElement("div")
		imgWrap.className = "amf-card-img-wrap"

		const img = document.createElement("img")
		img.src = item.image_large || item.images?.large || item.image || ""
		img.alt = item.name || "Avatar"
		img.loading = "lazy"
		img.onerror = function() {
			this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231a2f2d' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='14' fill='%234adeb7' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
		}

		const label = document.createElement("div")
		label.className = "amf-card-label"
		label.textContent = item.name || "Unknown Avatar"



		card.onclick = () => openMarketplace(item)
		imgWrap.appendChild(img)
		card.appendChild(imgWrap)
		card.appendChild(label)

		return card
	}

	function filterResults() {
		const query = searchInput.value.toLowerCase().trim()
		const cards = resultsContainer.querySelectorAll(".amf-card")
		
		let visibleCount = 0
		cards.forEach(card => {
			const name = card.dataset.name || ""
			const matches = !query || name.includes(query)
			card.style.display = matches ? "" : "none"
			if (matches) visibleCount++
		})

		updateStatus(`${visibleCount} of ${cards.length} results`)
	}

	async function searchMarketplace(name, imageUrl) {
		if (fetching) abortFetch()
		fetching = true

		controller = new AbortController()
		ensurePanel()
		resultsContainer.innerHTML = ""
		allResults = []
		searchInput.value = ""

		const loading = createLoading()
		resultsContainer.appendChild(loading)
		updateStatus("Searching...", true)

		let page = 1
		let active = 0
		let found = false
		let totalFetched = 0

		const run = async () => {
			if (found || page > MAX_PAGES || controller.signal.aborted) return
			active++

			const url = `https://www.kogama.com/model/market/?page=${page}&count=${PAGE_COUNT}&category=avatar&q=${encodeURIComponent(name)}`
			const currentPage = page
			page++

			try {
				const res = await fetch(url, { signal: controller.signal })
				const json = await res.json()
				

				if (json?.data?.length && currentPage === 1) {
					// console.log('Avatar Marketplace Finder: First item structure:', json.data[0])
				}
				
				if (!json?.data?.length) {
					found = true
					return
				}

				totalFetched += json.data.length

				if (resultsContainer.contains(loading)) {
					resultsContainer.removeChild(loading)
				}

				allResults.push(...json.data)
				for (const item of json.data) {
					if (controller.signal.aborted) break

					const card = createCard(item)
					resultsContainer.appendChild(card)

					if (!found && base(item.image_large) === base(imageUrl)) {
						found = true
						card.classList.add("amf-card-matched")
						setTimeout(() => {
							openMarketplace(item)
							closePanel()
						}, 500)
						break
					}
				}

				updateStatus(`Found ${totalFetched} results (Page ${currentPage}/${MAX_PAGES})`, true)

			} catch (e) {
				if (e.name !== "AbortError") {
					console.error("Marketplace search error:", e)
				}
			} finally {
				active--
				if (!found && !controller.signal.aborted) {
					await new Promise(r => setTimeout(r, BATCH_DELAY))
					if (active < CONCURRENCY) run()
				}
			}
		}

		for (let i = 0; i < CONCURRENCY; i++) run()
		while (active > 0 && !controller.signal.aborted) {
			await new Promise(r => setTimeout(r, 50))
		}

		fetching = false
		
		if (!found && resultsContainer.contains(loading)) {
			resultsContainer.removeChild(loading)
		}

		if (!controller.signal.aborted) {
			updateStatus(`${totalFetched} results found`)
		}
	}

	function enhanceAvatars() {
		document.querySelectorAll(".MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 .MuiGrid-item").forEach(avatar => {
			if (avatar.querySelector("av")) return

			const wrap = avatar.querySelector("._2uIZL")
			const span = wrap?.querySelector("span")
			if (!span) return

			const name = span.textContent.trim()
			const style = avatar.querySelector("._3Up3H")?.getAttribute("style") || ""
			const match = style.match(/url\("([^"]+)"\)/)
			const imgUrl = match ? match[1] : ""

			const av = document.createElement("av")
			av.textContent = name
			av.onclick = () => searchMarketplace(name, imgUrl)

        // Safe way: clear only if parent still exists
        if (wrap.parentNode) {
            wrap.textContent = ""; // safer than innerHTML = ""
            wrap.appendChild(av);
        }
		})
	}

	const style = document.createElement("style")
	style.textContent = `
@keyframes avflow {
	0% { background-position: 0% 50% }
	50% { background-position: 100% 50% }
	100% { background-position: 0% 50% }
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

@keyframes pulse {
	0%, 100% { opacity: 0.6; }
	50% { opacity: 1; }
}

av {
	background: linear-gradient(90deg, #0a2e2a, #1a4d47, #2a9d8f, #4adeb7, #6ef0cb, #4adeb7, #2a9d8f, #1a4d47, #0a2e2a);
	background-size: 400% 100%;
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	animation: avflow 8s ease-in-out infinite;
	font-weight: 700;
	cursor: pointer;
	transition: transform 0.2s ease;
	display: inline-block;
}

av:hover {
	transform: scale(1.05);
}

.amf-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.75);
	backdrop-filter: blur(6px);
	z-index: 99998;
	animation: fadeIn 0.2s ease;
}

.amf-panel {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: min(1600px, 96vw);
	max-height: 92vh;
	display: flex;
	flex-direction: column;
	background: linear-gradient(135deg, #0d1f1d 0%, #1a2f2d 50%, #0d1f1d 100%);
	border-radius: 12px;
	box-shadow: 0 0 40px rgba(74, 222, 183, 0.2), 0 20px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(74, 222, 183, 0.15);
	border: 1px solid rgba(74, 222, 183, 0.25);
	z-index: 99999;
	animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	overflow: hidden;
}


.amf-panel::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 180px;
	height: 180px;
	background: radial-gradient(circle at top right, rgba(74, 222, 183, 0.15) 0%, transparent 60%);
	pointer-events: none;
	z-index: 0;
}

.amf-header {
	padding: 20px 24px;
	background: linear-gradient(135deg, rgba(20, 35, 33, 0.85) 0%, rgba(15, 28, 26, 0.95) 100%);
	border-bottom: 1px solid rgba(74, 222, 183, 0.12);
	display: flex;
	flex-direction: column;
	gap: 12px;
	position: relative;
	z-index: 1;
}

.amf-header::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 5%;
	right: 5%;
	height: 1px;
	background: linear-gradient(90deg, transparent 0%, rgba(74, 222, 183, 0.4) 50%, transparent 100%);
}

.amf-title {
	font-size: 11px;
	font-weight: 500;
	letter-spacing: 3px;
	color: rgba(74, 222, 183, 0.7);
	text-transform: uppercase;
}

.amf-search {
	width: 100%;
	padding: 11px 16px;
	background: rgba(0, 0, 0, 0.5);
	border: 1px solid rgba(74, 222, 183, 0.18);
	border-radius: 8px;
	color: #e0f0ee;
	font-size: 14px;
	outline: none;
	transition: all 0.2s ease;
}

.amf-search::placeholder {
	color: rgba(74, 222, 183, 0.4);
}

.amf-search:focus {
	border-color: rgba(74, 222, 183, 0.4);
	box-shadow: 0 0 0 3px rgba(74, 222, 183, 0.1);
	background: rgba(0, 0, 0, 0.6);
}

.amf-status {
	font-size: 12px;
	color: rgba(74, 222, 183, 0.6);
	text-align: center;
}

.amf-status-loading {
	animation: pulse 2s ease-in-out infinite;
}

.amf-results {
	flex: 1;
	padding: 28px;
	overflow-y: auto;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 26px;
	align-content: start;
}



.amf-card {
	background: linear-gradient(135deg, rgba(74, 222, 183, 0.05) 0%, rgba(42, 157, 143, 0.03) 100%);
	border: 1px solid rgba(74, 222, 183, 0.18);
	border-radius: 10px;
	cursor: pointer;
	transition: all 0.2s ease;
	animation: fadeIn 0.3s ease;
	display: flex;
	flex-direction: column;
	padding: 14px;
	gap: 10px;
	overflow: visible;
}

.amf-card-img-wrap {
	width: 100%;
	background: rgba(0, 0, 0, 0.35);
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px;
	min-height: 220px;
}


.amf-card-img-wrap img {
	display: block;
	max-width: 100%;
	height: auto;
	width: auto;
	object-fit: contain;
	position: static;
}



.amf-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(74, 222, 183, 0.2);
	border-color: rgba(74, 222, 183, 0.25);
	background: linear-gradient(135deg, rgba(74, 222, 183, 0.08) 0%, rgba(42, 157, 143, 0.04) 100%);
}

.amf-card-matched {
	border-color: rgba(74, 222, 183, 0.5);
	box-shadow: 0 0 20px rgba(74, 222, 183, 0.4);
	animation: pulse 1s ease-in-out infinite;
}



.amf-card-label {
	font-size: 15px;
	font-weight: 700;
	color: #e0f0ee;
	text-align: center;
	line-height: 1.4;
	white-space: normal;
	word-break: break-word;
	overflow: visible;
}



.amf-card-price {
	padding: 0 14px 14px 14px;
	font-size: 13px;
	color: #4adeb7;
	text-align: center;
	font-weight: 700;
}

.amf-card-price span {
	font-size: 14px;
}

.amf-close {
	position: absolute;
	top: 16px;
	right: 16px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(74, 222, 183, 0.1);
	border: 1px solid rgba(74, 222, 183, 0.2);
	border-radius: 50%;
	color: #4adeb7;
	font-size: 22px;
	line-height: 1;
	cursor: pointer;
	transition: all 0.2s ease;
	z-index: 2;
}

.amf-close:hover {
	background: rgba(74, 222, 183, 0.2);
	border-color: rgba(74, 222, 183, 0.4);
	transform: scale(1.1);
}

.amf-loading {
	grid-column: 1 / -1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	gap: 16px;
}

.amf-spinner {
	width: 40px;
	height: 40px;
	border: 3px solid rgba(74, 222, 183, 0.2);
	border-top: 3px solid #4adeb7;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

.amf-loading-text {
	font-size: 14px;
	color: rgba(74, 222, 183, 0.6);
	font-weight: 500;
}

/* Scrollbar */
.amf-results::-webkit-scrollbar {
	width: 10px;
}

.amf-results::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.3);
}

.amf-results::-webkit-scrollbar-thumb {
	background: linear-gradient(180deg, rgba(74, 222, 183, 0.35) 0%, rgba(42, 157, 143, 0.35) 100%);
	border-radius: 5px;
	border: 2px solid transparent;
	background-clip: padding-box;
}

.amf-results::-webkit-scrollbar-thumb:hover {
	background: linear-gradient(180deg, rgba(74, 222, 183, 0.55) 0%, rgba(42, 157, 143, 0.55) 100%);
	background-clip: padding-box;
}

@media (max-width: 768px) {
	.amf-results {
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 12px;
		padding: 16px;
	}
}
`
	document.head.appendChild(style)

	window.addEventListener("load", () => {
		setTimeout(() => {
			enhanceAvatars()
			if (!window.__enhanceAvatarsInterval) {
    window.__enhanceAvatarsInterval = setInterval(enhanceAvatars, 2000);
}
		}, 800)
	})

	console.log('Avatar Marketplace Finder: Initialized')
})();

(() => {
  "use strict";
  const STATE = { query: "", hiddenElements: new Map() };
  const SEL = {
    toolbar: "div._6cutH",
    listRoot: "div._1Yhgq",
    item: "div._1lvYU",
    name: "div._3zDi-"
  };

  const applyFilter = () => {
    const q = STATE.query;
    const listRoot = document.querySelector(SEL.listRoot);
    if (!listRoot) return;
    if (!q || q === "") {
      STATE.hiddenElements.forEach((value, item) => {
        const { parent, nextSibling } = value;
        if (parent && document.contains(parent)) {
          if (nextSibling && nextSibling.parentElement === parent) {
            parent.insertBefore(item, nextSibling);
          } else {
            parent.appendChild(item);
          }
        }
      });
      STATE.hiddenElements.clear();
      return;
    }

    const allItems = [
      ...document.querySelectorAll(SEL.item),
      ...Array.from(STATE.hiddenElements.keys())
    ];

    allItems.forEach(item => {
      const name =
        item.querySelector(SEL.name)?.textContent.toLowerCase() ?? "";
      const visible = name.includes(q);

      if (!visible) {
        if (!STATE.hiddenElements.has(item) && item.parentElement) {
          STATE.hiddenElements.set(item, {
            parent: item.parentElement,
            nextSibling: item.nextSibling
          });
          item.remove();
        }
      } else {
        if (STATE.hiddenElements.has(item)) {
          const { parent, nextSibling } = STATE.hiddenElements.get(item);
          if (parent && document.contains(parent)) {
            if (nextSibling && nextSibling.parentElement === parent) {
              parent.insertBefore(item, nextSibling);
            } else {
              parent.appendChild(item);
            }
          }
          STATE.hiddenElements.delete(item);
        }
      }
    });
  };

  const injectSearchBar = toolbar => {
    if (toolbar.querySelector("#kogama-friend-filter")) return;
    
    const input = document.createElement("input");
    input.id = "kogama-friend-filter";
    input.type = "search";
    input.placeholder = "Filter friends";
    
    Object.assign(input.style, {
      marginLeft: "12px",
      padding: "8px 12px",
      height: "36px",
      minWidth: "200px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "400",
      outline: "none",
      transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    });

    input.addEventListener("focus", () => {
      input.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
      input.style.border = "1px solid rgba(255, 255, 255, 0.35)";
      input.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)";
    });

    input.addEventListener("blur", () => {
      input.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      input.style.border = "1px solid rgba(255, 255, 255, 0.2)";
      input.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
    });

    const handleInput = (e) => {
      const newQuery = e.target.value.trim().toLowerCase();
      STATE.query = newQuery;
      applyFilter();
    };

    input.addEventListener("input", handleInput);
    input.addEventListener("search", handleInput);
    input.addEventListener("change", handleInput);

    toolbar.appendChild(input);
  };

  const observeFriendsList = root => {
    if (root.__filterObserver) return;
    root.__filterObserver = true;
    new MutationObserver(() => {
      if (STATE.query) {
        applyFilter();
      }
    }).observe(root, {
      childList: true,
      subtree: true
    });
  };

  const observeToolbar = parent => {
    const observer = new MutationObserver(() => {
      const toolbar = parent.querySelector(SEL.toolbar);
      if (!toolbar) return;
      injectSearchBar(toolbar);
    });
    observer.observe(parent, { childList: true, subtree: true });
    const toolbar = parent.querySelector(SEL.toolbar);
    if (toolbar) injectSearchBar(toolbar);
  };

  const bootstrap = () => {
    const listRoot = document.querySelector(SEL.listRoot);
    if (!listRoot) return;
    
    observeFriendsList(listRoot);
    observeToolbar(listRoot.parentElement);
    applyFilter();
  };

bootstrap();
  let filterPending = false;
  const startObserver = () => {
    new MutationObserver(() => {
      if (filterPending) return;
      filterPending = true;
      requestAnimationFrame(() => {
        filterPending = false;
        bootstrap();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.documentElement) {
    startObserver();
  } else {
    new MutationObserver((_, obs) => {
      if (!document.documentElement) return;
      obs.disconnect();
      startObserver();
    }).observe(document, { childList: true });
  }
})();
