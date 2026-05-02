import { fromPromise } from "xstate";

class LoginError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const checkAuthActor = fromPromise(async () => {
  const res = await fetch("/api/profile/me");
  if (!res.ok) throw new LoginError(res.status, "not authenticated");
  return res.json();
});

const loginActor = fromPromise(
  async ({ input }: { input: { email: string; password: string } }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new LoginError(res.status, `login failed: ${res.status}`);
    const data = await res.json();
    return data.user ?? data;
  }
);

export const actors = {
  checkAuthActor,
  loginActor,
};
