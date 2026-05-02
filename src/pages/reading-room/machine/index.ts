import { readingRoomMachine } from "./machine";
import { actions } from "./actions";
import { actors } from "./actors";
import * as guards from "./guards";

export const machine = readingRoomMachine.provide({
  actions,
  actors,
  guards,
});
