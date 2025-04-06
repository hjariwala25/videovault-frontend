export interface User {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: string[];
  createdAt: string;
  updatedAt: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Video {
  ownerDetails: User;
  tags: boolean;
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: User | string;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
}

export interface Comment {
  _id: string;
  content: string;
  owner:
    | {
        _id: string;
        username: string;
        fullname?: string;
        avatar: string;
      }
    | string;
  video:
    | {
        _id: string;
        title?: string;
        thumbnail?: string;
      }
    | string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  isLiked: boolean;
}

export interface Tweet {
  _id: string;
  content: string;
  owner: string | { _id: string; username: string; avatar: string };
  ownerDetails?: {
    _id: string;
    username: string;
    avatar: string;
    fullname?: string;
  };
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
}

export interface Subscription {
  _id: string;
  subscriber: User | string;
  channel: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: Video[] | string[];
  owner: User | string;
  createdAt: string;
  updatedAt: string;
  totalVideos?: number;
  totalViews?: number;
}

export interface Like {
  _id: string;
  video?: string;
  comment?: string;
  tweet?: string;
  likedBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelProfile {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
  coverImage?: string;
  subscriberCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
}

export interface DashboardStats {
  totalSubscribers: number;
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
}
