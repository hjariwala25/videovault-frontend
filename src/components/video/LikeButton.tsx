import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatCount } from "@/utils/formatTime";
// import the correct mutation type or define it here if missing
// import { VideoMutation } from "@/types";
type VideoMutation = {
  mutate: (videoId: string) => void;
  isPending: boolean;
};

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  toggleLike: VideoMutation;
  videoId: string;
}

export default function LikeButton({
  isLiked,
  likesCount,
  toggleLike,
  videoId,
}: LikeButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toggleLike.mutate(videoId)}
      disabled={toggleLike.isPending}
      className={`flex-shrink-0 border-gray-200 dark:border-gray-800 ${
        isLiked
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-900 dark:text-white"
      } hover:bg-gray-100 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
    >
      {toggleLike.isPending ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
      ) : isLiked ? (
        <>
          <ThumbsDown className="mr-1.5 h-4 w-4" />
          Unlike
        </>
      ) : (
        <>
          <ThumbsUp className="mr-1.5 h-4 w-4" />
          Like
        </>
      )}
      <span className="ml-1">{formatCount(likesCount || 0)}</span>
    </Button>
  );
}
