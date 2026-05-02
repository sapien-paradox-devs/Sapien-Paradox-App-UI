import { assign } from "xstate";

const spawnLandingMachine = assign(({ context }: any) => {
  return { landingRef: context.landingRef ?? true };
});

const setUserData = assign(({ event }: any) => {
  const userData = event.output?.user || event.data?.user || event.output || event.data;
  return { user: userData };
});

export const actions = {
  spawnLandingMachine,
  setUserData,
};
