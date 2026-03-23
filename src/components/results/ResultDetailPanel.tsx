import type { NormalisedResult } from "@/lib/resultNormaliser";
import { X, ExternalLink, Bookmark, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultDetailPanelProps {
  result: NormalisedResult;
  onClose: () => void;
  onSave: (result: NormalisedResult) => void;
  isSaved: boolean;
  query: string;
  onRerunSimilar?: (query: string) => void;
}

export function ResultDetailPanel({ result, onClose, onSave, isSaved, query, onRerunSimilar }: ResultDetailPanelProps) {
  const copyLink = () => {
    navigator.clipboard.writeText(result.url || window.location.href);
  };

  const copyCitation = () => {
    const citation = `${result.title} — ${result.organisation}. Found via Service Pattern Finder searching: "${query}". Source: ${result.url || "N/A"}`;
    navigator.clipboard.writeText(citation);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Result detail">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card shadow-xl overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold truncate pr-4">{result.title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted" aria-label="Close detail panel">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {result.organisation !== "Unknown" && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Organisation</h3>
              <p className="mt-1">{result.organisation}</p>
            </div>
          )}

          {result.url && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-primary hover:underline break-all">
                {result.url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          )}

          {result.snippet && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Evidence / snippet</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap bg-muted rounded p-3">{result.snippet}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Why this may be relevant</h3>
            <p className="mt-1 text-sm">
              This result appears related to your search for patterns involving{" "}
              {result.tags.length > 0 ? result.tags.join(", ") : "the selected product type"}.
              It was ranked as <strong>{result.relevance}</strong> relevance based on its position in search results.
            </p>
          </div>

          {result.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Matched themes</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant={isSaved ? "secondary" : "outline"} size="sm" className="gap-1.5" onClick={() => onSave(result)}>
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={copyLink}>
                <Copy className="w-3.5 h-3.5" />Copy link
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={copyCitation}>
                <Copy className="w-3.5 h-3.5" />Copy citation
              </Button>
              {onRerunSimilar && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onRerunSimilar(result.title)}>
                  <RefreshCw className="w-3.5 h-3.5" />Rerun similar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
