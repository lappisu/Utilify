<div align="center">

# ◆ Utilify ◆

<img width="1905" height="1043" alt="{6EDE85F0-9E80-4FEB-B4C5-D6A082799ADE}" src="https://github.com/user-attachments/assets/94cdaea3-568d-4548-92f4-c883ebda0e81" />


**A comprehensive userscript suite for [KoGaMa](https://www.kogama.com)**

*Visual modernization · Privacy tools · Profile customization · Plugin system*

[![Version](https://img.shields.io/badge/version-3.0.4-4adeb7?style=flat-square)](https://github.com/lappisu/Utilify)
[![Grant](https://img.shields.io/badge/grant-none-2a9d8f?style=flat-square)](https://github.com/lappisu/Utilify)
[![License](https://img.shields.io/badge/license-community-4adeb7?style=flat-square)](https://github.com/lappisu/Utilify)

</div>

---

## Installation

**Recommended manager:** [ScriptCat](https://scriptcat.org/) - best compatibility. Tampermonkey is also supported.

[**👉 Install Utilify v3.0.4**](https://github.com/lappisu/Utilify/raw/refs/heads/main/Script/Rewrite/Utilify.user.js)

> Utilify runs with `@grant none` - it needs no special userscript permissions and works entirely within the page context.

---

## ⚠️ Compliance Notice

Utilify is a third-party extension. Users are solely responsible for compliance with KoGaMa's Terms of Service.

**Developer guidelines observed:**
- No violation of other users' privacy
- No spam-polling of API endpoints
- No interference with the game client

> Features marked **UAOR** (Use At Your Own Risk) interact with the API in ways that edge these guidelines. They are **disabled by default** and must be opted into explicitly from the settings panel.

---

## Features

### Visual & UI Overhaul

Utilify applies a suite of CSS fixes on page load that clean up KoGaMa's interface:

- Removes the oversized badge row, streak counter widget, level display block, and the site footer - permanently and silently
- Applies teal-accented styling to feed/comment author names and selected UI text
- Neutralizes the orange notification badges
- Applies glassmorphic blur/transparency to avatar card title overlays

**DM Chat redesign** - the entire DM panel is restyled: frosted glass background, teal border accent on the active conversation, blurred avatars in the conversation list (revealed on hover), and styled message bubbles with "Them / You" micro-labels above each side.

---

### Background Effects Engine

Driven by a special syntax placed anywhere in your **Profile Description**, Utilify reads it at page load and applies a live background image with optional visual effects.

**Syntax:**
```
Background: SOURCE, filter: EFFECTS
```

**Sources:**

| Format | Example | Resolves to |
|---|---|---|
| Imgur image ID | `i-aBcDeFg` | `https://i.imgur.com/aBcDeFg.png` (auto-detects extension) |
| KoGaMa game ID | `1234567` | Fetches the game's cover image via KoGaMa API |

**Effects (combine freely):**

| Keyword | What it does |
|---|---|
| `rain` | Animated rain streaks rendered on a canvas overlay (60 particles, depth simulation) |
| `snow` | Rotating SVG snowflakes with gentle sway (80 particles) |
| `fireflies` | Glowing floating dots that drift and pulse (50 particles) |
| `roses` | Falling rose SVGs with slow rotation and sway (35 particles) |
| `sparkles` | Fading teal star bursts that twinkle in and out (40 particles) |
| `blur` | Applies `blur(4px)` to the background image |
| `dark` | Applies `brightness(0.7)` to the background image |

**Examples:**
```
Background: i-aBcDeFg, filter: rain, blur
Background: 1234567, filter: snow, dark
Background: i-aBcDeFg, filter: fireflies
```

> **Helper tooltip** - when you type `filter:` into the profile description textarea, Utilify automatically shows a floating tooltip listing all available effects and modifiers. It dismisses when you leave the field.

---

### Profile Description Gradient

In addition to the background image system, Utilify also reads a `linear-gradient(...)` expression directly from your description and applies it to the page background (`#root-page-mobile`), with a smooth opacity transition on load.

```
linear-gradient(135deg, #0a2e2a, #1a4d47)
```

---

### Seamless Description

Replaces KoGaMa's native truncated bio display with a scrollable, full-text box. Decodes HTML entities (up to 10 passes), Unicode escape sequences (`\uXXXX`), literal `\n` newlines, and Braille space characters (`\u2800`). The box height adapts to the surrounding container so it never overflows the profile layout. A MutationObserver guards against React re-rendering the original elements back in.

---

### React-Compatible Input Decoder

When you click or focus any input or textarea on the site, Utilify immediately decodes all HTML entities in the field and fires the synthetic React events needed for the change to register with KoGaMa's React state - meaning your bio will actually save after editing. This runs on every input/textarea site-wide, with a polling fallback every 2 seconds for dynamically added elements.

---

### Smart Dot Obfuscation

Automatically converts dots (`.`) to `%2E` in any text input or paste event, bypassing KoGaMa's URL filter. YouTube (`youtube.com`, `youtu.be`) and Google Fonts (`fonts.googleapis.com`) URLs are whitelisted and pass through unchanged.

---

### Profile Info Chips

On any profile page, Utilify replaces the plain "Joined KoGaMa on..." text with a row of styled chips:

- **Account created** - shows relative time (e.g. `2.3y ago`); click to expand to full date/time with timezone
- **Last seen** - same relative/expandable format
- **Last played game** - on your own profile only, reads from `localStorage` cache and links directly to the game page (if available)
- **Archive** - a Wayback Machine link for the current profile URL, always present

---

### Compact Level Display

Injects a small "Level N" label directly below the username on profile pages, sourced from the bootstrap data. The native oversized level widget is hidden globally.

---

### Leaderboard Fix

Rewrites outgoing `fetch` and `XMLHttpRequest` calls targeting the `/api/leaderboard/around_me/` endpoint, substituting the hardcoded UID in the URL with the actual profile ID from the current page. This fixes the "Around Me" leaderboard view which KoGaMa's own code sends to the wrong user. Also automatically highlights your own row in the leaderboard table. Credits: idea by **Zpayer**.

---

### Feed Manager

Appears as a clickable card on **your own profile page only** (not visible to others, not injected elsewhere). Opens a full-screen overlay panel with:

- Paginated list of all your feed posts, rendered with content and timestamp
- Per-post delete button (with confirmation)
- **Delete All** button - iterates all posts with a 500ms delay between requests to avoid hammering the API
- Animated removal (slide + fade) when posts are deleted

---

### Friends & Requests Panel (Faster Friends)

On the friends page (`/profile/ID/friends/`), Utilify replaces the default paginated list with a fast, flat panel that fetches up to 555 friends in one request:

- **Own profile:** shows Friends, Incoming Requests, and Sent Requests in separate sections, all alphabetically sorted with a live search input
- **Other's profile:** shows their Friends and Mutual Friends (cross-referenced against your own friend list)
- Draggable panel (mouse and touch), collapsible to a floating "Open Friends Panel" button, Escape key toggles it

---

### Avatar Marketplace Finder

On avatar list pages, avatar names become animated teal gradient links. Clicking one searches the KoGaMa marketplace for that avatar by name and image hash, opening results in a searchable grid panel. Uses concurrent fetch with up to 5 simultaneous requests and 50 pages of results. Matched avatars are highlighted and auto-opened in the marketplace.

---

### Friend List Search

On any page showing the friends list widget, Utilify injects a styled search input into the toolbar. Filtering is live and instant, preserving DOM position of hidden elements so they re-appear correctly when the filter is cleared. Works on dynamically loaded lists via MutationObserver.

---

### Player Chip (UAOR)

On game pages (`/games/play/ID/`), fetches the page HTML and parses `playing_now_members` and `playing_now_tourists` counts, then injects a small glassmorphic chip next to the game title showing `Total | Members + Tourists`. Hovering each number shows a label tooltip.

---

### Settings Panel

Accessible via the **◆** button injected into the site's top navigation bar. The panel is draggable, animates in/out, and persists all settings to `localStorage`.

**Tabs:**

**Gradient** - two color pickers + angle slider + direct CSS input. Gradient is applied live to `#root-page-mobile` with a 150ms debounce. Copy CSS button for easy sharing.

**Privacy:**
- Hide Friendslist - hides the entire friends list widget globally
- Blur Sensitive Content - blurs profile descriptions, usernames in friend cards, rank info, and author names; hover to reveal
- Blur Comments - blurs comment text; hover to reveal

**Styles:**
- Glass Panels - enables a frosted glass effect on KoGaMa's main UI panels, with configurable border radius (0–50px), hue (0–360°), and alpha (1–50%)
- Online CSS URLs - load external stylesheets by URL (one per line)
- Custom CSS - freeform CSS injected directly into the page

**Fonts:**
- Dropdown to select System Default, Roboto, or Comfortaa (loaded from Google Fonts)
- Custom font URL input - paste any Google Fonts `<link>` href to load a custom font

**Plugins** - see the [Plugin System](#plugin-system) section below.

**UAOR** - risky features, see below.

**About** - credits and contributor list.

---

### UAOR Features

> These features are disabled by default. Enable them in the **UAOR** tab. You take full responsibility for their use.

**Appear Offline (Pulse Blocker)** - intercepts all outgoing `POST /user/ID/pulse/` requests via both `fetch` and `XMLHttpRequest` and silently drops them, making you appear offline to other users.

**Friend Activity Monitor** - polls `/user/ID/friend/chat/` every 30 seconds and resolves game and project IDs to human-readable names, updating the status text in friend list entries in real time. Also hooks a MutationObserver on the friends list container for newly added entries.

**Player Type Display** - injects the Members/Tourists chip on game pages (see above).

**Lazy Streak Keeper** - sends automated DMs to the streak bot account ([670350173](https://www.kogama.com/profile/670350173/)) at a 7-hour interval. Sends a random message, waits up to 3 minutes for a reply, sends a second message, waits 1 minute, sends a third. Uses `localStorage` to persist last-sent time across sessions. **Requires friending that account first.**

---

### Auto-Update Checker

On page load (at most once every 24 hours), Utilify fetches the raw script from GitHub, parses the `@version` header, and compares it against the installed version. If a newer version exists, a styled floating notification appears at the top of the page with an "Update Now" link and a "Later" dismiss button. Auto-dismisses after 45 seconds. Exposes `window.UtilifyUpdateChecker.check()` in the console for manual checks.

---

### Logo Override

The KoGaMa navbar logo is replaced with a custom image linking to the Utilify GitHub profile, with a hover title crediting the script.

---

## Plugin System

Utilify includes a plugin loader that lets you install external JavaScript files as plugins via the **Plugins** tab in the settings panel. Paste a raw URL (e.g. from GitHub) and click Add Plugin.

<img width="570" height="250" alt="{00CEF972-7199-4762-ABC1-80E060190A49}" src="https://github.com/user-attachments/assets/e01bc10d-a204-41b2-a3f0-ade72adc0ad6" />


### How it works

The plugin code is fetched, stored in `localStorage`, and injected as an inline `<script>` tag into `<head>` when enabled. Plugins persist across page reloads.

### Metadata format

Utilify reads metadata from special comment lines at the top of your plugin file using the format `// Key * Value`. These populate the plugin card in the UI.

```javascript
// Title * My Plugin Name
// Desc * A short description of what this does
// Ver * 1.0.0
// Date * 19 Feb 2026
// Auth * Alice, Bob
```

All five fields are optional - plugins without them will still load, but will appear as "Unnamed Plugin" with "No description". Multiple authors in `Auth` are just written comma-separated on one line.

Any other `//` comment lines in the file are ignored by the parser and won't appear in the UI.

---

### ⚠️ GM_* APIs will NOT work in plugins

Utilify itself runs with `// @grant none`, which means the Greasemonkey/Tampermonkey privileged APIs (`GM_xmlhttpRequest`, `GM_getValue`, `GM_setValue`, etc.) are **not available** in the page context. Plugins are injected as plain `<script>` tags, so they share this limitation.

If you use any GM API, the plugin will throw a `ReferenceError` and fail silently.

**Won't work:**
```javascript
// This will crash - GM_xmlhttpRequest is undefined
GM_xmlhttpRequest({
  method: 'GET',
  url: 'https://api.example.com/data',
  onload: r => console.log(r.responseText)
});
```

**Works - use `fetch` instead:**
```javascript
fetch('https://api.example.com/data')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

**Won't work:**
```javascript
// GM_getValue / GM_setValue are undefined
const lang = GM_getValue('myLang', 'en');
GM_setValue('myLang', 'fr');
```

**Works - use `localStorage` instead:**
```javascript
const lang = localStorage.getItem('myplugin_myLang') ?? 'en';
localStorage.setItem('myplugin_myLang', 'fr');
```

> **Tip:** Prefix your `localStorage` keys with something unique to your plugin (e.g. `translator_` or `myplugin_`) to avoid colliding with Utilify or other plugins.

---

### Complete plugin template

```javascript
// Title * My Plugin
// Desc * Does something cool on KoGaMa
// Ver * 1.0.0
// Date * 19 Feb 2026
// Auth * YourName

(function () {
    'use strict';

    // ✅ Use fetch instead of GM_xmlhttpRequest
    async function fetchData(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    // ✅ Use localStorage instead of GM_getValue / GM_setValue
    function getSetting(key, fallback) {
        try { return JSON.parse(localStorage.getItem('myplugin_' + key)) ?? fallback; }
        catch { return fallback; }
    }

    function setSetting(key, value) {
        localStorage.setItem('myplugin_' + key, JSON.stringify(value));
    }

    // Your plugin logic here
    console.log('[My Plugin] Loaded');
})();
```

---

## Background Effects - Quick Reference

```
Background: i-IMGUR_ID                          → Imgur image, no effects
Background: GAME_ID                             → KoGaMa game cover, no effects
Background: i-IMGUR_ID, filter: rain            → Rain overlay
Background: i-IMGUR_ID, filter: snow, dark      → Snow + darkened image
Background: GAME_ID, filter: fireflies, blur    → Fireflies + blurred image
Background: i-IMGUR_ID, filter: roses, sparkles → Both particle effects combined
```

Available effects: `rain` `snow` `fireflies` `roses` `sparkles`  
Available modifiers: `blur` `dark`

---

## Contributors

| Contributor | Role |
|---|---|
| **Simon** | Lead Developer, Core Maintainer |
| **Death Wolf.** | Primary motivation behind the project |
| **Sorry** | Testing, Feedback, CSS Design |
| **Zpayer** | Leaderboard Fix idea & implementation, various suggestions |
| **Awoi** | Porting features from KoGaMaBuddy |
| **Idealism** | Feedback, Avatar Search |
| **Selene** | Feedback, Avatar Search |
| **Snowy** | Feedback & Bug Reports |
| **Comenxo** | Testing & Feedback |
| **Raptor** | Testing & Feedback |
| **ReZa** | Testing & Feedback |
| **Tungsten** | Feedback |
| **ValDon** | Feedback |

---

*Utilify is an independent community project and is not affiliated with or endorsed by KoGaMa.*
