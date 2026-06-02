import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "YouTube description & chapter tools",
  description:
    "Free YouTube Publish tools — AI Description Generator, Chapter Generator, Embed Code Generator. Format what YouTube expects before you hit publish.",
  path: "tools/publish",
});

export default function PublishHubPage() {
  return <StageHub stage="publish" />;
}
