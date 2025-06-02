import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  AtSign,
  Mail,
  UserRound,
  KeyRound,
  Upload,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function RegisterForm({
  onSubmit,
  isSubmitting,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    setPasswordStrength(score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("fullname", formData.fullname);
    data.append("password", formData.password);

    if (avatar) {
      data.append("avatar", avatar);
    }

    if (coverImage) {
      data.append("coverImage", coverImage);
    }

    await onSubmit(data);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "coverImage"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (type === "avatar") {
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else {
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (type: "avatar" | "coverImage") => {
    if (type === "avatar") {
      setAvatar(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    } else {
      setCoverImage(null);
      setCoverPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      encType="multipart/form-data"
    >
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Account Info */}
        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <UserRound className="mr-2 h-4 w-4 text-blue-500" />
            Account Information
          </h2>

          {/* Full Name field */}
          <div className="mb-3">
            <Label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserRound className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                id="fullname"
                type="text"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
                placeholder="Enter your full name"
                className="pl-9 input-dark"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Username field */}
          <div className="mb-3">
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Username <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Choose a username"
                className="pl-9 input-dark"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="mb-3">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email address"
                className="pl-9 input-dark"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  });
                  checkPasswordStrength(e.target.value);
                }}
                placeholder="Create a secure password"
                className="pl-9 input-dark"
                autoComplete="new-password"
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
                      className="h-4 w-4"
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
                      className="h-4 w-4"
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

            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-1.5">
                <div className="flex items-center space-x-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors duration-200",
                        {
                          "bg-red-500": passwordStrength >= 1 && level === 1,
                          "bg-orange-500": passwordStrength >= 2 && level === 2,
                          "bg-yellow-500": passwordStrength >= 3 && level === 3,
                          "bg-green-500": passwordStrength >= 4 && level === 4,
                          "bg-gray-200 dark:bg-gray-700":
                            passwordStrength < level,
                        }
                      )}
                    ></div>
                  ))}
                </div>
                <p
                  className={cn("text-xs", {
                    "text-red-500": passwordStrength === 1,
                    "text-orange-500": passwordStrength === 2,
                    "text-yellow-500": passwordStrength === 3,
                    "text-green-500": passwordStrength === 4,
                  })}
                >
                  {passwordStrength === 0 && "Enter a password"}
                  {passwordStrength === 1 && "Weak - Add numbers or symbols"}
                  {passwordStrength === 2 && "Fair - Add more variety"}
                  {passwordStrength === 3 && "Good - Almost there"}
                  {passwordStrength === 4 && "Strong - Great password!"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Profile Media */}
        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Upload className="mr-2 h-4 w-4 text-blue-500" />
            Profile Media
          </h2>

          {/* Avatar upload */}
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Profile Picture <span className="text-red-500">*</span>
            </Label>

            {/* Avatar upload container */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900/70 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                {avatarPreview ? (
                  <>
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("avatar")}
                      className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white shadow-sm hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <UserRound size={30} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  id="avatar"
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "avatar")}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  className="mb-1 w-full h-9 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {avatar ? "Change Profile Picture" : "Upload Profile Picture"}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Square JPG/PNG (300×300px min)
                </p>
              </div>
            </div>
          </div>

          {/* Cover Image upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Cover Image (Optional)
            </Label>

            {/* Cover image container */}
            <div className="relative w-full h-[104px] rounded-lg overflow-hidden bg-white dark:bg-gray-900/70 border border-gray-100 dark:border-gray-800">
              {coverPreview ? (
                <>
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("coverImage")}
                    className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Upload size={24} className="mb-1" />
                  <span className="text-xs">Add a cover image</span>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recommended: 1920×400px
              </p>

              <input
                id="coverImage"
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "coverImage")}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => coverInputRef.current?.click()}
                className="h-9 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-800/30"
              >
                <Upload className="h-4 w-4 mr-2" />
                {coverImage ? "Change Cover" : "Upload Cover"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit section */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
        <Button
          type="submit"
          className={cn(
            "sm:w-auto py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white",
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Creating account..."
          ) : (
            <>
              Create account <ArrowRight className="ml-1 h-4 w-4 inline" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
