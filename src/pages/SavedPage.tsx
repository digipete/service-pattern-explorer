import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSavedItems, removeItem, clearAllItems, updateItemNote, exportAsJSON, exportAsMarkdown, type SavedItem } from "@/lib/storage";
import { Trash2, Download, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>(getSavedItems());
  const refresh = () => setItems(getSavedItems());

  const handleRemove = (id: string) => {
    removeItem(id);
    refresh();
  };

  const handleClearAll = () => {
    if (window.confirm("Remove all saved items?")) {
      clearAllItems();
      refresh();
    }
  };

  const handleNoteChange = (id: string, note: string) => {
    updateItemNote(id, note);
    refresh();
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-bold">Saved items</h1>
        <p className="text-muted-foreground mt-1 mb-6">
          Your shortlisted results, stored in this browser only.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-16 spf-card">
            <p className="text-muted-foreground">No saved items yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Save results from the search page to build your shortlist.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => downloadFile(exportAsJSON(items), "saved-patterns.json", "application/json")}>
                <Download className="w-3.5 h-3.5" />Export JSON
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => downloadFile(exportAsMarkdown(items), "saved-patterns.md", "text/markdown")}>
                <FileText className="w-3.5 h-3.5" />Export Markdown
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={handleClearAll}>
                <Trash2 className="w-3.5 h-3.5" />Clear all
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="spf-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {item.result.title || item.result.repository || "Untitled"}
                      </h3>
                      {item.result.organisation && (
                        <p className="text-xs text-muted-foreground">{item.result.organisation}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground"
                      aria-label="Remove saved item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {(item.result.snippet || item.result.description) && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item.result.snippet || item.result.description}
                    </p>
                  )}
                  <div className="mt-3">
                    <label htmlFor={`note-${item.id}`} className="block text-xs font-medium text-muted-foreground mb-1">Note</label>
                    <textarea
                      id={`note-${item.id}`}
                      rows={2}
                      value={item.note}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      placeholder="Add a note…"
                      className="w-full px-2 py-1.5 rounded border text-sm bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Saved {new Date(item.savedAt).toLocaleDateString("en-GB")} · Query: {item.query}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
