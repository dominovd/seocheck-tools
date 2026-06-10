import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";
import { allToolsSorted } from "@/lib/tools-catalog";
import { siteConfig } from "@/lib/site-config";

type CompetitorInfo = {
  slug: string;
  name: string;
  tagline: string;
  pricing: string;
};

const COMPETITORS: Record<string, CompetitorInfo> = {
  vidiq: {
    slug: "vidiq",
    name: "VidIQ",
    tagline:
      "Browser extension and dashboard for YouTube creator analytics, daily ideas, and AI-assisted optimization.",
    pricing: "Pro $7.50/mo, Boost $39/mo, with limited free tier.",
  },
  tuberanker: {
    slug: "tuberanker",
    name: "TubeRanker",
    tagline:
      "Mid-market YouTube SEO platform with tag generator, channel audit, keyword tool, and rank tracker.",
    pricing: "Basic $19/mo, Advanced $49/mo, 14-day free trial.",
  },
  keywordtool: {
    slug: "keywordtool",
    name: "Keywordtool.io",
    tagline:
      "Keyword research SaaS aggregating autocomplete data from YouTube, Google, Bing, Amazon, and others.",
    pricing: "Pro Basic $89/mo and up.",
  },
  "keyword-surfer": {
    slug: "keyword-surfer",
    name: "Keyword Surfer",
    tagline:
      "Chrome extension for in-SERP keyword volume and related terms, by Surfer SEO.",
    pricing: "Free Chrome extension; Surfer SEO suite $89/mo and up.",
  },
};

export function generateStaticParams() {
  return Object.keys(COMPETITORS).map((competitor) => ({ competitor }));
}

export async function generateMetadata({
  params,
}: {
  params: { competitor: string };
}) {
  const info = COMPETITORS[params.competitor];
  if (!info) return buildMetadata({ title: "Comparison", description: "" });
  return buildMetadata({
    title: `vs ${info.name}`,
    description: `Side-by-side comparison of ${siteConfig.name} and ${info.name} — features, pricing, and trade-offs.`,
    path: `compare/${info.slug}`,
  });
}

export default function ComparisonPage({
  params,
}: {
  params: { competitor: string };
}) {
  const info = COMPETITORS[params.competitor];
  if (!info) notFound();

  const liveTools = allToolsSorted().filter((t) => t.status === "live");

  return (
    <>
      <Container as="main" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Comparison
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {siteConfig.name} vs {info.name}
          </h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">{info.tagline}</p>
        </div>

        {/* Quick-view comparison */}
        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-gray-500"></th>
                <th className="px-5 py-3 text-left font-semibold text-brand-700">
                  {siteConfig.name}
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">
                  {info.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Pricing</th>
                <td className="px-5 py-3 text-brand-700 font-medium">Free forever</td>
                <td className="px-5 py-3">{info.pricing}</td>
              </tr>
              <tr>
                <th className="px-5 py-3 text-left font-medium">Signup required</th>
                <td className="px-5 py-3 text-brand-700 font-medium">No</td>
                <td className="px-5 py-3">Yes</td>
              </tr>
              <tr>
                <th className="px-5 py-3 text-left font-medium">Tools count</th>
                <td className="px-5 py-3 text-brand-700 font-medium">
                  {liveTools.length} (and growing)
                </td>
                <td className="px-5 py-3">Varies</td>
              </tr>
              <tr>
                <th className="px-5 py-3 text-left font-medium">AI generators</th>
                <td className="px-5 py-3 text-brand-700 font-medium">
                  6 (Claude Haiku)
                </td>
                <td className="px-5 py-3">Limited</td>
              </tr>
              <tr>
                <th className="px-5 py-3 text-left font-medium">
                  Competitor tag extraction
                </th>
                <td className="px-5 py-3 text-brand-700 font-medium">
                  Free, unlimited
                </td>
                <td className="px-5 py-3">Often paid-tier feature</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Honest note */}
        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-amber-200 bg-amber-50/60 p-5">
          <p className="text-sm text-amber-900">
            <strong>Honest disclosure:</strong> we&apos;re still drafting the
            full side-by-side. {info.name} is a well-established product with
            features {siteConfig.name} doesn&apos;t cover — channel analytics,
            in-Studio bulk edits, rank tracking. Use them for the deep
            workflow, use us for the free, no-signup utilities that don&apos;t
            need a subscription.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl justify-center">
          <Link href="/tools" className="btn-primary">
            Browse all our tools
          </Link>
        </div>
      </Container>
    </>
  );
}
