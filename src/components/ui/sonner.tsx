"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      duration={4000}
      expand={false}
      toastOptions={{
        style: {
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
        },
        classNames: {
          success:
            "group border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300",
          error:
            "group border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300",
          loading:
            "group border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300",
          info: "group border-indigo-500 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300",
          default:
            "group border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
