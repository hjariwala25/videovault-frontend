"use client";

import { useLogin } from "@/hooks/useUserQueries";
import { toast } from "sonner";
import Link from "next/link";

import VideoVaultLogo from "@/components/common/VideoVaultLogo";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  const loginMutation = useLogin();

  const handleSubmit = async (credentials: {
    username: string;
    password: string;
  }) => {
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password");
      return;
    }

    const loadingToast = toast.loading("Logging in...");

    try {
      await loginMutation.mutateAsync(credentials);
      toast.dismiss(loadingToast);
      toast.success("Login successful!");
      // Use window.location for more reliable navigation after login
      window.location.href = "/";
    } catch {
      toast.dismiss(loadingToast);
      // Error handling done in mutation onError
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Left column - Form */}
      <div className="flex flex-col justify-center w-full px-4 py-12 sm:px-6 lg:flex-none lg:w-[65%] xl:px-12">
        <div className="w-full max-w-md mx-auto lg:max-w-lg">
          <div className="mb-10 flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center mb-6">
              <div className="mr-2">
                <VideoVaultLogo size={40} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                VideoVault
              </span>
            </Link>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up →
              </Link>
            </p>
          </div>{" "}
          <div className="bg-white dark:bg-gray-900/70 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 backdrop-blur-sm">
            <LoginForm
              onSubmit={handleSubmit}
              isSubmitting={loginMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* Right column - Branding (hidden on small screens) */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-tl from-blue-600 to-indigo-900">
        <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-8">
              <VideoVaultLogo size={100} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6">
              Welcome back to VideoVault
            </h1>
            <p className="text-lg text-white/90">
              The best platform to share, discover, and engage with videos that
              matter to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
