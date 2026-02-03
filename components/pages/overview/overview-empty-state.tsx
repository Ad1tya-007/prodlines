'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus } from 'lucide-react';

export function OverviewEmptyState() {
  return (
    <Card className="hover-card bg-card/50 border-border/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <GitBranch className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No repository connected</h3>
        <p className="text-muted-foreground text-sm text-center max-w-sm mb-6">
          Connect a GitHub repository to see your production code leaderboard.
        </p>
        <Button className="hover-button" asChild>
          <Link href="/app/repos">
            <Plus className="h-4 w-4 mr-2" />
            Connect a repo
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
