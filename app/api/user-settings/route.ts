import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isValidDiscordWebhookUrl } from '@/lib/discord';
import { isValidSlackWebhookUrl } from '@/lib/slack';

// GET: Fetch current user's settings
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user settings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/user-settings:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to fetch settings',
      },
      { status: 500 }
    );
  }
}

// PATCH: Update current user's settings
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const ALLOWED_KEYS = [
      'email_notifications',
      'slack_notifications',
      'slack_webhook_url',
      'discord_notifications',
      'discord_webhook_url',
      'auto_sync',
      'sync_frequency',
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const key of ALLOWED_KEYS) {
      if (key in body) {
        const value = body[key];
        if (key === 'slack_webhook_url') {
          if (value === null || value === '') {
            updates[key] = null;
          } else if (typeof value === 'string' && isValidSlackWebhookUrl(value)) {
            updates[key] = value.trim();
          } else {
            return NextResponse.json(
              { error: 'Invalid Slack webhook URL format' },
              { status: 400 }
            );
          }
        } else if (key === 'discord_webhook_url') {
          if (value === null || value === '') {
            updates[key] = null;
          } else if (typeof value === 'string' && isValidDiscordWebhookUrl(value)) {
            updates[key] = value.trim();
          } else {
            return NextResponse.json(
              { error: 'Invalid Discord webhook URL format' },
              { status: 400 }
            );
          }
        } else {
          updates[key] = value;
        }
      }
    }

    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user settings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PATCH /api/user-settings:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update settings',
      },
      { status: 500 }
    );
  }
}
