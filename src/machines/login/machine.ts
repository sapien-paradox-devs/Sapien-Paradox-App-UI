import { assign, createMachine, fromPromise } from "xstate";

export const loginMachine = createMachine({
  id: "login",
  initial: "checkingAuth",
  context: {
    email: "",
    password: "",
    error: null,
  },
  states: {
    checkingAuth: {
      invoke: {
        src: fromPromise(async () => {
          const res = await fetch("/api/profile/me");
          if (!res.ok) throw new Error("Not authenticated");
          return res.json();
        }),
        onDone: {
          target: "authenticated",
          actions: assign({
            user: ({ event }) => event.output,
          }),
        },
        onError: "idle",
      },
    },
    idle: {
      on: {
        SUBMIT: "submitting",
      },
    },
    submitting: {
      invoke: {
        src: fromPromise(async ({ event }) => {
          const { email, password } = event;
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Invalid credentials");
          }
          return res.json();
        }),
        onDone: {
          target: "authenticated",
          actions: assign({
            user: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "idle",
          actions: assign({
            error: ({ event }) => event.error.message,
          }),
        },
      },
    },
    authenticated: {
      type: "final",
    },
  },
});
