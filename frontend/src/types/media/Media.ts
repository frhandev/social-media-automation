import MediaItem from "./MediaItem";

type Media = MediaItem & {
  preview?: string;
  local?: string;
};

export default Media;
