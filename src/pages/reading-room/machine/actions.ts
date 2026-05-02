import { assign } from "xstate";

const assignToken = assign(({ event }) => {
  if (event.type !== "SET_TOKEN") return {};
  return { token: (event as any).token as string };
});

const assignGrant = assign(({ event }) => {
  const output = (event as any).output;
  return {
    chapter: {
      title: output.chapter.title,
      orderIndex: output.chapter.order_index,
      bookTitle: output.chapter.book_title,
    },
    shardId: output.shard_id,
    openedAt: output.opened_at ?? null,
  };
});

const assignError = assign(({ event }) => ({
  errorMessage: (event as any).error?.message ?? "unknown error",
}));

const trackOpen = ({ context }: { context: any }) => {
  // Fire-and-forget POST /api/grants/:token/open. BE is idempotent on replay (T011a Q1).
  void fetch(`/api/grants/${context.token}/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).catch(() => undefined);
};

export const actions = {
  assignToken,
  assignGrant,
  assignError,
  trackOpen,
};
