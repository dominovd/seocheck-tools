import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

/**
 * Dynamic OG image endpoint.
 *
 * Query params:
 *   title     — page title (required, otherwise default)
 *   subtitle  — page tagline / short description
 *   ai        — "1" to render the AI-powered accent badge
 *
 * Called by lib/seo.ts buildMetadata() for every page; each tool/article gets
 * a unique branded social card without hand-authoring an image per page.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") ?? "Free YouTube SEO Toolkit";
  const subtitle =
    url.searchParams.get("subtitle") ??
    "AI title, description, tag, hashtag, and idea generators · no signup";
  const isAI = url.searchParams.get("ai") === "1";

  const BRAND_GREEN = "#10b981";
  const BG = "#ffffff";
  const TEXT = "#111827";
  const MUTED = "#6b7280";
  const SOFT = "#f3f4f6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header — wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Square brand icon */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: BRAND_GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <div
            style={{
              fontSize: "28px",
              color: TEXT,
              fontWeight: 600,
              display: "flex",
              gap: "6px",
            }}
          >
            <span>SEO</span>
            <span style={{ color: BRAND_GREEN }}>Check</span>
            <span>Tools</span>
          </div>
          {isAI && (
            <div
              style={{
                marginLeft: "20px",
                display: "flex",
                alignItems: "center",
                background: "#ecfdf5",
                color: "#047857",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              AI-powered
            </div>
          )}
        </div>

        {/* Middle — title + subtitle */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 50 ? "64px" : "76px",
              fontWeight: 700,
              color: TEXT,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "32px",
              color: MUTED,
              lineHeight: 1.35,
              marginTop: "24px",
              maxWidth: "1050px",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer — value props bar */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            paddingTop: "24px",
            borderTop: `1px solid ${SOFT}`,
            fontSize: "22px",
            color: MUTED,
          }}
        >
          <span>Free</span>
          <span style={{ color: SOFT }}>•</span>
          <span>No signup</span>
          <span style={{ color: SOFT }}>•</span>
          <span>Privacy-first</span>
          <span style={{ color: SOFT }}>•</span>
          <span>17 tools</span>
        </div>
      </div>
    ),
    SIZE
  );
}
