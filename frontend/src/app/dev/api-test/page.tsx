"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/ApiError";

export default function ApiTestPage() {
  const [result, setResult] = useState("");

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  async function testApi(endpoint: string) {
    setResult("Checking...");

    try {
      const data = await apiClient<string>(endpoint);

      setResult(`Success: ${data}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setResult(`Error: ${error.status} - ${error.message}`);
      } else {
        setResult("Unknown error");
      }
    }
  }

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">API Client Test</h1>

      <div className="flex gap-4">
        <button
          className="border rounded px-4 py-2"
          onClick={() => testApi("/health/live")}
        >
          Test Liveness
        </button>

        <button
          className="border rounded px-4 py-2"
          onClick={() => testApi("/nonexistent")}
        >
          Test 404
        </button>
      </div>

      <pre>{result}</pre>
    </main>
  );
}
