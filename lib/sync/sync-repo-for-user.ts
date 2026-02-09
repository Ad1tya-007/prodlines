import type { SupabaseClient } from '@supabase/supabase-js';
import type { GitHubStats } from '@/lib/types/github';
import { fetchGitHubStats } from '@/lib/github/stats';
import { sendStatsSyncedEmail } from '@/lib/email';
import { sendDiscordWebhook } from '@/lib/discord';
import { sendSlackWebhook } from '@/lib/slack';

/**
 * Sync GitHub stats for one repo for one user. Used by:
 * - GET /api/github/stats?sync=true (current user)
 * - POST /api/webhooks/github (realtime push)
 * - GET /api/cron/sync?frequency=... (scheduled)
 * @param recipientEmailOverride - When provided (e.g. from session user), use for email notifications; otherwise use profile email.
 */
export async function syncRepoForUser(
  supabase: SupabaseClient,
  userId: string,
  owner: string,
  repo: string,
  branch: string,
  githubToken: string,
  recipientEmailOverride?: string | null
): Promise<{ ok: boolean; stats?: GitHubStats; error?: string }> {
  if (!githubToken) {
    return { ok: false, error: 'GitHub token is not available' };
  }

  try {
    const stats = await fetchGitHubStats(owner, repo, branch, githubToken);

    const { error: upsertError } = await supabase.from('github_stats').upsert(
      {
        user_id: userId,
        owner,
        repo,
        branch,
        stats,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,owner,repo,branch',
        ignoreDuplicates: false,
      }
    );

    if (upsertError) {
      console.error('Error saving github_stats:', upsertError);
      return { ok: false, error: upsertError.message };
    }

    const fullName = `${owner}/${repo}`;
    const message = `Stats synced for ${fullName}`;
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'github_stats_synced',
      message,
      metadata: { owner, repo, branch },
      seen: false,
    });

    const { data: userSettings } = await supabase
      .from('user_settings')
      .select(
        'email_notifications, slack_notifications, slack_webhook_url, discord_notifications, discord_webhook_url'
      )
      .eq('id', userId)
      .single();

    if (userSettings?.slack_notifications && userSettings?.slack_webhook_url) {
      await sendSlackWebhook(
        userSettings.slack_webhook_url,
        `📊 *Stats synced*\nYour GitHub stats have been synced for *${fullName}*.\nView your updated leaderboard in ProdLines.`
      );
    }

    if (userSettings?.email_notifications) {
      const recipientEmail =
        recipientEmailOverride ??
        (await supabase.from('profiles').select('email').eq('id', userId).single())
          .data?.email ??
        null;
      if (recipientEmail) {
        await sendStatsSyncedEmail(recipientEmail, fullName);
      }
    }

    if (
      userSettings?.discord_notifications &&
      userSettings?.discord_webhook_url
    ) {
      await sendDiscordWebhook(
        userSettings.discord_webhook_url,
        `📊 **Stats synced**\nYour GitHub stats have been synced for **${fullName}**.\nView your updated leaderboard in ProdLines.`
      );
    }

    return { ok: true, stats };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    console.error('syncRepoForUser error:', message);
    return { ok: false, error: message };
  }
}
