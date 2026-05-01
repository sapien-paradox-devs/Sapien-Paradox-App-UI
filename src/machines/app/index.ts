import { appMachine } from "./machine";
import { actions } from "./actions";
import * as guards from "./guards";

export const machine = appMachine.provide({
  actions,
  guards,
});
