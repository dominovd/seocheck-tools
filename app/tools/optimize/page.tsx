import { StageHub } from "@/components/StageHub";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Optimize — YouTube SEO Tools for Titles, Thumbnails, Tags & Hashtags",
  description:
    "Free YouTube tools for the Optimize stage: shape the surfaces viewers actually click. Title Generator, Title Score Checker, Tag Generator, Hashtag Generator, Thumbnail Downloader.",
  path: "tools/optimize",
});

export default function OptimizeHubPage() {
  return <StageHub stage="optimize" />;
}
