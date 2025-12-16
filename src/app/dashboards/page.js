"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useToast } from "@/hooks/useToast";
import { useSidebar } from "@/hooks/useSidebar";
import Sidebar from "@/components/Sidebar";
import ApiKeysTable from "@/components/ApiKeysTable";
import CreateEditModal from "@/components/CreateEditModal";
import Toast from "@/components/Toast";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardsPage() {
  const router = useRouter();
  const {
    apiKeys,
    loading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const { toast, showToast, hideToast } = useToast();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({ name: "", key: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (key = null) => {
    if (key) {
      setEditingKey(key);
      setFormData({ name: key.name, key: key.key });
    } else {
      setEditingKey(null);
      setFormData({ name: "", key: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
    setFormData({ name: "", key: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      if (editingKey) {
        result = await updateApiKey(editingKey.id, formData.name, formData.key);
        if (result.success) {
          showToast("API key updated successfully!", "success");
        } else {
          showToast(result.error, "error");
        }
      } else {
        result = await createApiKey(formData.name, formData.key);
        if (result.success) {
          showToast("API key created successfully!", "success");
        } else {
          showToast(result.error, "error");
        }
      }

      if (result.success) {
        handleCloseModal();
      }
    } catch (err) {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this API key?")) {
      return;
    }

    const result = await deleteApiKey(id);
    if (result.success) {
      showToast("API key deleted successfully!", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <ProtectedRoute>
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
          {/* Header with Toggle Button and Back Button */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
              <button
                onClick={() => router.push("/")}
                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700" />
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                Overview
              </h1>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          {/* API Keys Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-zinc-50">
                  API Keys
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  The key is used to authenticate your requests to the API. To
                  learn more, see the documentation page.
                </p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Key
              </button>
            </div>

            {/* API Keys List */}
            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-800">
              <ApiKeysTable
                apiKeys={apiKeys}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onCopy={handleCopy}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Create/Edit */}
      <CreateEditModal
        isOpen={isModalOpen}
        editingKey={editingKey}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onFormDataChange={setFormData}
      />
      </div>
    </ProtectedRoute>
  );
}
