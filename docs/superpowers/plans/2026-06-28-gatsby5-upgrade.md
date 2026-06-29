# Gatsby 5 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the blog build reproducibly on Gatsby 5 with modern Node, React, image, Sass, and Netlify settings.

**Architecture:** Keep the current Gatsby Markdown architecture, page templates, content layout, and styling model. Replace obsolete dependency surfaces only where Gatsby 5 requires it.

**Tech Stack:** Gatsby 5, React 18, npm, Netlify, Markdown Remark, Sharp, Sass, React Helmet.

---

### Task 1: Baseline And Runtime Pins

**Files:**
- Modify: `.nvmrc`
- Modify: `netlify.toml`
- Modify: `package.json`

- [ ] Set Node runtime to a supported LTS version.
- [ ] Remove Netlify's old manual `sharp@0.25.2` install.
- [ ] Keep the build command as `npm run build`.

### Task 2: Dependency Upgrade

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Upgrade Gatsby core and Gatsby plugin packages to Gatsby 5 compatible majors.
- [ ] Upgrade React and React DOM to React 18.
- [ ] Replace `node-sass` with `sass`.
- [ ] Add `gatsby-plugin-image`.
- [ ] Remove `gatsby-image`.
- [ ] Regenerate `package-lock.json` with `npm install`.

### Task 3: Image API Migration

**Files:**
- Modify: `src/components/bio/index.jsx`
- Modify: `src/templates/blog-post.js`

- [ ] Replace `gatsby-image` imports with `GatsbyImage` or `getImage` from `gatsby-plugin-image`.
- [ ] Replace `fixed` GraphQL selections with `gatsbyImageData`.
- [ ] Preserve the current avatar rendering and social preview thumbnail URL behavior.

### Task 4: Build Breakage Fixes

**Files:**
- Modify Gatsby config, node APIs, pages, templates, or components as surfaced by build errors.

- [ ] Run `npm run build`.
- [ ] Fix Gatsby 5 GraphQL, plugin option, or package compatibility errors one at a time.
- [ ] Re-run build after each fix until production build exits successfully.

### Task 5: Final Verification

**Files:**
- No source changes expected unless verification exposes a defect.

- [ ] Run `npm run build`.
- [ ] Confirm generated RSS/sitemap/page-data artifacts exist.
- [ ] Run `git status --short` and review the final diff.
