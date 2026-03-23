import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ResultCard } from "@/components/results/ResultCard";
import { ResultDetailPanel } from "@/components/results/ResultDetailPanel";
import { InsightsSidebar } from "@/components/results/InsightsSidebar";
import { searchRepositories, type SearchResultItem } from "@/lib/api";
import { normaliseResults, type NormalisedResult } from "@/lib/resultNormaliser";
import { saveItem, getSavedItems, type SavedItem } from "@/lib/storage";
import { capabilities } from "@/config/taxonomy";
import type { SearchFormData } from "@/lib/queryBuilder";
import type { ResultLimit, ResultMode } from "@/config/taxonomy";
import { Loader2, ArrowLeft, AlertCircle, SearchX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationState {
  formData: SearchFormData;
  queries: { primary: string; alternatives: string[]; technical?: string };
  limit: ResultLimit;
  resultMode: ResultMode;
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [results, setResults] = useState<NormalisedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState("");
  const [inspecting, setInspecting] = useState<NormalisedResult | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const refreshSaved = useCallback(() => setSavedItems(getSavedItems()), []);

  useEffect(() => {
    refreshSaved();
  }, [refreshSaved]);

  const searchTags = state?.formData.selectedCapabilities
    .map((id) => capabilities.find((c) => c.id === id)?.label ?? id) ?? [];

  const runSearch = useCallback(
    async (query: string) => {
      if (!state) return;
      setLoading(true);
      setError(null);
      setActiveQuery(query);
      try {
        const raw = await searchRepositories({ query, limit: state.limit, resultMode: state.resultMode });
        setResults(normaliseResults(raw, searchTags));
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unexpected error occurred.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [state, searchTags]
  );

  useEffect(() => {
    if (state?.queries.primary) {
      runSearch(state.queries.primary);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = (result: NormalisedResult) => {
    const alreadySaved = savedItems.some((s) => s.result.title === result.raw.title || s.result.url === result.raw.url);
    if (!alreadySaved) {
      saveItem(result.raw, activeQuery);
      refreshSaved();
    }
  };

  const isSaved = (result: NormalisedResult) =>
    savedItems.some((s) => (s.result.title && s.result.title === result.raw.title) || (s.result.url && s.result.url === result.raw.url));

  if (!state) {
    return (
      <AppLayout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground mb-4">No search data found. Start a new search.</p>
          <Button asChild><Link to="/">Go to search</Link></Button>
        </div>
      </AppLayout>
    );
  }

  const altQueries = [...state.queries.alternatives, ...(state.queries.technical ? [state.queries.technical] : [])].filter(
    (q) => q !== activeQuery
  );

  return (
    <AppLayout>
      <div className="container py-8">
        {/* Search summary */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="gap-1.5 mb-3" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />Edit search
          </Button>
          <div className="spf-card">
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="font-medium">Query:</span>
              <span className="text-muted-foreground">{activeQuery}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main results */}
          <div className="flex-1 min-w-0">
            {loading && (
              <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching repositories…</span>
              </div>
            )}

            {error && (
              <div className="spf-card border-destructive/50 text-center py-10">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
                <p className="font-medium">Something went wrong</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                <Button variant="outline" size="sm" className="mt-4 gap-1.5" onClick={() => runSearch(activeQuery)}>
                  <RefreshCw className="w-3.5 h-3.5" />Try again
                </Button>
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="text-center py-16">
                <SearchX className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters or using one of the alternative queries below.
                </p>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
                {results.map((r) => (
                  <ResultCard
                    key={r.id}
                    result={r}
                    onInspect={setInspecting}
                    onSave={handleSave}
                    isSaved={isSaved(r)}
                  />
                ))}
              </div>
            )}

            {/* Alternative queries */}
            {altQueries.length > 0 && (
              <div className="mt-8 spf-card">
                <h3 className="text-sm font-semibold mb-3">Alternative queries</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Try these alternative searches generated from your filters.
                </p>
                <div className="space-y-2">
                  {altQueries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => runSearch(q)}
                      disabled={loading}
                      className="w-full text-left px-3 py-2 rounded border text-sm hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <InsightsSidebar results={results} />

            <div className="spf-card mt-4">
              <p className="text-xs text-muted-foreground">
                These results are from publicly searchable government code repositories. Presence in
                search results does not indicate official reuse, endorsement, or service ownership.
              </p>
            </div>
          </div>
        </div>
      </div>

      {inspecting && (
        <ResultDetailPanel
          result={inspecting}
          onClose={() => setInspecting(null)}
          onSave={handleSave}
          isSaved={isSaved(inspecting)}
          query={activeQuery}
          onRerunSimilar={(q) => {
            setInspecting(null);
            runSearch(q);
          }}
        />
      )}
    </AppLayout>
  );
}
