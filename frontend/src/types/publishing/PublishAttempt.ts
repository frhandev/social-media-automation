import type { Attempt } from "@/types/post/Attempt";

// Reuse the existing attempt model:
// { id, at, status, error? }
export type PublishAttempt = Attempt;
