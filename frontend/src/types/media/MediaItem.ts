import {MediaStatus} from "./MediaStatus";
import MediaType from "./MediaType";

type MediaItem = {
  id: string;
  filename: string;
  type: MediaType;
  format: string;
  durationSec?: number | undefined;
  width: number;
  height: number;
  sizeBytes: number;
  uploadedAt: string; // ISO
  status: MediaStatus;
  progress?: number | undefined;
  tone: "lime" | "ink" | "indigo" | "sand";
};

export default MediaItem