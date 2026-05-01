import { createMachine } from "xstate";

export const appMachine = createMachine({
  id: "app",
  initial: "landing",
  context: {
    landingRef: undefined,
    userRole: undefined,
  },
  states: {
    landing: {
      entry: "spawnLandingMachine",
      on: {
        GO_TO_LOGIN: "login",
      },
    },
    login: {
      on: {
        LOGIN: { target: "user.profile", actions: "setUserRole" },
        RETURN_TO_LANDING: "landing",
      },
    },
    user: {
      initial: "profile",
      states: {
        profile: {
          on: {
            VIEW_READING_ROOM: "readingRoom",
            VIEW_ADMIN: { target: "admin", guard: "isAdmin" },
          },
        },
        readingRoom: {
          on: {
            VIEW_PROFILE: "profile",
            VIEW_ADMIN: { target: "admin", guard: "isAdmin" },
          },
        },
        admin: {
          on: {
            VIEW_PROFILE: "profile",
            VIEW_READING_ROOM: "readingRoom",
          },
        },
      },
      on: {
        LOGOUT: "landing",
      },
    },
  },
});
