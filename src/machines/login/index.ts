import { loginMachine } from "./machine";
import { actions } from "./actions";
import { actors } from "./actors";
import * as guards from "./guards";

export const machine = loginMachine.provide({
  actions,
  actors,
  guards,
});
