const DISCORD_WEBHOOK_REGEX =
  /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+$/i;

export function isValidDiscordWebhookUrl(url: string): boolean {
  return DISCORD_WEBHOOK_REGEX.test(url.trim());
}

export async function sendDiscordWebhook(
  webhookUrl: string,
  content: string,
  options?: { username?: string }
): Promise<boolean> {
  if (!isValidDiscordWebhookUrl(webhookUrl)) {
    console.error('Invalid Discord webhook URL');
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        username: options?.username ?? 'ProdLines',
      }),
    });

    if (!response.ok) {
      console.error(
        'Discord webhook failed:',
        response.status,
        await response.text()
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send Discord webhook:', error);
    return false;
  }
}
