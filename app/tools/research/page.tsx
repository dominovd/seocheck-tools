import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "YouTube niche & competitor research tools",
  description:
    "Free YouTube Research tools — Competitor Analyzer, Outlier Finder, Keyword Tool, Video Idea Generator, Tag Extractor. Find what to make before recording.",
  path: "tools/research",
});

export default function ResearchHubPage() {
  return <StageHub stage="research" />;
}
