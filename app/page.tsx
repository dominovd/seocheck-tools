import { Container } from "@/components/Container";
import { ToolCard } from "@/components/ToolCard";
import { allToolsSorted } from "@/lib/tools-catalog";

export default function HomePage() {
  const tools = allToolsSorted();

  return (
    <>
      {/* Hero */}
      <Container as="section" className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Free YouTube SEO Toolkit
          </h1>
          <p className="mt-5 text-lg text-gray-600 sm:text-xl">
            Generate titles, descriptions, tags, and ideas with AI. Download thumbnails,
            calculate earnings, format chapters — everything you need to grow on YouTube,
            in one place.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-medium text-brand-700">No signup</span>
            {" · "}
            <span className="font-medium text-brand-700">No credit card</span>
            {" · "}
            <span className="font-medium text-brand-700">Privacy-first</span>
          </p>
        </div>
      </Container>

      {/* Tool grid */}
      <Container as="section" id="tools" className="pb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            All tools
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {tools.filter((t) => t.status === "live").length} live ·{" "}
            {tools.filter((t) => t.status === "coming-soon").length} coming soon
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </Container>
    </>
  );
}
