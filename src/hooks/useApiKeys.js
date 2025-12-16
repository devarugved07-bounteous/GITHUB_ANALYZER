"use client";

import { useState, useEffect } from "react";
import { formatApiKeyData } from "@/utils/apiKeyUtils";

/**
 * Get JWT token from localStorage
 */
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

/**
 * Make authenticated API request
 */
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API keys from REST API
  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/api/api-keys", {
        method: "GET",
      });

      const formattedData = formatApiKeyData(response.data || []);
      setApiKeys(formattedData);
    } catch (err) {
      console.error("Error fetching API keys:", err);
      setError(err.message || "Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async (name, key = null) => {
    try {
      setError(null);
      const response = await apiRequest("/api/api-keys", {
        method: "POST",
        body: JSON.stringify({ name, key }),
      });

      await fetchApiKeys();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating API key:", err);
      const errorMessage = err.message || "Failed to create API key";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update existing API key
  const updateApiKey = async (id, name, key) => {
    try {
      setError(null);
      const response = await apiRequest(`/api/api-keys/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, key }),
      });

      await fetchApiKeys();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating API key:", err);
      const errorMessage = err.message || "Failed to update API key";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete API key
  const deleteApiKey = async (id) => {
    try {
      setError(null);
      await apiRequest(`/api/api-keys/${id}`, {
        method: "DELETE",
      });

      await fetchApiKeys();
      return { success: true };
    } catch (err) {
      console.error("Error deleting API key:", err);
      const errorMessage = err.message || "Failed to delete API key";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}

