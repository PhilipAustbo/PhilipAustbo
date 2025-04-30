// api/ask.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { contents } = req.body;

    if (!Array.isArray(contents) || contents.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing "contents" in request body' });
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    // Debug-logg (kan fjernes etter testing)
    if (!apiKey) {
      console.error("❌ Missing GOOGLE_API_KEY in environment");
      return res.status(500).json({ error: 'Server configuration error: Missing GOOGLE_API_KEY' });
    } else {
      console.log("✅ API key loaded, sending request to Gemini...");
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error('[Gemini API Error]', data);
      return res.status(502).json({ error: 'Gemini API error', details: data });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('[Server Error]', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
