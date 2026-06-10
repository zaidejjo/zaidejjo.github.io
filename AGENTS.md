# Portfolio — Zaid Ajo

Static portfolio site hosted on GitHub Pages (`zaidejjo.github.io`).

## Structure

- `index.html` — main portfolio page
- `2.html` — alternate version of the portfolio
- `*.png`, `*.webp` — image assets referenced from the HTML files

## Development

No build system, bundler, package manager, or server. Open any `.html` file directly in a browser to preview.

## Deploy

Push to `main` — GitHub Pages auto-deploys `https://zaidejjo.github.io/` from the repo root.

## Important

- All CSS and JS (Three.js, GSAP, Typed.js) are loaded from CDNs in the HTML `<head>` — no local dependencies.
- Both `index.html` and `2.html` are standalone, independent page variants. Edits must be made in both if the change applies to both versions.
- Image assets are referenced by relative paths from the repo root.
