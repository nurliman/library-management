export const UserRole = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export const routes = [
  {
    name: "Dashboard",
    href: "/dashboard",
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
  },
  { name: "Books", href: "/books" },
  { name: "Borrowing", href: "/borrowing" },
  // TODO: remove this
  // { name: "Returning", href: "/returning" },
  { name: "Users", href: "/users", roles: [UserRole.SUPERADMIN] },
  { name: "Settings", href: "/settings", roles: [UserRole.SUPERADMIN] },
];
