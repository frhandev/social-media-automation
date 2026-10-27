import type { Attempt } from "@/types/post/Attemp";

// Reuse the existing attempt model:
// { id, at, status, error? }
export type PublishAttempt = Attempt;
