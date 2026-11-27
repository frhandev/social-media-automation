import { ProblemDetails } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly problemDetails?: ProblemDetails,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get code(): string | undefined {
    return this.problemDetails?.code;
  }

  get traceId(): string | undefined {
    return this.problemDetails?.traceId;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
}
