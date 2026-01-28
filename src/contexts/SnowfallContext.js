"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SnowfallContext = createContext(null);

export function SnowfallProvider({ children }) {
  const [isSnowing, setIsSnowing] = useState(false);

  useEffect(() => {
    // Load saved preference from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("snowfallEnabled");
      if (saved === "true") {
        setIsSnowing(true);
      }
    }
  }, []);

  const toggleSnowfall = () => {
    setIsSnowing((prev) => {
      const newValue = !prev;
      // Save preference to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("snowfallEnabled", newValue.toString());
      }
      return newValue;
    });
  };

  return (
    <SnowfallContext.Provider value={{ isSnowing, toggleSnowfall }}>
      {children}
    </SnowfallContext.Provider>
  );
}

export function useSnowfall() {
  const context = useContext(SnowfallContext);
  if (!context) {
    throw new Error("useSnowfall must be used within a SnowfallProvider");
  }
  return context;
}
