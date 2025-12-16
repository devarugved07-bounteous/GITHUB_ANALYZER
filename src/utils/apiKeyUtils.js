/**
 * Utility functions for API key operations
 */

export const generateApiKey = () => {
  return `myapp_${Math.random().toString(36).substring(2, 15)}${Math.random()
    .toString(36)
    .substring(2, 15)}`;
};

export const maskApiKey = (key) => {
  if (key.length <= 8) return key;
  return key.substring(0, 8) + "•".repeat(12) + key.substring(key.length - 4);
};

export const formatApiKeyData = (data) => {
  return data.map((key) => ({
    id: key.id,
    name: key.name,
    key: key.key,
    createdAt: new Date(key.created_at).toLocaleDateString(),
    lastUsed: key.last_used
      ? new Date(key.last_used).toLocaleDateString()
      : "Never",
    usage: key.usage || 0,
    rateLimit: key.rate_limit || 100,
  }));
};

