<div align="center">
   
# Utilify
</div>

<img width="1890" height="1070" alt="{57ECA78E-390A-497C-BD49-B5B6E725E36F}" src="https://github.com/user-attachments/assets/a9d54157-6fae-4a39-9932-edae51f203b5" />

A comprehensive userscript suite for **KoGaMa** designed to enhance user experience through visual modernization, privacy tools, and advanced profile customization.

Version **3.0.0** introduces a completely rewritten modular architecture, a new visual language and an experimental plugin system.

---

## ⚠️ Compliance & Safety

Utilify is a third-party extension. Users are responsible for adhering to the platform's Terms of Service.

**KoGaMa Developer Guidelines:**
1.  **Privacy:** Do not violate the privacy of other users.
2.  **API Usage:** Do not spam-poll endpoints.
3.  **Client Integrity:** Do not interfere with the game client logic.

> **Note on "UAOR" Features:**
> Features marked as **Use At Your Own Risk** (Pulse Blocker, Friend Activity, Streak Keeper) interact with the API in ways that strictly edge the guidelines. These are disabled by default.

---

## Patch Notes (v3.0.0)

### 🔧 Core System
* **Rewrite:** The codebase has been refactored into a modular, object-oriented structure for better performance and easier maintenance.
* **Plugin System (Beta):** Users can now load external scripts dynamically via the Settings panel.
* **React Integration:** Improved input handling for the bio/description editor, fixing issues where text changes would not save.

### 🎨 Visuals
* **New Aesthetic:** Replaced the previous pink "Ethereal" theme with a Teal/Dark Gray theme inspired by *A: Endfield*.
* **UI Cleanup:** Automatically removes visual clutter (useless footers, level displays, oversized badges) for a cleaner browsing experience.
* **Glassmorphism:** Configurable glass-panel effects for UI elements.

### ✨ Profile Customization
* **Effect Engine:** New particle rendering system supporting:
    * `rain`, `snow`, `fireflies`, `roses`, `sparkles`.
* **Modifiers:** Added `blur` and `dark` filters for background images.
* **Syntax:** Updated description syntax for easier application:
    * `Background: i-IMGUR_ID, filter: rain, dark`

---

## Features

### Utilities
| Feature | Description |
| :--- | :--- |
| **Feed Manager** | A dedicated card on the profile to view, manage, and batch-delete feed posts and comments. |
| **Marketplace Finder** | Quickly locate avatars in the marketplace directly from a user's profile list. |
| **Seamless Description** | Replaces the default truncated bio with a scrollable, fully decoded text box. |
| **Smart Obfuscation** | Automatically converts dots to `%2E` in text inputs to bypass filters (whitelists YouTube/Fonts). |
| **Archive Shortcut** | Adds a direct link to the Wayback Machine for the current profile. |

### Visual Enhancements
* **Custom Gradients:** Apply global CSS gradients to the site background.
* **Custom Fonts:** Load Google Fonts (e.g., Roboto, Comfortaa) or custom URLs.
* **Leaderboard Fix:** Corrects the API calls for the "Around Me" leaderboard view.
* **Player Chip:** Displays a breakdown of Members vs. Tourists on game pages.

### Social Tools
* **Friend Activity:** passively monitors friend list updates to show what game or project they are currently in.
* **Pulse Blocker:** Blocks outgoing "pulse" requests to appear offline to others.
* **Streak Keeper:** Automates chat messages to a specific bot account to maintain streaks (UAOR).

---

## Configuration

To apply background effects, add the following syntax to your **Profile Description**:

**Format:**
`Background: SOURCE, filter: EFFECTS`

**Examples:**
* **Imgur Image:** `Background: i-aBcDeFg`
* **Game Image:** `Background: 1234567`
* **With Effects:** `Background: i-aBcDeFg, filter: rain, blur`

**Available Filters:**
`rain` `snow` `fireflies` `roses` `sparkles` `blur` `dark`

> **Tip:** Typing `filter:` in your description box will trigger a helper tooltip listing available effects.

---

## Installation

1.  **Manager:** Install a userscript manager. **ScriptCat** is recommended for best compatibility, though Tampermonkey is supported.
2.  **Install:** Click the link below to install the script.

[**👉 Install Utilify v3.0.3**](https://github.com/lappisu/Utilify/raw/refs/heads/main/Script/Rewrite/Utilify.user.js)

---

## Contributors

Special thanks to the community members who helped shape Utilify.

| Contributor | Contribution / Role |
| :--- | :--- |
| **Simon** | Lead Developer, Core Maintainer |
| **Death Wolf.** | Leading motivation behind the whole project |
| **Sorry** | Testing, Feedback, Suggestions, Design (CSS) Feedback and adjustements |
| **Zpayer** | Leaderboard API Fix implementation & various ideas |
| **Awoi** | Help with porting various KB features |
| **Idealism** | Feedback, Avatar Search  |
| **Selene** | Feedback, Avatar Search  |
| **Snowy** | Feedback & Bug Reports |
| **Comenxo** | Testing & Feedback |
| **Raptor** | Testing & Feedback |
| **ReZa** | Testing & Feedback |
| **Tungsten** | Feedback |
| **ValDon** | Feedback |

---

*Utilify is an independent project and is not affiliated with or endorsed by KoGaMa.*
