"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

const researchTips = [
  {
    title: "Research Strategy",
    content: (name) => `Hey ${name}! When conducting research, always start with a clear question. Define what you're looking for before diving into the data. This will save you time and help you stay focused.`,
  },
  {
    title: "Data Collection",
    content: (name) => `${name}, remember that quality over quantity matters. Collect reliable sources and verify your information from multiple credible sources. Your research is only as good as your data!`,
  },
  {
    title: "Analysis Techniques",
    content: (name) => `Great researchers like you, ${name}, know that analyzing data requires both critical thinking and creativity. Look for patterns, anomalies, and connections that others might miss.`,
  },
  {
    title: "Documentation Best Practices",
    content: (name) => `${name}, always document your research process. Keep track of sources, methodologies, and findings. Future you will thank present you for this!`,
  },
];

const researchProjects = [
  { name: "Market Analysis", status: "In Progress", progress: 75 },
  { name: "User Behavior Study", status: "Completed", progress: 100 },
  { name: "Technology Trends", status: "Planning", progress: 25 },
  { name: "Competitive Research", status: "In Progress", progress: 60 },
];

export default function ResearchAssistantPage() {
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { toast, showToast, hideToast } = useToast();
  const [tips, setTips] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user) {
      const userName = user.name || user.email.split("@")[0];
      
      // Shuffle and select random tips
      const shuffled = [...researchTips].sort(() => 0.5 - Math.random());
      setTips(shuffled.map(tip => ({
        ...tip,
        content: tip.content(userName),
      })));

      // Shuffle projects
      const shuffledProjects = [...researchProjects].sort(() => 0.5 - Math.random());
      setProjects(shuffledProjects);
    }
  }, [user]);

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
                  Research Assistant
                </h1>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="mb-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 p-8 text-white">
              <h2 className="mb-2 text-2xl font-bold">
                🔍 Welcome, {userName}!
              </h2>
              <p className="text-yellow-100">
                Your personal research assistant is here to help you discover, analyze, and document insights.
              </p>
            </div>

            {/* Research Tips */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-zinc-50">
                Research Tips for {userName}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>

            {/* Research Projects */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-zinc-50">
                Your Research Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                        {project.name}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                          className="h-full bg-blue-600 transition-all dark:bg-blue-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
                Quick Actions for {userName}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button className="rounded-lg border border-zinc-300 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700">
                  <div className="text-sm font-medium text-black dark:text-zinc-50">
                    Start New Research
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Begin a new project
                  </div>
                </button>
                <button className="rounded-lg border border-zinc-300 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700">
                  <div className="text-sm font-medium text-black dark:text-zinc-50">
                    View Reports
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Check your findings
                  </div>
                </button>
                <button className="rounded-lg border border-zinc-300 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700">
                  <div className="text-sm font-medium text-black dark:text-zinc-50">
                    Export Data
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Download results
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

