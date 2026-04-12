import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram config missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: String(text || ''),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error('Telegram API error:', response.status, body);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Telegram send error:', error?.message || error);
    return false;
  }
}
