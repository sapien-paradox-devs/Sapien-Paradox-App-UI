export const isAdmin = ({ context }) => {
  return context.userRole === "admin";
};
