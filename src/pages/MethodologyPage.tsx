import { AppLayout } from "@/components/AppLayout";

export default function MethodologyPage() {
  return (
    <AppLayout>
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Methodology</h1>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">What this tool does</h2>
            <p>
              Service Pattern Finder helps product managers, service designers, architects, and
              delivery leads explore whether a similar type of digital service or capability has
              already been built somewhere in UK government code repositories.
            </p>
            <p className="mt-2">
              You describe the kind of service you're interested in — its type, users, features,
              and challenges — and the tool generates descriptive search queries against an index
              of publicly searchable government code repositories.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">How semantic search works</h2>
            <p>
              This tool uses <strong>semantic search</strong>, which matches the meaning and
              intent of your query rather than just matching individual keywords. This means
              longer, more descriptive queries tend to produce better results than short,
              keyword-only searches.
            </p>
            <p className="mt-2">
              For example, <em>"case management service for local government staff with document
              upload and workflow approvals"</em> will typically return more relevant results than
              simply searching for <em>"case management"</em>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Why descriptive queries work better</h2>
            <p>
              The search engine uses vector embeddings to understand what you're looking for.
              When you describe your service pattern in plain English — including the product type,
              who uses it, what features it needs, and what problems it solves — the system can
              find repositories with similar patterns even if they use different terminology.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">What the results mean</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                Results indicate that a public code repository contains content semantically
                related to your query.
              </li>
              <li>
                A result does not mean that a live, operational service exists based on that code.
              </li>
              <li>
                Repositories may contain prototypes, proof-of-concepts, archived projects, or
                components that were never deployed.
              </li>
              <li>
                Relevance indicators (High, Medium, Low) are based on the result's position in
                the search ranking and are approximate.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">What the results do not mean</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Finding a repository does not confirm a service is live or in use.</li>
              <li>Results do not indicate official endorsement, approval, or readiness for reuse.</li>
              <li>The tool cannot verify whether code is maintained, secure, or production-ready.</li>
              <li>Organisations shown may not be the current maintainers.</li>
            </ul>
          </section>

          <section className="spf-notice">
            <h2 className="text-base font-semibold mb-2">Disclaimer</h2>
            <p>
              Service Pattern Finder is an <strong>unofficial research and discovery tool</strong>.
              It is not affiliated with, endorsed by, or operated by any government department or
              agency. It searches publicly available data and should be used to inform early
              discovery and reduce duplication — not to confirm service ownership, availability,
              or fitness for purpose.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
