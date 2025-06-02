export default function SidebarFooter() {
  return (
    <div className="mt-6 px-3 pt-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 gap-x-2">
        <a
          href="#"
          className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
        >
          About
        </a>
        <a
          href="#"
          className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Contact
        </a>
        <a
          href="#"
          className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Terms
        </a>
        <a
          href="#"
          className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Privacy
        </a>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        © 2025 VideoVault
      </p>
    </div>
  );
}
