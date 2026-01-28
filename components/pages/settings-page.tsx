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
import { Badge } from '@/components/ui/badge';
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
  Building2,
  CreditCard,
  Webhook,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Users,
  RefreshCw,
  Trash2,
} from 'lucide-react';

export function SettingsPage() {
  const [orgName, setOrgName] = useState('Acme Corp');
  const [autoSync, setAutoSync] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyWebhook = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization and account settings
        </p>
      </div>

      {/* Organization Settings */}
      <Card className="hover-card bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Manage your organization settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization name</Label>
            <Input
              id="org-name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="max-w-sm bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-slug">Organization slug</Label>
            <div className="flex items-center gap-2 max-w-sm">
              <Input
                id="org-slug"
                value="acme-corp"
                disabled
                className="bg-secondary/50 text-muted-foreground"
              />
              <Badge variant="secondary" className="shrink-0">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />

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

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Email notifications</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Get weekly ownership reports via email
                </p>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="slack-notif">Slack notifications</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Send updates to your Slack workspace
                </p>
              </div>
              <Switch
                id="slack-notif"
                checked={slackNotifications}
                onCheckedChange={setSlackNotifications}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button className="hover-button">Save changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card className="hover-card bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle>Billing</CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
              Pro Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Current plan</p>
              <p className="text-lg font-semibold mt-1">Pro</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Billing cycle</p>
              <p className="text-lg font-semibold mt-1">Monthly</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Next invoice</p>
              <p className="text-lg font-semibold mt-1">Feb 15, 2026</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Team seats</p>
                <p className="text-sm text-muted-foreground">
                  8 of 10 seats used
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hover-button bg-transparent">
              Add seats
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="hover-button bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage subscription
            </Button>
            <Button variant="outline" className="hover-button bg-transparent">
              View invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Status */}
      <Card className="hover-card bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Webhook className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle>Webhook</CardTitle>
              <CardDescription>
                GitHub webhook integration status
              </CardDescription>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value="https://api.prodlines.io/webhooks/github/acme-corp"
                readOnly
                className="font-mono text-sm bg-secondary/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyWebhook}
                className="hover-button shrink-0 bg-transparent">
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Last delivery</p>
              <p className="font-medium mt-1">2 minutes ago</p>
              <Badge
                variant="outline"
                className="mt-2 text-green-500 border-green-500/30">
                200 OK
              </Badge>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-sm text-muted-foreground">
                Events received (24h)
              </p>
              <p className="font-medium mt-1">147 events</p>
              <Badge variant="outline" className="mt-2">
                push, pull_request
              </Badge>
            </div>
          </div>

          <Button variant="outline" className="hover-button bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test webhook
          </Button>
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5">
            <div>
              <p className="font-medium">Disconnect all repositories</p>
              <p className="text-sm text-muted-foreground mt-1">
                Remove all connected repositories and their data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover-button bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently
                    disconnect all your repositories and delete all associated
                    ownership data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover-button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-button">
                    Yes, disconnect all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5">
            <div>
              <p className="font-medium">Delete organization</p>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete this organization and all its data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover-button bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete organization?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the organization &quot;{orgName}&quot; and all associated
                    data including repositories, leaderboards, and team members.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover-button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-button">
                    Yes, delete organization
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
