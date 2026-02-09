'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNotificationsQuery } from '@/lib/hooks/use-notifications';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20] as const;
const DEBOUNCE_MS = 300;

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
  const [repoFilterInput, setRepoFilterInput] = useState('');
  const [repoFilter, setRepoFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const t = setTimeout(() => setRepoFilter(repoFilterInput), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [repoFilterInput]);

  const { data, isLoading } = useNotificationsQuery({
    page,
    rows: pageSize,
    search: repoFilter.trim() || undefined,
  });

  const notifications = data?.notifications ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  useEffect(() => {
    setPage(1);
  }, [repoFilter, pageSize]);

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-muted-foreground mt-1">
          View all your activity and notifications
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by repository..."
            value={repoFilterInput}
            onChange={(e) => setRepoFilterInput(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Rows per page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
            }}>
            <SelectTrigger className="w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROWS_PER_PAGE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="hover-card bg-card/50 border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="py-3 px-4 text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="py-3 px-4 text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="py-3 px-4 text-muted-foreground">
                  Message
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-b border-border/50 last:border-0">
                    <TableCell className="py-3 px-4">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Skeleton className="h-4 max-w-xs" />
                    </TableCell>
                  </TableRow>
                ))
              ) : notifications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-12 text-center text-muted-foreground text-sm">
                    {total === 0 && repoFilter
                      ? 'No events match the filter'
                      : 'No events yet'}
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((event) => (
                  <TableRow
                    key={event.id}
                    className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30">
                    <TableCell className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                      {formatEventTime(event.created_at)}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Badge variant="secondary" className="font-normal">
                        {formatEventType(event.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm whitespace-normal min-w-0">
                      {event.message}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!isLoading && total > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {start}-{end} of {total} event{total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover-button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {safePage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="hover-button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
