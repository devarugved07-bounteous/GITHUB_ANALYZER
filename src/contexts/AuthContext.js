"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (typeof window !== "undefined") {
        const userId = localStorage.getItem("userId");
        if (userId) {
          // Verify user session
          const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Invalid session, clear it
            localStorage.removeItem("userId");
            localStorage.removeItem("authToken");
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user ID and JWT token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("userId", data.user.id);
          if (data.token) {
            localStorage.setItem("authToken", data.token);
          }
        }
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user ID and JWT token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("userId", data.user.id);
          if (data.token) {
            localStorage.setItem("authToken", data.token);
          }
        }
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Signup failed" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "An error occurred during signup" };
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
    }
    setUser(null);
    // Navigate to landing page
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

