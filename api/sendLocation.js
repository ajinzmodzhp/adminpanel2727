export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const { latitude, longitude, accuracy } = req.body || {}
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'latitude and longitude required as numbers' })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return res.status(500).json({ error: 'server env not configured' })

  const telegramUrl = `https://api.telegram.org/bot${token}/sendLocation`

  const payload = new URLSearchParams({ chat_id: chatId.toString(), latitude: latitude.toString(), longitude: longitude.toString() })

  try {
    const r = await fetch(telegramUrl, { method: 'POST', body: payload })
    const j = await r.json()
    if (!r.ok || !j.ok) {
      console.error('telegram error', j)
      return res.status(502).json({ error: 'telegram error', detail: j })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(502).json({ error: 'failed to call telegram', detail: String(err) })
  }
}
