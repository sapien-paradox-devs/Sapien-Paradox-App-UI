import { createMachine } from "xstate";

export const loginMachine = createMachine({
  id: "login",
  initial: "checkingAuth",
  context: {
    email: "",
    password: "",
    errorKey: null as null | "errorInvalid" | "errorGeneric",
    user: null as any,
  },
  on: {
    UPDATE_EMAIL: { actions: "assignEmail" },
    UPDATE_PASSWORD: { actions: "assignPassword" },
  },
  states: {
    checkingAuth: {
      invoke: {
        src: "checkAuthActor",
        onDone: { target: "authenticated", actions: "assignUser" },
        onError: "idle",
      },
    },
    idle: {
      on: {
        SUBMIT: { target: "submitting", actions: "clearError" },
      },
    },
    submitting: {
      invoke: {
        src: "loginActor",
        input: ({ context }) => ({ email: context.email, password: context.password }),
        onDone: { target: "authenticated", actions: "assignUser" },
        onError: [
          {
            guard: "isInvalidCredentials",
            target: "idle",
            actions: ["assignErrorInvalid", "clearPassword"],
          },
          {
            target: "idle",
            actions: ["assignErrorGeneric", "clearPassword"],
          },
        ],
      },
    },
    authenticated: { type: "final" },
  },
});
