
import { ApiError } from "./ApiError";
import type { ProblemDetails } from "./types";

const API_BASE_URL = "/api/v1";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        credentials: "same-origin",
        cache: "no-store",
      },
    );
  } catch (error) {
    if (options.signal?.aborted) {
      throw error;
    }

    throw new ApiError(
      "Unable to connect to the server.",
      0,
    );
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  const isJson = contentType.includes("json");

  if (!response.ok) {
    let problem: ProblemDetails | undefined;

    if (isJson) {
      try {
        const data: unknown = await response.json();

        if (
          typeof data === "object" &&
          data !== null &&
          !Array.isArray(data)
        ) {
          problem = data as ProblemDetails;
        }
      } catch (error) {
        if (options.signal?.aborted) {
          throw error;
        }
      }
    }

    const message =
      typeof problem?.detail === "string"
        ? problem.detail
        : typeof problem?.title === "string"
          ? problem.title
          : "The request could not be completed.";

    throw new ApiError(
      message,
      response.status,
      problem,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    if (isJson) {
      return (await response.json()) as T;
    }

    if (contentType.includes("text/plain")) {
      return (await response.text()) as T;
    }
  } catch (error) {
    if (options.signal?.aborted) {
      throw error;
    }

    throw new ApiError(
      "Unable to read the server response.",
      response.status,
    );
  }

  throw new ApiError(
    "Unexpected response format.",
    response.status,
  );
}
