'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { GitBranch } from 'lucide-react';
import {
  useUserSettings,
  useUpdateRepositorySyncSettings,
} from '@/lib/hooks/use-user-settings';
import { toast } from 'sonner';

const repositorySyncSchema = z.object({
  autoSync: z.boolean(),
  syncFrequency: z.enum(['realtime', 'hourly', 'daily', 'weekly']),
  githubWebhookSecret: z.string().default(''),
});

type RepositorySyncValues = z.infer<typeof repositorySyncSchema>;

export function RepositorySyncForm() {
  const { data: settings, isLoading, isError, error } = useUserSettings();
  const updateMutation = useUpdateRepositorySyncSettings();
  const form = useForm<RepositorySyncValues>({
    resolver: zodResolver(repositorySyncSchema),
    defaultValues: {
      autoSync: false,
      syncFrequency: 'hourly',
      githubWebhookSecret: '',
    },
  });

  useEffect(() => {
    if (!settings) return;
    form.reset({
      autoSync: settings.auto_sync,
      syncFrequency:
        settings.sync_frequency as RepositorySyncValues['syncFrequency'],
      githubWebhookSecret: settings.github_webhook_secret ?? '',
    });
  }, [settings, form]);

  const autoSync = form.watch('autoSync');

  async function onSubmit(data: RepositorySyncValues) {
    try {
      await updateMutation.mutateAsync({
        autoSync: data.autoSync,
        syncFrequency: data.syncFrequency,
        githubWebhookSecret:
          data.syncFrequency === 'realtime'
            ? data.githubWebhookSecret?.trim() || null
            : null,
      });
      toast.success('Repository sync preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    }
  }

  if (isLoading) {
    return (
      <Card className="hover-card bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Repository Sync</CardTitle>
              <CardDescription>
                Configure how your repositories are synced
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading preferences…</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="hover-card bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Repository Sync</CardTitle>
          <CardDescription>
            Configure how your repositories are synced
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : 'Failed to load preferences'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-card bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Repository Sync</CardTitle>
            <CardDescription>
              Configure how your repositories are synced
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="autoSync"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div>
                    <FormLabel htmlFor="auto-sync">
                      Auto-sync repositories
                    </FormLabel>
                    <FormDescription className="mt-1">
                      Automatically sync when new commits are pushed
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id="auto-sync"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {autoSync && (
              <FormField
                control={form.control}
                name="syncFrequency"
                render={({ field }) => (
                  <FormItem className="space-y-2 pl-4 border-l-2 border-border/50">
                    <FormLabel htmlFor="sync-frequency">
                      Sync frequency
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          id="sync-frequency"
                          className="max-w-xs bg-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="realtime">
                          Real-time (on push)
                        </SelectItem>
                        <SelectItem value="hourly">Every hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value === 'realtime'
                        ? 'Add a webhook in your repo (Settings → Webhooks). Use the URL below and paste the same secret here.'
                        : `A scheduled job should call /api/cron/sync?frequency=${field.value} with your CRON_SECRET.`}
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            {autoSync && form.watch('syncFrequency') === 'realtime' && (
              <>
                <div className="space-y-2 pl-4 border-l-2 border-border/50">
                  <FormLabel htmlFor="webhook-url">
                    Webhook URL (add this in GitHub)
                  </FormLabel>
                  <Input
                    id="webhook-url"
                    readOnly
                    className="font-mono text-sm bg-muted/50"
                    value={
                      typeof window !== 'undefined'
                        ? `${window.location.origin}/api/webhooks/github`
                        : '/api/webhooks/github'
                    }
                  />
                  <FormDescription>
                    In your repo: Settings → Webhooks → Add webhook. Paste the
                    URL above. Content type: application/json.
                  </FormDescription>
                </div>
                <FormField
                  control={form.control}
                  name="githubWebhookSecret"
                  render={({ field }) => (
                    <FormItem className="space-y-2 pl-4 border-l-2 border-border/50">
                      <FormLabel htmlFor="github-webhook-secret">
                        Webhook secret
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="github-webhook-secret"
                          type="password"
                          autoComplete="off"
                          placeholder="Same secret you set in GitHub"
                          className="font-mono bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Create a secret when adding the webhook in GitHub, then
                        paste the same value here so we can verify deliveries.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="hover-button"
                disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving…' : 'Save preferences'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
