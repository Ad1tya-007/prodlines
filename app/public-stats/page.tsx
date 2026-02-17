import { PublicStatsPage } from '@/components/pages/public-stats/public-stats-page';

export const metadata = {
  title: 'Public Repository Stats - ProdLines',
  description: 'View production code ownership for any public GitHub repository',
};

export default function Page() {
  return <PublicStatsPage />;
}
