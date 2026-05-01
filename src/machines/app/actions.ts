import { assign } from "xstate";
import type { MachineContext } from "./types";

const spawnLandingMachine = assign(({ context }: { context: MachineContext }) => {
  return { landingRef: context.landingRef ?? true };
});

const setUserData = assign(({ event }: { event: any }) => {
  // Handle both actor onDone and external LOGIN_SUCCESS event
  const userData = event.output?.user || event.data?.user || event.output || event.data;
  return { user: userData };
});

export const actions = {
  spawnLandingMachine,
  setUserData,
};
