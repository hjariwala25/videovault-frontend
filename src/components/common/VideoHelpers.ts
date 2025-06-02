export const formatDuration = (duration: number | string | undefined) => {
  if (!duration) return "00:00";

  let seconds = 0;
  if (typeof duration === "string") {
    seconds = parseInt(duration, 10) || 0;
  } else {
    seconds = duration;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Get owner details with fallback
 */
interface Owner {
  username: string;
  fullname?: string;
  avatar?: string;
}

export const getOwnerDetails = (owner: Owner | string | undefined) => {
  if (!owner || typeof owner === "string") {
    return {
      username: "channel",
      displayName: "Channel",
      avatar: "/default-avatar.png",
    };
  }
  return {
    username: owner.username,
    displayName: owner.fullname || owner.username,
    avatar: owner.avatar || "/default-avatar.png",
  };
};
