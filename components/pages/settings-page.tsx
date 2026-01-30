'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Bell,
  GitBranch,
  AlertTriangle,
  Trash2,
  Mail,
  MessageSquare,
  Shield,
  Zap,
} from 'lucide-react';

export function SettingsPage() {
  // Profile settings
  const [displayName, setDisplayName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');

  // Repository sync settings
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('hourly');
  const [excludeBots, setExcludeBots] = useState(true);
  const [excludeTests, setExcludeTests] = useState(true);
  const [excludeDocs, setExcludeDocs] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [discordNotifications, setDiscordNotifications] = useState(false);
  const [leaderboardChanges, setLeaderboardChanges] = useState(true);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="hover-card bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="max-w-sm bg-secondary/50"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-row items-center gap-2">
                <Label htmlFor="email">Email address</Label>
                <p className="text-xs text-muted-foreground">
                  ( Used for notifications and account recovery )
                </p>
              </div>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-sm bg-secondary/50"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button className="hover-button">Save changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Repository Sync Settings */}
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
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">Auto-sync repositories</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically sync when new commits are pushed
                </p>
              </div>
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>

            {autoSync && (
              <div className="space-y-2 pl-4 border-l-2 border-border/50">
                <Label htmlFor="sync-frequency">Sync frequency</Label>
                <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                  <SelectTrigger
                    id="sync-frequency"
                    className="max-w-xs bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">
                      Real-time (on push)
                    </SelectItem>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="exclude-bots">Exclude bot contributions</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Filter out dependabot, renovate, and other automated commits
                </p>
              </div>
              <Switch
                id="exclude-bots"
                checked={excludeBots}
                onCheckedChange={setExcludeBots}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="exclude-tests">Exclude test files</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Don't count lines in test files (*.test.*, *.spec.*)
                </p>
              </div>
              <Switch
                id="exclude-tests"
                checked={excludeTests}
                onCheckedChange={setExcludeTests}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="exclude-docs">Exclude documentation</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Don't count markdown and documentation files
                </p>
              </div>
              <Switch
                id="exclude-docs"
                checked={excludeDocs}
                onCheckedChange={setExcludeDocs}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button className="hover-button">Save preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
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
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notif">Email notifications</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get updates about your repositories via email
                  </p>
                </div>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {emailNotifications && (
              <div className="pl-11 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="weekly-digest"
                      className="text-sm font-normal">
                      Weekly digest
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Summary of ownership changes every week
                    </p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="leaderboard-changes"
                      className="text-sm font-normal">
                      Leaderboard changes
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      When your rank changes significantly
                    </p>
                  </div>
                  <Switch
                    id="leaderboard-changes"
                    checked={leaderboardChanges}
                    onCheckedChange={setLeaderboardChanges}
                  />
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="slack-notif">Slack notifications</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send updates to your Slack workspace
                  </p>
                </div>
              </div>
              <Switch
                id="slack-notif"
                checked={slackNotifications}
                onCheckedChange={setSlackNotifications}
              />
            </div>

            {slackNotifications && (
              <div className="pl-11">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-button bg-transparent">
                  <Zap className="h-4 w-4 mr-2" />
                  Connect Slack
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="discord-notif">Discord notifications</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send updates to your Discord server
                  </p>
                </div>
              </div>
              <Switch
                id="discord-notif"
                checked={discordNotifications}
                onCheckedChange={setDiscordNotifications}
              />
            </div>

            {discordNotifications && (
              <div className="pl-11">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-button bg-transparent">
                  <Zap className="h-4 w-4 mr-2" />
                  Connect Discord
                </Button>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button className="hover-button">Save preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="hover-card bg-card/50 border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5">
            <div>
              <p className="font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover-button bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers,
                    including:
                    <p className="mt-2 space-y-1 list-disc list-inside">
                      <p> - All connected repositories</p>
                      <p> - Leaderboard statistics and history</p>
                      <p> - Profile information</p>
                      <p> - Notification preferences</p>
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover-button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-button">
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
