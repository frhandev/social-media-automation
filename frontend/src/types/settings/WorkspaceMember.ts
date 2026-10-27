
export type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
};
