import { LeaderboardPageWrapper } from '@/components/pages/leaderboard-page-wrapper';

export default function Page({ params }: { params: { repoId: string } }) {
  return <LeaderboardPageWrapper repoId={params.repoId} />;
}
