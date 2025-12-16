"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

const reportTemplates = [
  {
    title: "Market Analysis Report",
    content: (name) => `This comprehensive market analysis report prepared for ${name} covers key trends, competitive landscape, and growth opportunities in the current market. The data suggests promising prospects for strategic investments.`,
    date: "2024-01-15",
    pages: 42,
  },
  {
    title: "Technology Trends Report",
    content: (name) => `${name}'s technology trends report highlights emerging technologies that are shaping the future. From AI to blockchain, this report provides insights into what's next in the tech world.`,
    date: "2024-01-10",
    pages: 28,
  },
  {
    title: "User Behavior Study",
    content: (name) => `This detailed user behavior study commissioned by ${name} reveals fascinating patterns in user interactions. The findings will help shape better user experiences and product strategies.`,
    date: "2024-01-05",
    pages: 35,
  },
  {
    title: "Competitive Analysis",
    content: (name) => `The competitive analysis report for ${name} examines market positioning, strengths, and weaknesses of key competitors. This strategic overview provides actionable insights for business growth.`,
    date: "2023-12-28",
    pages: 51,
  },
];

const insights = [
  {
    category: "Key Finding",
    text: (name) => `${name}, your research shows a 23% increase in engagement when personalized content is used.`,
  },
  {
    category: "Recommendation",
    text: (name) => `Based on ${name}'s data, we recommend focusing on mobile-first strategies for better reach.`,
  },
  {
    category: "Trend",
    text: (name) => `${name}'s reports indicate a growing trend towards automation and AI integration.`,
  },
];

export default function ResearchReportsPage() {
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { toast, showToast, hideToast } = useToast();
  const [reports, setReports] = useState([]);
  const [reportInsights, setReportInsights] = useState([]);

  useEffect(() => {
    if (user) {
      const userName = user.name || user.email.split("@")[0];
      
      // Shuffle and select random reports
      const shuffled = [...reportTemplates].sort(() => 0.5 - Math.random());
      setReports(shuffled.map(report => ({
        ...report,
        content: report.content(userName),
      })));

      // Shuffle insights
      const shuffledInsights = [...insights].sort(() => 0.5 - Math.random());
      setReportInsights(shuffledInsights.map(insight => ({
        ...insight,
        text: insight.text(userName),
      })));
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
                  Research Reports
                </h1>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-8 text-white">
              <h2 className="mb-2 text-2xl font-bold">
                📊 {userName}'s Research Reports
              </h2>
              <p className="text-indigo-100">
                Access and manage all your research reports and findings in one place.
              </p>
            </div>

            {/* Insights */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {reportInsights.map((insight, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                >
                  <div className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    {insight.category}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Reports List */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-zinc-50">
                Your Reports
              </h2>
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
                          {report.title}
                        </h3>
                        <p className="mb-3 text-zinc-700 dark:text-zinc-300">
                          {report.content}
                        </p>
                        <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                          <span>📅 {new Date(report.date).toLocaleDateString()}</span>
                          <span>📄 {report.pages} pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                        View Report
                      </button>
                      <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700">
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Reports
                </div>
                <div className="mt-2 text-3xl font-bold text-black dark:text-zinc-50">
                  {reports.length}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Pages
                </div>
                <div className="mt-2 text-3xl font-bold text-black dark:text-zinc-50">
                  {reports.reduce((sum, r) => sum + r.pages, 0)}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  This Month
                </div>
                <div className="mt-2 text-3xl font-bold text-black dark:text-zinc-50">
                  {Math.floor(Math.random() * 5) + 2}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Avg. Pages
                </div>
                <div className="mt-2 text-3xl font-bold text-black dark:text-zinc-50">
                  {reports.length > 0 
                    ? Math.round(reports.reduce((sum, r) => sum + r.pages, 0) / reports.length)
                    : 0}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

