# Signup form (extends landing SignUp dialog)

**Domain:** auth
**Type:** screen extension (frontend) + flow
**Status:** drafting — **pending revision** (signup is now payment-gated; see `components/payments/README.md`. The "Future plan" section below describes a direct `POST /api/auth/signup` flow that no longer applies — actual flow is form → Stripe checkout → webhook → `User` + `Order` created together. Will be rewritten once `payments/` Q1 + Q2 land.)

## Purpose

The existing landing SignUp dialog already captures name, email, book, pace, notes. With auth becoming real, it must also provision a `User` account.

## Current state

- `frontend/src/components/landing/SignUpDialog.tsx` exists. Submits to `POST /api/leads/` (creates a `Lead` row).
- `frontend/src/pages/landing/machine/` (XState) drives the form flow.
- After submit, the landing machine sets `state.context.shard` and renders `<ShardView>` overlay (legacy; will be retired in `reading-room/` domain).
- No password field; no User creation; no sign-in side-effect.

## Future plan

- Add a password field to the dialog (single field; no confirm-password — open question).
- Submit endpoint changes from `POST /api/leads/` → `POST /api/auth/signup` (defined in `endpoints.md`).
- Backend creates User row + (eventually, when `subscription/` ships) Subscription row + first TemporalGrant + welcome email. For the auth-only slice, only the User row is created; book/pace/notes are stored inline on User as a temporary measure.
- Frontend receives session cookie on success → redirect to `/profile`.
- Error handling:
  - 409 (email exists) → inline form error: "An account with this email already exists. Sign in?" (link to `/login`).
  - 400 (invalid input) → field-level errors.
  - 5xx → toast or banner: "Couldn't create account, try again."

## Dependencies

- Needs: `endpoints.md` (signup endpoint), `user-model.md`.
- Future cross-domain: `subscription/model.md` (signup creates Subscription), `email/service.md` (welcome email).
- Used by: any new user signing up via `/`.
- Replaces: `POST /api/leads/` consumption by this form.

## Open questions

1. **Confirm-password field?** Recommendation: no — extra friction; password is single-entry. "Are you sure" deferred to strict-auth.
2. **Password rules in form?** Recommendation: minimum 8 characters, no other rules. Strict rules deferred.
3. **Show-password toggle?** Recommendation: yes — common, accessibility-positive.
4. **What happens when book/pace fields submit without a Subscription model?** This component's plan must coordinate with `subscription/`. For the auth-only slice, recommendation: store book_id/pace inline on User temporarily. Resolved in `user-model.md`.

## Notes for designer / implementer

- The dialog is already designed; add the password field above the Submit button, matching existing field styling.
- All copy via `labels.ts`.
- Form behavior in the existing `landingMachine` — extend, don't replace.
- Disable submit while in flight; show inline error per field.
