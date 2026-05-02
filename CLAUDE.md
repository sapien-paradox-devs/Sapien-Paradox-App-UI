# CLAUDE.md — Sapien Paradox Frontend

## Project Overview
A high-end, modular learning platform for "Intellectual Explorers." Focused on depth over velocity, digital monasticism, and temporal content delivery.

This repo is the **frontend**. The backend lives in a separate repo (`../backend`) with its own `plans/` and `.claude/`.

## Tech Stack
- **React** (Vite)
- **Framer Motion**
- **XState v5** (state machines)
- **Vanilla CSS**
- Backend API expected at `http://localhost:8000/api` (see `src/lib/fetcher.ts`).

## Technical Architecture Map (Living Document)
*Update this map when files are added or significantly refactored. Detailed deep-dive in `TECHNICAL_SUMMARY.md`.*

- `src/lib/labels.ts`: Centralized UI strings (non-dev editable).
- `src/lib/locale.ts`: Dot-notation utility for label access.
- `src/lib/fetcher.ts`: `mappedFetcher` — accepts an optional mapper function for response transformation.
- `src/pages/landing/machine/`: XState logic for the landing user flow.
- `src/components/landing/`: High-fidelity "Ethereal Architect" UI components.
- `src/pages/reading-room/`: Token-gated reading chamber at `/r/:token`. Renders one Shard via `react-pdf`, driven by `readingRoomMachine` (5-file split). States: `idle → loading → reading → sanctuary` (happy path); `invalid`/`locked`/`error` are terminal error branches. Last-page detection via `IntersectionObserver` (threshold 0.5).
- `src/pages/landing/ShardView.tsx` *(retiring)*: Legacy in-page PDF overlay. Replaced by `pages/reading-room/`; pending cleanup.
- `src/components/app/user/ReadingRoomView.tsx` *(retiring)*: Mock reading-room view inside the in-app shell. Dead code; pending cleanup once auth flows route to `/r/:token` directly.

## Routes
- `/`: Landing page (lead intake + book selection + pace).
- `/r/:token`: Reading Room. Token-gated, single-Shard reading chamber. Token IS the auth — route does not require login (cross-cutting decision #10).
- `/?book_id=<slug>`: Landing pre-filled with a book selection. Used by the expired-grant sanctuary screen as the "request a new grant" deep link.

## Key documents
- `plans/STATE.md`: **Active planning state. Auto-injected each session by the SessionStart hook. Read first when resuming planning or design work.**
- `plans/README.md`: Folder map and conventions.
- `plans/components/<domain>/*.md`: Per-component specs (screens, services, machines). Loaded on demand when working on that domain.
- `plans/_archive/`: Original plans (DEVELOPMENT_PLAN, FRONTEND_PLAN, READING_ROOM_PLAN). Frozen reference; superseded by re-planning under `components/`.

## Active planning — Claude as owner

`plans/` is the source of truth. Three hooks make Claude an autonomous owner across sessions:

- **`SessionStart`** auto-injects `plans/STATE.md` into context and flags any `plans/**` files newer than `STATE.md` (a leftover from a prior session that ended abruptly — reconcile early).
- **`UserPromptSubmit`** marks each turn boundary so the Stop hook knows what was touched THIS turn.
- **`Stop`** soft-blocks at end of turn if any `plans/**` file was modified but `STATE.md` was not — interpret as a checkpoint prompt: either update `STATE.md` (cross-cutting decisions, focus shift, open questions) or reply acknowledging no STATE.md change is needed.

**Discipline (the checkpoint contract):**

- When a decision lands in conversation, write it to the relevant `components/<domain>/*.md` AND update `STATE.md` if cross-cutting — *immediately*, not at end of turn. Sessions can end abruptly; do not accumulate decisions across turns.
- When focus shifts, update `STATE.md` "Active focus" and "Next action" before continuing.
- Domain-specific decisions live in `components/<domain>/*.md`. STATE.md only carries cross-cutting locks.
- **Cross-repo sync:** when a cross-cutting product decision lands here, mirror the lock list in the backend repo's `plans/STATE.md` so both sides stay aligned.

**Style:** BFS grilling — root before leaves, exhaust a level before descending. One question at a time, with a recommended answer. Plans → tickets only after the parent component spec(s) are locked.

**Workflow:** plan (here) → Claude Designer (visuals) → implement.

## Development Commands
```bash
npm run dev        # Vite dev server on port 5173
npm run build      # tsc -b && vite build
npm run lint       # eslint
```

## Architecture — State Machines

The app is driven by XState v5 state machines. Each machine follows this pattern:

- `machine/machine.ts` — pure `createMachine({...})` definition only, no implementations
- `machine/actions.ts` — `assign(({ context, event }) => {...})` style, exported as named object (`export const actions = { ... }`)
- `machine/actors.ts` — `fromPromise(async () => mappedFetcher.get(...))` style, exported as named object
- `machine/guards.ts` — individual named exports (`export const isAuthenticated = ...`), imported via `import * as guards`
- `machine/index.ts` — composes everything: `appMachine.provide({ actions, actors, guards })`

The provided machine is consumed in components via `useMachine(machine)` returning `[state, send]`.

## Code Style Preferences

- Keep TypeScript simple — avoid `satisfies`, explicit generic params on fetcher calls, or wrapper types like `AppContext` in action/guard signatures. Just use `({ context, event })`.
- Guards are individual named exports; actions and actors are properties on a single exported object.

## Engineering Mandates
1. **Zero Hardcoded Strings**: All UI text must go in `labels.ts`.
2. **Machine-First Logic**: Complex UI states must use XState, not component-level `useState`.
3. **Temporal Security**: Never expose raw Google Drive/S3 links; always proxy via the backend's `/api/shards/stream/`.
4. **Visual Standard**: Animations must adhere to "Variable Velocity" (fast start, slow settle).
