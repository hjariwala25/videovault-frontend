"use client";

import { useState } from "react";
import { useCreateTweet } from "@/hooks/useTweetQueries";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { Loader2, Send } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function TweetForm() {
  const [content, setContent] = useState("");
  const { data: currentUser } = useCurrentUser();
  const createTweet = useCreateTweet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Tweet content cannot be empty");
      return;
    }

    createTweet.mutate(content.trim(), {
      onSuccess: () => {
        setContent("");
        toast.success("Tweet created successfully");
      },
      onError: () => {
        toast.error("Failed to create tweet");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 mb-6"
    >
      <div className="flex gap-3">
        <Image
          src={currentUser?.avatar || "/default-avatar.png"}
          alt={currentUser?.username || "Your avatar"}
          width={40}
          height={40}
          className="rounded-full h-10 w-10 border-2 border-white dark:border-gray-800"
        />

        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full min-h-[80px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-600 mb-3"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createTweet.isPending || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4"
            >
              {createTweet.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Tweet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
