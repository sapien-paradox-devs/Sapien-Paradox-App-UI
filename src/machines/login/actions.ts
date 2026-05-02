import { assign } from "xstate";

const assignEmail = assign(({ event }) => {
  if (event.type !== "UPDATE_EMAIL") return {};
  return { email: (event as any).email as string };
});

const assignPassword = assign(({ event }) => {
  if (event.type !== "UPDATE_PASSWORD") return {};
  return { password: (event as any).password as string };
});

const clearError = assign(() => ({ errorKey: null }));

const clearPassword = assign(() => ({ password: "" }));

const assignUser = assign(({ event }) => ({
  user: (event as any).output,
}));

const assignErrorInvalid = assign(() => ({ errorKey: "errorInvalid" as const }));

const assignErrorGeneric = assign(() => ({ errorKey: "errorGeneric" as const }));

export const actions = {
  assignEmail,
  assignPassword,
  clearError,
  clearPassword,
  assignUser,
  assignErrorInvalid,
  assignErrorGeneric,
};
