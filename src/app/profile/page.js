"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

// Random content templates based on name
const randomContentTemplates = [
  {
    title: "Daily Inspiration",
    content: (name) => `Hey ${name}! Did you know that today is a perfect day to achieve something amazing? Your dedication and hard work are truly inspiring. Keep pushing forward!`,
  },
  {
    title: "Fun Facts",
    content: (name) => `Interesting fact about the name ${name}: Names have a unique way of shaping our identity. Your name carries a special meaning and energy that's all your own!`,
  },
  {
    title: "Motivational Quote",
    content: (name) => `${name}, remember: "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill. You've got this!`,
  },
  {
    title: "Tech Tip",
    content: (name) => `Hey ${name}! Here's a quick tip: Did you know that using strong, unique API keys for each service helps keep your applications secure? Stay safe out there!`,
  },
  {
    title: "Random Thought",
    content: (name) => `${name}, have you ever wondered about the infinite possibilities that technology brings? Your journey in the digital world is just beginning!`,
  },
  {
    title: "Achievement Unlocked",
    content: (name) => `🎉 Congratulations ${name}! You've successfully logged into your personalized dashboard. This is just the beginning of your amazing journey!`,
  },
];

const randomStats = [
  { label: "API Keys Created", value: () => Math.floor(Math.random() * 50) + 1 },
  { label: "Projects Active", value: () => Math.floor(Math.random() * 20) + 1 },
  { label: "Success Rate", value: () => `${Math.floor(Math.random() * 30) + 70}%` },
  { label: "Days Active", value: () => Math.floor(Math.random() * 365) + 1 },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { toast, showToast, hideToast } = useToast();
  const [contentItems, setContentItems] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (user) {
      const userName = user.name || user.email.split("@")[0];
      
      // Generate random content items
      const shuffled = [...randomContentTemplates].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      setContentItems(selected.map(item => ({
        ...item,
        content: item.content(userName),
      })));

      // Generate random stats
      setStats(randomStats.map(stat => ({
        label: stat.label,
        value: stat.value(),
      })));
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const userName = user.name || user.email.split("@")[0];
  const userInitials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
                  Welcome, {userName}!
                </h1>
              </div>
            </div>

            {/* Profile Card */}
            <div className="mb-8 overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-800">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
                    {userInitials}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {user.name || "User"}
                    </h2>
                    <p className="text-blue-100">{user.email}</p>
                    <p className="mt-1 text-sm text-blue-200">
                      Member since {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                >
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-black dark:text-zinc-50">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {contentItems.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-800"
                >
                  <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                      {item.title}
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Fun Section */}
            <div className="mt-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <h3 className="mb-4 text-2xl font-bold">
                🎲 Random Fun for {userName}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <p className="text-sm font-medium opacity-90">Lucky Number</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(Math.random() * 100) + 1}
                  </p>
                </div>
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <p className="text-sm font-medium opacity-90">Today's Color</p>
                  <p className="text-2xl font-bold">
                    {["Blue", "Green", "Purple", "Orange", "Red"][
                      Math.floor(Math.random() * 5)
                    ]}
                  </p>
                </div>
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <p className="text-sm font-medium opacity-90">Energy Level</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(Math.random() * 40) + 60}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

