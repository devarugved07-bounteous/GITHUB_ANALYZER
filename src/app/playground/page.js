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
                    {isSubmitting ? "Processing..." : "Summarize Repository"}
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
                  <div className="mt-6 space-y-6">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="font-semibold">Summary Generated Successfully!</span>
                      </div>
                    </div>

                    {results.repository && (
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                        <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          Repository Information
                        </h3>
                        <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <p>
                            <span className="font-medium">Owner:</span> {results.repository.owner}
                          </p>
                          <p>
                            <span className="font-medium">Repository:</span> {results.repository.repo}
                          </p>
                          <p>
                            <span className="font-medium">Branch:</span> {results.repository.branch}
                          </p>
                          <a
                            href={results.repository.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    )}

                    {results.summary && (
                      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
                        <h3 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
                          Summary
                        </h3>
                        <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                          {results.summary}
                        </p>
                      </div>
                    )}

                    {results.cool_facts && results.cool_facts.length > 0 && (
                      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
                        <h3 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
                          Cool Facts
                        </h3>
                        <ul className="space-y-2">
                          {results.cool_facts.map((fact, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300"
                            >
                              <span className="mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400">
                                ✨
                              </span>
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
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

