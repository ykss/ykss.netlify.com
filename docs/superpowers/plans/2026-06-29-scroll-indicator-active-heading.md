# Scroll Indicator And Active Heading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a top reading progress indicator and highlight the currently active post heading.

**Architecture:** Keep scroll progress independent in a small `ScrollIndicator` component mounted by the blog post template. Reuse the existing table-of-contents heading tracking to apply an active class to the matching `h2` or `h3` in the rendered post body so the TOC and heading highlight stay in sync.

**Tech Stack:** Gatsby 5, React 18, SCSS, browser scroll events, `requestAnimationFrame`, `IntersectionObserver`.

---

### Task 1: Reading Progress Indicator

**Files:**
- Create: `src/components/scroll-indicator/index.jsx`
- Create: `src/components/scroll-indicator/index.scss`
- Modify: `src/templates/blog-post.js`

- [ ] Render an aria-hidden fixed top bar on post pages.
- [ ] Calculate progress from `window.scrollY / (document height - viewport height)`.
- [ ] Batch scroll and resize updates with `requestAnimationFrame`.

### Task 2: Active Heading Highlight

**Files:**
- Modify: `src/components/table-of-contents/index.jsx`
- Modify: `src/components/table-of-contents/index.scss`
- Modify: `src/styles/light-theme.scss`
- Modify: `src/styles/dark-theme.scss`

- [ ] Toggle a class on the active `h2` or `h3` element using the existing TOC observer state.
- [ ] Remove the active class during cleanup and when the active heading changes.
- [ ] Style active headings with a subtle left bar and slight text emphasis without layout shift.

### Task 3: Verification

**Files:**
- No additional files.

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Verify generated HTML includes the scroll indicator and active heading styles in the production bundle.
