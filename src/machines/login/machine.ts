import { assign, createMachine, fromPromise } from "xstate";
import type { User } from "../app/types";

export interface LoginContext {
  email: string;
  password: string;
  error: string | null;
  user?: User;
}

export type LoginEvent = { type: "SUBMIT"; email: string; password: string };

export const loginMachine = createMachine({
  id: "login",
  types: {} as {
    context: LoginContext;
    events: LoginEvent;
  },
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
            user: ({ event }: { event: any }) => event.output,
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
        src: fromPromise(async ({ input }: { input: LoginEvent }) => {
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
        input: ({ event }) => event as LoginEvent,
        onDone: {
          target: "authenticated",
          actions: assign({
            user: ({ event }: { event: any }) => event.output,
          }),
        },
        onError: {
          target: "idle",
          actions: assign({
            error: ({ event }: { event: any }) => (event.error as Error).message,
          }),
        },
      },
    },
    authenticated: {
      type: "final",
    },
  },
});
