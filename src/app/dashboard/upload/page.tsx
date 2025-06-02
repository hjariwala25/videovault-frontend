"use client";

import { useUploadVideo } from "@/hooks/useVideoQueries";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import VideoUploadForm from "@/components/dashboard/VideoUploadForm";

export default function Upload() {
  const uploadMutation = useUploadVideo();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      uploadMutation.mutateAsync(formData).then(() => {
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
            <VideoUploadForm
              onSubmit={handleSubmit}
              isSubmitting={uploadMutation.isPending}
              onCancel={() => router.push("/dashboard/videos")}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
