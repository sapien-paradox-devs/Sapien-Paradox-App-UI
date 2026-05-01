import { fromCallback, fromPromise } from "xstate";
import { submitLead } from "./services";

const paceCadences = {
  crawl: 4500,
  steady: 3000,
  soar: 1900,
};

const paceActor = fromCallback(({ sendBack, input }) => {
  const pace = input?.pace ?? "steady";
  const cadence = paceCadences[pace];
  const intervalId = setInterval(() => {
    sendBack({ type: "PACE_TICK", pace });
  }, cadence);

  return () => clearInterval(intervalId);
});

const submitLeadActor = fromPromise(({ input }) => submitLead({ context: input }));

const validateShardActor = fromPromise(async ({ input }: { input: any }) => {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
  if (input?.token === "valid-token") {
    return true;
  }
  throw new Error("Expired");
});

export const actors = {
  paceActor,
  submitLeadActor,
  validateShardActor,
};
