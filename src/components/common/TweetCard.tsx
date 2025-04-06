"use client";

import { useState } from "react";
import { formatTimeAgo } from "@/utils/formatTime";
import Image from "next/image";
import Link from "next/link";
import {
  Trash,
  Edit,
  ThumbsUp,
  Save,
  X,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tweet } from "@/types";
import { useUpdateTweet, useDeleteTweet } from "@/hooks/useTweetQueries";
import { useToggleTweetLike } from "@/hooks/useLikeQueries";
import { useCurrentUser } from "@/hooks/useUserQueries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TweetCardProps {
  tweet: Tweet;
  showOptions?: boolean;
}

export default function TweetCard({
  tweet,
  showOptions = true,
}: TweetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(tweet.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: currentUser } = useCurrentUser();

  // Handle ownerDetails instead of owner based on API response
  const ownerInfo = tweet.ownerDetails || tweet.owner;

  // Fix: Ensure we handle undefined owner properly
  const isOwner =
    currentUser &&
    (typeof ownerInfo === "string"
      ? ownerInfo === currentUser._id
      : ownerInfo?._id === currentUser?._id);

  // Fix: Use ownerDetails first then fall back to owner
  const owner = !ownerInfo
    ? { username: "unknown", avatar: "/default-avatar.png" }
    : typeof ownerInfo === "string"
    ? { username: "user", avatar: "/default-avatar.png" }
    : ownerInfo;

  const updateTweet = useUpdateTweet();
  const deleteTweet = useDeleteTweet();
  const toggleLike = useToggleTweetLike();

  const handleUpdateTweet = () => {
    if (!content.trim()) {
      toast.error("Tweet content cannot be empty");
      return;
    }

    updateTweet.mutate(
      { tweetId: tweet._id, content: content.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Tweet updated successfully");
        },
        onError: () => {
          toast.error("Failed to update tweet");
        },
      }
    );
  };

  const handleDeleteTweet = async () => {
    deleteTweet.mutate(tweet._id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        toast.success("Tweet deleted successfully");
      },
      onError: () => {
        setShowDeleteDialog(false);
        toast.error("Failed to delete tweet");
      },
    });
  };

  const handleToggleLike = () => {
    toggleLike.mutate(tweet._id);
  };

  const formattedDate = tweet.createdAt
    ? formatTimeAgo(new Date(tweet.createdAt).toISOString())
    : "";

  return (
    <>
      <div className="p-4 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Link href={`/channel/${owner.username || "unknown"}`}>
              <Image
                src={owner.avatar || "/default-avatar.png"}
                alt={owner.username || "User"}
                width={40}
                height={40}
                className="rounded-full mr-3 border-2 border-white dark:border-gray-800"
              />
            </Link>

            <div>
              <Link
                href={`/channel/${owner.username || "unknown"}`}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                <>
                  {"fullname" in owner && owner.fullname
                    ? owner.fullname
                    : owner.username || "Unknown User"}
                </>
              </Link>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {formattedDate}
              </div>
            </div>
          </div>

          {isOwner && showOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                  <span>Edit Tweet</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  <span>Delete Tweet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Update your tweet..."
              className="w-full min-h-[80px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-600"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setContent(tweet.content);
                }}
                className="border-gray-200 dark:border-gray-700"
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUpdateTweet}
                disabled={updateTweet.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updateTweet.isPending ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line mb-3">
            {tweet.content}
          </p>
        )}

        <div className="flex items-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleLike}
            disabled={toggleLike.isPending}
            className={`rounded-full flex items-center gap-1.5 ${
              tweet.isLiked
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{tweet.likesCount || 0}</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this tweet? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTweet}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteTweet.isPending}
            >
              {deleteTweet.isPending ? "Deleting..." : "Delete Tweet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
