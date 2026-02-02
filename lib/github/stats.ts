import type { GitHubStats } from '@/lib/types/github';

export async function fetchGitHubStats(
  owner: string,
  repo: string,
  branch: string = 'main',
  githubToken: string
): Promise<GitHubStats> {
  if (!githubToken) {
    throw new Error('GitHub token is required');
  }

  const baseUrl = 'https://api.github.com';
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Get repository tree for the branch
  const repoResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}`, {
    headers,
  });
  if (!repoResponse.ok) {
    const errorText = await repoResponse.text().catch(() => '');
    if (repoResponse.status === 401) {
      throw new Error(
        `Invalid or expired GitHub token. Please check your GITHUB_TOKEN environment variable and restart the dev server. Status: ${repoResponse.status}`
      );
    }
    console.error(
      `GitHub API Error fetching repo (${repoResponse.status}):`,
      errorText
    );
    throw new Error(
      `Failed to fetch repo: ${repoResponse.status} ${repoResponse.statusText}`
    );
  }

  // Get branch info
  const branchResponse = await fetch(
    `${baseUrl}/repos/${owner}/${repo}/branches/${branch}`,
    { headers }
  );
  if (!branchResponse.ok) {
    throw new Error(`Failed to fetch branch: ${branchResponse.statusText}`);
  }

  // Get contributors stats
  const contributorsResponse = await fetch(
    `${baseUrl}/repos/${owner}/${repo}/contributors`,
    { headers }
  );
  const contributorsData = contributorsResponse.ok
    ? await contributorsResponse.json()
    : [];

  // Get recent commits
  const commitsResponse = await fetch(
    `${baseUrl}/repos/${owner}/${repo}/commits?sha=${branch}&per_page=100`,
    { headers }
  );
  const commitsData = commitsResponse.ok ? await commitsResponse.json() : [];

  // Get merged PRs
  const prsResponse = await fetch(
    `${baseUrl}/repos/${owner}/${repo}/pulls?state=closed&base=${branch}&per_page=100&sort=updated&direction=desc`,
    { headers }
  );
  const prsData = prsResponse.ok ? await prsResponse.json() : [];

  // Calculate LOC per contributor from commits
  const now = Date.now();
  const recentWindowMs = 30 * 24 * 60 * 60 * 1000;
  const contributorStats = new Map<
    string,
    {
      commits: number;
      additions: number;
      deletions: number;
      files: Set<string>;
      prs: Array<{
        title: string;
        url: string;
        number: number;
        linesAdded: number;
        linesDeleted: number;
        mergedAt: string;
      }>;
      firstCommitAt: string | null;
      lastCommitAt: string | null;
      recentCommits: number;
      prsClosed: number;
      prsMerged: number;
      prMergeTimeTotalMs: number;
      prMergeTimeCount: number;
      prSizeTotal: number;
      prSizeCount: number;
      firstPrMergedAt: string | null;
      lastPrMergedAt: string | null;
      recentMergedPrs: number;
    }
  >();

  // Process commits to get contributor stats
  for (const commit of commitsData) {
    const author = commit.author?.login || commit.commit.author.name;
    if (!author || author.includes('[bot]') || author.includes('bot')) continue;

    if (!contributorStats.has(author)) {
      contributorStats.set(author, {
        commits: 0,
        additions: 0,
        deletions: 0,
        files: new Set(),
        prs: [],
        firstCommitAt: null,
        lastCommitAt: null,
        recentCommits: 0,
        prsClosed: 0,
        prsMerged: 0,
        prMergeTimeTotalMs: 0,
        prMergeTimeCount: 0,
        prSizeTotal: 0,
        prSizeCount: 0,
        firstPrMergedAt: null,
        lastPrMergedAt: null,
        recentMergedPrs: 0,
      });
    }

    const stats = contributorStats.get(author)!;
    stats.commits++;
    const commitDate = commit.commit?.author?.date
      ? new Date(commit.commit.author.date)
      : null;
    if (commitDate && !Number.isNaN(commitDate.getTime())) {
      const commitIso = commitDate.toISOString();
      if (!stats.firstCommitAt || commitIso < stats.firstCommitAt) {
        stats.firstCommitAt = commitIso;
      }
      if (!stats.lastCommitAt || commitIso > stats.lastCommitAt) {
        stats.lastCommitAt = commitIso;
      }
      if (now - commitDate.getTime() <= recentWindowMs) {
        stats.recentCommits++;
      }
    }

    // Get commit details for file changes
    try {
      const commitDetailResponse = await fetch(commit.url, { headers });
      if (commitDetailResponse.ok) {
        const commitDetail = await commitDetailResponse.json();
        if (commitDetail.stats) {
          stats.additions += commitDetail.stats.additions || 0;
          stats.deletions += commitDetail.stats.deletions || 0;
        }
        if (commitDetail.files) {
          commitDetail.files.forEach((file: any) => {
            if (
              file.filename &&
              !file.filename.includes('node_modules') &&
              !file.filename.includes('dist')
            ) {
              stats.files.add(file.filename);
            }
          });
        }
      }
    } catch (e) {
      // Skip if commit detail fetch fails
    }
  }

  // Process PRs - fetch detailed info for each PR to get additions/deletions
  for (const pr of prsData) {
    const author = pr.user?.login;
    if (!author || author.includes('[bot]') || author.includes('bot')) continue;

    if (!contributorStats.has(author)) {
      contributorStats.set(author, {
        commits: 0,
        additions: 0,
        deletions: 0,
        files: new Set(),
        prs: [],
        firstCommitAt: null,
        lastCommitAt: null,
        recentCommits: 0,
        prsClosed: 0,
        prsMerged: 0,
        prMergeTimeTotalMs: 0,
        prMergeTimeCount: 0,
        prSizeTotal: 0,
        prSizeCount: 0,
        firstPrMergedAt: null,
        lastPrMergedAt: null,
        recentMergedPrs: 0,
      });
    }

    const stats = contributorStats.get(author)!;
    stats.prsClosed++;

    if (pr.merged_at) {
      stats.prsMerged++;
      const mergedAt = new Date(pr.merged_at);
      if (!Number.isNaN(mergedAt.getTime())) {
        const mergedIso = mergedAt.toISOString();
        if (!stats.firstPrMergedAt || mergedIso < stats.firstPrMergedAt) {
          stats.firstPrMergedAt = mergedIso;
        }
        if (!stats.lastPrMergedAt || mergedIso > stats.lastPrMergedAt) {
          stats.lastPrMergedAt = mergedIso;
        }
        if (now - mergedAt.getTime() <= recentWindowMs) {
          stats.recentMergedPrs++;
        }
      }

      if (pr.created_at) {
        const createdAt = new Date(pr.created_at);
        if (
          !Number.isNaN(createdAt.getTime()) &&
          !Number.isNaN(mergedAt.getTime())
        ) {
          stats.prMergeTimeTotalMs += mergedAt.getTime() - createdAt.getTime();
          stats.prMergeTimeCount++;
        }
      }
    }
  }

  const mergedPRs = prsData.filter((pr: any) => pr.merged_at);

  // Limit to first 30 PRs to avoid too many API calls
  const prsToProcess = mergedPRs.slice(0, 30);

  for (const pr of prsToProcess) {
    const author = pr.user?.login;
    if (!author || author.includes('[bot]') || author.includes('bot')) continue;

    if (!contributorStats.has(author)) {
      contributorStats.set(author, {
        commits: 0,
        additions: 0,
        deletions: 0,
        files: new Set(),
        prs: [],
        firstCommitAt: null,
        lastCommitAt: null,
        recentCommits: 0,
        prsClosed: 0,
        prsMerged: 0,
        prMergeTimeTotalMs: 0,
        prMergeTimeCount: 0,
        prSizeTotal: 0,
        prSizeCount: 0,
        firstPrMergedAt: null,
        lastPrMergedAt: null,
        recentMergedPrs: 0,
      });
    }

    const stats = contributorStats.get(author)!;

    // Fetch detailed PR info to get additions/deletions
    let linesAdded = 0;
    let linesDeleted = 0;

    try {
      const prDetailResponse = await fetch(
        `${baseUrl}/repos/${owner}/${repo}/pulls/${pr.number}`,
        { headers }
      );

      if (prDetailResponse.ok) {
        const prDetail = await prDetailResponse.json();
        linesAdded = prDetail.additions || 0;
        linesDeleted = prDetail.deletions || 0;
      }
    } catch (e) {
      // If fetch fails, use 0 for both
      console.error(`Failed to fetch PR #${pr.number} details:`, e);
    }

    stats.prs.push({
      title: pr.title,
      url: pr.html_url,
      number: pr.number,
      linesAdded,
      linesDeleted,
      mergedAt: pr.merged_at,
    });

    stats.prSizeTotal += linesAdded + linesDeleted;
    stats.prSizeCount++;
  }

  // Calculate total LOC (approximation from additions)
  const totalLOC = Array.from(contributorStats.values()).reduce(
    (sum, stat) => sum + stat.additions,
    0
  );

  // Convert to contributor array format
  const contributors = Array.from(contributorStats.entries())
    .map(([username, stats], index) => {
      const productionLOC = stats.additions; // Approximation
      const percentShare = totalLOC > 0 ? (productionLOC / totalLOC) * 100 : 0;
      const mergeRate =
        stats.prsClosed > 0 ? stats.prsMerged / stats.prsClosed : 0;
      const avgPrSize =
        stats.prSizeCount > 0 ? stats.prSizeTotal / stats.prSizeCount : 0;
      const avgTimeToMergeHours =
        stats.prMergeTimeCount > 0
          ? stats.prMergeTimeTotalMs / stats.prMergeTimeCount / 3600000
          : 0;
      const lastActivityAt =
        stats.lastCommitAt && stats.lastPrMergedAt
          ? stats.lastCommitAt > stats.lastPrMergedAt
            ? stats.lastCommitAt
            : stats.lastPrMergedAt
          : stats.lastCommitAt || stats.lastPrMergedAt || null;
      const firstActivityAt =
        stats.firstCommitAt && stats.firstPrMergedAt
          ? stats.firstCommitAt < stats.firstPrMergedAt
            ? stats.firstCommitAt
            : stats.firstPrMergedAt
          : stats.firstCommitAt || stats.firstPrMergedAt || null;

      return {
        id: `contributor-${index}`,
        username,
        avatarUrl: `https://github.com/${username}.png`,
        productionLOC,
        percentShare: Math.round(percentShare * 10) / 10,
        commits: stats.commits,
        additions: stats.additions,
        deletions: stats.deletions,
        filesTouchedCount: stats.files.size,
        prsMerged: stats.prsMerged,
        prsClosed: stats.prsClosed,
        prMergeRate: Math.round(mergeRate * 1000) / 10,
        avgPrSize: Math.round(avgPrSize),
        avgTimeToMergeHours: Math.round(avgTimeToMergeHours * 10) / 10,
        lastActivityAt,
        firstActivityAt,
        recentCommits: stats.recentCommits,
        recentMergedPrs: stats.recentMergedPrs,
        recentPRs: stats.prs.slice(0, 3),
        contributions:
          contributorsData.find(
            (contributor: any) => contributor.login === username
          )?.contributions || 0,
      };
    })
    .sort((a, b) => b.productionLOC - a.productionLOC)
    .slice(0, 12);

  return {
    productionLOC: totalLOC,
    activeContributors: contributors.length,
    lastSync: new Date().toISOString(),
    contributors: contributors as any[],
  };
}
