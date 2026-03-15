export const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Default timeout for fetch requests (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

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
