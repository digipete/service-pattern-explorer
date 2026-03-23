import type { SearchResultItem } from "./api";

export interface NormalisedResult {
  id: string;
  title: string;
  organisation: string;
  snippet: string;
  url: string;
  relevance: "High" | "Medium" | "Low";
  tags: string[];
  raw: SearchResultItem;
}

export function normaliseResults(results: SearchResultItem[], searchTags: string[]): NormalisedResult[] {
  return results.map((r, index) => ({
    id: crypto.randomUUID(),
    title: r.title || r.repository || r.source || "Untitled repository",
    organisation: r.organisation || extractOrg(r) || "Unknown",
    snippet: r.snippet || r.description || "",
    url: r.url || r.source || "",
    relevance: index < 3 ? "High" : index < 7 ? "Medium" : "Low",
    tags: inferTags(r, searchTags),
    raw: r,
  }));
}

function extractOrg(r: SearchResultItem): string {
  const repo = (r.repository || r.url || "") as string;
  const match = repo.match(/github\.com\/([^/]+)/);
  return match ? match[1] : "";
}

function inferTags(r: SearchResultItem, searchTags: string[]): string[] {
  const text = JSON.stringify(r).toLowerCase();
  return searchTags.filter((tag) => text.includes(tag.toLowerCase())).slice(0, 5);
}

export function extractInsights(results: NormalisedResult[]): {
  recurringCapabilities: string[];
  recurringOrgs: string[];
  themes: string[];
} {
  const tagCounts = new Map<string, number>();
  const orgCounts = new Map<string, number>();

  results.forEach((r) => {
    r.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1));
    if (r.organisation !== "Unknown") orgCounts.set(r.organisation, (orgCounts.get(r.organisation) || 0) + 1);
  });

  const recurringCapabilities = [...tagCounts.entries()]
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t)
    .slice(0, 6);

  const recurringOrgs = [...orgCounts.entries()]
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([o]) => o)
    .slice(0, 5);

  const themes: string[] = [];
  if (recurringCapabilities.length > 2) themes.push("Multiple repositories appear to share common capabilities");
  if (recurringOrgs.length > 0) themes.push("Some organisations appear multiple times across results");

  return { recurringCapabilities, recurringOrgs, themes };
}
