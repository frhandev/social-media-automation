"use client";

import { apiClient } from "@/lib/api/client";
import React, { useEffect } from "react";

type BackendState = "checking" | "connected" | "offline";

const CHECK_INTERVAL = 10_000; // 10 seconds
const REQUEST_TIMEOUT = 5_000; // 5 seconds

const statusConfig = {
  checking: {
    label: "Checking backend",
    description: "Checking API connection...",
    color: "bg-yellow-500",
  },
  connected: {
    label: "Backend connected",
    description: "API is reachable",
    color: "bg-green-500",
  },
  offline: {
    label: "Backend offline",
    description: "Unable to reach the API",
    color: "bg-red-500",
  },
} as const;

export default function BackendStatus() {
  const [status, setStatus] = React.useState<BackendState>("checking");

  useEffect(() => {
    let disposed = false;

    let pollTimer: ReturnType<typeof setTimeout>;

    let controller: AbortController | undefined;

    async function checkBackend() {
      controller = new AbortController();

      const timeout = setTimeout(() => {
        controller?.abort();
      }, REQUEST_TIMEOUT);

      try {
        const response = await apiClient<string>("/health/live", {
          signal: controller.signal,
        });

        if (disposed) return;

        setStatus(response.trim() === "Healthy" ? "connected" : "offline");
      } catch {
        if (!disposed) {
          setStatus("offline");
        }
      } finally {
        clearTimeout(timeout);

        if (!disposed) {
          pollTimer = setTimeout(checkBackend, CHECK_INTERVAL);
        }
      }
    }

    void checkBackend();

    return () => {
      disposed = true;
      controller?.abort();
      clearTimeout(pollTimer);
    };
  }, []);

  const config = statusConfig[status];

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 flex
        items-center gap-3 rounded-xl border
        border-border bg-background px-4 py-3 shadow-lg"
    >
      <span
        aria-hidden="true"
        className={`size-2.5 rounded-full ${config.color}
          ${status === "checking" ? "animate-pulse" : ""}`}
      />

      <div className="flex flex-col">
        <span className="text-xs font-semibold">{config.label}</span>

        <span className="text-[10px] text-muted-foreground">
          {config.description}
        </span>
      </div>
    </div>
  );
}
