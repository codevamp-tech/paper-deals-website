"use client";
import { useEffect, useState } from "react";
import { themes } from "@/theme";

export function useTheme() {
  const [mode, setMode] = useState<"B2B" | "B2C">("B2B");

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    setMode(storedMode === "B2C" ? "B2C" : "B2B");
  }, []);

  const theme = themes[mode];

  return { mode, theme, setMode };
}
