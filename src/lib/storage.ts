import type { SearchResultItem } from "./api";

export interface SavedItem {
  id: string;
  result: SearchResultItem;
  note: string;
  savedAt: string;
  query: string;
}

const SAVED_KEY = "spf-saved-items";
const RECENT_KEY = "spf-recent-searches";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Saved items
export function getSavedItems(): SavedItem[] {
  return readJSON<SavedItem[]>(SAVED_KEY, []);
}

export function saveItem(result: SearchResultItem, query: string, note = ""): SavedItem {
  const items = getSavedItems();
  const item: SavedItem = {
    id: crypto.randomUUID(),
    result,
    note,
    savedAt: new Date().toISOString(),
    query,
  };
  items.unshift(item);
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
  return item;
}

export function updateItemNote(id: string, note: string): void {
  const items = getSavedItems();
  const item = items.find((i) => i.id === id);
  if (item) {
    item.note = note;
    localStorage.setItem(SAVED_KEY, JSON.stringify(items));
  }
}

export function removeItem(id: string): void {
  const items = getSavedItems().filter((i) => i.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

export function clearAllItems(): void {
  localStorage.removeItem(SAVED_KEY);
}

export function exportAsJSON(items: SavedItem[]): string {
  return JSON.stringify(items, null, 2);
}

export function exportAsMarkdown(items: SavedItem[]): string {
  let md = "# Saved Service Patterns\n\n";
  md += `_Exported on ${new Date().toLocaleDateString("en-GB")}_\n\n`;
  items.forEach((item, i) => {
    const title = item.result.title || item.result.repository || "Untitled";
    md += `## ${i + 1}. ${title}\n\n`;
    if (item.result.organisation) md += `**Organisation:** ${item.result.organisation}\n\n`;
    if (item.result.snippet || item.result.description) md += `> ${item.result.snippet || item.result.description}\n\n`;
    if (item.result.url) md += `**Source:** ${item.result.url}\n\n`;
    if (item.note) md += `**Note:** ${item.note}\n\n`;
    md += `**Search query:** ${item.query}\n\n---\n\n`;
  });
  return md;
}

// Recent searches
export interface RecentSearch {
  query: string;
  timestamp: string;
  productType: string;
}

export function getRecentSearches(): RecentSearch[] {
  return readJSON<RecentSearch[]>(RECENT_KEY, []);
}

export function addRecentSearch(search: RecentSearch): void {
  const items = getRecentSearches().filter((s) => s.query !== search.query);
  items.unshift(search);
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, 10)));
}
