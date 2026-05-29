import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Research — YouTube SEO Tools for Niche & Competitor Discovery",
  description:
    "Free YouTube tools for the Research stage: find what to make, scout competitors, validate topics, discover keywords. Competitor Analyzer, Keyword Tool, Video Ideas, Tag Extractor, more.",
  path: "tools/research",
});

export default function ResearchHubPage() {
  return <StageHub stage="research" />;
}
