<div align="center">
  <img src="icon128.png" alt="Unikorn Logo" width="100"/>
  <h1>Unikorn Phone Search</h1>
  <p><strong>A high-performance Chrome Extension that seamlessly bridges arbitrary web dashboards to the Unikorn CRM.</strong></p>
  
  <a href="https://chromewebstore.google.com/detail/niekbojhocofmfelaoogemikjanidajl">
    <img src="https://img.shields.io/chrome-web-store/v/niekbojhocofmfelaoogemikjanidajl?label=Chrome%20Web%20Store&color=blue&style=for-the-badge" alt="Chrome Web Store Extension">
  </a>
</div>

<br/>

**Unikorn Phone Search** radically accelerates clinical, support, and outbound workflows. It securely scans text natively rendered on any external web application (e.g. Medifyr, support dashboards, or lead boards) and instantly injects a clickable Unikorn button beside any valid phone number it isolates. Simply clicking the icon instantly opens a highly targeted global Unikorn search.

## 🚀 Features

- **Opt-In Domain Security:** The extension is mathematically hardcoded to remain **100% disabled** globally. You manually whitelist the exact private domains you wish the crawler to analyze using the Extension Popup UI.
- **DOM TreeWalker Core:** Achieves supreme JavaScript performance by walking the internal Node Trees to locate digits instead of slow `querySelector` regex loops.
- **HTML5 Layout Protection:** Highly engineered injection algorithms (`span onclick`) specifically bypass native HTML `<a>` nesting limits. The UI seamlessly integrates directly into third-party Tailwind, Bootstrap, and Flexbox layouts without rupturing spacing margins or shattering CSS grids.
- **Singular Tab Recycling:** Prevents intensive desktop window clutter by universally forcing all 1-Click events to cleanly overwrite exactly one persistent 'Unikorn Search' target tab.
- **Hidden `tel:` Interception:** Detects generalized text (like *"Click to Call"*) by explicitly scanning HTML properties for masked telephony routing protocols globally.

---

## 🛠 Installation

### Option A: Install from Chrome Web Store (Recommended)
1. Navigate directly to the official Google listing: **[Unikorn Phone Search - Chrome Web Store](https://chromewebstore.google.com/detail/niekbojhocofmfelaoogemikjanidajl)**.
2. Click **Add to Chrome**.
3. Pin the extension to your toolbar. When you visit a domain that contains leads (like Medifyr), click the Unikorn Icon and toggle **Enable on this Site**. Done!

### Option B: Local Developer Mode
If you wish to fork this repository or run local CSS modifications:
1. Clone this repository or download the ZIP file.
2. Open Google Chrome and enter `chrome://extensions/` into the URL bar.
3. Toggle the **Developer mode** switch in the top right corner.
4. Click **Load unpacked** and simply select the folder where you cloned this repository.

---

## 💻 Tech Architecture

The extension achieves cross-site functionality by utilizing Chrome Sync endpoints alongside iterative frontend checks:
- **`manifest.json`:** Driven by Google's V3 architecture securely limiting script injections strictly through asynchronous user whitelisting.
- **`content.js`:** The brain of the operation. Contains a robust, dual-pass DOM scanner. Pass 1 iterates all raw text. Pass 2 explicitly filters `href="tel:"` elements. Both pipelines securely build highly-contained Flex geometries so third-party layouts remain structurally identical.
- **`popup.js` / `popup.html`:** A heavily polished UI interacting synchronously with `chrome.storage.sync` allowing agents to selectively toggle the search engines per domain without manual code configurations. 

---

## 🤝 Contribution Guidelines
To modify the DOM rules or redesign the icon geometry, open `content.js`, modify your targets, save, and hit the **Refresh 🔄** icon next to the unpackaged payload in `chrome://extensions/`.

### Formatting Constraints (Chrome Guidelines)
If you actively alter the graphical icons, remember Chrome rigidly expects explicit scaling arrays:
- `16x16`
- `48x48`
- `128x128`
