import type { ResultMode, ResultLimit } from "@/config/taxonomy";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api-proxy";

export interface SearchParams {
  query: string;
  limit: ResultLimit;
  resultMode: ResultMode;
}

export interface SearchResultItem {
  title?: string;
  repository?: string;
  organisation?: string;
  snippet?: string;
  url?: string;
  source?: string;
  description?: string;
  [key: string]: unknown;
}

export interface SearchResponse {
  results?: SearchResultItem[];
  data?: SearchResultItem[];
  [key: string]: unknown;
}

export async function searchRepositories(params: SearchParams): Promise<SearchResultItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE_URL}/mcp/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: params.query,
        limit: params.limit,
        resultMode: params.resultMode,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data: SearchResponse = await response.json();
    return data.results ?? data.data ?? (Array.isArray(data) ? data : []);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Search request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
