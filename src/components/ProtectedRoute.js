"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import Toast from "./Toast";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (!loading && !user && !hasShownToast) {
      showToast("Login required", "error");
      setHasShownToast(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }, [user, loading, router, showToast, hasShownToast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toast toast={toast} onClose={hideToast} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg text-zinc-600 dark:text-zinc-400">
            Redirecting to login...
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}

