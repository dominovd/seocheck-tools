import { ScreenshotCarousel } from "./ScreenshotCarousel";

/**
 * Screenshot carousels used on the homepage and guides.
 *
 * The Channel Audit, Video Audit, and Title Generator carousels were
 * removed 2026-07 as part of the YouTube API compliance remediation —
 * the archived shots displayed derived numeric scores (Grade, avg/dim
 * scores, per-video score badges) that fall under policy III.E.4h.
 * Replace them with post-refactor shots once the new UI is stable.
 */

export function ChannelNameGeneratorScreenshots() {
  return (
    <ScreenshotCarousel
      screenshots={[
        {
          src: "/screenshots/channel-name-generator-1.webp",
          alt: "AI YouTube Channel Name Generator with 3 brandable name ideas for a home cooking niche",
          width: 1244,
          height: 1442,
        },
        {
          src: "/screenshots/channel-name-generator-2.webp",
          alt: "Continuation of channel name ideas with rationale and YouTube handle availability check",
          width: 1086,
          height: 1094,
        },
      ]}
    />
  );
}
