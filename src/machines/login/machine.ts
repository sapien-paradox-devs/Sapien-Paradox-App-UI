import { assign, createMachine, fromPromise } from "xstate";

export const loginMachine = createMachine({
  id: "login",
  initial: "checkingAuth",
  context: {
    email: "",
    password: "",
    error: null as string | null,
    user: undefined as any,
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
            user: ({ event }: any) => event.output,
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
        src: fromPromise(async ({ input }: any) => {
          const { email, password } = input;
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
        input: ({ event }: any) => event,
        onDone: {
          target: "authenticated",
          actions: assign({
            user: ({ event }: any) => event.output,
          }),
        },
        onError: {
          target: "idle",
          actions: assign({
            error: ({ event }: any) => event.error?.message || "Login failed",
          }),
        },
      },
    },
    authenticated: {
      type: "final",
    },
  },
});
