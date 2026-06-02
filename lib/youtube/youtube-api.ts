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
 * Get up to `totalNeeded` latest video IDs from an uploads playlist,
 * paginating playlistItems.list as needed (50 per page). Returns in
 * reverse chronological order (newest first).
 *
 * Cost: 1 unit per page = ceil(totalNeeded / 50) units total.
 * E.g. 100 videos -> 2 units, 200 -> 4 units.
 *
 * Used by Outlier Finder to get a statistically meaningful pool.
 */
export async function fetchVideoIdsFromPlaylist(
  uploadsPlaylistId: string,
  totalNeeded: number,
  apiKey: string
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  const wanted = Math.max(1, Math.min(totalNeeded, 500));

  while (ids.length < wanted) {
    const params = new URLSearchParams({
      part: "contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: String(Math.min(50, wanted - ids.length)),
      key: apiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) break;
      const data = (await res.json()) as PlaylistItemsResponse & { nextPageToken?: string };
      const pageIds = (data.items ?? [])
        .map((it) => it.contentDetails?.videoId)
        .filter((v): v is string => Boolean(v));
      ids.push(...pageIds);
      if (!data.nextPageToken || pageIds.length === 0) break;
      pageToken = data.nextPageToken;
    } catch {
      break;
    }
  }
  return ids.slice(0, wanted);
}

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
 * Search YouTube by keyword. Returns top N video IDs by relevance.
 * Costs 100 units per call (search.list is expensive).
 *
 * Used by Niche Check to evaluate topic-level competition.
 */
export async function searchByKeyword(
  query: string,
  maxResults: number,
  apiKey: string
): Promise<{ videoIds: string[]; totalResults: number }> {
  const params = new URLSearchParams({
    part: "id",
    q: query,
    type: "video",
    order: "relevance",
    maxResults: String(Math.min(Math.max(maxResults, 1), 50)),
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return { videoIds: [], totalResults: 0 };
    const data = (await res.json()) as SearchApiResponse & {
      pageInfo?: { totalResults?: number };
    };
    return {
      videoIds: (data.items ?? [])
        .map((it) => it.id?.videoId)
        .filter((v): v is string => Boolean(v)),
      totalResults: data.pageInfo?.totalResults ?? 0,
    };
  } catch {
    return { videoIds: [], totalResults: 0 };
  }
}

/**
 * Fetch channel data for an array of channel IDs in a single batched
 * call. Costs 1 unit regardless of batch size.
 */
export async function fetchChannelsBatch(
  channelIds: string[],
  apiKey: string
): Promise<Map<string, { id: string; title: string; subscriberCount: number | null }>> {
  if (channelIds.length === 0) return new Map();
  const params = new URLSearchParams({
    part: "snippet,statistics",
    id: channelIds.slice(0, 50).join(","),
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return new Map();
    const data = (await res.json()) as {
      items?: Array<{
        id?: string;
        snippet?: { title?: string };
        statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean };
      }>;
    };
    const out = new Map<string, { id: string; title: string; subscriberCount: number | null }>();
    for (const item of data.items ?? []) {
      if (!item.id) continue;
      out.set(item.id, {
        id: item.id,
        title: item.snippet?.title ?? "",
        subscriberCount: item.statistics?.hiddenSubscriberCount
          ? null
          : item.statistics?.subscriberCount
          ? parseInt(item.statistics.subscriberCount, 10)
          : null,
      });
    }
    return out;
  } catch {
    return new Map();
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

/**
 * Fetch metadata for ANY number of video IDs by chunking into 50-id
 * batches and calling videos.list once per batch. Costs 1 unit per
 * batch (i.e. 1 unit per 50 videos, rounded up).
 *
 * Returns a single merged Map keyed by video ID.
 */
export async function fetchVideoBatchPaginated(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, ApiVideoData & VideoEngagement>> {
  const merged = new Map<string, ApiVideoData & VideoEngagement>();
  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const partial = await fetchVideoBatchWithEngagement(chunk, apiKey);
    for (const [id, data] of partial) merged.set(id, data);
  }
  return merged;
}

// Extra per-video stats not in ApiVideoData (used by competitor analyzer)
export type VideoEngagement = {
  likeCount: number | null;
  commentCount: number | null;
};

/**
 * Lightweight fetch returning view/publish/channelId for a batch of
 * video IDs. Used by Niche Check to compute median views, freshness,
 * and channel-size distribution from search results.
 *
 * Costs 1 unit per batch of 50.
 */
export type NicheVideoRecord = {
  videoId: string;
  title: string;
  channelId: string;
  publishedAt: string | null;
  viewCount: number | null;
};

export async function fetchVideosForNicheCheck(
  videoIds: string[],
  apiKey: string
): Promise<NicheVideoRecord[]> {
  if (videoIds.length === 0) return [];

  const params = new URLSearchParams({
    part: "snippet,statistics",
    id: videoIds.slice(0, 50).join(","),
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items?: Array<{
        id?: string;
        snippet?: { title?: string; channelId?: string; publishedAt?: string };
        statistics?: { viewCount?: string };
      }>;
    };
    return (data.items ?? [])
      .filter((it): it is NonNullable<typeof it> & { id: string } => Boolean(it.id))
      .map((it) => ({
        videoId: it.id,
        title: it.snippet?.title ?? "",
        channelId: it.snippet?.channelId ?? "",
        publishedAt: it.snippet?.publishedAt ?? null,
        viewCount: it.statistics?.viewCount
          ? parseInt(it.statistics.viewCount, 10)
          : null,
      }));
  } catch {
    return [];
  }
}

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
