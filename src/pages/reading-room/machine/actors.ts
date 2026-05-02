import { fromPromise } from "xstate";

const API_BASE = "http://localhost:8000/api";

class GrantFetchError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const fetchGrantActor = fromPromise(async ({ input }: { input: { token: string } }) => {
  const response = await fetch(`${API_BASE}/grants/${input.token}`, {
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
