# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev        # Vite dev server on port 5000
npm run build      # tsc -b && vite build
npm run lint       # eslint
```

Backend API is expected at `http://localhost:8000/api` (see `src/lib/fetcher.ts`).

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
- `mappedFetcher` in `lib/fetcher.ts` accepts an optional mapper function for response transformation.
