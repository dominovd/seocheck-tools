import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "YouTube analytics & channel audit tools",
  description:
    "Free YouTube Analyze tools — Visibility Score, Channel Audit, Video Audit with AI Fix-with-AI, Money Calculator. Composite scoring and weekly trend tracking.",
  path: "tools/analyze",
});

export default function AnalyzeHubPage() {
  return <StageHub stage="analyze" />;
}
