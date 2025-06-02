"use client";

import { useRegister } from "@/hooks/useUserQueries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import VideoVaultLogo from "@/components/common/VideoVaultLogo";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  const registerMutation = useRegister();
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    if (
      !data.get("username") ||
      !data.get("email") ||
      !data.get("fullname") ||
      !data.get("password")
    ) {
      toast.error("All fields are required");
      return;
    }

    if (!data.get("avatar")) {
      toast.error("Please upload a profile picture");
      return;
    }

    const password = data.get("password") as string;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await toast.promise(registerMutation.mutateAsync(data), {
        loading: "Creating your account...",
        success: "Account created successfully! Please log in.",
        error: (err) =>
          `Registration failed: ${
            err?.response?.data?.message || "An error occurred"
          }`,
      });

      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Form Column */}
      <div className="flex flex-col justify-center w-full px-4 py-4 lg:flex-none lg:w-[65%] xl:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="mb-4 flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center mb-3">
              <div className="mr-2">
                <VideoVaultLogo size={40} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                VideoVault
              </span>
            </Link>

            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Join our community and start sharing your videos
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900/70 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <RegisterForm
              onSubmit={handleSubmit}
              isSubmitting={registerMutation.isPending}
            />

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign in →
                </Link>
              </p>
            </div>

            <p className="text-xs text-center sm:text-left text-gray-500 dark:text-gray-400 mt-2">
              By signing up, you agree to the{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Branding Column */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-tl from-blue-600 to-indigo-900">
        <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <VideoVaultLogo size={100} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">
              Join VideoVault Today
            </h1>
            <p className="text-base text-white/90">
              Create, share, and discover amazing video content with creators
              from around the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
