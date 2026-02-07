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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, Zap } from 'lucide-react';
import {
  useUserSettings,
  useUpdateNotificationSettings,
} from '@/lib/hooks/use-user-settings';
import { toast } from 'sonner';

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  slackNotifications: z.boolean(),
  discordNotifications: z.boolean(),
});

type NotificationsValues = z.infer<typeof notificationsSchema>;

export function NotificationsForm() {
  const { data: settings, isLoading, isError, error } = useUserSettings();
  const updateMutation = useUpdateNotificationSettings();
  const form = useForm<NotificationsValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: false,
      slackNotifications: false,
      discordNotifications: false,
    },
  });

  useEffect(() => {
    if (!settings) return;
    form.reset({
      emailNotifications: settings.email_notifications,
      slackNotifications: settings.slack_notifications,
      discordNotifications: settings.discord_notifications,
    });
  }, [settings, form]);

  const slackNotifications = form.watch('slackNotifications');
  const discordNotifications = form.watch('discordNotifications');

  async function onSubmit(data: NotificationsValues) {
    try {
      await updateMutation.mutateAsync({
        emailNotifications: data.emailNotifications,
        slackNotifications: data.slackNotifications,
        discordNotifications: data.discordNotifications,
      });
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to save preferences');
    }
  }

  if (isLoading) {
    return (
      <Card className="hover-card bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose how you want to be notified
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
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
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
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose how you want to be notified
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <FormLabel htmlFor="email-notif">
                        Email notifications
                      </FormLabel>
                      <FormDescription className="mt-1">
                        Get updates about your repositories via email
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      id="email-notif"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="slackNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <FormLabel htmlFor="slack-notif">
                        Slack notifications
                      </FormLabel>
                      <FormDescription className="mt-1">
                        Send updates to your Slack workspace
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      id="slack-notif"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {slackNotifications && (
              <div className="pl-11">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="hover-button bg-transparent">
                  <Zap className="h-4 w-4 mr-2" />
                  Connect Slack
                </Button>
              </div>
            )}

            <FormField
              control={form.control}
              name="discordNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <FormLabel htmlFor="discord-notif">
                        Discord notifications
                      </FormLabel>
                      <FormDescription className="mt-1">
                        Send updates to your Discord server
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      id="discord-notif"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {discordNotifications && (
              <div className="pl-11">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="hover-button bg-transparent">
                  <Zap className="h-4 w-4 mr-2" />
                  Connect Discord
                </Button>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="hover-button">
                Save preferences
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
