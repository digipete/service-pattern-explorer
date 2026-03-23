import { extractInsights, type NormalisedResult } from "@/lib/resultNormaliser";

interface InsightsSidebarProps {
  results: NormalisedResult[];
}

export function InsightsSidebar({ results }: InsightsSidebarProps) {
  const insights = extractInsights(results);

  if (insights.recurringCapabilities.length === 0 && insights.recurringOrgs.length === 0 && insights.themes.length === 0) {
    return null;
  }

  return (
    <aside className="spf-card space-y-5" aria-label="Search insights">
      <h3 className="font-semibold text-sm">Insights</h3>
      <p className="text-xs text-muted-foreground">
        These observations are inferred from the current results. They may indicate potential patterns but should not be treated as definitive.
      </p>

      {insights.recurringCapabilities.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Recurring capabilities</h4>
          <div className="flex flex-wrap gap-1.5">
            {insights.recurringCapabilities.map((c) => (
              <span key={c} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{c}</span>
            ))}
          </div>
        </div>
      )}

      {insights.recurringOrgs.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Organisations appearing multiple times</h4>
          <ul className="text-sm space-y-1">
            {insights.recurringOrgs.map((o) => (
              <li key={o} className="text-foreground/80">• {o}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.themes.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Possible patterns</h4>
          <ul className="text-sm space-y-1">
            {insights.themes.map((t, i) => (
              <li key={i} className="text-foreground/80">• {t}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
