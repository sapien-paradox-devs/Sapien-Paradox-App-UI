# Active planning state — frontend

> Auto-loaded each session by `.claude/hooks/session-start.sh`.
> Update whenever a cross-cutting decision lands, focus shifts, or a new open question surfaces.
> Domain-specific decisions live in `components/<domain>/*.md`, NOT here. STATE.md is cross-cutting only.
>
> **Note:** This is the frontend slice. The backend repo has its own `plans/STATE.md` covering API/data state. Keep cross-cutting locks below in sync between the two when product-level decisions land.

**Last updated:** 2026-05-01
**Mode:** **Prototype-first.** Lock the happy flow at the basic-shape level (no concrete structure — decisions may change once the team weighs in) and build a working demo end-to-end. Detail-level grilling deferred until after the prototype lands.
**Active focus:** Happy-flow grilling **closed**. Pivoting to ticket creation in `plans/tickets/`.
**Next action:** Draft prototype tickets covering the frontend slice of the happy flow (landing form with password+phone, Stripe redirect, welcome screen, `/profile` page, `/login` page, `/r/:token` reading room, Sanctuary state). ~5–7 frontend tickets expected.

---

## Locked decisions (cross-cutting)

1. **Plans live in `plans/` as a tree.** Shape: `STATE.md`, `README.md`, `components/<domain>/*.md`, `integrations/*.md`, `tickets/*.md`, `_archive/`. No numeric prefixes. No separate architecture folder — `CLAUDE.md` files own architecture truth. Folders/files created lazily — only domains in active scope have folders.
2. **Plans = source of truth.** Edited in place. Domain decisions in `components/<domain>/*.md`. STATE.md is cross-cutting only.
3. **Existing tickets in `_archive/FRONTEND_PLAN.md` (FE-1..15) are reference, not canon.** We re-cut tickets from root.
4. **Tickets are heavyweight implementation specs.** File structure, function signatures (where useful), edge cases, test plan, acceptance, out-of-scope. Implementation should be straight-forward because the planning happened upstream.
5. **Tests fold into the implementing ticket's acceptance.** One slice-closer smoke-test ticket per slice for end-to-end coverage.
6. **Ticket file naming:** flat `plans/tickets/`, files `001-<slug>.md` (3-digit padded). Lane (FE/BE) in frontmatter.
7. **BFS over DFS.** Resolve root-level questions before descending. Within a level, exhaust all questions. One question at a time during grilling, with a recommended answer.
8. **Cover and document everything that exists.** Don't dismiss code as cruft. Disposition (replace, retain, delete) is part of each component spec's "Current state" section.
9. **Two personas: Reader and Admin.** Same signed-in surface for now. Admin gets distinct features later. "Visitor" is the unauthenticated entry state of a Reader.
10. **Auth is infrastructure, not a product pivot.** Product remains cadence-paced delivery (Crawl/Steady/Soar). Cadence channel is **WhatsApp via Twilio** (not email) — each unlocked chapter is delivered as a Twilio WhatsApp message containing a token-gated link to the secure PDF stream. Auth replaces "we know you by token" with "we know you by account." Token-gated chapter links remain self-authenticating (clicking a WhatsApp link does NOT require login). The in-app `/profile` exposes a re-read library of **already-unlocked** chapters only — never future ones. (This is not "library-on-demand" — it's reflective re-reading of earned content.)
11. **Workflow:** we plan → Claude Designer designs visuals → we implement. Plans specify *contents and behavior*, not visual styling.
12. **Canonical screens (only these for now):** Landing (`/`), Login (`/login`), Profile (`/profile`), Reading Room (`/r/:token`), Sanctuary (sub-state of Reading Room). No settings/billing/help/admin screens until scoped.
13. **Continuity / checkpoint system:** STATE.md is the resume file. Three hooks: `SessionStart` (auto-injects STATE.md, flags drift), `UserPromptSubmit` (marks turn boundary), `Stop` (per-turn nudge if plans/ touched without STATE.md sync). Model writes decisions as they land — does not accumulate across turns.
14. **Payments are real and gate signup.** One-time per-book purchase via Stripe Checkout (hosted page, redirect flow). Frontend impact: landing form POST creates a Stripe Checkout session and redirects; success URL → `/profile?welcome=1` (welcome screen variant); cancel URL → `/?book_id=<slug>` (landing pre-filled). No card UI to design. Detail in `components/payments/README.md`.

## Cross-domain open questions

1. **Three Reading Room concepts in current code, all different** — `ShardView` legacy iframe overlay, `ReadingRoomView` mock feed, planned `/r/:token`. Must converge to one. Resolved in `components/reading-room/`.
2. **Mock-auth scaffold in current code** (`AppShell.tsx`, `LoginPage.tsx`, `components/app/user/*`, `machines/app/`). Replaced by real auth. Disposition specifics in `components/auth/*.md` "Current state" sections.

## Working notes

- User prefers simple over fancy. Push back on overengineering by default. Add complexity only when it earns its keep.
- One question at a time during grilling. Always provide a recommended answer with reasoning.
- Token-gated WhatsApp links remain self-authenticating; auth adds account-based access on top, doesn't replace tokens for the link flow.
- Plans → tickets flow: never create tickets until parent component spec(s) are locked.
- Audit findings about current code drift are detailed in each component's "Current state" section — don't restate them here.

## Recent thread (frontend-relevant)

1. User clarified: tickets are heavyweight, plan from root to leaf, plans/ is tree, auth becomes real.
2. Reviewed plans/ tree proposal twice; landed on `components/<domain>/*.md` structure with optional domain README, separate `integrations/`, flat `tickets/`. Lazy folder creation.
3. Locked: 2 personas (Reader, Admin); same signed-in surface; basic email+password auth; cadence-paced product unchanged.
4. Locked: 5 canonical screens (Landing, Login, Profile, Reading Room, Sanctuary).
5. Set up continuity system: 3 hooks installed (`session-start.sh`, `user-prompt-submit.sh`, `stop.sh`), `.claude/.gitignore` for ephemeral markers, plans/ tree restructured. Auth domain skeleton populated in `components/auth/`.
6. User introduced payment-gated signup. Locked: Stripe Checkout (hosted page, not Elements). Frontend just redirects; no payment UI to design. `auth/signup-form.md` flagged for revision (adds password + phone fields; submit creates checkout session, not User directly).
7. Mode shift: **prototype-first**. Stop deep structural planning. Lock the basic happy flow only, build a working demo, defer detailed component specs. Existing component .md files are reference, not gospel.
8. Frontend-side happy flow:
   - `/` (landing form — adds **password** AND **phone** fields) → submit → redirect to Stripe Checkout → success → **welcome screen** (cadence framing copy + "Start reading" button) → `/r/:token` for chapter 1.
   - WhatsApp messages also fire from backend on every unlock; the frontend only renders `/r/:token` when a token link is opened.
9. Channel pivot: **WhatsApp via Twilio** (not email) is the cadence delivery channel. Frontend impact: phone field on landing form. In-app, `/profile` shows a **library of already-unlocked chapters** the user can re-read at any time (chapters 1..N where N is the highest-unlocked); future chapters are NOT visible in the library (preserves the "earn-then-revisit" cadence ethos, not library-on-demand).
10. `/profile` shape: single-screen home — small account block at top (name, email, phone, current book, pace, logout), body is a vertical list of unlocked chapters (title + "Chapter N" → click → `/r/:token`). No `/library` URL split. Prototype: titles + click only — no progress bars, badges, or thumbnails.
11. Chapter 1 unlocks immediately on Stripe payment success — the welcome screen's "Start reading" button takes the user straight to `/r/:token` for chapter 1.
12. **(this turn)** Grilling closed. Prototype happy flow is locked enough to ticket. Open at-ticket-time (non-blocking): login redirect target (default `/profile`), Sanctuary state copy.
