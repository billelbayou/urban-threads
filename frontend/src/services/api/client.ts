const rawApiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
export const api = rawApiBase.replace(/\/+$/, "");

// Default timeout for fetch requests (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

/**
 * Builds standard headers for API requests.
 * Handles cookie forwarding and content-type.
 */
export function buildHeaders(opts: {
  cookie?: string;
  contentType?: string;
} = {}): Record<string, string> {
  const headers: Record<string, string> = {};
  if (opts.contentType) headers["Content-Type"] = opts.contentType;
  if (opts.cookie) headers["cookie"] = opts.cookie;
  return headers;
}

// Helper function to create fetch with timeout
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};
