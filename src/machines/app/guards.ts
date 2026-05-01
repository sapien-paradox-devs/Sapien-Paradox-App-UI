import { MachineContext } from "./types";

export const isAdmin = ({ context }: { context: MachineContext }) => {
  return context.user?.role === "admin";
};
