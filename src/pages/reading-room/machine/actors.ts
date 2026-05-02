import { fromPromise } from "xstate";

class GrantFetchError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const fetchGrantActor = fromPromise(async ({ input }: { input: { token: string } }) => {
  const response = await fetch(`/api/grants/${input.token}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new GrantFetchError(response.status, `grant fetch failed: ${response.status}`);
  }
  return response.json();
});

export const actors = {
  fetchGrantActor,
};
