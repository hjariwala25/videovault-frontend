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
import { Loader2, UploadCloud, Video, Image } from "lucide-react";

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
        <h1 className="text-2xl font-bold text-adaptive-heading mb-6">
          Upload New Video
        </h1>

        <Card className="glass-effect border border-gray-100 dark:border-gray-800/40 shadow-md">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800/40 bg-gray-50/90 dark:bg-gray-950/30 backdrop-blur-sm">
            <CardTitle className="text-adaptive-heading">
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video Upload Area */}
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
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-md mx-auto">
                      {file.name}
                    </div>
                    <p className="text-xs text-adaptive-muted">
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
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Drag and drop your video or click to browse
                    </p>
                    <p className="text-xs text-adaptive-muted">
                      MP4, WebM, or QuickTime (max 100MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-adaptive-heading">
                  Video Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  disabled={uploadMutation.isPending}
                  className="input-dark shadow-sm"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-adaptive-heading">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about your video"
                  className="min-h-[100px] input-dark shadow-sm"
                  disabled={uploadMutation.isPending}
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="text-adaptive-heading">
                  Thumbnail Image <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2">
                  {thumbnailPreview ? (
                    <div className="relative aspect-video mb-3 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="object-cover w-full h-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
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
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-900/30"
                      onClick={() =>
                        document.getElementById("thumbnail-input")?.click()
                      }
                    >
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Click to upload thumbnail
                        </div>
                        <p className="text-xs text-adaptive-muted">
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

              {/* Upload Progress */}
              {uploadMutation.isPending && (
                <div className="space-y-2 py-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center text-adaptive-muted">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800/40 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/videos")}
                  disabled={uploadMutation.isPending}
                  className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    uploadMutation.isPending ||
                    !file ||
                    !thumbnail ||
                    !title.trim() ||
                    !description.trim() ||
                    isValidating
                  }
                  className="gradient-bg text-white shadow-sm hover:shadow transition-all"
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
