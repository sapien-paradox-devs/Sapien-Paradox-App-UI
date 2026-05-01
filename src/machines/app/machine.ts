import { createMachine } from "xstate";
import { loginMachine } from "../login";

export const appMachine = createMachine({
  id: "app",
  initial: "landing",
  context: {
    landingRef: undefined,
    user: undefined,
  },
  states: {
    landing: {
      entry: "spawnLandingMachine",
      on: {
        GO_TO_LOGIN: "login",
      },
    },
    login: {
      invoke: {
        id: "loginActor",
        src: loginMachine,
        onDone: {
          target: "user.profile",
          actions: "setUserData",
        },
      },
      on: {
        LOGIN_SUCCESS: {
          target: "user.profile",
          actions: "setUserData",
        },
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
