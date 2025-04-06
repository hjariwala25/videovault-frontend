"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  initialValue?: string;
  buttonText?: string;
  isSubmitting?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function CommentForm({
  onSubmit,
  initialValue = "",
  buttonText = "Comment",
  isSubmitting = false,
  autoFocus = false,
  placeholder = "Add a comment...",
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSubmit(content);
    if (!initialValue) {
      // Only clear if it's a new comment, not an edit
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="min-h-[80px] pr-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 dark:focus:border-blue-600 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600"
        />
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="absolute right-2 bottom-2 p-2 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          aria-label={buttonText}
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  );
}
