const SLACK_WEBHOOK_REGEX =
  /^https:\/\/hooks\.(slack\.com|slack-gov\.com)\/services\/[\w-]+\/[\w-]+\/[\w.-]+$/i;

export function isValidSlackWebhookUrl(url: string): boolean {
  return SLACK_WEBHOOK_REGEX.test(url.trim());
}

export async function sendSlackWebhook(
  webhookUrl: string,
  text: string,
  options?: { username?: string }
): Promise<boolean> {
  if (!isValidSlackWebhookUrl(webhookUrl)) {
    console.error('Invalid Slack webhook URL');
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        username: options?.username ?? 'ProdLines',
      }),
    });

    if (!response.ok) {
      console.error(
        'Slack webhook failed:',
        response.status,
        await response.text()
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send Slack webhook:', error);
    return false;
  }
}
