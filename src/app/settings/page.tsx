"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useUserQueries";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import AccountForm from "@/components/settings/AccountForm";
import PasswordForm from "@/components/settings/PasswordForm";
import AvatarUpload from "@/components/settings/AvatarUpload";
import CoverUpload from "@/components/settings/CoverUpload";
import { User, Settings, Lock } from "lucide-react";

export default function SettingsPage() {
  const { data: currentUser, isLoading, error } = useCurrentUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-4 py-8 animate-in fade-in duration-300">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
          <div className="bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-6 text-red-600 dark:text-red-400">
            <h2 className="text-lg font-medium mb-2">Error</h2>
            <p>{(error as Error).message || "Failed to load user data"}</p>
            <p className="mt-2 text-sm">
              Please try refreshing the page or log in again.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentUser) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-4 py-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-xl p-6 text-yellow-600 dark:text-yellow-400">
            <h2 className="text-lg font-medium mb-2">
              Authentication Required
            </h2>
            <p>You need to be logged in to view your settings.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          Account Settings
        </h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-black/60 p-1 border border-gray-200 dark:border-gray-800">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
            >
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Profile Picture
              </h2>
              <AvatarUpload currentUser={currentUser} />
            </div>

            <div className="bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Cover Image
              </h2>
              <CoverUpload currentUser={currentUser} />
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Account Details
              </h2>
              <AccountForm currentUser={currentUser} />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Change Password
              </h2>
              <PasswordForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
