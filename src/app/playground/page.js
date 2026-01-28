"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useSidebar } from "@/hooks/useSidebar";
import { useToast } from "@/hooks/useToast";

const playgroundTips = [
  {
    title: "API Testing",
    content: (name) => `Hey ${name}! The playground is your safe space to test API keys. Try different endpoints and see how they respond.`,
  },
  {
    title: "Best Practices",
    content: (name) => `${name}, always test your API keys in the playground before using them in production. This helps catch issues early!`,
  },
  {
    title: "Security Note",
    content: (name) => `${name}, remember that API keys are sensitive. Never share them publicly or commit them to version control.`,
  },
];

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { toast, showToast, hideToast } = useToast();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    if (user) {
      const userName = user.name || user.email.split("@")[0];
      const shuffled = [...playgroundTips].sort(() => 0.5 - Math.random());
      setTips(shuffled.map(tip => ({
        ...tip,
        content: tip.content(userName),
      })));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResults(null);

    if (!apiKey.trim()) {
      showToast("API Key is required", "error");
      setIsSubmitting(false);
      return;
    }

    if (!githubUrl.trim()) {
      showToast("GitHub URL is required", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      // Make request to /api/github-summarizer
      const response = await fetch("/api/github-summarizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          githubUrl: githubUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        if (response.status === 429) {
          setError({
            message: data.error || "Rate limit exceeded",
            details: data.message || `Usage: ${data.usage}/${data.rateLimit}`,
            type: "rate_limit",
          });
          showToast("Rate limit exceeded", "error");
        } else if (response.status === 401) {
          setError({
            message: data.error || "Invalid API key",
            details: data.message || "Please check your API key",
            type: "auth",
          });
          showToast("Invalid API key", "error");
        } else {
          setError({
            message: data.error || "Request failed",
            details: data.message || "An error occurred while processing your request",
            type: "error",
          });
          showToast(data.error || "Request failed", "error");
        }
        setIsSubmitting(false);
        return;
      }

      // Success - set results
      setResults(data);
      showToast("Repository summarized successfully!", "success");
    } catch (err) {
      console.error("Error calling GitHub summarizer:", err);
      setError({
        message: "Network error",
        details: err.message || "Failed to connect to the server",
        type: "network",
      });
      showToast("Network error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  const userName = user.name || user.email.split("@")[0];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Toast toast={toast} onClose={hideToast} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <div className="px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  aria-label="Toggle sidebar"
                >
                  {isSidebarOpen ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
                <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                  API Playground
                </h1>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="mb-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <h2 className="mb-2 text-2xl font-bold">
                🚀 Welcome, {userName}!
              </h2>
              <p className="text-purple-100">
                Test and validate your API keys in a safe environment. Experiment with different endpoints and see how they work.
              </p>
            </div>

            {/* Tips */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                >
                  <h3 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
                    {tip.title}
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Form Section */}
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg bg-white p-8 shadow dark:bg-zinc-800">
                <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
                  GitHub Repository Summarizer
                </h2>
                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                  Enter your API key and a GitHub repository URL to get an AI-generated summary.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label
                      htmlFor="apiKey"
                      className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      API Key
                    </label>
                    <input
                      type="text"
                      id="apiKey"
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 font-mono text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                      placeholder="Enter your API key here..."
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="githubUrl"
                      className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      required
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                      placeholder="https://github.com/owner/repo"
                    />
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      Enter a valid GitHub repository URL (e.g., https://github.com/facebook/react)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !apiKey.trim() || !githubUrl.trim()}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-5 w-5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Summarize Repository"
                    )}
                  </button>
                </form>

                {/* Error Display */}
                {error && (
                  <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-800 dark:text-red-300">
                          {error.message}
                        </h3>
                        {error.details && (
                          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            {error.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Results Display */}
                {results && (
                  <div className="mt-8 transition-all duration-500 ease-in-out">
                    {/* Success Banner */}
                    <div className="mb-6 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5 shadow-sm dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                            <svg
                              className="h-6 w-6 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                              Summary Generated Successfully!
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              Your repository has been analyzed and summarized
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Repository Card */}
                    {results.repository && (
                      <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-lg dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <svg
                              className="h-6 w-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <h3 className="text-xl font-bold text-white">Repository Details</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                                <svg
                                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Owner</p>
                                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                  {results.repository.owner}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40">
                                <svg
                                  className="h-5 w-5 text-purple-600 dark:text-purple-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Repository</p>
                                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                  {results.repository.repo}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                                <svg
                                  className="h-5 w-5 text-green-600 dark:text-green-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Branch</p>
                                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                  {results.repository.branch}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
                          <a
                            href={results.repository.url}
                            target="_blank"
                            rel="noopener noreferrer"
                                className="flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-white transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
                              >
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
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                                <span className="font-semibold">View on GitHub</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Summary Card */}
                    {results.summary && (
                      <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <svg
                                  className="h-6 w-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">Repository Summary</h3>
                                <p className="text-xs text-white/80">AI-generated insights</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(results.summary);
                                  showToast("Summary copied to clipboard!", "success");
                                }}
                                className="rounded-lg bg-white/20 backdrop-blur-sm px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/30 hover:scale-105"
                                title="Copy summary"
                              >
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
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="relative p-8">
                          {/* Decorative background elements */}
                          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-20 blur-3xl dark:from-indigo-900/20 dark:to-purple-900/20"></div>
                          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gradient-to-tr from-pink-100 to-rose-100 opacity-20 blur-2xl dark:from-pink-900/20 dark:to-rose-900/20"></div>
                          
                          {/* Summary content */}
                          <div className="relative">
                            <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>AI Analysis</span>
                            </div>
                            <div className="rounded-lg border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50/50 to-transparent p-4 dark:from-indigo-900/10">
                              <p className="whitespace-pre-wrap text-base leading-8 text-zinc-800 dark:text-zinc-200">
                                {results.summary}
                              </p>
                            </div>
                            
                            {/* Summary stats */}
                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                              <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-700">
                                <svg
                                  className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span>{results.summary.split(' ').length} words</span>
                              </div>
                              <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-700">
                                <svg
                                  className="h-4 w-4 text-purple-600 dark:text-purple-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                  />
                                </svg>
                                <span>{results.summary.split('.').filter(s => s.trim().length > 0).length} sentences</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cool Facts Card */}
                    {results.cool_facts && results.cool_facts.length > 0 && (
                      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                              <svg
                                className="h-6 w-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Cool Facts</h3>
                            <span className="ml-auto rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-white">
                              {results.cool_facts.length}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {results.cool_facts.map((fact, index) => (
                              <div
                              key={index}
                                className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 p-5 transition-all hover:scale-[1.02] hover:shadow-lg dark:border-zinc-700 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-fuchsia-900/20"
                              >
                                <div className="absolute right-2 top-2 text-4xl opacity-10 transition-opacity group-hover:opacity-20">
                                  ✨
                                </div>
                                <div className="relative flex items-start gap-4">
                                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500 text-white shadow-md ring-2 ring-pink-200 dark:ring-pink-800">
                                    <span className="text-sm font-bold">{index + 1}</span>
                                  </div>
                                  <p className="flex-1 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                                    {fact}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

