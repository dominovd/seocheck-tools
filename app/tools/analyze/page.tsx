import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Analyze — YouTube SEO Tools for Video Audit & Earnings",
  description:
    "Free YouTube tools for the Analyze stage: score what's working, surface what's broken, project earnings. Video Audit, Money Calculator.",
  path: "tools/analyze",
});

export default function AnalyzeHubPage() {
  return <StageHub stage="analyze" />;
}
