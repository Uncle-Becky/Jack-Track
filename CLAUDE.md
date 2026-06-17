# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR (port varies; printed on startup).
- `npm run build` — production build into `dist/`.
- `npm run preview` — serve the built `dist/` for smoke-testing.
- `npm run lint` — ESLint over `**/*.{js,jsx}` (flat config in `eslint.config.js`, extends `js.configs.recommended` + react-hooks + react-refresh/vite). No test runner is configured.

## Architecture

Single-page React 19 + Vite 8 app. All state is client-side; nothing is fetched from a network. The app is a personal monthly expense tracker for "Jack."

**Tailwind v4 wiring (non-standard).** Tailwind is loaded via `@tailwindcss/vite` — there is no `tailwind.config.js` and no PostCSS config. `src/index.css` is one line: `@import "tailwindcss";` followed by `@variant dark (&:is(.dark *));`. That custom `@variant` overrides Tailwind's default `prefers-color-scheme` dark variant so the `dark:` utility instead triggers when an ancestor (specifically `<html>`) has class `dark`. App.jsx toggles that class from `settings.darkMode` — do not switch to a media-query variant or add a `tailwind.config.js` without understanding this.

**State + persistence.** `useLocalStorage(key, initial)` in `src/hooks/useLocalStorage.js` is the single persistence primitive. Three top-level slices in `App.jsx`:
- `expenses` — array, key `EXPENSES_KEY` (current: `jack-expense-tracker-v2`)
- `budgets` — `{ [category]: number }`, key `BUDGETS_KEY`
- `settings` — `{ darkMode, customCategories }`, key `SETTINGS_KEY`

A `loadInitialExpenses()` helper in `App.jsx` migrates from `OLD_EXPENSES_KEY` (`jack-monthly-expense-tracker-v1`) when the v2 key is empty, and otherwise seeds `SEED_EXPENSES` from `src/utils/constants.js`. Keep this migration path intact when changing the shape — bumping `EXPENSES_KEY` again means writing another fallback.

**Expense shape.** `{ id, name, category, amount, month: 'YYYY-MM', notes, createdAt, isRecurring }`. `month` is a `YYYY-MM` string everywhere — month arithmetic goes through `currentMonth/prevMonth/nextMonth/lastNMonths` in `src/utils/helpers.js`, never through raw `Date` math in views.

**View router.** No `react-router`. `App.jsx` holds an `activeView` string and renders one of five views (`overview`, `expenses`, `analytics`, `budgets`, `settings`) wrapped in framer-motion's `AnimatePresence`. `Navigation` (bottom tab bar) sets `activeView`. New views are added by extending the `views` map in `App.jsx` and the tabs in `Navigation`.

**Categories + colors.** The active category list is `[...DEFAULT_CATEGORIES, ...settings.customCategories]`, assembled in `App.jsx` and passed down as `categories`. `getCategoryColor` / `getCategoryBadge` in `src/utils/constants.js` derive a color from the category's *index* in that combined array — reordering `DEFAULT_CATEGORIES` or how the merge is built will reshuffle every chart and badge across the UI.

**Destructive actions go through ConfirmModal → Toast undo.** Delete flow: row triggers `handleDelete` → sets `pendingDelete` → `ConfirmModal` confirms → `executeDelete` removes the expense and calls `showToast(msg, undoFn)` where `undoFn` re-inserts it. `useToast` (`src/hooks/useToast.js`) keeps a single active toast with a 5s auto-dismiss timer. Match this pattern (confirm → execute → toast with undo) for any new destructive action rather than deleting inline.

**Import/export.** `exportJSON`, `exportCSV`, `importJSON` in `src/utils/helpers.js` use synthetic `<a download>` / `<input type=file>` elements — they only work in a real browser, not under SSR or jsdom.

## Termux-specific notes

This project lives under Termux on Android (see global `~/.claude/CLAUDE.md`). `npm run dev` binds to localhost; preview it from a Termux-side browser or Termux:X11 — there is no LAN exposure by default.
