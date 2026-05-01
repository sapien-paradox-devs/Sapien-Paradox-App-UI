# Reading Room — Design & Implementation Plan

> **Audience:** Engineers implementing the Reading Room feature.
> **Status:** Locked design, ready for build.
> **Last updated:** 2026-04-27

---

## 1. What we're building

A **single-user, token-gated reading chamber** where an authorized Sapien opens one Shard (PDF) at a time. The room is the visual signature of the product — quiet, ethereal, focused.

**Design north star:** Apple-clean. Solid and stylish, not fancy. The content is the design. Avoid decorative effects that don't serve reading.

---

## 2. Locked decisions (the grill outputs)

| # | Decision | Choice |
|---|---|---|
| 1 | Scope | **Solo chamber now**, data model stays communal-ready (a future `ReadingSession` can group multiple `TemporalGrant`s). |
| 2 | Form factor | **Both fully designed.** Desktop = the showcase. Mobile = comfortable, not magical. |
| 3 | What's inside the room (MVP) | **PDF + focus mode + close. Nothing else.** No tempo dial in-room (pace is delivery cadence, not a reading control). No timers, no progress, no session metadata. |
| 4 | Entry path | **URL-only at `/r/:token`.** No embedded landing-flow opening. Single door. |
| 4.1 | Threshold ceremony | **Yes, ~2s, once per token.** First entry plays full ceremony; return entries play short pulse loader. Gate via `localStorage[reading-room.entered.<token>]`. |
| 5 | Validation cadence | **Entry-only.** No heartbeats. No mid-read interrupts. Anti-piracy is soft-touch. |
| 5.1 | Expired-token landing | **Quiet sanctuary** + discreet "request a new grant" deep-link to `/?book_id=<slug>`. |
| 6 | Desktop layout | **Centered ~720px column, floating chrome.** Close top-left, top-right reserved for future controls. Deep negative space on either side. |
| 7 | PDF rendering | **`react-pdf`** (pdf.js wrapper) with web worker. Iframe is retired. |
| 8 | Pace surfacing in-room | **Pace-agnostic.** Room knows nothing about Crawl/Steady/Soar. |
| 9 | Page navigation | **Continuous scroll, both platforms.** Lazy-load pages on intersection. |
| 10 | Ceremony style | **Soft pulse + Shard title**, ~2s, no skip button. |
| 11 | Focus mode | **Auto-fade chrome on idle (~3s)**, restore on mouse-move (desktop) or tap (mobile). No toggle button, no keyboard shortcut. |
| 12 | Close behavior | **→ landing page** with reverse-pulse exit (~600ms). |
| 13 | Routing | **`react-router-dom`**. Routes: `/`, `/r/:token`, `/?book_id=<slug>`. State machines drive in-route logic. |
| 14 | Mobile layout | **Full-screen route.** No bottom-sheet. No swipe-to-close. Same model as desktop, narrower column. |
| 15 | PDF surface treatment | **Pure white page on dark bg with subtle drop-shadow.** No glow, no parchment tint, no inversion. |
| 16/A2 | Loading microstates | **Animation as cover** — full ceremony absorbs first-entry latency; short pulse loader (~600ms) covers return-entry latency. No spinners, no skeletons. |
| 17 | Anti-piracy in-room | **Nothing extra.** Token gating is the line. No right-click disable, no watermark. |
| 18 | Failure modes | **Single sanctuary screen** for all three (token not found, time-expired, views-exhausted). Backend can collapse them server-side. |

### Future shelf (parked, do not build)

- 🔮 **Read-aloud (TTS)** — react-pdf's text extraction makes this clean later.
- 🔮 **AI chat panel (desktop only)** — uses negative space on the right of the column.
- 🔮 **Communal sessions** — multiple users in one Shard, synced cadence. Needs `ReadingSession` model + WebSocket presence.
- 🔮 **Margin notes / highlights**, **Constellation map**, **Ambient audio**.

---

## 3. End-to-end user flow

```
[Email link] /r/Abc123XyZ
      │
      ▼
┌──────────────────────────┐
│ App router → ReadingRoom │
└──────────────────────────┘
      │
      │  XState: state = "validating"
      │  GET /api/shards/validate/?token=Abc123XyZ
      │
      │  In parallel: Ceremony animation begins
      │  (full ceremony if first entry per localStorage,
      │   else short pulse loader)
      │
      ▼
┌──────────────────────────────────────────────┐
│ Validation result?                           │
├──────────────────────────────────────────────┤
│ valid   → state = "entering" → "reading"     │
│ expired → state = "expired" (sanctuary)      │
└──────────────────────────────────────────────┘
      │ (valid)
      ▼
┌──────────────────────────────────────────────┐
│ Reading state                                │
│  - PDF renders via react-pdf (continuous)    │
│  - Floating chrome: close (top-left)         │
│  - Chrome auto-fades after 3s idle           │
│  - Mouse-move / tap restores chrome          │
└──────────────────────────────────────────────┘
      │
      │  User taps close
      ▼
┌──────────────────────────┐
│ Reverse-pulse exit ~600ms│
│ Navigate → /             │
└──────────────────────────┘
```

### Failure path (expired)

```
state = "expired"
  → render Sanctuary screen
  → single soft message: "This chamber has closed."
  → discreet link: "Request a new grant" → /?book_id=<shard.slug>
```

### Return entry (token already entered before)

```
/r/:token
  → localStorage check finds entered:<token>
  → skip full ceremony
  → short pulse loader (~600ms) covers validation + PDF fetch
  → straight to "reading"
```

---

## 4. Visual design

### 4.1 Theme tokens (already in `index.css`, reuse)

- `--bg-primary: #06050e` — room background
- `--accent-violet`, `--accent-gold` — for ceremony pulse
- Glass surfaces via `--bg-glass`, `--bg-glass-strong`

### 4.2 Desktop layout (≥1100px)

```
┌────────────────────────────────────────────────────────┐
│  ✕                                                      │  ← close (top-left, 24px from edge)
│                                                         │     auto-fades on idle
│           ┌─────────────────────────────┐               │
│           │                             │               │
│           │                             │               │
│           │      PDF page (white)       │               │
│           │      720px wide             │               │
│           │      drop-shadow            │               │
│           │      0 8px 40px rgba(0,0,0, │               │
│           │      0.5)                   │               │
│           │                             │               │
│           │                             │               │
│           └─────────────────────────────┘               │
│           ┌─────────────────────────────┐               │
│           │      next page              │               │
│           │      ...                    │               │
│           └─────────────────────────────┘               │
│                                                         │
└────────────────────────────────────────────────────────┘
       ↑                                       ↑
   reserved for                          reserved for
   future: nav/notes                     future: AI chat
```

- Column: `max-width: 720px`, centered horizontally, top-padding `64px`, bottom-padding `128px`.
- Page gap: `48px` between PDF pages.
- Page card: `box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5)`, `border-radius: 4px`.
- Close button: `40x40px` glass circle, top-left, fixed.
- Top-right and side gutters: empty in MVP, reserved for future.

### 4.3 Mobile layout (<768px)

```
┌────────────────────┐
│  ✕                 │  ← close (top-left, fixed)
│                    │     auto-fades on idle
│  ┌──────────────┐  │
│  │              │  │
│  │   PDF page   │  │
│  │   100% width │  │
│  │   - 32px     │  │
│  │              │  │
│  └──────────────┘  │
│  ┌──────────────┐  │
│  │   next page  │  │
│  └──────────────┘  │
│                    │
└────────────────────┘
```

- Column: `width: calc(100% - 32px)`, `padding: 16px`.
- Page gap: `24px`.
- Same close button, same auto-fade behavior.
- No swipe-to-close, no bottom sheet, no gestures. Tap close to leave.

### 4.4 PDF page treatment

- Background: `#ffffff` (pure white).
- Drop shadow: `0 8px 40px rgba(0, 0, 0, 0.5)` (lifts page off the dark bg).
- Border radius: `4px`.
- No filters, no tint, no glow, no overlay.

### 4.5 Sanctuary screen (expired)

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│                                        │
│         This chamber has closed.       │
│                                        │
│           Request a new grant          │  ← link to /?book_id=<slug>
│                                        │
│                                        │
└────────────────────────────────────────┘
```

- Centered vertically and horizontally.
- Title: 28px, `--text-primary`, weight 400.
- Link: 14px, `--accent-violet`, underline on hover.
- Same dark background as room. No ceremony, no chrome.

---

## 5. Animations

All animations use **Framer Motion** and adhere to the project's "Variable Velocity" easing: fast start, slow settle. Recommended easing: `[0.16, 1, 0.3, 1]` (cubic-bezier).

### 5.1 Entry ceremony (first entry per token, ~2.0s)

```
t=0     Black screen, no chrome
t=0.0   Single dot of light at viewport center, scale 0
t=0.3   Dot scales up to ~12px, soft glow (violet-gold gradient)
t=0.6   Pulse ring expands from dot to ~600px diameter, fading out
t=0.8   Shard title fades in below the dot, 18px, weight 300
t=1.5   Title and dot fade out
t=1.8   PDF column fades up from below (translateY 20 → 0)
t=2.0   Reading state active, chrome visible
```

On completion: write `localStorage.setItem('reading-room.entered.<token>', '1')`.

### 5.2 Return pulse loader (subsequent entries, ~600ms)

```
t=0     Black screen
t=0.0   Soft pulse ring expands from center, single beat
t=0.4   Ring dissolves
t=0.5   PDF column fades up
t=0.6   Reading state active
```

No title, no extended dot. Just a beat.

### 5.3 Reverse-pulse exit (~600ms)

```
t=0     PDF column fades down (opacity 1 → 0, translateY 0 → 20)
t=0.3   Single contracting pulse from screen center inward
t=0.6   Black screen, navigate to /
```

### 5.4 Chrome auto-fade

- Chrome starts visible.
- 3000ms timer starts on mount and resets on `mousemove` (desktop) / `touchstart` (mobile).
- On timeout: chrome fades out over 400ms (`opacity 1 → 0`, `pointer-events: none`).
- On interaction: chrome fades in over 200ms.

---

## 6. Component architecture

```
src/pages/reading-room/
├── index.tsx                  # ReadingRoom page component
├── machine/
│   ├── machine.ts             # Pure createMachine definition
│   ├── actions.ts             # `export const actions = { ... }`
│   ├── actors.ts              # validateGrant fromPromise
│   ├── guards.ts              # individual named exports (isFirstEntry)
│   └── index.ts               # composes via .provide({...})
├── components/
│   ├── EntryCeremony.tsx      # Full ceremony animation
│   ├── ReturnPulse.tsx        # Short pulse loader
│   ├── ExitPulse.tsx          # Reverse-pulse exit
│   ├── PdfColumn.tsx          # react-pdf <Document> + <Page>s, lazy-loaded
│   ├── FloatingChrome.tsx     # Close button + auto-fade behavior
│   └── Sanctuary.tsx          # Expired-state screen
└── ReadingRoom.css            # Scoped styles
```

`App.tsx` becomes:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/landing";
import { ReadingRoom } from "./pages/reading-room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/r/:token" element={<ReadingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 7. State machine

Following project conventions (`/frontend/CLAUDE.md` + saved style memory): simple TS, no `satisfies`, guards as named exports, actions/actors as objects.

### 7.1 States

```
readingRoomMachine
├── validating          (initial; invokes validateGrant)
├── entering            (ceremony playing; full or pulse based on isFirstEntry)
├── reading             (PDF visible)
│   └── chrome (parallel sub-machine)
│       ├── visible     (default; transitions to hidden on IDLE_TIMEOUT)
│       └── hidden      (transitions to visible on INTERACT)
├── exiting             (reverse-pulse playing; on done, navigate to /)
└── expired             (terminal; renders Sanctuary)
```

### 7.2 Context

```ts
{
  token: string;
  shard: { id: string; title: string } | null;
  isFirstEntry: boolean;
  numPages: number | null;          // assigned on PDF_LOADED
}
```

> **Mandate enforcement:** every piece of flow-relevant state lives here. No `useState` in any Reading Room component for load status, page count, validation result, ceremony progress, or chrome visibility.

### 7.3 Events

- `VALIDATED_OK` (from actor done event)
- `VALIDATED_EXPIRED` (from actor done event with status="expired")
- `CEREMONY_DONE`
- `PDF_LOADED` (payload: `{ numPages: number }`) — emitted from `PdfColumn` when `<Document>`'s `onLoadSuccess` fires
- `LOAD_FAILED` — emitted from `PdfColumn` when `<Document>`'s `onLoadError` fires; transitions to `expired`
- `INTERACT` (mousemove / touchstart)
- `IDLE_TIMEOUT`
- `CLOSE`
- `EXIT_DONE`

### 7.4 Actor

```ts
// actors.ts
export const actors = {
  validateGrant: fromPromise(async ({ input }) => {
    return mappedFetcher.get(`/shards/validate/?token=${input.token}`);
  }),
};
```

### 7.5 Guards

```ts
// guards.ts
export const isFirstEntry = ({ context }) =>
  !localStorage.getItem(`reading-room.entered.${context.token}`);

export const isValidationOk = ({ event }) =>
  event.output.status === "valid";
```

### 7.6 Actions

```ts
// actions.ts
export const actions = {
  assignShard: assign(({ event }) => ({
    shard: { id: event.output.shard_id, title: event.output.title },
  })),
  assignNumPages: assign(({ event }) => ({
    numPages: event.numPages,
  })),
  markEntered: ({ context }) => {
    localStorage.setItem(`reading-room.entered.${context.token}`, "1");
  },
  navigateToLanding: () => {
    window.location.href = "/";
  },
};
```

---

## 8. API contracts

**No backend changes required for MVP.** Existing endpoints suffice:

### 8.1 `GET /api/shards/validate/?token=<token>`

**Response (valid):**
```json
{
  "status": "valid",
  "shard_id": "<slug>",
  "expires_at": "2026-05-01T12:00:00Z",
  "title": "<shard title>"
}
```

**Response (any failure — token not found, time-expired, views-exhausted):**
```json
{ "status": "expired" }
```

> Backend tweak (small): `validate_shard` currently uses `get_object_or_404`, which would return HTTP 404 for missing tokens. Per Q18, we want a unified `{status: "expired"}` for all three failure modes. Change: replace `get_object_or_404` with a `get + try/except DoesNotExist` returning `{status: "expired"}`.

### 8.2 `GET /api/shards/stream/?token=<token>`

Already serves the PDF as `FileResponse`. Used as the `file` prop for react-pdf's `<Document>`. Increments `current_views` once per fetch (one fetch per `<Document>` mount).

> ⚠️ **Operational note:** With `max_views=5`, every refresh costs 1 view. Tune `max_views` upward when issuing grants if you expect users to come back across multiple sessions. Not a code change — just an admin-side awareness.

---

## 9. Implementation checklist

**Phase 1 — plumbing**
- [ ] Add `react-router-dom` to `frontend/package.json`.
- [ ] Add `react-pdf` + worker config to Vite (see react-pdf docs for vite worker setup).
- [ ] Refactor `App.tsx` to use `BrowserRouter` with two routes.
- [ ] Tweak `validate_shard` in `core/api.py` to return `{status:"expired"}` for missing tokens (instead of 404).

**Phase 2 — machine**
- [ ] Scaffold `src/pages/reading-room/machine/` per the file split convention.
- [ ] Implement states, actors, guards, actions per §7.
- [ ] Unit test transitions: validating → entering → reading; validating → expired.

**Phase 3 — components**
- [ ] `ReadingRoom/index.tsx` — wires `useMachine` to UI states.
- [ ] `EntryCeremony` — Framer Motion sequence per §5.1.
- [ ] `ReturnPulse` — per §5.2.
- [ ] `ExitPulse` — per §5.3.
- [ ] `PdfColumn` — react-pdf `<Document>` + `<Page>` stack with `IntersectionObserver` lazy-loading.
- [ ] `FloatingChrome` — close button + idle-timer auto-fade per §5.4.
- [ ] `Sanctuary` — per §4.5.

**Phase 4 — strings & polish**
- [ ] Add reading-room labels to `src/lib/labels.ts` (per "Zero Hardcoded Strings" mandate).
- [ ] Mobile QA pass (full-screen route, scroll behavior, chrome auto-fade on touch).
- [ ] Sanity-check the deep-link `/?book_id=<slug>` actually pre-selects the book on the landing page.

**Phase 5 — cleanup**
- [ ] Remove the existing landing-flow `ShardView` overlay path (`state.context.shard` rendering in `pages/landing/index.tsx`). Reading room is a real route now; the dev-mock overlay should not ship.

---

## 10. Engineering mandates this plan honors

From `CLAUDE.md`:
1. ✅ **Zero Hardcoded Strings** — all reading-room copy goes in `labels.ts`.
2. ✅ **Machine-First Logic** — full XState machine drives the room.
3. ✅ **Temporal Security** — PDF served only via `/api/shards/stream/?token=`. No raw URLs.
4. ✅ **Variable Velocity** — animations use fast-start, slow-settle easing.
