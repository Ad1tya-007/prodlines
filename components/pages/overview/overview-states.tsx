'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function OverviewErrorState({ error }: { error: string }) {
  return (
    <Card className="border-destructive/50 bg-destructive/10">
      <CardContent className="p-4">
        <p className="text-destructive text-sm">{error}</p>
      </CardContent>
    </Card>
  );
}

export function OverviewLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
