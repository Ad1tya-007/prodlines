'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { isValidSlackWebhookUrl } from '@/lib/slack';

export interface SlackWebhookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentWebhookUrl: string | null;
  onSave: (webhookUrl: string | null) => Promise<void>;
  isPending?: boolean;
}

export function SlackWebhookDialog({
  open,
  onOpenChange,
  currentWebhookUrl,
  onSave,
  isPending = false,
}: SlackWebhookDialogProps) {
  const [webhookInput, setWebhookInput] = useState('');

  useEffect(() => {
    if (open) {
      setWebhookInput(currentWebhookUrl ?? '');
    }
  }, [open, currentWebhookUrl]);

  const isConfigured = Boolean(currentWebhookUrl);

  async function handleSave() {
    const trimmed = webhookInput.trim();
    if (!trimmed) {
      toast.error('Please enter a webhook URL');
      return;
    }
    if (!isValidSlackWebhookUrl(trimmed)) {
      toast.error(
        'Invalid webhook URL. It should look like https://hooks.slack.com/services/...'
      );
      return;
    }
    try {
      await onSave(trimmed);
      onOpenChange(false);
    } catch {
      // Parent handles error toast
    }
  }

  async function handleDisconnect() {
    try {
      await onSave(null);
      onOpenChange(false);
    } catch {
      // Parent handles error toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Slack</DialogTitle>
          <DialogDescription>
            Create an incoming webhook in your Slack workspace to receive
            notifications. Go to your app’s configuration in the Slack API
            dashboard, add an Incoming Webhooks feature, and paste the webhook
            URL below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label
              htmlFor="slack-webhook-url"
              className="text-sm font-medium">
              Webhook URL
            </label>
            <Input
              id="slack-webhook-url"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <a
            href="https://api.slack.com/messaging/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-4 w-4" />
            How to create a Slack webhook
          </a>
        </div>
        <DialogFooter>
          {isConfigured && (
            <Button
              variant="ghost"
              onClick={handleDisconnect}
              disabled={isPending}
              className="mr-auto text-muted-foreground hover:text-destructive">
              Disconnect
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !webhookInput.trim()}>
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
