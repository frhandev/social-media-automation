import { Channel } from "../Channel";
import { Attempt } from "./Attempt";
import { PostLifecycle } from "./PostLifecycle";

export type Publication = {
  inFlight?: boolean;
  platform: Channel;
  status: PostLifecycle;
  error?: string;
  publishedAt?: string;
  attempts: Attempt[];
};