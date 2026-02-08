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
import { isValidDiscordWebhookUrl } from '@/lib/discord';

export interface DiscordWebhookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentWebhookUrl: string | null;
  onSave: (webhookUrl: string | null) => Promise<void>;
  isPending?: boolean;
}

export function DiscordWebhookDialog({
  open,
  onOpenChange,
  currentWebhookUrl,
  onSave,
  isPending = false,
}: DiscordWebhookDialogProps) {
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
    if (!isValidDiscordWebhookUrl(trimmed)) {
      toast.error(
        'Invalid webhook URL. It should look like https://discord.com/api/webhooks/...'
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
          <DialogTitle>Connect Discord</DialogTitle>
          <DialogDescription>
            Create a webhook in your Discord server to receive notifications. Go
            to Server Settings → Integrations → Webhooks, create one, and paste
            the URL below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label
              htmlFor="discord-webhook-url"
              className="text-sm font-medium">
              Webhook URL
            </label>
            <Input
              id="discord-webhook-url"
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <a
            href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-4 w-4" />
            How to create a Discord webhook
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
