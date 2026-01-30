"use client";

import { useState } from "react";
import { maskApiKey } from "@/utils/apiKeyUtils";

export default function ApiKeysTable({
  apiKeys,
  loading,
  onEdit,
  onDelete,
  onCopy,
}) {
  const [viewingKeyId, setViewingKeyId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (key, id) => {
    onCopy(key, id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          No API keys found. Create your first API key to get started.
        </p>
      </div>
    );
  }

  const usagePercent = (key) =>
    Math.min(((key.usage || 0) / (key.rateLimit || 100)) * 100, 100);
  const barColor = (key) =>
    (key.usage || 0) >= (key.rateLimit || 100)
      ? "bg-red-500"
      : (key.usage || 0) >= ((key.rateLimit || 100) * 0.8)
        ? "bg-yellow-500"
        : "bg-green-500";

  const actionButtons = (apiKey) => (
    <div className="flex items-center justify-end gap-2 sm:gap-3">
      <button
        onClick={() =>
          setViewingKeyId(viewingKeyId === apiKey.id ? null : apiKey.id)
        }
        className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
        title="View"
        aria-label="View key"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button
        onClick={() => handleCopy(apiKey.key, apiKey.id)}
        className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
        title="Copy"
        aria-label="Copy key"
      >
        {copiedId === apiKey.id ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <button
        onClick={() => onEdit(apiKey)}
        className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
        title="Edit"
        aria-label="Edit key"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={() => onDelete(apiKey.id)}
        className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-900 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
        title="Delete"
        aria-label="Delete key"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      {/* Card layout for mobile */}
      <div className="space-y-4 md:hidden">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-semibold text-black dark:text-zinc-50">
                {apiKey.name}
              </h3>
              {actionButtons(apiKey)}
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Usage: </span>
                <span className="font-medium">{apiKey.usage || 0} / {apiKey.rateLimit || 100}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className={`h-full transition-all ${barColor(apiKey)}`}
                  style={{ width: `${usagePercent(apiKey)}%` }}
                />
              </div>
              <div className="break-all font-mono text-xs text-zinc-600 dark:text-zinc-400">
                {viewingKeyId === apiKey.id ? apiKey.key : maskApiKey(apiKey.key)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table layout for md and up */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 lg:px-6">
                NAME
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 lg:px-6">
                USAGE / LIMIT
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 lg:px-6">
                KEY
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 lg:px-6">
                OPTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-800">
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-black dark:text-zinc-50 lg:px-6">
                  {apiKey.name}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-600 dark:text-zinc-400 lg:px-6">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {apiKey.usage || 0} / {apiKey.rateLimit || 100}
                    </span>
                    <div className="mt-1 h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className={`h-full transition-all ${barColor(apiKey)}`}
                        style={{ width: `${usagePercent(apiKey)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-400 lg:px-6">
                  <code className="break-all font-mono text-xs">
                    {viewingKeyId === apiKey.id ? apiKey.key : maskApiKey(apiKey.key)}
                  </code>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right lg:px-6">
                  {actionButtons(apiKey)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

