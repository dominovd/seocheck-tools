import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Publish — YouTube SEO Tools for Descriptions, Chapters & Embeds",
  description:
    "Free YouTube tools for the Publish stage: format the description, chapters, and embeds the way YouTube expects. Description Generator, Chapter Generator, Embed Code Generator.",
  path: "tools/publish",
});

export default function PublishHubPage() {
  return <StageHub stage="publish" />;
}
