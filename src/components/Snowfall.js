"use client";

import { useEffect, useState } from "react";

export default function Snowfall({ isActive }) {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setSnowflakes([]);
      return;
    }

    // Create snowflakes (fewer on small screens for performance)
    const createSnowflakes = () => {
      const isNarrow = typeof window !== "undefined" && window.innerWidth < 768;
      const count = isNarrow ? 120 : 500;
      const flakes = Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // Distribute across full width
        top: -50 + Math.random() * 150, // Distribute from above viewport to below (-50% to 100%)
        animationDuration: 10 + Math.random() * 20, // 10-30 seconds
        animationDelay: 0, // No delay - start immediately
        size: 1 + Math.random() * 0.25, // 1-3.5px - smaller flakes
        opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
        drift: -15 + Math.random() * 30, // Horizontal drift in pixels
      }));
      setSnowflakes(flakes);
    };

    createSnowflakes();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            top: `${flake.top}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            "--base-opacity": flake.opacity,
            animation: `snowfall ${flake.animationDuration}s linear ${flake.animationDelay}s infinite`,
            transform: `translateX(${flake.drift}px)`,
            boxShadow: `0 0 ${flake.size * 2}px ${flake.size}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ))}
    </div>
  );
}
