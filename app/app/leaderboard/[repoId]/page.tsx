import { Suspense } from 'react';
import { LeaderboardPage } from '@/components/pages/leaderboard-page';
import Loading from './loading';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <LeaderboardPage />
    </Suspense>
  );
}
