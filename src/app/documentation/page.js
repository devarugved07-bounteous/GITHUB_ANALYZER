"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

const docSections = [
  {
    title: "Getting Started",
    content: (name) => `Welcome ${name}! This getting started guide will help you understand the basics of our platform. Follow these steps to begin your journey.`,
    articles: ["Introduction", "Quick Start Guide", "First Steps"],
  },
  {
    title: "API Reference",
    content: (name) => `${name}, our comprehensive API reference covers all endpoints, authentication methods, and request/response formats. Everything you need to integrate is here.`,
    articles: ["Authentication", "Endpoints", "Error Handling"],
  },
  {
    title: "Best Practices",
    content: (name) => `Hey ${name}! Learn from our best practices guide. These recommendations will help you build more efficient and secure applications.`,
    articles: ["Security Tips", "Performance Optimization", "Code Examples"],
  },
  {
    title: "Troubleshooting",
    content: (name) => `${name}, having issues? Our troubleshooting guide covers common problems and their solutions. You're not alone in this!`,
    articles: ["Common Errors", "FAQ", "Support Resources"],
  },
];

const quickLinks = [
  { title: "API Documentation", icon: "📚", description: (name) => `Complete API reference for ${name}` },
  { title: "Code Examples", icon: "💻", description: (name) => `Sample code snippets for ${name}` },
  { title: "Video Tutorials", icon: "🎥", description: (name) => `Step-by-step videos for ${name}` },
  { title: "Community Forum", icon: "💬", description: (name) => `Join ${name} and others in discussions` },
];

export default function DocumentationPage() {
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { toast, showToast, hideToast } = useToast();
  const [sections, setSections] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (user) {
      const userName = user.name || user.email.split("@")[0];
      
      // Shuffle sections
      const shuffled = [...docSections].sort(() => 0.5 - Math.random());
      setSections(shuffled.map(section => ({
        ...section,
        content: section.content(userName),
      })));

      // Shuffle links
      const shuffledLinks = [...quickLinks].sort(() => 0.5 - Math.random());
      setLinks(shuffledLinks.map(link => ({
        ...link,
        description: link.description(userName),
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
                  Documentation
                </h1>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white">
              <h2 className="mb-2 text-2xl font-bold">
                📖 Welcome, {userName}!
              </h2>
              <p className="text-blue-100">
                Your comprehensive guide to using our platform. Find everything you need to get started and succeed.
              </p>
            </div>

            {/* Quick Links */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow transition-transform hover:scale-105 dark:bg-zinc-800"
                >
                  <div className="mb-2 text-3xl">{link.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
                    {link.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {link.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Documentation Sections */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-zinc-50">
                Documentation Sections
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                  >
                    <h3 className="mb-3 text-xl font-semibold text-black dark:text-zinc-50">
                      {section.title}
                    </h3>
                    <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                      {section.content}
                    </p>
                    <div className="space-y-2">
                      {section.articles.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{article}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Section */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
                Search Documentation
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Search for ${userName}...`}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                />
                <button className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Search
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

