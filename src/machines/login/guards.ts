export const isInvalidCredentials = ({ event }: { event: any }) =>
  event?.error?.status === 401;
