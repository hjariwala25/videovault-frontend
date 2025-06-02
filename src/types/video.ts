export interface VideoData {
  _id: string;
  title: string;
  isPublished: boolean;
  views?: number | string | { count: number };
  likesCount?: number;
}
