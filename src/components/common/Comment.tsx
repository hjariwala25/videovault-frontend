"use client";

import { useState } from "react";
import { Comment as CommentType } from "@/types";
import { useToggleCommentLike } from "@/hooks/useLikeQueries";
import { useUpdateComment, useDeleteComment } from "@/hooks/useCommentQueries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Trash,
  Edit,
  Save,
  X,
  ThumbsUp,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatTimeAgo } from "@/utils/formatTime";
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
import { useCurrentUser } from "@/hooks/useUserQueries"; 



interface CommentProps {
  comment: CommentType;
  videoId?: string;
  showOptions?: boolean; 
}

export default function Comment({ comment, videoId }: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const toggleLike = useToggleCommentLike();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  
  const isOwner =
    !!currentUser &&
    (typeof comment.owner === "string"
      ? comment.owner === currentUser._id
      : comment.owner?.username === currentUser.username);

  
  const owner =
    typeof comment.owner === "string"
      ? {
          _id: comment.owner,
          avatar: "/default-avatar.png",
          username: "Anonymous",
        }
      : comment.owner;

  const handleToggleLike = () => {
    toggleLike.mutate(comment._id);
  };

  const handleUpdateComment = () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    updateComment.mutate(
      {
        commentId: comment._id,
        content: editContent.trim(),
        videoId: videoId || "", 
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Comment updated successfully");
        },
        onError: () => {
          toast.error("Failed to update comment");
        },
      }
    );
  };


  // Update the handleSaveEdit function to use the prop videoId
  // const handleSaveEdit = () => {
  //   if (editContent.trim() && editContent !== comment.content) {
  //     // Use the prop videoId instead of trying to extract it from comment
  //     if (!videoId) {
  //       toast.error("Video ID is missing");
  //       return;
  //     }

  //     updateComment.mutate({
  //       commentId: comment._id,
  //       content: editContent,
  //       videoId: videoId, // Use the prop directly
  //     });
  //   }
  //   setIsEditing(false);
  // };

  
  const handleDeleteComment = async () => {
    deleteComment.mutate({ commentId: comment._id, videoId: videoId || "" }, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        toast.success("Comment deleted successfully");
      },
      onError: () => {
        setShowDeleteDialog(false);
        toast.error("Failed to delete comment");
      },
    });
  };

  const formattedDate = comment.createdAt
    ? formatTimeAgo(new Date(comment.createdAt).toISOString())
    : "";

  return (
    <>
      <div className="flex gap-4 p-4 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200">
        <Link
          href={`/channel/${owner?.username || "anonymous"}`}
          className="flex-shrink-0"
        >
          <Image
            src={owner?.avatar || "/default-avatar.png"}
            alt={owner?.username || "User"}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 object-cover border-2 border-white dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
          />
        </Link>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/channel/${owner?.username || "unkown"}`}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {owner?.fullname || owner?.username || "Unknown"}
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                {formattedDate}
              </span>
            </div>

            {isOwner && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="sr-only">Comment options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 p-1 z-50 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-md"
                >
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg py-2 my-1 hover:bg-gray-100 dark:hover:bg-black/40 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>Edit Comment</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="rounded-lg py-2 my-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer flex items-center"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-600"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="border-gray-200 dark:border-gray-700"
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdateComment}
                  disabled={
                    updateComment.isPending ||
                    !editContent.trim() ||
                    editContent === comment.content
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {updateComment.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {comment.content}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleLike}
              disabled={toggleLike.isPending}
              className={`rounded-full flex items-center gap-1.5 h-8 ${
                comment.isLiked
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{comment.likesCount || 0}</span>
            </Button>
          </div>
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
              Are you sure you want to delete this comment? This action cannot
              be undone.
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
              onClick={handleDeleteComment}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteComment.isPending}
            >
              {deleteComment.isPending ? "Deleting..." : "Delete Comment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
