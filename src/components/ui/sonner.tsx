"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { CheckCircle, XCircle, Info, Loader2 } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors={false}
      closeButton
      duration={3000}
      expand={false}
      icons={{
        success: <CheckCircle className="h-5 w-5" />,
        error: <XCircle className="h-5 w-5" />,
        loading: <Loader2 className="h-5 w-5 animate-spin" />,
        info: <Info className="h-5 w-5" />,
      }}
      toastOptions={{
        style: {
          border: "none",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.12)",
          fontWeight: "500",
          maxWidth: "320px",
          marginTop: "28px",
        },
        classNames: {
          success:
            "bg-green-500 text-white animate-in fade-in-50 duration-300",
          error:
            "bg-red-500 text-white animate-in fade-in-50 duration-300",
          loading:
            "bg-blue-500 text-white animate-in fade-in-50 duration-300",
          info: 
            "bg-indigo-500 text-white animate-in fade-in-50 duration-300",
          default:
            "bg-gray-900 text-white dark:bg-gray-800 animate-in fade-in-50 duration-300",
          description: 
            "text-sm opacity-90 font-normal mt-1",
          title:
            "font-medium text-base flex items-center gap-2",
          actionButton:
            "bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 text-sm transition-colors",
          cancelButton:
            "text-white/80 hover:text-white text-sm",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };