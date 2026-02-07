import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'ProdLines <onboarding@resend.dev>';

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://prodlines.app';

function buildStatsSyncedEmailHtml(repoFullName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stats synced - ProdLines</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; background: linear-gradient(135deg, #18181b 0%, #27272a 100%); text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                      <tr>
                        <td style="width: 44px; height: 44px; background-color: rgba(167, 139, 250, 0.25); border-radius: 10px; text-align: center; vertical-align: middle; font-size: 22px; line-height: 44px;" valign="middle">📊</td>
                        <td style="padding-left: 12px;">
                          <span style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ProdLines</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #18181b; line-height: 1.4;">
                Stats synced
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; color: #52525b; line-height: 1.6;">
                Your GitHub stats have been synced for <strong style="color: #18181b;">${repoFullName}</strong>.
              </p>
              <p style="margin: 0 0 28px; font-size: 15px; color: #52525b; line-height: 1.6;">
                View your updated leaderboard to see who owns the most lines in production.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                    <a href="${APP_URL}/app/overview" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      View leaderboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                ProdLines · Leaderboard for production code
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendStatsSyncedEmail(
  to: string,
  repoFullName: string
): Promise<boolean> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return false;
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Stats synced for ${repoFullName}`,
    html: buildStatsSyncedEmailHtml(repoFullName),
  });

  if (error) {
    console.error('Failed to send stats synced email:', error);
    return false;
  }
  return true;
}
