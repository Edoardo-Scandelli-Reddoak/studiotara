"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function AnalyticsPing() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const url = `${API_BASE}/api/analytics/pageview/`;
    const body = JSON.stringify({ path: pathname });

    try {
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(url, blob);
        return;
      }
    } catch {
      // fall through to fetch
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // silent fail — analytics shouldn't break navigation
    });
  }, [pathname]);

  return null;
}
