import { Content } from "../post/Content";
import { Platform } from "./Platform";

export type PlatformContent = Partial<
  Record<Platform, Content>
>;