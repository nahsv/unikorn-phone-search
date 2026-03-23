# Unikorn Phone Search

**Unikorn Phone Search** is a powerful, lightweight Google Chrome Extension built exclusively for the Unikorn CRM. It automatically scans external Angular-based dashboards and natively links phone numbers into 1-click Unikorn searches. 

## 🚀 Key Features

- **Dynamic SPA Detection**: Utilizes a robust interval sweep to seamlessly track rapidly changing Angular Single Page Applications containing the `mat-subtitle` class, ensuring the links never silently break during component lifecycles.
- **Smart Country Code Stripping**: Employs Regex to intelligently isolate the `+` character and Country Code payloads (e.g., `+967`) out of phone strings, guaranteeing the query exactly matches the local database numbers.
- **Singular Tab Recycling**: Prevents intense window clutter! Every Unikorn injection relies on a named window DOM target (`target="unikorn_search_tab"`), meaning clicking a new phone number cleanly recycles the previous CRM tab to preserve system memory.
- **Premium Material UI**: Injects a custom, responsive, drop-shadowed button directly adjacent to the parsed figures, featuring the 512px Unikorn Logo floating inline for immediate visibility.
- **CSS Trap Evasion**: The Javascript injection physically binds the anchor element outside the `<p>` container tags as a sibling node, perfectly bypassing Angular's strict `overflow: hidden` visibility blocks natively.

## 🛠 Installation (Developer Mode)

To install this dynamically from your local filesystem during testing:

1. Copy or clone this directory physically onto your Mac.
2. Open Google Chrome and navigate your URL bar to `chrome://extensions/`.
3. In the top right corner, flip the **Developer Mode** toggle to ON.
4. Click the **Load Unpacked** button in the top left corner.
5. Select the entire `/unikorn-phone-search` directory. The extension is now instantly live!

## 📦 Production Architecture (Chrome Web Store)

This repository is formally engineered to pass the stringent Google Chrome Marketplace Validation checks out of the box!

It implements:
- Strictly compliant **Manifest V3** (`manifest_version: 3`).
- Appropriately dimensioned and mathematically resized Icon matrix dependencies (`16x16`, `48x48`, and `128x128`).
- Formal array encapsulation of the inline `icon.png` via `web_accessible_resources`.

To publish, zip the directory contents into a standard `.zip` archive and deposit it natively into the Google Chrome Web Store Developer Console dashboard. No further compilation is required!
