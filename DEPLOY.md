# Deploying the TAHDIG review build

Fully static: `index.html` plus `assets/`. No build step, no server. The only external
request is Google Fonts (Vazirmatn). Paths are relative, so it works from a domain root
or a subfolder, and also opened straight from disk.

```
index.html
assets/css/tahdig.css
assets/js/catalog.js    mock Shopify-shaped data (to be replaced by the Storefront API)
assets/js/commerce.js   commerce layer: catalog, cart, recurring list, customer
assets/js/ui.js         presentational components (HTML in, no state)
assets/js/app.js        router, views, interactions
assets/tahdig-logo.png
assets/tahdig-logo-small.png
```

- **Netlify Drop**: drag the `site` folder from the ZIP onto https://app.netlify.com/drop.
- **GitHub Pages**: enable Pages for this branch, root folder (`.nojekyll` included).
- **Any host**: upload `index.html` and `assets/` to the public folder, over HTTPS.

Test on iPhone by opening the URL directly in Safari (not an in-app browser).
Demo discount code: `TAHDIG10`. State is kept in `localStorage` (clear site data to reset).
