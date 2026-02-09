import { createAdminClient } from '@/lib/supabase/admin';
import { syncRepoForUser } from '@/lib/sync/sync-repo-for-user';
import { NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const VALID_FREQUENCIES = ['hourly', 'daily', 'weekly'] as const;

/**
 * Scheduled sync. Call from a cron (e.g. Vercel Cron, cron-job.org) with the frequency to run.
 * Example: GET https://your-domain.com/api/cron/sync?frequency=hourly
 * Header: Authorization: Bearer <CRON_SECRET> (or x-cron-secret: <CRON_SECRET>)
 *
 * Run schedule suggestion:
 * - Every hour: ?frequency=hourly
 * - Once per day (e.g. 0:00 UTC): ?frequency=daily
 * - Once per week (e.g. Sunday 0:00 UTC): ?frequency=weekly
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const secretHeader = request.headers.get('x-cron-secret');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : secretHeader ?? request.nextUrl.searchParams.get('secret');

    if (!CRON_SECRET || token !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const frequency = request.nextUrl.searchParams.get('frequency') ?? 'hourly';
    if (!VALID_FREQUENCIES.includes(frequency as (typeof VALID_FREQUENCIES)[number])) {
      return NextResponse.json(
        { error: `frequency must be one of: ${VALID_FREQUENCIES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!GITHUB_TOKEN) {
      console.error('CRON sync: GITHUB_TOKEN not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const supabase = createAdminClient();

    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('auto_sync', true)
      .eq('sync_frequency', frequency);

    if (!userSettings?.length) {
      return NextResponse.json({ ok: true, synced: 0, users: 0 });
    }

    const userIds = userSettings.map((r) => r.id);

    const { data: repos } = await supabase
      .from('repositories')
      .select('user_id, owner, name, default_branch')
      .eq('is_active', true)
      .in('user_id', userIds);

    if (!repos?.length) {
      return NextResponse.json({ ok: true, synced: 0, users: userIds.length });
    }

    let synced = 0;
    for (const r of repos) {
      const branch = r.default_branch ?? 'main';
      const result = await syncRepoForUser(
        supabase,
        r.user_id,
        r.owner,
        r.name,
        branch,
        GITHUB_TOKEN
      );
      if (result.ok) synced++;
    }

    return NextResponse.json({
      ok: true,
      synced,
      users: userIds.length,
      repos: repos.length,
    });
  } catch (error) {
    console.error('Cron sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron sync failed' },
      { status: 500 }
    );
  }
}
