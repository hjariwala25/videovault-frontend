"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useVideoById, useUpdateVideo } from "@/hooks/useVideoQueries";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function EditVideo() {
  const params = useParams();
  const videoId = params.id as string;
  const { data: video, isLoading, error } = useVideoById(videoId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const updateVideo = useUpdateVideo(videoId);
  const router = useRouter();

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setIsPublished(video.isPublished || false);
    }
  }, [video]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setThumbnail(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || ""); // Send empty string if no description
    formData.append("isPublished", isPublished.toString());

    // Only send a new thumbnail if one is selected
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    
    toast.promise(
      updateVideo.mutateAsync(formData).then(() => {
        router.push("/dashboard/videos");
      }),
      {
        loading: "Updating video...",
        success: "Video updated successfully!",
        error: "Failed to update video. Please try again.",
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 max-w-3xl mx-auto animate-in fade-in duration-300">
          <div className="flex items-center mb-6">
            <Skeleton className="h-8 w-8 mr-2" />
            <Skeleton className="h-8 w-36" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <Skeleton className="absolute inset-0" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 max-w-3xl mx-auto">
          <div className="text-red-600 dark:text-red-400 mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
            Error loading video: {error.message}
          </div>
          <Button onClick={() => router.push("/dashboard/videos")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Videos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/videos")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Videos
        </Button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Video
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-gray-900 dark:text-white"
                >
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  disabled={updateVideo.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gray-900 dark:text-white"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  className="min-h-[100px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  disabled={updateVideo.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white">
                  Publishing Options
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublished"
                    checked={isPublished}
                    onCheckedChange={(checked) =>
                      setIsPublished(checked === true)
                    }
                    disabled={updateVideo.isPending}
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                  >
                    Make this video public
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="thumbnail"
                  className="text-gray-900 dark:text-white"
                >
                  Thumbnail
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                    {thumbnailPreview ? (
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                    ) : video?.thumbnail ? (
                      <Image
                        src={video.thumbnail}
                        alt="Current thumbnail"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                        {/* Use width and height props for the Image component */}
                        <Image
                          src="/placeholder-image.png"
                          alt="Placeholder thumbnail"
                          width={48}
                          height={48}
                          className="text-gray-400 dark:text-gray-600 mb-2"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No thumbnail
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Upload a new thumbnail image
                    </p>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="border-gray-300 dark:border-gray-700"
                      disabled={updateVideo.isPending}
                    />
                    {thumbnail && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        New thumbnail selected: {thumbnail.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/videos")}
                  disabled={updateVideo.isPending}
                  className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateVideo.isPending || !title.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {updateVideo.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
