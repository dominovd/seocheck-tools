/**
 * Minimal GitHub Contents API wrapper for the auto-discovery cron.
 *
 * Used to:
 *  1. Read content/updates/_state/seen-sources.json each cron cycle.
 *  2. Commit a new markdown post when a fresh source item is drafted.
 *  3. Update the seen-sources.json in the same commit (or follow-up).
 *
 * Every commit on main triggers a Vercel rebuild → new posts appear live
 * automatically. The cron itself does not deploy.
 *
 * Required env:
 *  - GITHUB_TOKEN  — PAT with `repo` scope, set in Vercel project env
 *  - GITHUB_REPO   — "owner/repo", e.g. "username/seocheck-tools"
 *  - GITHUB_BRANCH — default "main"
 */

const API = "https://api.github.com";

type Cfg = {
  token: string;
  repo: string;
  branch: string;
};

function readCfg(): Cfg {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token) throw new Error("GITHUB_TOKEN not configured");
  if (!repo) throw new Error("GITHUB_REPO not configured (expected 'owner/repo')");
  return { token, repo, branch };
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "seocheck-tools-discovery/0.1",
  };
}

/** Reads a UTF-8 file from the repo. Returns null if it does not exist. */
export async function getFile(
  path: string,
): Promise<{ content: string; sha: string } | null> {
  const { token, repo, branch } = readCfg();
  const url = `${API}/repos/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: headers(token) });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`getFile failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as {
    content: string;
    encoding: string;
    sha: string;
  };
  if (json.encoding !== "base64") {
    throw new Error(`Unexpected content encoding ${json.encoding} for ${path}`);
  }
  // GitHub returns base64 with line breaks every 60 chars
  const content = Buffer.from(json.content, "base64").toString("utf8");
  return { content, sha: json.sha };
}

/**
 * Creates or updates a file at path with the given UTF-8 content. If the
 * file already exists, you must pass `sha` (use `getFile` to fetch it).
 * Returns the new commit SHA.
 */
export async function putFile(opts: {
  path: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<{ commitSha: string; contentSha: string }> {
  const { token, repo, branch } = readCfg();
  const url = `${API}/repos/${repo}/contents/${encodeURIComponent(opts.path).replace(/%2F/g, "/")}`;
  const body = {
    message: opts.message,
    content: Buffer.from(opts.content, "utf8").toString("base64"),
    branch,
    ...(opts.sha ? { sha: opts.sha } : {}),
  };
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`putFile failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as {
    commit: { sha: string };
    content: { sha: string };
  };
  return { commitSha: json.commit.sha, contentSha: json.content.sha };
}
