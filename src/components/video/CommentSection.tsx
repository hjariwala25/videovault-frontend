import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import Comment from "@/components/common/Comment";
import CommentForm from "@/components/common/CommentForm";
import Link from "next/link";
import { Comment as CommentType } from "@/types";

interface CommentSectionProps {
  videoId: string;
  comments: CommentType[] | undefined;
  commentsLoading: boolean;
  currentUser: { id: string; name: string; email?: string } | null;
  addComment: {
    mutate: (params: { videoId: string; content: string }) => void;
    isPending: boolean;
  };
}

export default function CommentSection({
  videoId,
  comments,
  commentsLoading,
  currentUser,
  addComment,
}: CommentSectionProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        Comments
        {comments && comments.length > 0 && (
          <span className="ml-3 text-base text-gray-600 dark:text-gray-400">
            {comments.length}
          </span>
        )}
      </h2>

      {currentUser ? (
        <CommentForm
          onSubmit={(content) => addComment.mutate({ videoId, content })}
          isSubmitting={addComment.isPending}
        />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in
          </Link>{" "}
          to add a comment
        </div>
      )}

      {/* Comments list */}
      <div className="mt-6 space-y-4">
        {commentsLoading ? (
          // Comment skeletons while loading
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-16 w-full mb-2" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
            ))
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {comments.map((comment: CommentType) => (
              <Comment key={comment._id} comment={comment} videoId={videoId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 animate-in fade-in duration-300">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
