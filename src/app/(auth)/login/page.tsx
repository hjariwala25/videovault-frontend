"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useUserQueries";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { UserRound, KeyRound, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import VideoVaultLogo from "@/components/common/VideoVaultLogo";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      await loginMutation.mutateAsync(credentials);

      // Show success notification
      toast.success("Login successful!");

      // Navigate to home page
      router.push("/");
    } catch (error) {
      let errorMessage = "Please check your credentials";
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      toast.error(`Login failed: ${errorMessage}`);
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
          </div>

          <div className="bg-white dark:bg-gray-900/70 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserRound className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    placeholder="Enter your username"
                    className="pl-10 input-dark"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                </div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    className="pl-10 input-dark"
                    autoComplete="current-password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  className={cn(
                    "w-full py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white",
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  )}
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
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
