import { ScreenshotCarousel } from "./ScreenshotCarousel";

export function TitleGeneratorScreenshot() {
  return (
    <ScreenshotCarousel
      screenshots={[
        {
          src: "/screenshots/title-generator.webp",
          alt: "AI YouTube Title Generator showing 10 generated titles for a React tutorial topic",
          width: 1220,
          height: 1506,
        },
      ]}
    />
  );
}

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

export function ChannelAuditScreenshots() {
  return (
    <ScreenshotCarousel
      screenshots={[
        {
          src: "/screenshots/channel-audit-1.webp",
          alt: "YouTube Channel Audit showing average score 59 with top recurring issues across last 10 uploads",
          width: 1212,
          height: 1452,
        },
        {
          src: "/screenshots/channel-audit-2.webp",
          alt: "Per-dimension breakdown across 10 audited videos with worst dimension flagged and per-video scores",
          width: 1142,
          height: 1438,
        },
      ]}
    />
  );
}

export function VideoAuditScreenshots() {
  return (
    <ScreenshotCarousel
      screenshots={[
        {
          src: "/screenshots/video-audit-1.webp",
          alt: "YouTube Video Audit result showing overall score 65 with weaknesses summary and Fix with AI button",
          width: 1386,
          height: 1480,
        },
        {
          src: "/screenshots/video-audit-2.webp",
          alt: "Video audit per-dimension breakdown with Title, Description, Tags, Hashtags and Chapters scores",
          width: 1294,
          height: 1372,
        },
      ]}
    />
  );
}
