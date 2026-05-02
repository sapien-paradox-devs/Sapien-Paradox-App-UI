import { createMachine } from "xstate";

export const readingRoomMachine = createMachine({
  id: "readingRoom",
  initial: "idle",
  context: {
    token: "",
    chapter: null as { title: string; orderIndex: number; bookTitle: string } | null,
    shardId: null as string | null,
    openedAt: null as string | null,
    errorMessage: null as string | null,
  },
  states: {
    idle: {
      on: {
        SET_TOKEN: { target: "loading", actions: "assignToken" },
      },
    },
    loading: {
      invoke: {
        src: "fetchGrantActor",
        input: ({ context }) => ({ token: context.token }),
        onDone: {
          target: "reading",
          actions: "assignGrant",
        },
        onError: [
          { guard: "isNotFound", target: "invalid", actions: "assignError" },
          { guard: "isLocked", target: "locked", actions: "assignError" },
          { target: "error", actions: "assignError" },
        ],
      },
    },
    reading: {
      entry: "trackOpen",
      on: {
        REACHED_LAST_PAGE: "sanctuary",
      },
    },
    sanctuary: { type: "final" },
    invalid: { type: "final" },
    locked: { type: "final" },
    error: { type: "final" },
  },
});
