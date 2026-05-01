# Login screen — `/login`

**Domain:** auth
**Type:** screen (frontend)
**Status:** drafting

## Purpose

Sign-in surface for returning Readers. Email + password → session.

## Current state

- `frontend/src/components/app/LoginPage.tsx` exists as a role-picker mock (Reader / Admin buttons; no auth, no API call). Will be superseded.
- No real `/login` route; `App.tsx` renders `<AppShell />` directly with no router.

## Future plan

- Route: `/login` (added to React Router setup as part of this domain's tickets).
- Sections:
  - Header / eyebrow.
  - Email input.
  - Password input.
  - Submit button.
  - Inline error display (wrong creds; locked-account future).
  - Secondary link: "Back to /" (no "forgot password" link in MVP — strict-auth deferred).
- Behavior:
  - Submit → `POST /api/auth/login` with `{email, password}`.
  - Success → set session cookie, redirect to `/profile`.
  - 401 → display generic error ("invalid credentials"); clear password field.
  - 5xx → display generic "couldn't sign in, try again."
  - Visiting `/login` while already authenticated → redirect to `/profile`.
  - Submit on Enter key.
  - Disable submit while in flight (machine state).
- All copy via `labels.ts` per Zero-Hardcoded-Strings mandate.
- Behind a `loginMachine` (XState) per the project mandate.

## Dependencies

- Needs: `endpoints.md` (login endpoint), `user-model.md` (User row to validate against).
- Used by: returning Readers from the landing page "Sign in" entry.

## Open questions

1. Where on `/` does the "Sign in" entry live (top-right corner button, footer link, both)? Resolved when landing screen is specced.
2. Does `/login` show a "Don't have an account? Sign up" link back to `/`? Recommendation: yes — direct returning visitors who landed here by mistake.

## Notes for designer / implementer

- Centered, minimal — Apple-clean per project mandate.
- Single column. No imagery beyond background.
- Reuse `index.css` design tokens; no new visual language.
