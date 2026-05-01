import { assign } from "xstate";

const spawnLandingMachine = assign(({ context }) => {
  return { landingRef: context.landingRef ?? true };
});

const setUserRole = assign(({ event }) => {
  return { userRole: event.role };
});

export const actions = {
  spawnLandingMachine,
  setUserRole,
};
