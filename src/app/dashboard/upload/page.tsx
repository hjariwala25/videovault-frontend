"use client";

import { useState, useRef } from "react";
import { useUploadVideo } from "@/hooks/useVideoQueries";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, UploadCloud, Video } from "lucide-react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadVideo();
  const router = useRouter();

  const validateFile = (selectedFile: File) => {
    setIsValidating(true);

    // Check file size (limit to 100MB)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > MAX_SIZE) {
      toast.error("File is too large. Maximum size is 100MB.");
      setIsValidating(false);
      return false;
    }

    // Check file type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(
        "Invalid file type. Supported formats are MP4, WebM, and QuickTime."
      );
      setIsValidating(false);
      return false;
    }

    setIsValidating(false);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        // Auto-populate title from filename if empty
        if (!title) {
          const fileName = selectedFile.name.split(".").slice(0, -1).join(".");
          setTitle(fileName);
        }
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file for the thumbnail");
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        // Auto-populate title from filename if empty
        if (!title) {
          const fileName = droppedFile.name.split(".").slice(0, -1).join(".");
          setTitle(fileName);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (!thumbnail) {
      toast.error("Please select a thumbnail image");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for the video");
      return;
    }

    // Check if description is empty
    if (!description.trim()) {
      toast.error("Please enter a description for the video");
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", file); 
    formData.append("thumbnail", thumbnail); 
    formData.append("title", title);
    formData.append("description", description);

    toast.promise(
      uploadMutation
        .mutateAsync(formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        })
        .then(() => {
          router.push("/dashboard/videos");
        }),
      {
        loading: "Uploading video...",
        success: "Video uploaded successfully!",
        error: "Failed to upload video. Please try again.",
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Upload New Video
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadMutation.isPending}
                />

                {file ? (
                  <div className="space-y-2">
                    <Video className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md mx-auto">
                      {file.name}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      disabled={uploadMutation.isPending}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Drag and drop your video or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      MP4, WebM, or QuickTime (max 100MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-gray-900 dark:text-white"
                >
                  Video Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  disabled={uploadMutation.isPending}
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
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
                  placeholder="Provide details about your video"
                  className="min-h-[100px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  disabled={uploadMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="thumbnail"
                  className="text-gray-900 dark:text-white"
                >
                  Thumbnail <span className="text-red-500">*</span>
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={uploadMutation.isPending}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:border-gray-600 dark:placeholder-gray-400"
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="mt-2 w-full h-auto rounded-lg"
                  />
                )}
              </div>

              <div className="mt-6">
                <Label
                  htmlFor="thumbnail"
                  className="text-gray-900 dark:text-white"
                >
                  Thumbnail Image <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2">
                  {thumbnailPreview ? (
                    <div className="relative aspect-video mb-3 border rounded-md overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="object-cover w-full h-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          setThumbnail(null);
                          setThumbnailPreview(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed rounded-lg p-4 mt-1 text-center cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-600"
                      onClick={() =>
                        document.getElementById("thumbnail-input")?.click()
                      }
                    >
                      <div className="space-y-1">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload thumbnail
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP up to 2MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    id="thumbnail-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                    disabled={uploadMutation.isPending}
                  />
                </div>
              </div>

              {uploadMutation.isPending && (
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/videos")}
                  disabled={uploadMutation.isPending}
                  className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    uploadMutation.isPending ||
                    !file ||
                    !thumbnail || // Add this check
                    !title.trim() ||
                    !description.trim() ||
                    isValidating
                  }
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Video"
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
