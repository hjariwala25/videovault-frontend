// Owner interface for VideoCard and related components
export interface Owner {
  _id?: string;
  username: string;
  fullname?: string;
  avatar?: string;
}

// Video interface for VideoCard and related components
export interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  views: number;
  duration?: number | string;
  isPublished?: boolean;
  owner: string | Owner;
  isInPlaylist?: boolean;
  playlistId?: string;
}
