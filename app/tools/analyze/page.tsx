import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "YouTube analytics & channel audit tools",
  description:
    "Free YouTube Analyze tools — Channel Audit, Video Audit with AI Fix-with-AI, Outlier Finder, Money Calculator. Raw YouTube metrics plus editorial recommendations, with weekly trend tracking.",
  path: "tools/analyze",
});

export default function AnalyzeHubPage() {
  return <StageHub stage="analyze" />;
}
