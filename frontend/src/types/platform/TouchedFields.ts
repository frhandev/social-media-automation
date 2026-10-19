import { ContentField } from "./ContentField";
import { Platform } from "./Platform";

export type TouchedFields = Partial<
  Record<Platform, Partial<Record<ContentField, boolean>>>
>;
