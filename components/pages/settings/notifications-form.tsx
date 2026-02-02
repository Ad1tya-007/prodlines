'use client';

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
import { Input } from '@/components/ui/input';
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

const notificationsSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  emailNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  leaderboardChanges: z.boolean(),
  slackNotifications: z.boolean(),
  discordNotifications: z.boolean(),
});

type NotificationsValues = z.infer<typeof notificationsSchema>;

export function NotificationsForm() {
  const form = useForm<NotificationsValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      email: '',
      emailNotifications: true,
      weeklyDigest: true,
      leaderboardChanges: true,
      slackNotifications: false,
      discordNotifications: false,
    },
  });

  const emailNotifications = form.watch('emailNotifications');
  const slackNotifications = form.watch('slackNotifications');
  const discordNotifications = form.watch('discordNotifications');

  function onSubmit(data: NotificationsValues) {
    console.log('Notification preferences:', data);
    // TODO: Save to backend
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

            {emailNotifications && (
              <div className="pl-11 space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex flex-row items-center gap-2">
                        <FormLabel htmlFor="email">Email address</FormLabel>
                        <FormDescription>
                          ( Used for notifications and account recovery )
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          className="max-w-sm bg-secondary/50"
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weeklyDigest"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div>
                        <FormLabel
                          htmlFor="weekly-digest"
                          className="text-sm font-normal">
                          Weekly digest
                        </FormLabel>
                        <FormDescription className="mt-1">
                          Summary of ownership changes every week
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          id="weekly-digest"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leaderboardChanges"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div>
                        <FormLabel
                          htmlFor="leaderboard-changes"
                          className="text-sm font-normal">
                          Leaderboard changes
                        </FormLabel>
                        <FormDescription className="mt-1">
                          When your rank changes significantly
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          id="leaderboard-changes"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

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
