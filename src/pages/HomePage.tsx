import { AppLayout } from "@/components/AppLayout";
import { SearchForm } from "@/components/search/SearchForm";
import { Search, Filter, BarChart3 } from "lucide-react";

const steps = [
  { icon: Search, title: "Describe what you need", text: "Choose a product type and relevant features, users, and challenges." },
  { icon: Filter, title: "We generate smart queries", text: "Your selections are converted into descriptive natural-language search queries." },
  { icon: BarChart3, title: "Explore similar patterns", text: "Browse results from public sector code repositories to find potential matches." },
];

export default function HomePage() {
  return (
    <AppLayout>
      <section className="container py-10 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Find similar public sector service patterns
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Explore whether a digital service, capability, or workflow pattern has already been
            built somewhere in UK government code repositories. Use this to inform discovery
            and reduce duplication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-12">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">{title}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="spf-notice mb-8 max-w-2xl">
          This is an unofficial research tool. It searches publicly available government code
          repositories and does not confirm that any service is live, officially endorsed, or
          available for reuse.
        </div>

        <SearchForm />
      </section>
    </AppLayout>
  );
}
