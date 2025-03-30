import { useState } from "react";
import { Comment as CommentType } from "@/types";
import { useToggleCommentLike } from "@/hooks/useLikeQueries";
import { useUpdateComment, useDeleteComment } from "@/hooks/useCommentQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit, Save, X } from "lucide-react";
import Image from "next/image";

interface CommentProps {
  comment: CommentType;
  currentUserId?: string;
}

export default function Comment({ comment, currentUserId }: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const toggleLike = useToggleCommentLike();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  // Check if this comment belongs to the current user
  const isOwner =
    currentUserId &&
    (typeof comment.owner === "string"
      ? comment.owner === currentUserId
      : comment.owner._id === currentUserId);

  // Create a properly typed owner object with defaults
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      updateComment.mutate({
        commentId: comment._id,
        content: editContent,
        videoId:
          typeof comment.video === "string" ? comment.video : comment.video._id,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteComment.mutate({
        commentId: comment._id,
        videoId:
          typeof comment.video === "string" ? comment.video : comment.video._id,
      });
    }
  };

  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow mt-2">
      <Image
        src={owner.avatar || "/default-avatar.png"}
        alt={owner.username || "User"}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-semibold">{owner.username || "Anonymous"}</p>
          <span className="text-gray-500 text-xs">{formattedDate}</span>
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={updateComment.isPending}
              >
                <Save className="h-4 w-4 mr-1" />{" "}
                {updateComment.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1">{comment.content}</p>
        )}

        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleLike}
            disabled={toggleLike.isPending}
            className={comment.isLiked ? "text-blue-600" : ""}
          >
            {comment.isLiked ? "Liked" : "Like"} ({comment.likesCount || 0})
          </Button>

          {isOwner && !isEditing && (
            <>
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleteComment.isPending}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
