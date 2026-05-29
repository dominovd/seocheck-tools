/**
 * YouTube Data API v3 wrapper.
 *
 * Used as the middle-tier fallback in the Video Audit when /watch HTML
 * scraping gets 429'd by YouTube. The API is quota-bounded (10K units/day
 * default for new keys) but is rate-limit-safe — quota exhaustion is a
 * different failure mode than IP rate-limiting.
 *
 * Cost: videos.list with parts=snippet,statistics,contentDetails costs
 * 1 unit per call. 10K units/day = ~10K audits/day before exhaustion.
 *
 * Critical limitation: snippet.tags is returned ONLY for the authenticated
 * channel owner. For all other videos the field is omitted entirely.
 * That's why /watch HTML scraping is still primary for tags — the API
 * cannot fill that gap.
 *
 * Set the YOUTUBE_API_KEY environment variable in Vercel to enable this
 * fallback. If absent, callers transparently skip this tier.
 */

export type ApiVideoData = {
  title: string;
  channel: string;
  description: string;
  thumbnailUrl: string | null;
  viewCount: number | null;
  publishDate: string | null;
  lengthSeconds: number | null;
};

type ApiResponse = {
  items?: Array<{
    snippet?: {
      title?: string;
      channelTitle?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: {
        maxres?: { url?: string };
        high?: { url?: string };
        medium?: { url?: string };
      };
    };
    statistics?: { viewCount?: string };
    contentDetails?: { duration?: string };
  }>;
};

export async function fetchVideoFromApi(
  videoId: string,
  apiKey: string
): Promise<ApiVideoData | null> {
  const url =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet,statistics,contentDetails` +
    `&id=${encodeURIComponent(videoId)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as ApiResponse;
    const item = data.items?.[0];
    if (!item) return null;

    const sn = item.snippet ?? {};
    const st = item.statistics ?? {};
    const cd = item.contentDetails ?? {};

    return {
      title: sn.title ?? "",
      channel: sn.channelTitle ?? "",
      description: sn.description ?? "",
      thumbnailUrl:
        sn.thumbnails?.maxres?.url ??
        sn.thumbnails?.high?.url ??
        sn.thumbnails?.medium?.url ??
        null,
      viewCount: st.viewCount ? parseInt(st.viewCount, 10) : null,
      publishDate: sn.publishedAt ? sn.publishedAt.slice(0, 10) : null,
      lengthSeconds: cd.duration ? parseIsoDuration(cd.duration) : null,
    };
  } catch {
    return null;
  }
}

/**
 * Parse ISO 8601 duration (e.g. "PT3M30S", "PT1H2M3S") to seconds.
 * YouTube only emits hours/minutes/seconds for videos (no days/weeks).
 */
function parseIsoDuration(iso: string): number | null {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return null;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const s = m[3] ? parseInt(m[3], 10) : 0;
  return h * 3600 + min * 60 + s;
}

// ─── Channel lookup ────────────────────────────────────────────────────

export type ChannelData = {
  id: string;
  title: string;
  handle: string | null;
  description: string;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  videoCount: number | null;
  viewCount: number | null;
  /** ID of the channel's "uploads" playlist — useful for chronological browsing. */
  uploadsPlaylistId: string | null;
};

type ChannelsApiResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      description?: string;
      customUrl?: string;
      thumbnails?: {
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
    statistics?: {
      subscriberCount?: string;
      videoCount?: string;
      viewCount?: string;
      hiddenSubscriberCount?: boolean;
    };
    contentDetails?: {
      relatedPlaylists?: { uploads?: string };
    };
  }>;
};

/**
 * Look up a channel by ID, handle, or legacy custom URL.
 * Costs 1 unit per call.
 */
export async function fetchChannel(
  lookup: { type: "id"; value: string } | { type: "handle"; value: string } | { type: "legacy"; value: string },
  apiKey: string
): Promise<ChannelData | null> {
  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    key: apiKey,
  });
  if (lookup.type === "id") {
    params.set("id", lookup.value);
  } else if (lookup.type === "handle") {
    params.set("forHandle", `@${lookup.value}`);
  } else {
    // legacy username
    params.set("forUsername", lookup.value);
  }

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ChannelsApiResponse;
    const item = data.items?.[0];
    if (!item?.id) return null;

    const sn = item.snippet ?? {};
    const st = item.statistics ?? {};
    const cd = item.contentDetails ?? {};

    return {
      id: item.id,
      title: sn.title ?? "",
      handle: sn.customUrl ?? null,
      description: sn.description ?? "",
      thumbnailUrl:
        sn.thumbnails?.high?.url ??
        sn.thumbnails?.medium?.url ??
        sn.thumbnails?.default?.url ??
        null,
      subscriberCount: st.hiddenSubscriberCount
        ? null
        : st.subscriberCount
        ? parseInt(st.subscriberCount, 10)
        : null,
      videoCount: st.videoCount ? parseInt(st.videoCount, 10) : null,
      viewCount: st.viewCount ? parseInt(st.viewCount, 10) : null,
      uploadsPlaylistId: cd.relatedPlaylists?.uploads ?? null,
    };
  } catch {
    return null;
  }
}

// ─── Top videos by views ───────────────────────────────────────────────

type SearchApiResponse = {
  items?: Array<{
    id?: { videoId?: string };
  }>;
};

type PlaylistItemsResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
  }>;
};

/**
 * Get the latest N video IDs from a channel by reading its uploads
 * playlist in reverse chronological order. Costs 1 unit per call
 * (playlistItems.list is cheap, unlike search.list).
 */
export async function fetchLatestVideoIds(
  uploadsPlaylistId: string,
  maxResults: number,
  apiKey: string
): Promise<string[]> {
  const params = new URLSearchParams({
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: String(Math.min(Math.max(maxResults, 1), 50)),
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as PlaylistItemsResponse;
    return (data.items ?? [])
      .map((it) => it.contentDetails?.videoId)
      .filter((v): v is string => Boolean(v));
  } catch {
    return [];
  }
}

/**
 * Get the top N video IDs from a channel ordered by view count.
 * Costs 100 units per call (search.list is expensive).
 */
export async function fetchTopVideoIdsByChannel(
  channelId: string,
  maxResults: number,
  apiKey: string
): Promise<string[]> {
  const params = new URLSearchParams({
    part: "id",
    channelId,
    order: "viewCount",
    type: "video",
    maxResults: String(Math.min(Math.max(maxResults, 1), 50)),
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as SearchApiResponse;
    return (data.items ?? [])
      .map((it) => it.id?.videoId)
      .filter((v): v is string => Boolean(v));
  } catch {
    return [];
  }
}

// ─── Batched videos lookup ─────────────────────────────────────────────

/**
 * Fetch full metadata for up to 50 video IDs in one call.
 * Costs 1 unit total regardless of batch size.
 */
export async function fetchVideoBatch(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, ApiVideoData>> {
  if (videoIds.length === 0) return new Map();

  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    id: videoIds.slice(0, 50).join(","),
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return new Map();

    type BatchResponse = {
      items?: Array<{
        id?: string;
        snippet?: {
          title?: string;
          channelTitle?: string;
          description?: string;
          publishedAt?: string;
          thumbnails?: {
            maxres?: { url?: string };
            high?: { url?: string };
            medium?: { url?: string };
          };
        };
        statistics?: {
          viewCount?: string;
          likeCount?: string;
          commentCount?: string;
        };
        contentDetails?: { duration?: string };
      }>;
    };

    const data = (await res.json()) as BatchResponse;
    const out = new Map<string, ApiVideoData>();
    for (const item of data.items ?? []) {
      if (!item.id) continue;
      const sn = item.snippet ?? {};
      const st = item.statistics ?? {};
      const cd = item.contentDetails ?? {};
      out.set(item.id, {
        title: sn.title ?? "",
        channel: sn.channelTitle ?? "",
        description: sn.description ?? "",
        thumbnailUrl:
          sn.thumbnails?.maxres?.url ??
          sn.thumbnails?.high?.url ??
          sn.thumbnails?.medium?.url ??
          null,
        viewCount: st.viewCount ? parseInt(st.viewCount, 10) : null,
        publishDate: sn.publishedAt ? sn.publishedAt.slice(0, 10) : null,
        lengthSeconds: cd.duration ? parseIsoDuration(cd.duration) : null,
      });
    }
    return out;
  } catch {
    return new Map();
  }
}

// Extra per-video stats not in ApiVideoData (used by competitor analyzer)
export type VideoEngagement = {
  likeCount: number | null;
  commentCount: number | null;
};

/**
 * Variant that returns engagement stats alongside the canonical ApiVideoData.
 * Costs the same 1 unit as fetchVideoBatch but returns likeCount + commentCount.
 */
export async function fetchVideoBatchWithEngagement(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, ApiVideoData & VideoEngagement>> {
  if (videoIds.length === 0) return new Map();

  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    id: videoIds.slice(0, 50).join(","),
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return new Map();

    type BatchResponse = {
      items?: Array<{
        id?: string;
        snippet?: {
          title?: string;
          channelTitle?: string;
          description?: string;
          publishedAt?: string;
          thumbnails?: {
            maxres?: { url?: string };
            high?: { url?: string };
            medium?: { url?: string };
          };
        };
        statistics?: {
          viewCount?: string;
          likeCount?: string;
          commentCount?: string;
        };
        contentDetails?: { duration?: string };
      }>;
    };

    const data = (await res.json()) as BatchResponse;
    const out = new Map<string, ApiVideoData & VideoEngagement>();
    for (const item of data.items ?? []) {
      if (!item.id) continue;
      const sn = item.snippet ?? {};
      const st = item.statistics ?? {};
      const cd = item.contentDetails ?? {};
      out.set(item.id, {
        title: sn.title ?? "",
        channel: sn.channelTitle ?? "",
        description: sn.description ?? "",
        thumbnailUrl:
          sn.thumbnails?.maxres?.url ??
          sn.thumbnails?.high?.url ??
          sn.thumbnails?.medium?.url ??
          null,
        viewCount: st.viewCount ? parseInt(st.viewCount, 10) : null,
        publishDate: sn.publishedAt ? sn.publishedAt.slice(0, 10) : null,
        lengthSeconds: cd.duration ? parseIsoDuration(cd.duration) : null,
        likeCount: st.likeCount ? parseInt(st.likeCount, 10) : null,
        commentCount: st.commentCount ? parseInt(st.commentCount, 10) : null,
      });
    }
    return out;
  } catch {
    return new Map();
  }
}
