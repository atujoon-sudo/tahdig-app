# Deploying the TAHDIG review build

The site is fully static: `index.html` plus the `assets/` folder. There is no build step
and no server code. The only external request is Google Fonts (Vazirmatn).

Upload these two items together, keeping the folder structure:

```
index.html
assets/tahdig-logo.png
assets/tahdig-logo-small.png
```

Paths are relative, so the site works from a domain root or from a subfolder.

## Quickest options

- **Netlify Drop**: open https://app.netlify.com/drop and drag the `site` folder from the ZIP
  onto the page. You get a public `*.netlify.app` URL in a few seconds.
- **GitHub Pages**: in the repository settings, enable Pages for the
  `claude/tahdig-modernize-3se2qm` branch, root folder. `.nojekyll` is included so files
  are served as-is.
- **Any web host**: upload `index.html` and `assets/` to the public folder.

Serve over HTTPS so iPhone Safari behaves as it will in production.

## Testing on iPhone

1. Open the URL directly in Safari (not inside another app's in-app browser).
2. Read the dark diagnostic box in the bottom-left corner. It shows the viewport size,
   visual viewport, zoom scale, pixel ratio, safe-area insets, standalone mode, the
   rendered header height, whether the page is inside an iframe, and the active
   viewport meta tag.
3. Tap × to hide it, or open the URL with `#nodebug` at the end to start with it hidden.

The diagnostic overlay is temporary. It is marked `TEMP` in `index.html` and will be
removed after the standalone iPhone check.

## Scope of this build

Built from the approved reference: shared header, menu drawer, footer, Home and Products.
Not yet rebuilt: Product Details, Recipes, Cart, Payment, Checkout and Account; they still
open in the older prototype style.
