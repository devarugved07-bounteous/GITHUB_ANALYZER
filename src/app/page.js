"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    title: "AI-Powered Summaries",
    description: "Get comprehensive summaries of any GitHub repository using advanced AI models. Understand complex projects in minutes, not hours.",
    icon: "🤖",
  },
  {
    title: "Cool Facts Discovery",
    description: "Uncover interesting facts and insights about repositories automatically. Learn what makes each project unique and noteworthy.",
    icon: "✨",
  },
  {
    title: "Secure API Access",
    description: "Manage your API keys securely with our dashboard. Track usage, monitor performance, and control access to your resources.",
    icon: "🔒",
  },
  {
    title: "Easy Integration",
    description: "Simple REST API that works with any programming language. Just send a GitHub URL and get structured JSON responses.",
    icon: "⚡",
  },
];

const benefits = [
  "Save hours of manual research time",
  "Get instant insights into any GitHub repository",
  "Powered by cutting-edge AI technology",
  "Secure and reliable API infrastructure",
  "Easy to integrate into your workflow",
  "Comprehensive documentation and support",
];

const stats = [
  { label: "Repositories Analyzed", value: "10K+" },
  { label: "Active Users", value: "5K+" },
  { label: "API Requests", value: "1M+" },
  { label: "Uptime", value: "99.9%" },
];

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const userName = user?.name || user?.email?.split("@")[0] || "User";

  const handleTryItOut = (e) => {
    e.preventDefault();
    if (user) {
      router.push("/playground");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Navigation */}
      <nav className="relative border-b border-white/10 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/50 via-blue-800/50 to-indigo-800/50"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-3xl font-bold text-white drop-shadow-lg transition-transform hover:scale-105">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  🔍 GitHub Summarizer
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-5">
              {user ? (
                <>
                  <div className="text-base font-medium text-white/90 drop-shadow-md">
                    Welcome, <span className="font-bold text-white">{userName}</span>
                  </div>
                  <Link
                    href="/dashboards"
                    className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:bg-blue-50"
                  >
                    API Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 hover:shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:bg-blue-50"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-300 via-blue-300 to-indigo-300 px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/50 via-blue-200/50 to-indigo-200/50"></div>
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-purple-900 drop-shadow-2xl sm:text-6xl lg:text-7xl">
              Summarize GitHub Repositories
              <br />
              <span className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                with AI Power
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-purple-800 drop-shadow-lg">
              Get instant, comprehensive summaries and insights from any GitHub repository. 
              Powered by advanced AI to help you understand projects faster than ever.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {user ? (
                <Link
                  href="/dashboards"
                  className="group relative rounded-xl bg-purple-700 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:scale-110 hover:bg-purple-800 hover:shadow-purple-500/50"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group relative rounded-xl bg-purple-700 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:scale-110 hover:bg-purple-800 hover:shadow-purple-500/50"
                  >
                    <span className="relative z-10">Get Started Free</span>
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border-2 border-purple-600 bg-purple-600 px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-purple-700 hover:shadow-xl"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-zinc-200 bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Example Section */}
      <section className="bg-gradient-to-br from-zinc-50 via-white to-purple-50/30 py-20 dark:bg-gradient-to-br dark:from-black dark:via-zinc-900 dark:to-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-black dark:text-zinc-50">
              See It In Action
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Simple API request, powerful results. Just send a GitHub URL and get comprehensive insights.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* API Request */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                  API Request
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Edit the payload and send a request
                </p>
              </div>
              <div className="p-6">
                <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-green-400">
{`POST /api/github-summarizer
Headers:
  x-api-key: your-api-key

Body:
{
  "githubUrl": "https://github.com/assafelovic/gpt-researcher"
}`}
                </pre>
              </div>
              <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
                <div className="flex gap-3">
                  <button
                    onClick={handleTryItOut}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  >
                    Try it out
                  </button>
                  <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700">
                    Documentation
                  </button>
                </div>
              </div>
            </div>

            {/* API Response */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                  API Response
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  View the response from the API
                </p>
              </div>
              <div className="p-6">
                <pre className="max-h-96 overflow-y-auto rounded-lg bg-zinc-900 p-4 text-sm text-green-400">
{`{
  "summary": "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to provide detailed, factual, and unbiased research reports by leveraging AI technology...",
  "cool_facts": [
    "The project leverages both gpt-4o-mini and gpt-4o models",
    "Built with Python and designed for extensibility",
    "Addresses misinformation and reliability in research",
    "Open-source and community-driven development"
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-zinc-50 via-white to-blue-50 py-20 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-black dark:text-zinc-50">
              Powerful Features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to understand GitHub repositories at a glance
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-blue-50/50 p-6 shadow-md transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity group-hover:opacity-10"></div>
                <div className="relative text-5xl transition-transform group-hover:scale-110">{feature.icon}</div>
                <h3 className="relative mt-4 text-xl font-semibold text-black dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="relative mt-2 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 py-20 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold text-black dark:text-zinc-50">
                Why Choose GitHub Summarizer?
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Our platform combines the power of AI with intuitive design to help developers, researchers, and teams understand GitHub repositories faster and more effectively.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
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
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 p-10 shadow-2xl dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
                <div className="relative text-center">
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-7xl font-bold text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                    10x
                  </div>
                  <div className="mt-4 text-2xl font-bold text-black dark:text-zinc-50">
                    Faster Research
                  </div>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Understand repositories in minutes instead of hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-indigo-500/50"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-white drop-shadow-2xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100 drop-shadow-lg">
            Join thousands of developers who are already using GitHub Summarizer to understand repositories faster.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/dashboards"
                className="group relative rounded-xl bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-2xl transition-all hover:scale-110 hover:shadow-blue-500/50"
              >
                <span className="relative z-10">Go to API Dashboard</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 transition-opacity group-hover:opacity-20"></div>
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="group relative rounded-xl bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-2xl transition-all hover:scale-110 hover:shadow-blue-500/50"
                >
                  <span className="relative z-10">Create Free Account</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 transition-opacity group-hover:opacity-20"></div>
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border-2 border-white/50 bg-white/10 px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 hover:shadow-xl"
                >
                  Sign In to Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-xl font-bold text-black dark:text-zinc-50">
                🔍 GitHub Summarizer
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                AI-powered GitHub repository analysis
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-zinc-50">Product</h3>
              <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link href="/documentation" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/playground" className="hover:text-blue-600 dark:hover:text-blue-400">
                    API Playground
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-zinc-50">Account</h3>
              <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-zinc-50">Support</h3>
              <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <p>© 2024 GitHub Summarizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
