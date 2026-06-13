"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink as ExternalLinkIcon } from "lucide-react";
import type { UpdatePost, UpdateCategory } from "@/lib/updates";

/**
 * Updates feed cards + category filter.
 *
 * Client component because the filter is interactive. All posts are
 * rendered into props at build time (they are static-safe: only strings),
 * the client filters visibility by category state.
 *
 * Internal nav links (Link) only — outbound source domains are surfaced
 * as plain text + icon to signal external destination, but the clickable
 * target is always our own /updates/[slug] page. Source URLs are
 * displayed on the per-item page through ExternalLink.
 */
type Filter = UpdateCategory | "all";

type Props = {
  posts: UpdatePost[];
};

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "algorithm", label: "Algorithm" },
  { value: "monetization", label: "Monetization" },
  { value: "shorts", label: "Shorts" },
  { value: "api", label: "API" },
  { value: "policy", label: "Policy" },
];

const CATEGORY_LABEL: Record<UpdateCategory, string> = {
  algorithm: "Algorithm",
  monetization: "Monetization",
  shorts: "Shorts",
  api: "API",
  policy: "Policy",
};

const SEVERITY_STYLE: Record<
  UpdatePost["severity"],
  { label: string; cls: string }
> = {
  major: { label: "MAJOR", cls: "bg-red-50 text-red-800 ring-red-200" },
  minor: { label: "MINOR", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  info: { label: "INFO", cls: "bg-gray-100 text-gray-700 ring-gray-200" },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function UpdatesFeedClient({ posts }: Props) {
  const [active, setActive] = useState<Filter>("all");

  const visible = useMemo(
    () => (active === "all" ? posts : posts.filter((p) => p.category === active)),
    [posts, active],
  );

  // Category-button counts for the chip row (helps the user see what's
  // populated without clicking through).
  const counts = useMemo(() => {
    const acc: Record<Filter, number> = {
      all: posts.length,
      algorithm: 0,
      monetization: 0,
      shorts: 0,
      api: 0,
      policy: 0,
    };
    for (const p of posts) acc[p.category] += 1;
    return acc;
  }, [posts]);

  return (
    <>
      {/* Filter chips */}
      <div
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter updates by category"
      >
        {FILTERS.map((f) => {
          const isActive = f.value === active;
          const count = counts[f.value];
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(f.value)}
              className={
                isActive
                  ? "inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white"
                  : "inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition"
              }
            >
              {f.label}
              <span
                className={
                  isActive
                    ? "text-[10px] text-white/70"
                    : "text-[10px] text-gray-400"
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card list */}
      <div className="mt-8 space-y-3">
        {visible.length === 0 ? (
          <EmptyState filter={active} totalPosts={posts.length} />
        ) : (
          visible.map((post) => <UpdateCard key={post.slug} post={post} />)
        )}
      </div>
    </>
  );
}

function UpdateCard({ post }: { post: UpdatePost }) {
  const sev = SEVERITY_STYLE[post.severity];
  const category = CATEGORY_LABEL[post.category];

  return (
    <Link
      href={`/updates/${post.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
    >
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2">
        <time dateTime={post.date} className="text-[11px] text-gray-500">
          {formatDate(post.date)}
        </time>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${sev.cls}`}
        >
          {sev.label}
        </span>
        <span className="rounded-md px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
          {category}
        </span>
      </div>

      {/* Title */}
      <p className="mt-3 text-base font-semibold text-gray-900 leading-snug group-hover:text-brand-700 transition-colors">
        {post.title}
      </p>

      {/* Summary */}
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        {post.summary}
      </p>

      {/* Footer: source + read more */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-[11px] text-gray-500">
          Source:{" "}
          <span className="text-gray-700">{post.source.name}</span>{" "}
          <ExternalLinkIcon
            className="inline-block h-3 w-3 align-[-0.1em] text-gray-400"
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:text-brand-700 transition">
          Read
          <ArrowRight
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.25}
          />
        </span>
      </div>
    </Link>
  );
}

function EmptyState({
  filter,
  totalPosts,
}: {
  filter: Filter;
  totalPosts: number;
}) {
  if (totalPosts === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-12 text-center">
        <p className="text-sm font-medium text-gray-800">
          No updates yet
        </p>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Watching YouTube&apos;s Creators Blog, Help Center, and Data API
          release notes for changes. The feed will fill as real updates
          land.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-10 text-center">
      <p className="text-sm font-medium text-gray-800">
        No {filter === "all" ? "" : `${CATEGORY_LABEL[filter as UpdateCategory]} `}
        updates match this filter
      </p>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        Try another category, or check back next week.
      </p>
    </div>
  );
}
