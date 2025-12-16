"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useSidebar } from "@/hooks/useSidebar";
import { useToast } from "@/hooks/useToast";

export default function ProtectedPage() {
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  useEffect(() => {
    const validateApiKey = async () => {
      // Get API key from sessionStorage
      let apiKeyToValidate = null;
      if (typeof window !== "undefined") {
        apiKeyToValidate = sessionStorage.getItem("apiKeyToValidate");
        // Clear it after reading
        sessionStorage.removeItem("apiKeyToValidate");
      }

      if (!apiKeyToValidate) {
        // No API key provided, redirect to playground
        showToast("No API key provided. Redirecting to playground...", "error");
        setTimeout(() => {
          router.push("/playground");
        }, 2000);
        setIsValidating(false);
        return;
      }

      try {
        // Validate API key against Supabase
        const { data, error } = await supabase
          .from("api_keys")
          .select("id, name, key")
          .eq("key", apiKeyToValidate)
          .maybeSingle();

        if (error || !data) {
          // Invalid API key
          showToast("Invalid API Key", "error");
          setIsValidating(false);
        } else {
          // Valid API key
          showToast("Valid API key, /protected can be accessed", "success");
          setIsValidating(false);
        }
      } catch (err) {
        console.error("Error validating API key:", err);
        showToast("Invalid API Key", "error");
        setIsValidating(false);
      }
    };

    validateApiKey();
  }, [router, showToast]);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Toast toast={toast} onClose={hideToast} />

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <div className="px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
          {/* Header with Toggle Button */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                Protected Page
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg bg-white p-8 shadow dark:bg-zinc-800">
              {isValidating ? (
                <div className="text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Validating API key...
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
                    Protected Content
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    This is a protected page that requires a valid API key to
                    access.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push("/playground")}
                      className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Go to Playground
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

