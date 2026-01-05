(function() { // copy description
    'use strict';
    
    let observer = null;
    let buttonAdded = false;
    const injectStyles = () => {
        if (document.getElementById('ethereal-copy-style')) return;
        
        const css = `
            @keyframes sparkle-pulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.1); }
            }
            
            @keyframes shimmer-sweep {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            
            @keyframes float-up {
                from { opacity: 0; transform: translate(-50%, 10px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            
            .ethereal-copy-btn {
                margin-left: 8px !important;
                width: 26px !important;
                height: 26px !important;
                border: 1px solid rgba(255, 192, 203, 0.3) !important;
                border-radius: 6px !important;
                background: linear-gradient(135deg, rgba(255, 192, 203, 0.15), rgba(200, 190, 220, 0.1)) !important;
                backdrop-filter: blur(8px) !important;
                color: #ffc0cb !important;
                font-size: 14px !important;
                cursor: pointer !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                vertical-align: middle !important;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                top: -1px !important;
                box-shadow: 0 2px 8px rgba(255, 192, 203, 0.2) !important;
                overflow: hidden !important;
            }
            
            .ethereal-copy-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -200%;
                width: 200%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(255, 192, 203, 0.3) 50%, 
                    transparent 100%);
                transition: left 0.6s ease;
            }
            
            .ethereal-copy-btn:hover {
                background: linear-gradient(135deg, rgba(255, 192, 203, 0.25), rgba(200, 190, 220, 0.2)) !important;
                border-color: rgba(255, 192, 203, 0.5) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 16px rgba(255, 192, 203, 0.3) !important;
            }
            
            .ethereal-copy-btn:hover::before {
                left: 200%;
            }
            
            .ethereal-copy-btn:active {
                transform: translateY(0) !important;
            }
            
            .ethereal-copy-btn-icon {
                animation: sparkle-pulse 3s ease-in-out infinite;
            }
            
            .ethereal-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                background: linear-gradient(135deg, rgba(255, 192, 203, 0.95) 0%, rgba(200, 190, 220, 0.9) 100%);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                box-shadow: 0 8px 24px rgba(255, 192, 203, 0.4);
                color: #1a1b1e;
                font: 600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                z-index: 999999;
                opacity: 0;
                animation: float-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                pointer-events: none;
            }
            
            .ethereal-notification::before {
                content: '✓';
                margin-right: 8px;
                font-size: 14px;
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'ethereal-copy-style';
        style.textContent = css;
        document.head.appendChild(style);
    };

    const showNotification = (message) => {
        document.querySelectorAll('.ethereal-notification').forEach(n => n.remove());
        
        const notif = document.createElement('div');
        notif.className = 'ethereal-notification';
        notif.textContent = message;
        
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translate(-50%, -10px)';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    };

    const addCopyButton = () => {
        if (buttonAdded) return;
        const bioContent = document.querySelector('div[itemprop="description"]');
        if (!bioContent) return;
        
        const bioContainer = bioContent.parentElement?.querySelector('h2');
        if (!bioContainer) return;
        if (bioContainer.querySelector('.ethereal-copy-btn')) {
            buttonAdded = true;
            return;
        }
        
        const btn = document.createElement('button');
        btn.className = 'ethereal-copy-btn';
        btn.title = 'Copy bio to clipboard';
        btn.innerHTML = '<span class="ethereal-copy-btn-icon">⎘</span>';
        
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            const textToCopy = bioContent.innerText?.trim() || '';
            
            if (!textToCopy) {
                showNotification('Bio is empty');
                return;
            }
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                showNotification('Copied to clipboard');
                btn.style.transform = 'translateY(-2px) scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            } catch (err) {
                console.error('Failed to copy:', err);
                showNotification('Copy failed');
            }
        });
        
        bioContainer.style.display = 'inline-flex';
        bioContainer.style.alignItems = 'center';
        bioContainer.appendChild(btn);
        buttonAdded = true;
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };

    const init = () => {
        injectStyles();
        addCopyButton();
        if (!buttonAdded) {
            observer = new MutationObserver(() => {
                addCopyButton();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            setTimeout(() => {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            }, 10000);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
