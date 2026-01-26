export interface Contributor {
  id: string
  username: string
  avatarUrl: string
  productionLOC: number
  percentShare: number
  trend: "up" | "down" | "neutral"
  trendValue: number
  topFiles: string[]
  recentPRs: string[]
}

export interface Repo {
  id: string
  name: string
  owner: string
  branch: string
  lastSync: string
  totalLOC: number
  contributors: number
}

export interface File {
  id: string
  path: string
  owner: string
  ownedLOC: number
  lastModified: string
}

export interface PR {
  id: string
  title: string
  author: string
  mergedAt: string
  additions: number
  deletions: number
}

export const mockContributors: Contributor[] = [
  { id: "1", username: "alexchen", avatarUrl: "", productionLOC: 45892, percentShare: 28.4, trend: "up", trendValue: 3.2, topFiles: ["src/core/engine.ts", "src/api/handlers.ts"], recentPRs: ["feat: Add caching layer", "fix: Memory leak in parser"] },
  { id: "2", username: "sarahdev", avatarUrl: "", productionLOC: 38241, percentShare: 23.7, trend: "up", trendValue: 1.8, topFiles: ["src/components/Dashboard.tsx", "src/hooks/useAuth.ts"], recentPRs: ["feat: New dashboard layout", "refactor: Auth flow"] },
  { id: "3", username: "mikejohnson", avatarUrl: "", productionLOC: 28456, percentShare: 17.6, trend: "down", trendValue: 0.5, topFiles: ["src/utils/helpers.ts", "src/lib/validation.ts"], recentPRs: ["fix: Validation edge case", "chore: Update deps"] },
  { id: "4", username: "emilywang", avatarUrl: "", productionLOC: 19834, percentShare: 12.3, trend: "up", trendValue: 2.1, topFiles: ["src/services/api.ts", "src/types/index.ts"], recentPRs: ["feat: API v2 endpoints", "types: Add generics"] },
  { id: "5", username: "davidlee", avatarUrl: "", productionLOC: 12567, percentShare: 7.8, trend: "neutral", trendValue: 0, topFiles: ["tests/integration.test.ts"], recentPRs: ["test: Add integration tests"] },
  { id: "6", username: "jessicapatel", avatarUrl: "", productionLOC: 8934, percentShare: 5.5, trend: "up", trendValue: 0.8, topFiles: ["src/styles/theme.css"], recentPRs: ["style: Dark mode support"] },
  { id: "7", username: "chrismartin", avatarUrl: "", productionLOC: 4212, percentShare: 2.6, trend: "down", trendValue: 1.2, topFiles: ["docs/README.md"], recentPRs: ["docs: Update API docs"] },
  { id: "8", username: "amandabrown", avatarUrl: "", productionLOC: 3456, percentShare: 2.1, trend: "up", trendValue: 0.3, topFiles: ["src/config/env.ts"], recentPRs: ["feat: Env configuration"] },
  { id: "9", username: "ryankim", avatarUrl: "", productionLOC: 2891, percentShare: 1.8, trend: "neutral", trendValue: 0, topFiles: ["scripts/build.sh"], recentPRs: ["chore: Build optimization"] },
  { id: "10", username: "laurawilson", avatarUrl: "", productionLOC: 2134, percentShare: 1.3, trend: "down", trendValue: 0.4, topFiles: ["src/i18n/locales.ts"], recentPRs: ["feat: i18n support"] },
  { id: "11", username: "jamessmith", avatarUrl: "", productionLOC: 1987, percentShare: 1.2, trend: "up", trendValue: 0.2, topFiles: ["src/analytics/tracker.ts"], recentPRs: ["feat: Analytics events"] },
  { id: "12", username: "oliviagreen", avatarUrl: "", productionLOC: 1654, percentShare: 1.0, trend: "neutral", trendValue: 0, topFiles: ["src/errors/handlers.ts"], recentPRs: ["fix: Error boundaries"] },
]

export const mockRepos: Repo[] = [
  { id: "1", name: "frontend-app", owner: "acme-corp", branch: "main", lastSync: "2 minutes ago", totalLOC: 161508, contributors: 12 },
  { id: "2", name: "api-server", owner: "acme-corp", branch: "main", lastSync: "15 minutes ago", totalLOC: 89234, contributors: 8 },
  { id: "3", name: "shared-lib", owner: "acme-corp", branch: "release", lastSync: "1 hour ago", totalLOC: 34521, contributors: 5 },
  { id: "4", name: "mobile-app", owner: "acme-corp", branch: "main", lastSync: "3 hours ago", totalLOC: 78432, contributors: 6 },
  { id: "5", name: "infra-tools", owner: "acme-corp", branch: "master", lastSync: "1 day ago", totalLOC: 23456, contributors: 3 },
]

export const mockFiles: File[] = [
  { id: "1", path: "src/core/engine.ts", owner: "alexchen", ownedLOC: 2341, lastModified: "2 days ago" },
  { id: "2", path: "src/components/Dashboard.tsx", owner: "sarahdev", ownedLOC: 1892, lastModified: "1 day ago" },
  { id: "3", path: "src/api/handlers.ts", owner: "alexchen", ownedLOC: 1567, lastModified: "3 days ago" },
  { id: "4", path: "src/hooks/useAuth.ts", owner: "sarahdev", ownedLOC: 1234, lastModified: "5 days ago" },
  { id: "5", path: "src/utils/helpers.ts", owner: "mikejohnson", ownedLOC: 987, lastModified: "1 week ago" },
  { id: "6", path: "src/services/api.ts", owner: "emilywang", ownedLOC: 876, lastModified: "4 days ago" },
  { id: "7", path: "src/lib/validation.ts", owner: "mikejohnson", ownedLOC: 765, lastModified: "2 weeks ago" },
  { id: "8", path: "src/types/index.ts", owner: "emilywang", ownedLOC: 654, lastModified: "1 week ago" },
  { id: "9", path: "tests/integration.test.ts", owner: "davidlee", ownedLOC: 543, lastModified: "3 days ago" },
  { id: "10", path: "src/styles/theme.css", owner: "jessicapatel", ownedLOC: 432, lastModified: "6 days ago" },
  { id: "11", path: "src/config/env.ts", owner: "amandabrown", ownedLOC: 321, lastModified: "1 day ago" },
  { id: "12", path: "src/analytics/tracker.ts", owner: "jamessmith", ownedLOC: 298, lastModified: "4 days ago" },
  { id: "13", path: "src/i18n/locales.ts", owner: "laurawilson", ownedLOC: 276, lastModified: "2 weeks ago" },
  { id: "14", path: "src/errors/handlers.ts", owner: "oliviagreen", ownedLOC: 234, lastModified: "1 week ago" },
  { id: "15", path: "scripts/build.sh", owner: "ryankim", ownedLOC: 189, lastModified: "3 weeks ago" },
]

export const mockPRs: PR[] = [
  { id: "1", title: "feat: Add caching layer for API responses", author: "alexchen", mergedAt: "2 hours ago", additions: 342, deletions: 45 },
  { id: "2", title: "feat: New dashboard layout with real-time updates", author: "sarahdev", mergedAt: "5 hours ago", additions: 567, deletions: 123 },
  { id: "3", title: "fix: Memory leak in parser module", author: "alexchen", mergedAt: "1 day ago", additions: 23, deletions: 89 },
  { id: "4", title: "refactor: Auth flow improvements", author: "sarahdev", mergedAt: "1 day ago", additions: 234, deletions: 178 },
  { id: "5", title: "fix: Validation edge case for empty inputs", author: "mikejohnson", mergedAt: "2 days ago", additions: 45, deletions: 12 },
  { id: "6", title: "feat: API v2 endpoints", author: "emilywang", mergedAt: "3 days ago", additions: 456, deletions: 34 },
  { id: "7", title: "test: Add integration tests for core module", author: "davidlee", mergedAt: "4 days ago", additions: 234, deletions: 0 },
  { id: "8", title: "style: Dark mode support", author: "jessicapatel", mergedAt: "5 days ago", additions: 189, deletions: 67 },
  { id: "9", title: "docs: Update API documentation", author: "chrismartin", mergedAt: "1 week ago", additions: 123, deletions: 45 },
  { id: "10", title: "feat: Environment configuration system", author: "amandabrown", mergedAt: "1 week ago", additions: 98, deletions: 23 },
]

export const kpiData = {
  productionLOC: 161508,
  activeContributors: 12,
  lastSync: "2 minutes ago",
  excludedLOC: 23456,
}
