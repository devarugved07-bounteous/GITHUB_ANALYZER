"use client";

import { generateApiKey } from "@/utils/apiKeyUtils";

export default function CreateEditModal({
  isOpen,
  editingKey,
  formData,
  isSubmitting,
  onClose,
  onSubmit,
  onFormDataChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-bold text-black dark:text-zinc-50">
          {editingKey ? "Edit API Key" : "Create New API Key"}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              placeholder="e.g., Production API Key"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="key"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              API Key {!editingKey && "(Leave empty to generate)"}
            </label>
            <input
              type="text"
              id="key"
              value={formData.key}
              onChange={(e) =>
                onFormDataChange({ ...formData, key: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              placeholder={editingKey ? "API Key" : "Auto-generated if empty"}
            />
            {!editingKey && (
              <button
                type="button"
                onClick={() =>
                  onFormDataChange({ ...formData, key: generateApiKey() })
                }
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Generate Random Key
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isSubmitting
                ? "Saving..."
                : editingKey
                ? "Update"
                : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

