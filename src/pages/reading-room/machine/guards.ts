export const isNotFound = ({ event }: { event: any }) =>
  event?.error?.status === 404;

export const isLocked = ({ event }: { event: any }) =>
  event?.error?.status === 403;
