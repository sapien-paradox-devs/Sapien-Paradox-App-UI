# Frontend Development Plan

> **Audience:** Frontend engineers picking up tickets from this plan.
> **Scope:** All UI work across Slices 1–5 from `/DEVELOPMENT_PLAN.md`.
> **Conventions:** See `/CLAUDE.md` and `/frontend/CLAUDE.md`. Non-negotiable.

---

## 1. Architectural overview

### 1.1 Stack (locked)
- **React 18** (Vite, TypeScript).
- **`react-router-dom` v6** — routing (added in Slice 1).
- **XState v5** — all non-trivial UI state. No component-level `useState` chains for flow logic.
- **Framer Motion** — all transitions and ambient animations.
- **`react-pdf`** — PDF rendering in Reading Room (added in Slice 1).
- **Vanilla CSS** — no Tailwind, no styled-components. CSS variables for theming.

### 1.2 Folder structure (target after Slice 2)

```
frontend/src/
├── App.tsx                           # Router root
├── main.tsx
├── index.css                         # Theme tokens, base resets
├── App.css                           # Landing-page styles (legacy, eventually split)
│
├── lib/
│   ├── labels.ts                     # All UI strings (Zero Hardcoded Strings mandate)
│   ├── locale.ts                     # locale() dot-notation accessor
│   ├── fetcher.ts                    # mappedFetcher; central API client
│   └── types.ts                      # Shared TS types (Book, Shard, Grant, etc.)
│
├── components/
│   ├── landing/                      # Landing-page UI (existing)
│   │   ├── LandingHero.tsx
│   │   ├── BooksShowcase.tsx
│   │   ├── ModularEngine.tsx
│   │   ├── PaceSelector.tsx
│   │   └── SignUpDialog.tsx
│   ├── reading-room/                 # Reading Room UI (Slice 1, new)
│   │   ├── EntryCeremony.tsx
│   │   ├── ReturnPulse.tsx
│   │   ├── ExitPulse.tsx
│   │   ├── PdfColumn.tsx
│   │   ├── FloatingChrome.tsx
│   │   └── Sanctuary.tsx
│   └── shared/                       # Cross-page primitives (created on demand)
│       └── (e.g. GlassButton, AmbientPulse)
│
├── pages/
│   ├── landing/
│   │   ├── index.tsx                 # LandingPage component
│   │   └── machine/                  # XState (existing)
│   │       ├── machine.ts
│   │       ├── actions.ts
│   │       ├── actors.ts
│   │       ├── guards.ts
│   │       ├── services.ts
│   │       ├── fields.ts
│   │       └── index.ts
│   └── reading-room/                 # Slice 1, new
│       ├── index.tsx
│       └── machine/
│           ├── machine.ts
│           ├── actions.ts
│           ├── actors.ts
│           ├── guards.ts
│           └── index.ts
│
└── styles/                           # New — split monolithic App.css here
    ├── landing.css                   # Slice 2 cleanup: extract from App.css
    └── reading-room.css              # Slice 1
```

> **Rule:** A page module owns its machine. Components live in `/components/<page>/` if they're page-specific, `/components/shared/` if they're reused across pages. Don't put Reading Room components inside `/pages/reading-room/components/` — keep all reusable visuals under `/components/`.

### 1.3 Routes (post-Slice 1)

| Path | Page | Notes |
|---|---|---|
| `/` | `LandingPage` | Existing. Accepts `?book_id=<slug>` to pre-select a book (Slice 2). |
| `/r/:token` | `ReadingRoom` | New (Slice 1). |
| `*` | (none yet) | 404 fallback. Defer until Slice 5+. |

### 1.4 State machine inventory

| Machine | Location | Purpose | Slice |
|---|---|---|---|
| `landingMachine` | `pages/landing/machine/` | Lead capture flow, book selection, pace, form submit. *(exists)* | 1 |
| `readingRoomMachine` | `pages/reading-room/machine/` | Validation → ceremony → reading → exit. Parallel sub-machine for chrome auto-fade. | 1 |

> **Convention:** Each machine has 5 files (`machine.ts`, `actions.ts`, `actors.ts`, `guards.ts`, `index.ts`) — see `/frontend/CLAUDE.md` for the split rationale. Do not deviate.

---

## 2. Component inventory + specs

### 2.1 Existing components — keep as-is unless flagged

| Component | File | Status |
|---|---|---|
| `LandingHero` | `components/landing/LandingHero.tsx` | Keep. |
| `BooksShowcase` | `components/landing/BooksShowcase.tsx` | **Slice 2:** swap hardcoded books for `/api/books/` data. Add `?book_id=` deep-link support. |
| `ModularEngine` | `components/landing/ModularEngine.tsx` | Keep. |
| `PaceSelector` | `components/landing/PaceSelector.tsx` | Keep. **Future:** add inline copy clarifying "this is your delivery cadence, not reading speed." |
| `SignUpDialog` | `components/landing/SignUpDialog.tsx` | Keep. |
| `ShardView` | `pages/landing/ShardView.tsx` | **Retire in Slice 1.** Replaced by Reading Room route. |

### 2.2 New components — Reading Room (Slice 1)

#### `EntryCeremony.tsx`
- **Purpose:** First-entry threshold animation (~2.0s).
- **Props:** `{ title: string, onDone: () => void }`.
- **Behavior:** Per `/READING_ROOM_PLAN.md` §5.1. Renders centered pulse + title fade. Calls `onDone` at t=2.0s.
- **DOM:** Single full-viewport overlay. Black background. Two motion children (dot, title).
- **No internal state.** All animation timing in Framer Motion sequences.

#### `ReturnPulse.tsx`
- **Purpose:** Subsequent-entry loader (~600ms).
- **Props:** `{ onDone: () => void }`.
- **Behavior:** Per `/READING_ROOM_PLAN.md` §5.2. One pulse beat, no title.

#### `ExitPulse.tsx`
- **Purpose:** Reverse-pulse on close (~600ms).
- **Props:** `{ onDone: () => void }`.
- **Behavior:** Per `/READING_ROOM_PLAN.md` §5.3. Mirror of entry pulse but contracting. Triggers navigation on done.

#### `PdfColumn.tsx`
- **Purpose:** Renders the actual PDF using `react-pdf`. **Machine-driven; no internal flow state.**
- **Props:** `{ token: string, numPages: number | null, onLoaded: (numPages: number) => void, onLoadFailed: () => void }`.
- **Behavior:**
  - Mounts `<Document file={`/api/shards/stream/?token=${token}`} />`.
  - On `onLoadSuccess({numPages})` → calls `props.onLoaded(numPages)`. The page-component does **not** store this in local `useState`; it's the machine's job (assigned to `context.numPages`).
  - On `onLoadError` → calls `props.onLoadFailed()`. The page-component dispatches `LOAD_FAILED` to the machine; this component renders nothing extra.
  - Renders `<Page pageNumber={n} />` for `n = 1..props.numPages` (read from machine context). If `numPages` is null, render nothing — the machine is in a state where the doc isn't ready.
  - **Lazy-load:** wrap each `<Page>` in an `IntersectionObserver` so off-screen pages don't render canvases until needed. Use `react-intersection-observer` if it simplifies this; otherwise a 30-line custom hook. **The "is this page in viewport" boolean is local DOM-render state, not flow state — `useState` is acceptable here per the mandate ("trivial UI state").**
  - **Page width:** 720px desktop, `100% - 32px` mobile (CSS-driven, not prop-driven).
  - **Drop shadow:** `0 8px 40px rgba(0,0,0,0.5)`, `border-radius: 4px`.
- **No `useState` for**: page count, load status, error state. All in the machine.

#### `FloatingChrome.tsx`
- **Purpose:** Close button + auto-fade behavior.
- **Props:** `{ onClose: () => void, visible: boolean }`.
- **Behavior:**
  - Renders the close icon (top-left desktop + mobile).
  - `visible` is driven by the parallel sub-machine in `readingRoomMachine`. The component itself has no timer logic — it just animates opacity based on the prop.
  - Listens globally (in the page, not this component) for `mousemove`/`touchstart` and dispatches `INTERACT` to the machine.
- **Top-right slot:** intentionally empty in MVP. Future home for AI-chat toggle (F2). Don't add markup; CSS keeps it reserved.

#### `Sanctuary.tsx`
- **Purpose:** Expired-token landing screen.
- **Props:** `{ shardSlug: string | null }`.
- **Behavior:**
  - Renders the locked copy ("This chamber has closed.") + link to `/?book_id=<shardSlug>` (Slice 2 makes this useful; in Slice 1 it deep-links to the landing page with the book preselected — graceful even if the book mapping isn't wired yet).
  - If `shardSlug` is null (token didn't validate at all), link goes to `/`.
- **DOM:** Single centered block. No chrome, no animation, no ambient pulse.

### 2.3 Existing pages

#### `LandingPage` (`pages/landing/index.tsx`)
- **Slice 1 cleanup:** remove the `state.context.shard && <ShardView ... />` overlay path (lines 129–134 of current file). Reading Room is a real route now.
- **Slice 2:**
  - Read `?book_id=<slug>` query param on mount and dispatch `SET_BOOK` to landing machine.
  - Replace the hardcoded `state.context.books` with data from `/api/books/`. Use a new actor in the landing machine for the fetch.

### 2.4 New page — `ReadingRoom` (`pages/reading-room/index.tsx`)
- **Responsibility:** Wire `useMachine(readingRoomMachine)` to the right sub-component for the current state.
- **Render map:**
  - `validating` → null OR (if `isFirstEntry`) `<EntryCeremony />`, (else) `<ReturnPulse />`. Validation runs in parallel.
  - `entering` → continue ceremony. (Same component as `validating` if first entry.)
  - `reading` → `<PdfColumn />` + `<FloatingChrome />`.
  - `exiting` → `<ExitPulse />`.
  - `expired` → `<Sanctuary />`.
- **Keyboard:** no shortcuts in MVP. (Future: `Esc` for close.)
- **Mouse/touch listeners** for chrome restoration are added at this page level via `useEffect`, not inside `FloatingChrome`.

---

## 3. State machine specs

### 3.1 `readingRoomMachine` (Slice 1)

Full spec lives in `/READING_ROOM_PLAN.md` §7. Frontend ticket-level reminders:

- **States:** `validating`, `entering`, `reading` (with parallel chrome sub-machine), `exiting`, `expired`.
- **Context:** `{ token, shard, isFirstEntry }`.
- **Actor:** `validateGrant` (fromPromise → `mappedFetcher.get('/shards/validate/?token=...')`).
- **Guards:** `isFirstEntry` (reads `localStorage`), `isValidationOk` (event output check).
- **Actions:** `assignShard`, `markEntered`, `navigateToLanding`.
- **Idle timer:** XState `after: { 3000: { target: 'hidden' } }` on the chrome sub-machine.

### 3.2 `landingMachine` updates (Slice 2)

- **New actor:** `loadBooks` → `mappedFetcher.get('/books/')`. Invoked on machine entry. Initial state becomes `loadingBooks` → `idle`.
- **New event:** `BOOK_FROM_QUERY` (event from URL parsing on page mount). Sets `selectedBookId` if the slug matches a loaded book.
- **No breaking changes** to the form flow. Event names remain stable.

---

## 4. Styling

### 4.1 Tokens (`index.css`, already present)
Leave existing tokens alone. They're well-chosen and consistent.

### 4.2 Reading Room styles (Slice 1)

Create `frontend/src/styles/reading-room.css`. Imported once from `pages/reading-room/index.tsx`. Owns:

- `.reading-room` (full-viewport dark container)
- `.reading-room__column` (centered, max-width 720, padding)
- `.reading-room__page` (PDF page card with drop-shadow)
- `.floating-chrome` and its visibility states
- `.entry-ceremony`, `.return-pulse`, `.exit-pulse` (animation containers)
- `.sanctuary` (expired screen)

> **Don't bloat `App.css`.** It already has 1300+ lines; further additions go in scoped files.

### 4.3 Mobile rules
- All Reading Room layouts mobile-first within `reading-room.css`. Single `@media (min-width: 1100px)` block for desktop overrides.
- No swipe gestures, no bottom-sheet — see `/READING_ROOM_PLAN.md` §4.3.

---

## 5. Shared concerns

### 5.1 Strings
- Every visible string in the Reading Room goes into `lib/labels.ts` under a `readingRoom.*` namespace:
  ```ts
  readingRoom: {
    sanctuary: { title: "...", action: "..." },
    ceremony: { /* (no copy in MVP — title comes from API response) */ },
  }
  ```
- Access via `locale("readingRoom.sanctuary.title")`. Never hardcode.

### 5.2 API client (`lib/fetcher.ts`)
- Existing `mappedFetcher` is the only HTTP entry point.
- Add a typed wrapper for the validate endpoint (Slice 1):
  ```ts
  export const validateGrant = (token: string) =>
    mappedFetcher.get(`/shards/validate/?token=${token}`);
  ```
- Add `loadBooks()` (Slice 2). Keep wrappers thin — they're for type-safety and a single edit point, not for caching or retry logic.

### 5.3 Types (`lib/types.ts`)
- Centralize `Book`, `Shard`, `Grant`, `ValidateResponse` here. Mirror backend Pydantic schemas, but don't generate — manual sync is fine for an app this size.

### 5.4 Error boundaries
- One top-level `ErrorBoundary` wrapping `<Routes>` in `App.tsx`. Add in Slice 1.
- Per-page boundaries are over-engineering for our scale.

---

## 6. Ticket-ready breakdown

> Each ticket below is one PR. Acceptance criteria are observable.

### Slice 1 — Reading Room MVP

| # | Ticket | Owner | Acceptance |
|---|---|---|---|
| FE-1 | Add `react-router-dom` to `package.json`; refactor `App.tsx` to `<BrowserRouter>` with `/` and `/r/:token` routes. | FE | Both routes load; `/` renders existing landing; `/r/:token` renders a placeholder. |
| FE-2 | Install + configure `react-pdf` (Vite worker). Render a sample PDF on `/r/test`. | FE | Sample PDF renders without console errors; worker file is bundled correctly. |
| FE-3 | Scaffold `pages/reading-room/machine/` per the 5-file convention. Implement `validating` → `entering` → `reading` → `exiting` and `expired` states. Mock the validate actor. | FE | Unit tests cover the four happy/sad transition paths. |
| FE-4 | Implement `EntryCeremony.tsx` per `/READING_ROOM_PLAN.md` §5.1. | FE | Storybook entry (or a `?ceremony=1` route flag) shows ~2s pulse; calls `onDone`. |
| FE-5 | Implement `ReturnPulse.tsx` and `ExitPulse.tsx`. | FE | Both render the documented animations and fire `onDone` at the right time. |
| FE-6 | Implement `PdfColumn.tsx` with continuous scroll + `IntersectionObserver` lazy-load. | FE | Multi-page PDF scrolls smoothly; off-screen `<Page>`s defer rendering (verify in DevTools). |
| FE-7 | Implement `FloatingChrome.tsx` with the chrome auto-fade behavior. | FE | Chrome fades after 3s of stillness; reappears on mousemove/tap. Toggle is machine-driven, not local state. |
| FE-8 | Implement `Sanctuary.tsx`. | FE | Renders centered copy, link href is `/?book_id=<slug>` when slug is present, `/` otherwise. |
| FE-9 | Wire `pages/reading-room/index.tsx` — useMachine → state-to-component map. | FE | Visiting `/r/:token` for a valid token shows ceremony → PDF; for an expired token shows Sanctuary. |
| FE-10 | Add reading-room labels to `lib/labels.ts`; replace any inline copy. | FE | `grep -r "This chamber" frontend/src/components` returns zero matches. |
| FE-11 | Retire `pages/landing/ShardView.tsx` and the overlay rendering in `pages/landing/index.tsx`. Remove unused imports/CSS. | FE | File is deleted; landing page still works; `npm run build` is clean. |
| FE-12 | Add a top-level `ErrorBoundary` wrapping `<Routes>`. | FE | Forced throw in a page renders a fallback, not a white screen. |

### Slice 2 — Book model integration

| # | Ticket | Owner | Acceptance |
|---|---|---|---|
| FE-13 | Add `loadBooks` actor to landing machine; replace hardcoded `books` array. | FE | Landing renders books fetched from `/api/books/`; loading state during fetch. |
| FE-14 | Parse `?book_id=<slug>` on landing mount; dispatch `SET_BOOK` if matches. | FE | Visiting `/?book_id=foo` pre-selects "foo" in `BooksShowcase`. |
| FE-15 | Update `Sanctuary.tsx` link to use the actual `shard.book.slug` once API exposes it. | FE | Expired-token sanctuary deep-links to the right book on the landing page. |

### Slices 3–5: backend-driven, FE has no work in 3 and 4. Slice 5 telemetry is BE-only at the API level (Reading Room emits no client events in MVP).

---

## 7. QA mandates

- **Per-PR:** `npm run lint`, `npm run build` clean.
- **Per-slice:** manual smoke test on iPhone-sized viewport (Chrome devtools) + desktop. The Reading Room must feel right on both before Slice 1 closes.
- **Animations:** test with `prefers-reduced-motion: reduce` — ceremonies should fall back to instant fades. (Add this in Slice 1, FE-4 acceptance.)
- **Lighthouse:** not gating, but the Reading Room should land >90 on Performance and Accessibility before shipping.

---

## 8. Anti-patterns (don't do)

- ❌ Don't reach for Redux, Zustand, or any state library beyond XState. Local component state is fine for trivial UI; flow state is XState.
- ❌ Don't add Tailwind, CSS-in-JS, or a component library. Vanilla CSS is the convention.
- ❌ Don't write inline copy. Every string in `labels.ts`.
- ❌ Don't render PDFs via `<iframe>` or `<embed>`. `react-pdf` only.
- ❌ Don't add per-page error boundaries unless one page genuinely needs isolation.
- ❌ Don't introduce a 4th file in any machine folder ("helpers.ts", "selectors.ts"). Five files. That's it. If you need helpers, they live in `actions.ts` or `lib/`.
- ❌ Don't pre-fetch the PDF binary. Let the browser handle it via `react-pdf`. No "warm-up" calls.
