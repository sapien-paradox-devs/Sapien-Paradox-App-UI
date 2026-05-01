import { assign } from "xstate";

const spawnLandingMachine = assign(({ context }) => {
  return { landingRef: context.landingRef ?? true };
});

const setUserData = assign(({ event }) => {
  // Handle both actor onDone and external LOGIN_SUCCESS event
  const userData = event.output?.user || event.data?.user || event.output || event.data;
  return { user: userData };
});

export const actions = {
  spawnLandingMachine,
  setUserData,
};
