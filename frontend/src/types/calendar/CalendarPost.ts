import { PostRow } from "../post/PostRow";

export type CalendarPost = PostRow & {
  scheduledAt: string;
};