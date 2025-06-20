export const queryKeys = {
  // User related keys
  user: {
    all: ["users"] as const,
    current: () => [...queryKeys.user.all, "current"] as const,
    channel: (username: string) =>
      [...queryKeys.user.all, "channel", username] as const,
    watchHistory: () => [...queryKeys.user.all, "watchHistory"] as const,
  },

  // Video related keys
  videos: {
    all: ["videos"],
    list: (params = {}) => ["videos", "list", params],
    detail: (id: string) => ["videos", "detail", id],
    byIds: (ids: string[]) => ["videos", "byIds", ids],
    liked: () => ["videos", "liked"],
  },
  // Comment related keys
  comments: {
    all: ["comments"] as const,
    list: (videoId: string, page?: number) =>
      [...queryKeys.comments.all, videoId, page] as const,
  },

  // Tweet related keys
  tweets: {
    all: ["tweets"] as const,
    user: (userId: string) =>
      [...queryKeys.tweets.all, "user", userId] as const,
  },

  // Subscription related keys
  subscriptions: {
    all: ["subscriptions"] as const,
    channelSubscribers: (channelId: string) =>
      [...queryKeys.subscriptions.all, "channel", channelId] as const,
    subscribedChannels: (userId: string) =>
      [...queryKeys.subscriptions.all, "user", userId] as const,
  },

  // Playlist related keys
  playlists: {
    all: ["playlists"] as const,
    user: (userId: string) =>
      [...queryKeys.playlists.all, "user", userId] as const,
    detail: (playlistId: string) =>
      [...queryKeys.playlists.all, "detail", playlistId] as const,
  },

  // Dashboard related keys
  dashboard: {
    all: ["dashboard"],
    stats: () => [...queryKeys.dashboard.all, "stats"],
    videos: () => [...queryKeys.dashboard.all, "videos"],
    analytics: (period: string) => [
      ...queryKeys.dashboard.all,
      "analytics",
      period,
    ],
  },

  // Discover related keys
  discover: {
    channels: (sort: string, page: number, limit: number, search: string) =>
      ["discover", "channels", sort, page, limit, search] as const,
  },
};
