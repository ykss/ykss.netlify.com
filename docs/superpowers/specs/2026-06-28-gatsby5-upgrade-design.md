# Gatsby 5 Upgrade Design

## Goal

Upgrade the blog from its legacy Gatsby/Node stack to a reproducible Gatsby 5 build while preserving the current Markdown content, URLs, RSS, sitemap, comments, ads, theme behavior, and Netlify deployment shape.

## Current State

- `package.json` declares Gatsby 2, React 16, Node 14, `node-sass`, `gatsby-image`, and old Gatsby plugin majors.
- The local install currently resolves closer to Gatsby 3 and React 17, so the declared spec and actual install state are not aligned.
- Netlify pins Node 14.15.0 and manually installs `sharp@0.25.2`.
- A baseline `npm run build` succeeds on the existing install when Gatsby can write its user config, but emits Gatsby image and Sass deprecation warnings.

## Target State

- Node LTS runtime suitable for Gatsby 5.
- Gatsby 5, React 18, and matching Gatsby plugin majors.
- `gatsby-plugin-image` replaces direct `gatsby-image` usage.
- `sass` replaces `node-sass`.
- Netlify build no longer manually installs old `sharp`.
- `package-lock.json` is regenerated with a modern lockfile format from a clean install.

## Migration Strategy

The migration should stay incremental and verifiable on the `codex/gatsby5-upgrade` branch:

1. Record the plan and baseline.
2. Update dependencies and runtime pins.
3. Convert the small amount of direct image API usage.
4. Fix Gatsby GraphQL/API breakages surfaced by build.
5. Verify production build output.

## Validation

The primary regression check is a production Gatsby build. During implementation, build failures are treated as migration feedback and fixed in small steps. Final validation must include:

- `npm install`
- `npm run build`
- inspection of key generated artifacts such as `public/rss.xml`, `public/sitemap-index.xml` or sitemap output, and representative page-data files when available.
