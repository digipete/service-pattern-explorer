import type { NormalisedResult } from "@/lib/resultNormaliser";
import { Bookmark, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  result: NormalisedResult;
  onInspect: (result: NormalisedResult) => void;
  onSave: (result: NormalisedResult) => void;
  isSaved: boolean;
}

const relevanceColors: Record<string, string> = {
  High: "bg-relevance-high text-primary-foreground",
  Medium: "bg-relevance-medium text-foreground",
  Low: "bg-relevance-low text-primary-foreground",
};

export function ResultCard({ result, onInspect, onSave, isSaved }: ResultCardProps) {
  return (
    <article className="spf-card animate-fade-in" aria-label={result.title}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold truncate">{result.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${relevanceColors[result.relevance]}`}>
              {result.relevance}
            </span>
          </div>
          {result.organisation !== "Unknown" && (
            <p className="text-sm text-muted-foreground mt-0.5">{result.organisation}</p>
          )}
        </div>
      </div>

      {result.snippet && (
        <p className="text-sm mt-3 text-foreground/80 line-clamp-3">{result.snippet}</p>
      )}

      {result.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {result.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-3 border-t">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onInspect(result)}>
          <Eye className="w-3.5 h-3.5" />
          Inspect
        </Button>
        <Button
          variant={isSaved ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => onSave(result)}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </Button>
        {result.url && (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
}
