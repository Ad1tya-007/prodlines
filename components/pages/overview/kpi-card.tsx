'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KPICard as KPICardType } from '@/lib/types/github';

interface KPICardProps {
  card: KPICardType;
  index: number;
}

export function KPICard({ card, index }: KPICardProps) {
  return (
    <Card
      className="hover-card group bg-card/50 border-border/50 opacity-0 animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards',
      }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {card.title}
        </CardTitle>
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center group-hover:rounded-none transition-all duration-200">
          <card.icon className="h-4 w-4 text-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{card.value}</div>
        <div className="flex items-center justify-between mt-1">
          {card.description && (
            <p className="text-xs text-muted-foreground">{card.description}</p>
          )}
          {card.trend && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                card.trendUp
                  ? 'text-green-500 border-green-500/30'
                  : 'text-red-500 border-red-500/30',
              )}>
              {card.trendUp ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {card.trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICardSkeleton() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}
