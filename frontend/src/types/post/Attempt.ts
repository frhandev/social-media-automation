export type Attempt = {
  id: string;
  at: string;
  status: "published" | "failed";
  error?: string;
};