export interface User {
  email: string;
  full_name: string;
  role: string;
}

export interface MachineContext {
  landingRef?: any;
  user?: User;
}

export type AppEvent =
  | { type: "GO_TO_LOGIN" }
  | { type: "LOGIN_SUCCESS"; data: { user: User } }
  | { type: "RETURN_TO_LANDING" }
  | { type: "VIEW_READING_ROOM" }
  | { type: "VIEW_PROFILE" }
  | { type: "VIEW_ADMIN" }
  | { type: "LOGOUT" };
