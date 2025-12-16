"use client";

import { useEffect, useState } from "react";

export default function Toast({ toast, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      setIsExiting(false);
    }
  }, [toast]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!toast || !isVisible) return null;

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          container: "border-green-200/50 bg-white/95 backdrop-blur-md text-green-800 shadow-green-200/50 dark:border-green-800/50 dark:bg-zinc-900/95 dark:text-green-300 dark:shadow-green-900/20",
          iconBg: "bg-green-100 dark:bg-green-900/30",
          icon: "text-green-600 dark:text-green-400",
          progress: "bg-green-500",
        };
      case "error":
        return {
          container: "border-red-200/50 bg-white/95 backdrop-blur-md text-red-800 shadow-red-200/50 dark:border-red-800/50 dark:bg-zinc-900/95 dark:text-red-300 dark:shadow-red-900/20",
          iconBg: "bg-red-100 dark:bg-red-900/30",
          icon: "text-red-600 dark:text-red-400",
          progress: "bg-red-500",
        };
      case "info":
        return {
          container: "border-blue-200/50 bg-white/95 backdrop-blur-md text-blue-800 shadow-blue-200/50 dark:border-blue-800/50 dark:bg-zinc-900/95 dark:text-blue-300 dark:shadow-blue-900/20",
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          icon: "text-blue-600 dark:text-blue-400",
          progress: "bg-blue-500",
        };
      default:
        return {
          container: "border-zinc-200/50 bg-white/95 backdrop-blur-md text-zinc-800 shadow-zinc-200/50 dark:border-zinc-700/50 dark:bg-zinc-900/95 dark:text-zinc-300 dark:shadow-zinc-900/20",
          iconBg: "bg-zinc-100 dark:bg-zinc-800/30",
          icon: "text-zinc-600 dark:text-zinc-400",
          progress: "bg-zinc-500",
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 min-w-[320px] max-w-md transition-all duration-300 ease-out ${
        isExiting
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      }`}
    >
      <div
        className={`relative flex items-start gap-4 rounded-xl border px-5 py-4 shadow-xl ${styles.container}`}
      >
        {/* Icon with background */}
        <div className={`flex-shrink-0 rounded-full p-2 ${styles.iconBg}`}>
          <div className={styles.icon}>{getIcon()}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-5">{toast.message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-lg p-1 text-current opacity-60 transition-all hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
          aria-label="Close notification"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl bg-black/5 dark:bg-white/5">
          <div
            className={`h-full ${styles.progress} animate-[shrink_3s_linear_forwards]`}
          />
        </div>
      </div>
    </div>
  );
}

