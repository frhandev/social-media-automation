export type AnalyticsDailyRecord = {
  publicationId: string;
  date: string; // YYYY-MM-DD in Europe/Istanbul
  views: number;
  likes: number;
  comments: number;
  shares: number | null;
};
