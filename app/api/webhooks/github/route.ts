import { createAdminClient } from '@/lib/supabase/admin';
import { syncRepoForUser } from '@/lib/sync/sync-repo-for-user';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function verifyWithSecret(rawBody: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature?.startsWith('sha256=')) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * GitHub webhook handler. Configure in GitHub repo: Settings → Webhooks → Add webhook.
 * Payload URL: https://your-domain.com/api/webhooks/github
 * Content type: application/json
 * Secret: use the same value the user saved in Settings (or set GITHUB_WEBHOOK_SECRET for global fallback).
 * Events: Just the push event (or "Send me everything" for testing).
 *
 * When a push event is received, syncs the repo for all users who:
 * - Have that repository saved, auto_sync=true, and sync_frequency='realtime'.
 * Verification: global GITHUB_WEBHOOK_SECRET first, then per-user github_webhook_secret.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    const payload = JSON.parse(rawBody) as {
      ref?: string;
      repository?: { full_name?: string; default_branch?: string };
      [key: string]: unknown;
    };

    if (payload.repository?.full_name === undefined) {
      return NextResponse.json({ error: 'Missing repository' }, { status: 400 });
    }

    const [owner, repo] = payload.repository.full_name.split('/');
    if (!owner || !repo) {
      return NextResponse.json({ error: 'Invalid repository full_name' }, { status: 400 });
    }

    let branch = payload.repository.default_branch ?? 'main';
    if (payload.ref?.startsWith('refs/heads/')) {
      branch = payload.ref.replace('refs/heads/', '');
    }

    const supabase = createAdminClient();

    const { data: repos } = await supabase
      .from('repositories')
      .select('user_id')
      .eq('full_name', payload.repository.full_name)
      .eq('is_active', true);

    const userIdsToSync = [...new Set((repos ?? []).map((r) => r.user_id))];

    const { data: userSettingsWithSecret } = await supabase
      .from('user_settings')
      .select('id, github_webhook_secret')
      .eq('auto_sync', true)
      .eq('sync_frequency', 'realtime')
      .in('id', userIdsToSync);

    const verified =
      verifyWithSecret(rawBody, signature, GITHUB_WEBHOOK_SECRET ?? '') ||
      (userSettingsWithSecret ?? []).some((u) =>
        verifyWithSecret(rawBody, signature, u.github_webhook_secret ?? '')
      );

    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (!GITHUB_TOKEN) {
      console.error('GITHUB_WEBHOOK: GITHUB_TOKEN not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const userIdsRealtime = (userSettingsWithSecret ?? []).map((u) => u.id);
    if (userIdsRealtime.length === 0) {
      return NextResponse.json({ ok: true, synced: 0 });
    }

    let synced = 0;
    for (const userId of userIdsRealtime) {
      const result = await syncRepoForUser(
        supabase,
        userId,
        owner,
        repo,
        branch,
        GITHUB_TOKEN
      );
      if (result.ok) synced++;
    }

    return NextResponse.json({ ok: true, synced });
  } catch (error) {
    console.error('GitHub webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook failed' },
      { status: 500 }
    );
  }
}
