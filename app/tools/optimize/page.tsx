import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "YouTube title, thumbnail & tag tools",
  description:
    "Free YouTube Optimize tools — AI Title Generator, Title Analyzer, Thumbnail Preview, Tag and Hashtag Generators. Shape the surfaces viewers click.",
  path: "tools/optimize",
});

export default function OptimizeHubPage() {
  return <StageHub stage="optimize" />;
}
