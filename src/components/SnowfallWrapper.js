"use client";

import { useSnowfall } from "@/contexts/SnowfallContext";
import Snowfall from "./Snowfall";

export default function SnowfallWrapper() {
  const { isSnowing } = useSnowfall();
  return <Snowfall isActive={isSnowing} />;
}
