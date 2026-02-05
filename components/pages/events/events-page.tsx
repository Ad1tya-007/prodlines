'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotificationsQuery } from '@/lib/hooks/use-notifications';
import { cn } from '@/lib/utils';

function formatEventTime(iso: string) {
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function formatEventType(type: string) {
  const labels: Record<string, string> = {
    github_stats_synced: 'Stats Synced',
  };
  return labels[type] ?? type;
}

export function EventsPage() {
  const { data: notifications = [], isLoading } = useNotificationsQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-muted-foreground mt-1">
          View all your activity and notifications
        </p>
      </div>

      <Card className="hover-card bg-card/50 border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Message
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-4 flex-1 max-w-xs" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-5 w-14" />
                      </td>
                    </tr>
                  ))
                ) : notifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-muted-foreground text-sm">
                      No events yet
                    </td>
                  </tr>
                ) : (
                  notifications.map((event) => (
                    <tr
                      key={event.id}
                      className={cn(
                        'border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30',
                        !event.seen && 'bg-muted/20',
                      )}>
                      <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatEventTime(event.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="font-normal">
                          {formatEventType(event.type)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{event.message}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={event.seen ? 'outline' : 'default'}
                          className="font-normal">
                          {event.seen ? 'Read' : 'Unread'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
