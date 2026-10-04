# Documentation website

The site lives at <https://asrulazwan0.github.io/nodejs-tdd-base-web-api/> and presents the current `main` documentation alongside the stable API baseline. It does not host the API or replace a tagged source release.

## Build and preview

Use a checkout of `main` containing the website tooling. The stable `v1.0.0` application tag predates this website.

```sh
npm ci
npm run docs:build
npm run docs:preview
```

Open <http://127.0.0.1:4173/nodejs-tdd-base-web-api/>. Node.js 24 and npm 11 are sufficient; MySQL and Docker are unnecessary for the website. Set `DOCS_PORT` to change the preview port.

The build writes ignored output to `.site/` and validates internal links, section anchors, assets, and duplicate IDs. Quickstart, TDD, architecture, operations, contributing, changelog, security, and verification pages use existing repository Markdown. The overview is `docs/site/index.md`. The API reference is generated from `openapi.json`, which is also served unchanged as a download. Links to repository files outside the site open their source on GitHub.

Navigation and content work without JavaScript. JavaScript adds section search, code copying, a mobile menu, and a light/dark toggle. System colors apply until a visitor chooses a theme. That choice is saved under `tdd-api-docs-theme` in local storage and shared across pages and tabs. Blocked storage still allows switching on the current page. Print output uses light colors. No external fonts or scripts are required.

`scripts/docs-config.mjs` defines the navigation and source mappings. `docs/site/site.css` and `docs/site/site.js` define presentation and enhancements. `marked` is a development dependency and is omitted from the production API image with other development dependencies.

## Publish

The `Documentation` workflow builds and checks pull requests. Publication is limited to the exact upstream repository on `main`, using the `github-pages` environment. GitHub Pages uses **GitHub Actions** as its source. Only the deployment job receives Pages write and OpenID Connect permissions; Actions are pinned to commit SHAs.

The initial publication is tracked by the pull request adding this website. A deployment is complete when Actions succeeds and the public URL serves the generated pages and assets. Documentation changes do not require a new application release. Existing tags and release archives remain unchanged.

## Initial verification

Local verification on 2026-10-04 covered:

- Ten generated pages and 271 internal links/assets, built at both the repository prefix and `/`.
- Chromium checks on all ten pages in light and dark mode at widths of 1440, 390, and 320 pixels, with no page overflow or failed requests.
- Automated axe checks across that matrix with no violations of the selected WCAG A/AA rules. These checks provide automated evidence, not a complete accessibility conformance audit.
- Search results and section navigation, code copying, keyboard skip navigation, mobile menu controls, and Escape returning focus to the menu button.
- Saved themes across pages, reloads, and tabs; changing system preferences; blocked storage; light print output; and usable mobile navigation and system colors without JavaScript.
- The downloaded OpenAPI matching the unchanged contract, including pagination bounds, UUID parameters, and a 204 response without a body in the generated reference.
- Preview rejection of encoded traversal, invalid encodings, and routes outside its base path.
- `npm run check` passing all 68 unit/HTTP tests and the format/lint/type/build gates; `npm run audit` reporting zero vulnerabilities.

GitHub Actions records the documentation build, deployment, and application checks for the publishing commit. Publication verification also checks the live URL after deployment.

## Adopt the template

A new project can build the website but cannot publish automatically under the upstream deployment guard. Remove the website workflow, scripts, and assets if your project does not need them.

For your own site, update the repository URL, canonical URL generation, base path, overview links, and deployment guard. Replace starter-specific content and security policies, then enable Pages with GitHub Actions as its source in your repository settings.

The default base path is `/nodejs-tdd-base-web-api/`. Set `DOCS_BASE_PATH` to `/` or another slash-delimited path ending in `/` for a different deployment. Use the same value for building and previewing, including in CI. For a custom domain, also update canonical URLs in `scripts/docs-build.mjs`.

## Troubleshooting

- Missing files or anchors fail the build. Fix the source link or navigation mapping.
- A successful build followed by a failed deployment may indicate disabled Pages or an incorrect deployment environment policy.
- Missing styles or search often indicate a mismatched base path. Preview at the same repository prefix used publicly.
- Failed clipboard permission leaves code selectable. Search failures leave navigation available.
