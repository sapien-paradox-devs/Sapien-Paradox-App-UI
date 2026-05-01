import { createMachine } from "xstate";
import { locale } from "../../../lib/locale";

export const landingMachine = createMachine({
  id: "landing",
  initial: "checkingUrl",
  context: {
    books: locale("landingPage.books") as Array<{ id: string; title: string; tagline: string; summary: string }>,
    pace: "steady",
    formValues: {} as Record<string, string | undefined>,
    selectedBookId: undefined as string | undefined,
    shard: null as { id: string; token: string; status: "loading" | "valid" | "expired" } | null,
  },
  on: {
    SET_BOOK: { actions: "assignSelectedBook" },
    SET_PACE: { actions: "assignPace" },
  },
  states: {
    checkingUrl: {
      always: [
        {
          guard: "hasShardParams",
          target: "viewingShard",
          actions: "assignShardFromUrl",
        },
        { target: "idle" },
      ],
    },
    idle: {
      on: {
        OPEN_FORM: "form",
      },
    },
    viewingShard: {
      invoke: {
        src: "validateShardActor",
        input: ({ context }) => context.shard,
        onDone: {
          actions: "assignShardValid",
        },
        onError: {
          actions: "assignShardExpired",
        },
      },
      on: {
        CLOSE_SHARD: {
          target: "idle",
          actions: "clearShardParams",
        },
      },
    },
    form: {
      entry: "logFormReady",
      invoke: {
        id: "paceActor",
        src: "paceActor",
        input: ({ context }) => ({ pace: context.pace }),
      },
      on: {
        CLOSE_FORM: "idle",
        UPDATE_FIELD: { actions: "assignFieldValue" },
        SUBMIT: [
          {
            guard: "canSubmit",
            target: "submitting",
          },
        ],
        PACE_TICK: { actions: "noop" },
      },
    },
    submitting: {
      invoke: {
        id: "submitLead",
        src: "submitLeadActor",
        input: ({ context }) => context,
        onDone: { target: "success", actions: "resetForm" },
        onError: { target: "form" },
      },
    },
    success: {
      entry: "notifySuccess",
      on: {
        OPEN_FORM: "form",
      },
    },
  },
});
