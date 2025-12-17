"use client";

import { useEffect } from "react";

export default function ColorSchemeHandler() {
  useEffect(() => {
    // Force light mode always
    try {
      document.documentElement.style.colorScheme = "light";
      document.documentElement.setAttribute("data-theme", "light");
    } catch (e) {
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  return null;
}

