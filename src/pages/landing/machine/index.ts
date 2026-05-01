import { landingMachine } from "./machine";
import { actions } from "./actions";
import { actors } from "./actors";
import * as guards from "./guards";

export { fieldStructure } from "./fields";

export const machine = landingMachine.provide({
  actions,
  actors,
  guards,
});
