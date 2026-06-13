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
 *
 * Single-file commit via Contents API. Use sparingly — each call creates
 * its own commit, which triggers a separate Vercel build. For multi-file
 * cron updates, use `commitFiles` instead (Git Data API, one commit for
 * all files together).
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

/**
 * Batched multi-file commit via the Git Data API. All files land in a
 * single commit on the configured branch, so Vercel sees ONE push event
 * and runs ONE build regardless of how many files are included.
 *
 * Flow (per GitHub docs):
 *  1. GET ref → parent commit SHA.
 *  2. GET commit → parent tree SHA.
 *  3. POST git/blobs for each file → blob SHA.
 *  4. POST git/trees with base_tree=parentTree and entries → new tree SHA.
 *  5. POST git/commits with parent + tree → new commit SHA.
 *  6. PATCH ref/heads/<branch> to point at new commit.
 *
 * Returns the new commit SHA.
 */
export async function commitFiles(opts: {
  files: Array<{ path: string; content: string }>;
  message: string;
}): Promise<{ commitSha: string }> {
  if (opts.files.length === 0) {
    throw new Error("commitFiles called with empty files array");
  }
  const { token, repo, branch } = readCfg();
  const h = headers(token);
  const hJson = { ...h, "Content-Type": "application/json" };

  // 1. Get current ref
  const refRes = await fetch(
    `${API}/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`,
    { headers: h },
  );
  if (!refRes.ok) {
    throw new Error(`get ref failed (${refRes.status}): ${await refRes.text()}`);
  }
  const refJson = (await refRes.json()) as { object: { sha: string } };
  const parentCommitSha = refJson.object.sha;

  // 2. Get parent commit to extract parent tree
  const parentCommitRes = await fetch(
    `${API}/repos/${repo}/git/commits/${parentCommitSha}`,
    { headers: h },
  );
  if (!parentCommitRes.ok) {
    throw new Error(
      `get commit failed (${parentCommitRes.status}): ${await parentCommitRes.text()}`,
    );
  }
  const parentCommitJson = (await parentCommitRes.json()) as {
    tree: { sha: string };
  };
  const parentTreeSha = parentCommitJson.tree.sha;

  // 3. Create blob for each file (parallel)
  const blobs = await Promise.all(
    opts.files.map(async (f) => {
      const blobRes = await fetch(`${API}/repos/${repo}/git/blobs`, {
        method: "POST",
        headers: hJson,
        body: JSON.stringify({
          content: Buffer.from(f.content, "utf8").toString("base64"),
          encoding: "base64",
        }),
      });
      if (!blobRes.ok) {
        throw new Error(
          `create blob failed for ${f.path} (${blobRes.status}): ${await blobRes.text()}`,
        );
      }
      const blobJson = (await blobRes.json()) as { sha: string };
      return { path: f.path, sha: blobJson.sha };
    }),
  );

  // 4. Create tree based on parent
  const treeRes = await fetch(`${API}/repos/${repo}/git/trees`, {
    method: "POST",
    headers: hJson,
    body: JSON.stringify({
      base_tree: parentTreeSha,
      tree: blobs.map((b) => ({
        path: b.path,
        mode: "100644",
        type: "blob",
        sha: b.sha,
      })),
    }),
  });
  if (!treeRes.ok) {
    throw new Error(
      `create tree failed (${treeRes.status}): ${await treeRes.text()}`,
    );
  }
  const treeJson = (await treeRes.json()) as { sha: string };

  // 5. Create commit
  const commitRes = await fetch(`${API}/repos/${repo}/git/commits`, {
    method: "POST",
    headers: hJson,
    body: JSON.stringify({
      message: opts.message,
      tree: treeJson.sha,
      parents: [parentCommitSha],
    }),
  });
  if (!commitRes.ok) {
    throw new Error(
      `create commit failed (${commitRes.status}): ${await commitRes.text()}`,
    );
  }
  const commitJson = (await commitRes.json()) as { sha: string };

  // 6. Update ref
  const updateRefRes = await fetch(
    `${API}/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`,
    {
      method: "PATCH",
      headers: hJson,
      body: JSON.stringify({ sha: commitJson.sha }),
    },
  );
  if (!updateRefRes.ok) {
    throw new Error(
      `update ref failed (${updateRefRes.status}): ${await updateRefRes.text()}`,
    );
  }

  return { commitSha: commitJson.sha };
}
