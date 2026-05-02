export const isAdmin = ({ context }: any) => {
  return context.user?.role === "admin";
};
